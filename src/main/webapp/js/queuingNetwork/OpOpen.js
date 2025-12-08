define(["jquery","jquery-ui", "LightBoxManager", "JsonManager", "OpNew", "Utils", "Cons", "IdManager", "DrawArea", "jsPlumb"],
    function($, ui, lightBoxManager, jsonManager, opNew, utils, cons, idManager, drawArea, jsPlumb) {
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
                $(document).on("click", "#opGraph-btSubmit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("graph");
                });
                $(document).on("click", "#opCode-btSubmit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("code");
                });
                $(document).on("click", "#opReport-btSubmit", function(e) {
                    e.preventDefault();
                    OpOpen.execute("report");
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
                        const checkboxEl = e.target;
                        const filename = checkboxEl.dataset.filenameCheckbox;
                        const authorId = checkboxEl.dataset.authorCheckbox;
                        const userId = document.getElementById("current-user").dataset.userId;
                        console.log(authorId);
                        console.log(userId);
                        if (authorId !== userId) {
                            alert("Only the author can alter the visibility");
                            return;
                        }

                        if (checkboxEl.dataset.busy === "true") return;
                        checkboxEl.dataset.busy = "true";

                        const currentlyPublic = checkboxEl.textContent === "✔";
                        checkboxEl.textContent = currentlyPublic ? "" : "✔";

                        $.ajax({
                            url: "qnetwork?cmd=public",
                            type: "POST",
                            data: { graphName: filename },
                            success: function() {
                                jsonManager.setSaved(true);
                            },
                            error: function(xhr, ajaxOptions, thrownError) {
                                checkboxEl.textContent = currentlyPublic ? "✔" : "";
                                var errorHeader = xhr.getResponseHeader('fot-error');
                                alert(errorHeader !== null ? errorHeader : thrownError);
                            },
                            complete: function() {
                                checkboxEl.dataset.busy = "false";
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
                // Carrega OpNew dinamicamente (ajuda contra ciclos)
                require(["OpNew"], function(opNewLoaded) {
                    // Se action NÃO for string -> queremos abrir a caixa de "open"
                    if (typeof action !== "string") {
                        // Se não estiver salvo, devemos mostrar a caixa de "new" primeiro
                        if (!jsonManager.isSaved()) {
                            // Passamos um callback para opNew: quando o usuário decidir,
                            // o callback abrirá a caixa de "open".
                            opNewLoaded.execute(function() {
                                lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                                    "qnetwork?cmd=open-box&type=open", function() {
                                        $("#opOpen-filename").focus();
                                    });
                            });

                            // guardamos o callback externo (se necessário)
                            callback = action;
                            return;
                        }

                        // se já estava salvo, abre direto a caixa "open"
                        lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                            "qnetwork?cmd=open-box&type=open", function() {
                                $("#opOpen-filename").focus();
                            });
                        callback = action;
                        return;
                    }

                    // ---- se aqui, action é string ----
                    lastAction = action;

                    if (action === "submit") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME),
                            author = $("#opOpen-author").val();
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        } else if (author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        } else {
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
                            alert("You need to enter a valid filename.");
                        } else if (author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        } else {
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
                        OpOpen.delete($("#opOpen-filename").val(), $("#opOpen-author").val());
                        document.getElementById("opOpen-filename").value = "";
                        document.getElementById("opOpen-author").value = "";
                    }

                    if (action === "rename") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        } else {
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
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME),
                            author = $("#opOpen-author").val();
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        } else if (author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        }
                        $.ajax({
                            url: "qnetwork?cmd=opengv",
                            type: "POST",
                            data: {
                                graphName: filename,
                                author: author
                            },
                            dataType: "text",
                            success: function(data) {
                                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                const $dlg = $(`<div id="draggableModal" style="white-space: pre-wrap; text-align: left;">${data}</div>`).appendTo('body');

                                $dlg.dialog({
                                    title: $("#opOpen-filename").val() + ".gv",
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

                    if (action === "code") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME),
                            author = $("#opOpen-author").val();
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        } else if (author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        }
                        $.ajax({
                            url: "qnetwork?cmd=opencode",
                            type: "POST",
                            data: {
                                graphName: filename,
                                author: author
                            },
                            dataType: "json",
                            success: function(data) {
                                console.log(data.code);
                                console.log(data.code_name);
                                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                const $dlg = $(`<div id="draggableModal" style="white-space: pre-wrap; text-align: left;">${data.code}</div>`).appendTo('body');

                                $dlg.dialog({
                                    title: data.code_name,
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

                    if (action === "report") {
                        var filename = $("#opOpen-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME),
                            author = $("#opOpen-author").val();
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        } else if (author.match(re) === null) {
                            alert("You need to enter a valid author.");
                        }
                        $.ajax({
                            url: "qnetwork?cmd=openreport",
                            type: "POST",
                            data: {
                                graphName: filename,
                                author: author
                            },
                            dataType: "json",
                            success: function(data) {
                                console.log(data.report);
                                console.log(data.report_name);
                                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                const $dlg = $(`<div id="draggableModal" style="white-space: pre-wrap; text-align: left;">${data.report}</div>`).appendTo('body');

                                $dlg.dialog({
                                    title: data.report_name,
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

                    if (typeof callback === "function") {
                        callback();
                        callback = null;
                    }
                }); // end require(["OpNew"], ...)
            }, // end execute

            getLastAction: function() {
                return lastAction;
            },

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
            }
        };

        /* --- Private methods. --- */

        function open(filename, author) {
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
            elementManager.prevElement = null;
            elementManager.prevEndPoint = null;
            $("#" + cons.DRAW_AREA).empty();
            jsPlumb.reset();
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
                            elementManager.linkElements($("#" + keyNode));
                            elementManager.linkElements($("#" + keyTarget));
                        }
                    }
                }
            }
        }

        function saveAs(filename, i) {
            if (i !== 0) jsonManager.setName(filename + "_" + i);

            if (jsonManager.getGraph().parameters.opParam_library === "Python") {
                jsonManager.getGraph().code_name = filename + "_" + i + ".py";
                jsonManager.getGraph().report_name = filename + "_" + i + "_Python.txt";
            } else if (jsonManager.getGraph().parameters.opParam_library === "Java") {
                jsonManager.getGraph().code_name = filename + "_" + i + ": Controle.java";
                jsonManager.getGraph().report_name = filename + "_" + i + "_Java.txt";
            } else if (jsonManager.getGraph().parameters.opParam_library === "R") {
                jsonManager.getGraph().code_name = filename + "_" + i + ".r";
                jsonManager.getGraph().report_name = filename + "_" + i + "_R.txt";
            } else if (jsonManager.getGraph().parameters.opParam_library === "C SMPL") {
                jsonManager.getGraph().code_name = filename + "_" + i + ".c";
                jsonManager.getGraph().report_name = filename + "_" + i + "_C_SMPL.txt";
            } else if (jsonManager.getGraph().parameters.opParam_library === "C SMPLX") {
                jsonManager.getGraph().code_name = filename + "_" + i + ".c";
                jsonManager.getGraph().report_name = filename + "_" + i + "_C_SMPLX.txt";
            } else {
                jsonManager.getGraph().code_name = filename + "_" + i;
                jsonManager.getGraph().report_name = filename + "_" + i;
            }

            var newfilename = filename;
            if (i !== 0) newfilename = filename + "_" + i;
            $.ajax({
                url: "qnetwork?cmd=saveAs",
                type: "POST",
                data: {
                    filename: newfilename,
                    graphJson: jsonManager.stringifyGraph(),
                    gv_file: jsonManager.getGraph().gv,
                    code_file: jsonManager.getGraph().code,
                    report_file: jsonManager.getGraph().report,
                    report_name: jsonManager.getGraph().report_name,
                    code_name: jsonManager.getGraph().code_name
                },
                success: function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    jsonManager.setSaved(true);
                    if (i === 0) document.title = "ASDA - " + filename;
                    else document.title = "ASDA - " + newfilename;
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
