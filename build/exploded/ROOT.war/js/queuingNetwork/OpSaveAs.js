/*
 * author: Marcela Tiemi Shinzato
 */
define(["jquery", "LightBoxManager", "JsonManager", "Cons", "Utils"],
    function($, lightBoxManager, jsonManager, cons, utils) {
        "use strict";

        var lastAction = null, callback = null;

        var OpSaveAs = {
            initialize: function() {
                /* Close button of the light box. */
                $(document).on("click", "#op-save-as-bt-close", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#op-save-as-bt-submit", function() {
                    OpSaveAs.execute("submit");
                });
                document.addEventListener("click", function(e) {
                    if (e.target && e.target.classList.contains("file-item-save")) {
                        var filename = e.target.getAttribute("data-filename");
                        document.getElementById("op-save-as-filename").value = filename;
                    }
                });
            },
            execute: function(action) {
                if (typeof action !== "string") {
                    this.callback = action;
                    lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                        "qnetwork?cmd=open-box&type=saveAs", function() {
                        $("#op-save-as-filename").focus();
                    });
                } else {
                    lastAction = action;
                    if (action === "submit") {
                        var filename = $("#op-save-as-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);
                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                        } 
                        else {
                            jsonManager.setName(filename);
                            jsonManager.nameCodeReport();
                            const graph = jsonManager.getGraph();
                            $.ajax({
                                url: 'qnetwork?cmd=verify',
                                type: 'POST',
                                data: { 
                                    filename: filename, 
                                    graphJson: jsonManager.stringifyGraph(), 
                                    gvFile: graph.gv, 
                                    codeFile: graph.code, 
                                    reportFile: graph.report, 
                                    reportName: graph.reportName,
                                    codeName: graph.codeName},
                                success: function () {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);

                                    jsonManager.setSaved(true);

                                    document.title = "ASDA - "+ filename;
                                    if (typeof this.callback === "function") {
                                        this.callback();
                                        this.callback = null;
                                    }
                                },
                                error: function (err) {
                                    alert('Error while verifying graph.');
                                }
                            });
                        }
                        
                        if (typeof this.callback === "function") {
                            this.callback();
                            this.callback = null;
                        }
                    }
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpSaveAs;
    }
);