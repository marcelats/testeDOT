/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */

define(["jquery", "LightBoxManager", "JsonManager", "Utils", "Cons","Arrival"],
    function($, lightBoxManager, jsonManager, utils, cons,arrival) {
        "use strict";

        var lastAction = null, callback = null;

        var OpParam = {
            initialize: function() {

                /* Close button of the light box. */
                $(document).on("click", "#opParam-btClose", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });
                
                $(document).on("click", "#opParam-btSubmit", function() {
                    OpParam.execute("submit");
                });

                $(document).on("click", "#chegada-btSubmit", function() {
                    OpParam.execute("submitArrival");
                });

                $(document).on("click", "#chegada-bt", function() {
                    console.log("clicou em arrival");
                    lightBoxManager.openBox(  
                            "shadow2",
                        "boxArrival",
                        
                        "qnetwork?cmd=open-box&type=arrival", 
                        function() {
                          console.log("box arrival aberta");
                          arrival.execute();
                        }
                      );
                });
            },
            execute: function(action) {
                if (typeof action !== "string") {
                    lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                        "qnetwork?cmd=open-box&type=parameters", function() {
                        var parameters = jsonManager.getGraphParameters();

                        $("#" + cons.BOX_CONTAINER).values(parameters);
                    });

                    callback = action;

                } else {
                    lastAction = action;
                    
                    if (action === "submit") {
                        var parameters = $("#" + cons.BOX_CONTAINER).values();

                        jsonManager.setGraphParameters(parameters);
                        lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                        const btnCode = document.getElementById("opCode");
                            btnCode.style.opacity = '0.3';
                            btnCode.style.pointerEvents = 'none';
                            const btnExecute = document.getElementById("opExecute");
                            btnExecute.style.opacity = '0.3';
                            btnExecute.style.pointerEvents = 'none';
                    }
                    
                    if (action === "submitArrival") {
                        lightBoxManager.closeBox("shadow2","boxArrival");
                    }

                    if (typeof callback === "function") {
                        callback();
                        callback = null;
                    }
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpParam;
    }
);