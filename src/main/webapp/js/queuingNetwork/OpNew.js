/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */

define(["jquery", "LightBoxManager", "JsonManager", "Cons", "IdManager", "jsPlumb", "Utils"],
    function($, lightBoxManager, jsonManager, cons, idManager, jsPlumb, utils) {
        "use strict";

        var lastAction = null, callback = null;

        var OpNew = {
            initialize: function(opSaveAs) {
                this.opSaveAs = opSaveAs;
                /* Close button of the light box. */
                $(document).on("click", "#op-new-bt-close", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#op-new-bt-yes", function() {
                    OpNew.execute("yes");
                });

                $(document).on("click", "#op-new-bt-no", function() {
                    OpNew.execute("no");
                });

                $(document).on("click", "#op-new-bt-cancel", function() {
                    OpNew.execute("cancel");
                });
            },
            execute: function(action) {
                if (!jsonManager.isSaved()) {
                    if (typeof action !== "string") {
                        lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                            "qnetwork?cmd=open-box&type=new");
                        callback = action;
                    } else {
                        lastAction = action;
                        lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                        if (action === "yes") {
                            const filename = jsonManager.getGraph().name;
                            if(filename === "untitled") this.opSaveAs.execute(callback);
                            else {
                                jsonManager.nameCodeReport();
                                $.ajax({
                                    url: 'qnetwork?cmd=verify',
                                    type: 'POST',
                                    data: { filename: filename, graphJson: jsonManager.stringifyGraph(), 
                                        gvFile: jsonManager.getGraph().gv, codeFile: jsonManager.getGraph().code, 
                                        reportFile: jsonManager.getGraph().report, reportName: jsonManager.getGraph().reportName,
                                        codeName: jsonManager.getGraph().codeName},
                                    success: function () {
                                        lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                                        jsonManager.setSaved(true);
                                        document.title = "ASDA - "+ filename;
                                        this.newGraph();
                                    },
                                    error: function (err) {
                                        alert('Error while verifying graph.');
                                    }
                                });   
                            }
                        } else if (action === "no") {
                            this.newGraph();
                        } else {
                            if (typeof callback === "function") {
                                callback();
                                callback = null;
                            }
                        } 
                    }  
                } else {
                    this.newGraph();
                }
            },
            getLastAction: function() {
                return lastAction;
            },
            newGraph: function(){
                jsonManager.clearGraph();
                jsonManager.setSaved(true);
                $("#" + cons.DRAW_AREA).empty();
                idManager.setStartCid(-1);
                jsPlumb.reset(); 
                document.title = "ASDA";
                utils.resetCodeExecute();
                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                if (typeof callback === "function") {
                    callback();
                    callback = null;
                }
            }
        };

        return OpNew;
    }
);