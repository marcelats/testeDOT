/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */

define(["jquery", "LightBoxManager", "JsonManager", "OpSave", "Cons", "IdManager", "jsPlumb"],
    function($, lightBoxManager, jsonManager, opSave, cons, idManager, jsPlumb) {
        "use strict";

        var lastAction = null, callback = null;

        var OpNew = {
            initialize: function() {

                /* Close button of the light box. */
                $(document).on("click", "#opNew-btClose", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#opNew-btYes", function() {
                    OpNew.execute("yes");
                });

                $(document).on("click", "#opNew-btNo", function() {
                    OpNew.execute("no");
                });

                $(document).on("click", "#opNew-btCancel", function() {
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
                            opSave.execute();

                        } else if (action === "no") {
                            jsonManager.clearGraph();
                            window.gv = "";
                            window.code = "";
                            window.report = "";
                            jsonManager.setSaved(true);
                            $("#" + cons.DRAW_AREA).empty();
                            idManager.setStartCid(-1);
                            jsPlumb.reset(); 
                            document.title = "ASDA";
                            const btnCode = document.getElementById("opCode");
                            btnCode.style.opacity = '0.3';
                            btnCode.style.pointerEvents = 'none';
                            const btnExecute = document.getElementById("opExecute");
                            btnExecute.style.opacity = '0.3';
                            btnExecute.style.pointerEvents = 'none';
                        }

                        if (typeof callback === "function") {
                            callback();
                            callback = null;
                        }
                    }
                } else {
                    jsonManager.clearGraph();
                    window.gv = "";
                    window.code = "";
                    window.report = "";
                    jsonManager.setSaved(true);
                    idManager.setStartCid(-1);
                    $("#" + cons.DRAW_AREA).empty();
                    jsPlumb.reset(); 
                    document.title = "ASDA";
                    const btnCode = document.getElementById("opCode");
                    btnCode.style.opacity = '0.3';
                    btnCode.style.pointerEvents = 'none';
                    const btnExecute = document.getElementById("opExecute");
                    btnExecute.style.opacity = '0.3';
                    btnExecute.style.pointerEvents = 'none';
                    window.flag = false;
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpNew;
    }
);