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
                $(document).on("click", "#opRename-btSubmit", function(e) {
                    e.preventDefault();

                    OpOpen.execute("rename");
                    
                });
                
    console.log('file-item count =', document.querySelectorAll('.file-item').length);

    document.addEventListener("click", function(e) {
  if (e.target && e.target.classList.contains("file-item-open")) {
    var filename = e.target.getAttribute("data-filename");
    console.log("filename:", filename);
    document.getElementById("opOpen-filename").value = filename;
    document.getElementById("opOpen-author").value = e.target.getAttribute("data-authorname");
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
                                    var tempFilename = jsonManager.getName();
                                            

                                            saveAs(filename,0);
                                            
                                },
                                error: function(xhr, ajaxOptions, thrownError) {
                                    var errorHeader = xhr.getResponseHeader('fot-error');

                                    if (errorHeader != null) {
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
                    }
                    if (action === "private") {
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
                    }
                    
                    if (action === "delete") {
                        OpOpen.delete($("#opOpen-filename").val());
                        jsonManager.clearGraph();
                            jsonManager.setSaved(true);
                            $("#" + cons.DRAW_AREA).empty();
                            idManager.setStartCid(-1);
                            document.title = "ASDA";
                    }
                    
                    if (action === "rename") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);
 

                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");

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
                            console.log("saindo do ajax");
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
            delete: function(filename){
                
                            var re = new RegExp(cons.REG_EXP_FILENAME);

                        
 

                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");

                        }
                        else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=delete",
                                type: "POST",
                                async: false,
                                data: {
        graphName: filename
        
    },
                                success: function() {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                    jsonManager.setSaved(true);

                                    document.title = "ASDA - "+filename;
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

                    jsonManager.setGraph(data);
                    jsonManager.setSaved(true);

                    if (data.name !== "") {
                        document.title = "ASDA - " + data.name;
                    }

                    constructGraph(data);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    var errorHeader = xhr.getResponseHeader('fot-error');

                    if (errorHeader != null) {
                        alert(errorHeader);
                    } else {
                        alert(thrownError);
                    }
                }
            });
        }

        function opParam(action) {
            if (typeof action === "undefined") {
                lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                    "qnetwork?cmd=open-box&type=parameters", function() {
                    var parameters = jsonManager.getGraphParameters();

                    $("#" + cons.BOX_CONTAINER).values(parameters);
                });

            } else if (action === "submit") {
                var parameters = $("#" + cons.BOX_CONTAINER).values();

                jsonManager.setGraphParameters(parameters);

                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
            }
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

                for (var keyNode in graph.mapNodes) {

                    var mapTargets = graph.mapNodes[keyNode].mapTargets;

                    if (!utils.mapIsEmpty(mapTargets)) {
                        for (var keyTarget in mapTargets) {
                            drawArea.linkElements($("#" + keyNode));
                            drawArea.linkElements($("#" + keyTarget));
                        }
                    }
                }
            }
        }
        function saveAs(filename, i = 0) {
            if (i !== 0) jsonManager.setName(filename + "_" + i);

            $.ajax({
                url: "qnetwork?cmd=save",
                type: "POST",
                data: "graphJson=" + jsonManager.stringifyGraph(),
                async: true, // nunca usar false
                success: function () {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    jsonManager.setSaved(true);

                    if (i === 0) document.title = "ASDA - " + filename;
                    else document.title = "ASDA - " + filename + "_" + i;
                },
                error: function () {
                    if (i < 10) { // limite de tentativas
                        setTimeout(() => saveAs(filename, i + 1), 500); 
                    } else {
                        alert("Erro ao salvar após várias tentativas.");
                    }
                }
            });
        }

        function saveAs(filename,i){
            if(i!==0)jsonManager.setName(filename+"_"+i);
            $.ajax({
                url: "qnetwork?cmd=save",
                type: "POST",
                data: "graphJson=" + jsonManager.stringifyGraph(),
                async: false,
                success: function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    jsonManager.setSaved(true);

                    if(i===0)document.title = "ASDA - "+filename;
                    else document.title = "ASDA - "+filename+"_"+i;
                    return;
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    saveAs(filename,i+1);
                    return;
                }
            });
        }

        return OpOpen;
    }
);