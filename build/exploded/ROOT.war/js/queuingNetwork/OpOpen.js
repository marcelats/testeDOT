/*
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */
define(["jquery", "jquery-ui", "LightBoxManager", "JsonManager", "Utils", "Cons", "IdManager", "jsPlumb"],
    function($, ui, lightBoxManager, jsonManager, utils, cons, idManager, jsPlumb) {
        "use strict";

        var lastAction = null, callback = null, elementManager = null, re = new RegExp(cons.REG_EXP_FILENAME);

        var OpOpen = {
            initialize: function(manager) {
                elementManager = manager;

                /* Close button of the light box. */
                $(document).on("click", "#op-open-bt-close", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#op-open-bt-submit", function() {
                    OpOpen.execute("submit");
                });

                $(document).on("click", "#op-copy-bt-submit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("copy");
                });
                $(document).on("click", "#op-delete-bt-submit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("delete");
                });
                $(document).on("click", "#op-graph-bt-submit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("graph");
                });
                $(document).on("click", "#op-code-bt-submit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("code");
                });
                $(document).on("click", "#op-report-bt-submit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("report");
                });
                /*$(document).on("click", "#opRename-btSubmit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("rename");
                });*/         
                document.addEventListener("click", (e) => {
                    const checkbox = e.target.closest(".checkbox");
                    const row = e.target.closest(".file-row-open");

                    if (checkbox) {
                        e.stopPropagation();
                        const filename = checkbox.dataset.filenameCheckbox;
                        const authorId = checkbox.dataset.authorCheckbox;
                        const userId = document.getElementById("current-user").dataset.userId;
                        if (authorId !== userId) {
                            alert("Only the author can alter the visibility");
                            return;
                        }
                        if (checkbox.dataset.busy === "true") return;
                        checkbox.dataset.busy = "true";
                        $.ajax({
                            url: "qnetwork?cmd=public",
                            type: "POST",
                            data: { graphName: filename },
                            success: function(respText) {
                                checkbox.textContent = respText.publicGraph ? "✔" : "";
                            },
                            error: function() {
                                alert("Error while altering visibility");
                            },
                            complete: function() {
                                checkbox.dataset.busy = "false";
                            }
                        });
                    } else if (row) {
                        var filename = row.dataset.filename;
                        var authorId = row.dataset.authorname;
                        document.getElementById("op-open-filename").value = filename;
                        document.getElementById("op-open-author").value = authorId;
                    }
                });
            },

            execute: function(action) {
                require(["OpNew"], function(opNewLoaded) {
                    if (typeof action !== "string") {
                        if (!jsonManager.isSaved()) {
                            opNewLoaded.execute(function() {
                                lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                                    "qnetwork?cmd=open-box&type=open", function() {
                                        $("#op-open-filename").focus();
                                    });
                            });
                            callback = action;
                            return;
                        }
                        lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                            "qnetwork?cmd=open-box&type=open", function() {
                                $("#opOpen-filename").focus();
                            });
                        callback = action;
                        return;
                    }
                    lastAction = action;
                    if (action === "submit") {
                        var filename = checkFilename();
                        var author = checkAuthor();
                        if(filename && author) 
                        {
                            $.ajax({
                                url: "qnetwork?cmd=open",
                                type: "POST",
                                data: {
                                    graphName: filename,
                                    author: author
                                },
                                dataType: "json",
                                success: function(data) {
                                    console.log(
  "snapshot:",
  structuredClone(data)
);
                                    
                                    
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                    jsonManager.setGraph(JSON.parse(JSON.stringify(data)));
                                    console.log(
  "snapshot:",
  structuredClone(jsonManager.getMapNodes())
);
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
                            utils.resetCodeExecute();
                        }
                    }

                    if (action === "copy") {
                        var filename = checkFilename();
                        var author = checkAuthor();
                        if(filename && author)
                        {
                            $.ajax({
                                url: "qnetwork?cmd=copy",
                                type: "POST",
                                data: {
                                    graphName: $("#op-open-filename").val(),
                                    author: author
                                },
                                dataType: "json",
                                success: function(data) {
                                    jsonManager.setGraph(data);
                                    jsonManager.setSaved(true);
                                    constructGraph(data);
                                    saveAs(filename, 0);
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
                    }

                    if (action === "public") {
                        var filename = checkFilename();            
                        if(filename) {
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

                    if (action === "delete") {
                        const confirmDelete = confirm("Are you sure you want to delete " + $("#opOpen-filename").val() + "?");
                        if (!confirmDelete) {
                            return;
                        }
                        var filename = checkFilename();
                        var author = checkAuthor();
                        if (filename) {
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
                        document.getElementById("op-open-filename").value = "";
                        document.getElementById("op-open-author").value = "";
                    }

                    if (action === "rename") {
                        var filename = checkFilename();
                        if (filename) {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);
                            $.ajax({
                                url: "qnetwork?cmd=rename",
                                type: "POST",
                                async: false,
                                data: {
                                    graphName: filename,
                                    newName: $("#op-open-new-name").val()
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

                    if (action === "graph") {
                        var filename = checkFilename();
                        var author = checkAuthor();
                        if(filename && author){
                            $.ajax({
                                url: "qnetwork?cmd=open-gv",
                                type: "POST",
                                data: {
                                    graphName: filename,
                                    author: author
                                },
                                dataType: "text",
                                success: function(data) {
                                    openText($("#op-open-filename").val() + ".gv", data);
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

                    if (action === "code") {
                        var filename = checkFilename();
                        var author = checkAuthor();
                        if (filename && author)
                        {
                            $.ajax({
                                url: "qnetwork?cmd=open-code",
                                type: "POST",
                                data: {
                                    graphName: filename,
                                    author: author
                                },
                                dataType: "json",
                                success: function(data) {
                                    openText(data.code_name, data.code);
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

                    if (action === "report") {
                        
                        var filename = checkFilename();
                        var author = checkAuthor();
                        if (filename && author)
                        {
                            $.ajax({
                                url: "qnetwork?cmd=open-report",
                                type: "POST",
                                data: {
                                    graphName: filename,
                                    author: author
                                },
                                dataType: "json",
                                success: function(data) {
                                    console.log(data);
                                    console.log(data.reportName);
                                    openText(data.report_name, data.report);
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

                    if (typeof callback === "function") {
                        callback();
                        callback = null;
                    }
                }); 
            },

            getLastAction: function() {
                return lastAction;
            }/*,

            delete: function(filename, author) {
                var re = new RegExp(cons.REG_EXP_FILENAME);
                if (filename.match(re) === null) {
                    alert("You need to enter a valid filename.");
                } else {
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
            }*/
        };

        /* --- Private methods. --- */

        function checkFilename()
        {
            var filename = $("#op-open-filename").val();
            if (filename.match(re) === null) {
                alert("You need enter a valid filename.");
                return null;
            }
            return filename;
        }

        function checkAuthor()
        {
            var author = $("#op-open-author").val();
            if (author.match(re) === null) {
                alert("You need to enter a valid author.");
                return null;
            }
            return author;
        }

        function openText(title, data)
        {
            console.log(title);
            lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
            const $dlg = $(`<div id="draggableModal" style="white-space: pre-wrap; text-align: left;">${data}</div>`).appendTo('body');

            $dlg.dialog({
                title: title,
                modal: false,
                draggable: true,
                resizable: true,
                closeOnEscape: false,
                width: 500,
                height: 'auto',
                maxHeight: 500,
                open: function () {
                    $('.ui-widget-overlay').off('click');
                },
                close: function () {
                    $(this).dialog('destroy').remove();
                },
                create: function () {
                    $(this).parent().draggable('option', 'handle', '.ui-dialog-titlebar');
                }
            });

            $dlg.closest('.ui-dialog').find('.ui-dialog-content').css({
                'max-height': '400px',
                'overflow-y': 'auto',
                'overflow-x': 'auto',
                'user-select': 'text',
                'cursor': 'auto'
            });

            $dlg.closest('.ui-dialog')
                .find('.ui-dialog-titlebar')
                .on('mousedown', function () {
                    $(this).css('user-select', 'none');
                })
                .on('mouseup', function () {
                    $(this).css('user-select', 'auto');
                });
        }

        function constructGraph(graph) {
            elementManager.prevElement = null;
            elementManager.prevEndPoint = null;
            $("#" + cons.DRAW_AREA).empty();
            jsPlumb.reset();
            const mapNodes = graph.mapNodes;
            
            console.log(
  "snapshot:",
  structuredClone(mapNodes)
);
            if (!utils.mapIsEmpty(mapNodes)) {
                jsonManager.setLoading(true);
                for (var key in mapNodes) {
                    var position = {
                        x: parseInt(mapNodes[key].x),
                        y: parseInt(mapNodes[key].y)
                    };
                    elementManager.add(mapNodes[key].type, position, key);
                }
                /*let maiorId = -Infinity;
                for (const key in mapNodes) {
                    if (mapNodes.hasOwnProperty(key)) {
                        const node = mapNodes[key];
                        if (node.id > maiorId) {
                            maiorId = node.id;
                        }
                    }
                }
                idManager.setStartCid(maiorId);*/
                for (var keyNode in mapNodes) {
                    var mapTargets = mapNodes[keyNode].mapTargets;
                    if (!utils.mapIsEmpty(mapTargets)) {
                        for (var keyTarget in mapTargets) {
                            console.log(
  "snapshot:",
  structuredClone(mapNodes)
);
console.log(
  "snapshot:",
  structuredClone(mapTargets)
);
console.log(
  "snapshot:",
  structuredClone(keyTarget)
);
console.log(keyNode,keyTarget);
                            elementManager.linkElements($("#" + keyNode));
                            elementManager.linkElements($("#" + keyTarget));
                            
                        }
                    }
                }
                elementManager.updateDOMIndexes();
                jsonManager.setLoading(false);
            }
        }

        function saveAs(filename, i) {
            if (i !== 0) jsonManager.setName(filename + "_" + i);

            if (jsonManager.getGraph().parameters["op-param-library"] === "Python") {
                jsonManager.getGraph().codeName = filename + "_" + i + ".py";
                jsonManager.getGraph().reportName = filename + "_" + i + "_Python.txt";
            } else if (jsonManager.getGraph().parameters["op-param-library"] === "Java") {
                jsonManager.getGraph().codeName = filename + "_" + i + ": Controle.java";
                jsonManager.getGraph().reportName = filename + "_" + i + "_Java.txt";
            } else if (jsonManager.getGraph().parameters["op-param-library"] === "R") {
                jsonManager.getGraph().codeName = filename + "_" + i + ".r";
                jsonManager.getGraph().reportName = filename + "_" + i + "_R.txt";
            } else if (jsonManager.getGraph().parameters["op-param-library"] === "C SMPL") {
                jsonManager.getGraph().codeName = filename + "_" + i + ".c";
                jsonManager.getGraph().reportName = filename + "_" + i + "_C_SMPL.txt";
            } else if (jsonManager.getGraph().parameters["op-param-library"] === "C SMPLX") {
                jsonManager.getGraph().codeName = filename + "_" + i + ".c";
                jsonManager.getGraph().reportName = filename + "_" + i + "_C_SMPLX.txt";
            } else {
                jsonManager.getGraph().codeName = filename + "_" + i;
                jsonManager.getGraph().reportName = filename + "_" + i;
            }
            console.log(
  "snapshot:",
  structuredClone(jsonManager.getGraph())
);
            var newFilename = filename;
            if (i !== 0) newFilename = filename + "_" + i;
            $.ajax({
                url: "qnetwork?cmd=save-as",
                type: "POST",
                data: {
                    filename: newFilename,
                    graphJson: jsonManager.stringifyGraph(),
                    gvFile: jsonManager.getGraph().gv,
                    codeFile: jsonManager.getGraph().code,
                    reportFile: jsonManager.getGraph().report,
                    reportName: jsonManager.getGraph().reportName,
                    codeName: jsonManager.getGraph().codeName
                },
                success: function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    jsonManager.setSaved(true);
                    if (i === 0) document.title = "ASDA - " + filename;
                    else document.title = "ASDA - " + newFilename;
                    return;
                },
                error: function(err) {
                    saveAs(filename, i + 1);
                }
            });
        }

        return OpOpen;
    }
);
