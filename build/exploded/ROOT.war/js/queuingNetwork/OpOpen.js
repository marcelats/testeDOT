/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */

define(["jquery", "LightBoxManager", "JsonManager", "OpNew", "Utils", "Cons", "IdManager", "DrawArea"],
    function($, lightBoxManager, jsonManager, opNew, utils, cons, idManager, drawArea) {
        "use strict";

        var lastAction = null, callback = null, elementManager = null;

        var OpOpen = {
            initialize: function(manager) {

                console.log("lightBoxManager", lightBoxManager);
console.log("jsonManager", jsonManager);
console.log("opNew", opNew); // este deve aparecer como objeto, não undefined

                elementManager = manager;

                /* Close button of the light box. */
                $(document).on("click", "#opOpen-btClose", function() {
                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');
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
                
    /*const fileItems = document.querySelectorAll('.file-item');
    const inputField = document.getElementById('opOpen-filename');

    fileItems.forEach(item => {
        item.addEventListener('click', function () {
            const fileName = this.getAttribute('data-filename');
            inputField.value = fileName;
        });
    });*/
    console.log('file-item count =', document.querySelectorAll('.file-item').length);

    /*document.addEventListener("DOMContentLoaded", function() {
    // Pega todos os elementos com a classe .file-item
    document.querySelectorAll(".file-item").forEach(function(item) {
      item.addEventListener("click", function() {
        // Pega o valor do atributo data-filename
        var filename = this.getAttribute("data-filename");
        console.log("filename:");
        console.log(filename);
        // Coloca no input
        document.getElementById("opOpen-filename").value = filename;
        console.log("document.getElementById(opOpen-filename).value");
        console.log(document.getElementById("opOpen-filename").value);
      });
    });
  });*/
    document.addEventListener("click", function(e) {
  if (e.target && e.target.classList.contains("file-item")) {
    var filename = e.target.getAttribute("data-filename");
    console.log("filename:", filename);
    document.getElementById("opOpen-filename").value = filename;
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
                    lightBoxManager.openBox('shadowing3', 'opOpenBox',
                        "qnetwork?cmd=open-box&type=open", function() {
                        $("#opOpen-filename").focus();
                    });

                    callback = action;

                } else {
                    lastAction = action;
                    
                    if (action === "submit") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);

                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");

                        } else {
                            open(filename);
                            const btnCode = document.getElementById("opCode");
                            btnCode.style.opacity = '0.3';
                            btnCode.style.pointerEvents = 'none';
                            const btnExecute = document.getElementById("opExecute");
                            btnExecute.style.opacity = '0.3';
                            btnExecute.style.pointerEvents = 'none';
                        }
                    }
                    
                    if (action === "copy") {
                        var filename = "copia" + $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);

                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");

                        } else {
                            $.ajax({
                url: "qnetwork?cmd=open",
                type: "POST",
                data: "graphName=" + $("#opOpen-filename").val(),
                dataType: "json",
                success: function(data) {
                    jsonManager.setGraph(data);
                    jsonManager.setSaved(true);

                    if (data.name !== "") {
                        document.title = "ASDA - " + data.name;
                    }

                    constructGraph(data);
                    var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=save",
                                type: "POST",
                                data: "graphJson=" + jsonManager.stringifyGraph(),
                                async: false,
                                success: function() {
                                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');
                                    jsonManager.setSaved(true);

                                    document.title = filename;
                                    open(filename);
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

                        } else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=public",
                                type: "POST",
                                async: false,
                                data: "graphName=" + filename,
                                success: function() {
                                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');
                                    jsonManager.setSaved(true);

                                    document.title = filename;
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

                        } else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=private",
                                type: "POST",
                                async: false,
                                data: "graphName=" + filename,
                                success: function() {
                                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');
                                    jsonManager.setSaved(true);

                                    document.title = filename;
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
                    }
                    
                    if (action === "rename") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);

                        if (filename.match(re) === null) {
                            alert("You need enter a valid filename.");

                        } else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=rename",
                                type: "POST",
                                async: false,
                                data: "graphName=" + filename + "&newName=" + $("#opOpen-newname").val(),
                                success: function() {
                                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');
                                    jsonManager.setSaved(true);

                                    document.title = filename;
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

                        } else {
                            var tempFilename = jsonManager.getName();
                            jsonManager.setName(filename);

                            $.ajax({
                                url: "qnetwork?cmd=delete",
                                type: "POST",
                                async: false,
                                data: "graphName=" + filename,
                                success: function() {
                                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');
                                    jsonManager.setSaved(true);

                                    document.title = filename;
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

        function open(filename) {
            $.ajax({
                url: "qnetwork?cmd=open",
                type: "POST",
                data: "graphName=" + filename,
                dataType: "json",
                success: function(data) {
                    lightBoxManager.closeBox('shadowing3', 'opOpenBox');

                    jsonManager.setGraph(data);
                    jsonManager.setSaved(true);

                    if (data.name !== "") {
                        document.title = data.name;
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

        return OpOpen;
    }
);