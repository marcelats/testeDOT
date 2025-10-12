define(["jquery", "LightBoxManager", "JsonManager", "OpNew", "Utils", "Cons", "IdManager", "DrawArea"],
    function($, lightBoxManager, jsonManager, opNew, utils, cons, idManager, drawArea) {
        "use strict";

        var lastAction = null, callback = null, elementManager = null;

        var OpOpen = {
            initialize: function(manager) {
                elementManager = manager;

                /* Close button of the light box. */
                $(document).on("click", "#opOpen-btClose", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#opOpen-btSubmit", function() {
                    OpOpen.execute("submit");
                });
              
                $(document).on("click", "#opCopy-btSubmit", function(e) {
                    e.preventDefault();

                    OpOpen.execute("copy");
                });
                $(document).on("click", "#opPublic-btSubmit", function(e) {
                    e.preventDefault();

                    OpOpen.execute("public");
                });
                $(document).on("click", "#opPrivate-btSubmit", function(e) {
                    e.preventDefault();

                    OpOpen.execute("private");
                });
                $(document).on("click", "#opDelete-btSubmit", function(e) {
                    e.preventDefault();

                    OpOpen.execute("delete");
                });
                /*$(document).on("click", "#opRename-btSubmit", function(e) {
                    e.preventDefault();

                    OpOpen.execute("rename");
                });*/
                
                console.log('file-item count =', document.querySelectorAll('.file-item').length);
                document.addEventListener("click", (e) => {
                    const checkbox = e.target.closest(".checkbox");
                    const row = e.target.closest(".file-row-open");

                    if (checkbox) {
                        e.stopPropagation();
                        const checkbox = e.target;
                        const filename = checkbox.dataset.filenameCheckbox;
                        const authorId = checkbox.dataset.authorCheckbox;
                        const userId = document.getElementById("current-user").dataset.userId;
                        console.log(authorId);
                        console.log(userId);
                        if (authorId !== userId) {
                            alert("Only the author can alter the visibility");
                            return;
                        }

                        if (checkbox.dataset.busy === "true") return;
                        checkbox.dataset.busy = "true";

                        const currentlyPublic = checkbox.textContent === "✔";
                        checkbox.textContent = currentlyPublic ? "" : "✔";

                        $.ajax({
                            url: "qnetwork?cmd=public",
                            type: "POST",
                            data: { graphName: filename },
                            success: function() {
                                jsonManager.setSaved(true);
                            },
                            error: function(xhr, ajaxOptions, thrownError) {
                                checkbox.textContent = currentlyPublic ? "✔" : "";
                                var errorHeader = xhr.getResponseHeader('fot-error');
                                alert(errorHeader !== null ? errorHeader : thrownError);
                            },
                            complete: function() {
                                checkbox.dataset.busy = "false"; 
                            }
                        });
                    } else if (row) {
                        var filename = row.dataset.filename;
                        var authorId = row.dataset.authorname;

                        console.log("filename:", filename);
                        document.getElementById("opOpen-filename").value = filename;
                        document.getElementById("opOpen-author").value = authorId;
                    }
                });
            },
            execute: function(action) {
                require(["OpNew"], function(opNew) {
                    if(!jsonManager.isSaved()) {
                        console.log("opNew", opNew);
                        opNew.execute(function() {
                            var userChose = opNew.getLastAction();

                            if(userChose !== "cancel") {
                                OpOpen.execute();
                            }
                        });
                    }
                });
                if (typeof action !== "string") {
                    lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                        "qnetwork?cmd=open-box&type=open", function() {
                        $("#opOpen-filename").focus();
                    });      
                    callback = action;
                } else {
                    lastAction = action;
                    if (action === "submit") {
                        var filename = $("#opOpen-filename").val(),
                        re = new RegExp(cons.REG_EXP_FILENAME),
                        author = $("#opOpen-author").val();
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        }else if(author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        }
                        else {
                            
                            open(filename, author);
                            const btnCode = document.getElementById("opCode");
                            btnCode.style.opacity = '0.3';
                            btnCode.style.pointerEvents = 'none';
                            const btnExecute = document.getElementById("opExecute");
                            btnExecute.style.opacity = '0.3';
                            btnExecute.style.pointerEvents = 'none';      
                            window.flag = false;
                        }
                    }
                    if (action === "copy") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME),
                            author = $("#opOpen-author").val();
                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");
                        }
                        else if (author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        }
                        else {
                            $.ajax({
                                url: "qnetwork?cmd=copy",
                                type: "POST",
                                data: {
                                    graphName: $("#opOpen-filename").val(),
                                    author: author
                                },
                                dataType: "json",
                                success: function(data) {
                                    jsonManager.setGraph(data);
                                    jsonManager.setSaved(true);
                                    constructGraph(data);
                                    saveAs(filename,0);       
                                },
                                error: function(xhr, thrownError) {
                                    var errorHeader = xhr.getResponseHeader('fot-error');
                                    if (errorHeader !== null) {
                                        alert(errorHeader);
                                    } else {
                                        alert(thrownError);
                                    }
                                }
                            });
                        }
                    }
                    if (action === "public") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);
                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");
                        }                       
                        else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=public",
                                type: "POST",
                                async: false,
                                data: {
                                    graphName: filename
                                },
                                success: function() {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                    jsonManager.setSaved(true);
                                    document.title = "ASDA - " + filename;
                                },
                                error: function(xhr, thrownError) {
                                    var errorHeader = xhr.getResponseHeader('fot-error');

                                    jsonManager.setName(tempFilename);

                                    if (errorHeader !== null) {
                                        alert(errorHeader);
                                    } else {
                                        alert(thrownError);
                                    }
                                }
                            });
                        }
                    }
                    /*if (action === "private") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);
                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");
                        }
                        else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);
                            $.ajax({
                                url: "qnetwork?cmd=private",
                                type: "POST",
                                async: false,
                                data: {
                                    graphName: filename
                                },
                                success: function() {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                    jsonManager.setSaved(true);
                                    document.title = "ASDA - " + filename;
                                },
                                error: function(xhr, ajaxOptions, thrownError) {
                                    var errorHeader = xhr.getResponseHeader('fot-error');
                                    jsonManager.setName(tempFilename);
                                    if (errorHeader != null) {
                                        alert(errorHeader);
                                    } else {
                                        alert(thrownError);
                                    }
                                }
                            });
                        }
                    }*/
                    
                    if (action === "delete") {
                        const confirmDelete = confirm("Are you sure you want to delete " + $("#opOpen-filename").val() +"?");
                        if (!confirmDelete) {
                            return; 
                        }
                        OpOpen.delete($("#opOpen-filename").val(),$("#opOpen-author").val());
                        document.getElementById("opOpen-filename").value = "";
                        document.getElementById("opOpen-author").value = "";
                    }
                    
                    if (action === "rename") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        }
                         else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);
                            $.ajax({
                                url: "qnetwork?cmd=rename",
                                type: "POST",
                                async: false,
                                data: {
                                    graphName: filename,
                                    newName: $("#opOpen-newname").val()
                                },
                                
                                success: function() {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                    jsonManager.setSaved(true);

                                    document.title = "ASDA - "+filename;
                                },
                                error: function(xhr, thrownError) {
                                    var errorHeader = xhr.getResponseHeader('fot-error');

                                    jsonManager.setName(tempFilename);

                                    if (errorHeader !== null) {
                                        alert(errorHeader);
                                    } else {
                                        alert(thrownError);
                                    }
                                }
                            });
                        }
                    }

                    if (typeof callback === "function") {
                        callback();
                        callback = null;
                    }
                }
            },
            getLastAction: function() {
                return lastAction;
            },
            delete: function(filename,author){
                var re = new RegExp(cons.REG_EXP_FILENAME);
                if (filename.match(re) === null) {
                    alert("You need to enter a valid filename.");
                }
                else {
                    $.ajax({
                        url: "qnetwork?cmd=delete",
                        type: "POST",
                        async: false,
                        data: {
                            graphName: filename
                        },
                        success: function() {
                            $('.file-row-open[data-filename="' + filename + '"][data-authorname="' + author + '"]').remove();      
                        },
                        error: function(xhr, thrownError) {
                            var errorHeader = xhr.getResponseHeader('fot-error');
                            if (errorHeader !== null) {
                                alert(errorHeader);
                            } else {
                                alert(thrownError);
                            }
                        }
                    });
                }
            }
        };

        /* --- Private methods. --- */

        function open(filename,author) {
            $.ajax({
                url: "qnetwork?cmd=open",
                type: "POST",
                data: {
                    graphName: filename,
                    author: author
                },
                dataType: "json",
                success: function(data) {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    window.opcoes = [];
                    window.arrivals = [];
                    window.arrivalIndex = 0;
                    jsonManager.setGraph(data);
                    jsonManager.setSaved(true);

                    if (data.name !== "") {
                        document.title = "ASDA - " + data.name;
                    }
                    constructGraph(data);
                    $("#opParamBox").values(jsonManager.getGraphParameters());
                },
                error: function(xhr, thrownError) {
                    var errorHeader = xhr.getResponseHeader('fot-error');
                    if (errorHeader !== null) {
                        alert(errorHeader);
                    } else {
                        alert(thrownError);
                    }
                }
            });
        }

        function constructGraph(graph) {
            $("#" + cons.DRAW_AREA).empty();
            if (!utils.mapIsEmpty(graph.mapNodes)) {
                for (var key in graph.mapNodes) {
                    var position = {
                        x: parseInt(graph.mapNodes[key].x),
                        y: parseInt(graph.mapNodes[key].y)
                    };
                    elementManager.add(graph.mapNodes[key].type, position, key);
                }
                const mapNodes = jsonManager.getGraph().mapNodes;
                let maiorId = -Infinity;
                for (const key in mapNodes) {
                    if (mapNodes.hasOwnProperty(key)) {
                        const node = mapNodes[key];
                        if (node.id > maiorId) {
                            maiorId = node.id;
                        }
                    }
                }
                idManager.setStartCid(maiorId);
                console.log(graph.mapNodes);
                for (var keyNode in graph.mapNodes) {
                    var mapTargets = graph.mapNodes[keyNode].mapTargets;
                    if (!utils.mapIsEmpty(mapTargets)) {
                        for (var keyTarget in mapTargets) {
                            console.log(keyNode, keyTarget);
                            elementManager.prevElement = null;
                            elementManager.prevEndPoint = null;
                            elementManager.linkElements($("#" + keyNode));
                            elementManager.linkElements($("#" + keyTarget));
                        }
                    }
                }
            }
        }
        
        function saveAs(filename, i){
            if(i!==0)jsonManager.setName(filename + "_" + i);
            $.ajax({
                url: "qnetwork?cmd=save",
                type: "POST",
                data: "graphJson=" + jsonManager.stringifyGraph(),
                async: false,
                success: function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    jsonManager.setSaved(true);

                    if(i === 0) document.title = "ASDA - " + filename;
                    else document.title = "ASDA - " + filename + "_" + i;
                    return;
                },
                error: function() {
                    saveAs(filename, i+1);
                    return;
                }
            });
        }
        return OpOpen;
    }
);