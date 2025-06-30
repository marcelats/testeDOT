/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */

define(["jquery", "LightBoxManager", "JsonManager", "Utils", "Cons"],
    function($, lightBoxManager, jsonManager, utils, cons) {
        "use strict";

        var lastAction = null, callback = null;

        var OpParam = {
            initialize: function() {

                /* Close button of the light box. */
                $(document).on("click", "#opParam-btClose", function() {
                    lightBoxManager.closeBox(cons.BOX_CONTAINER, cons.SHADOWING);
                });

                $(document).on("click", "#chegada-btSubmit", function() {
                    OpParam.execute("submitArrival");
                });

                $(document).on("click", "#chegada-bt", function() {
                    console.log("clicou em arrival");
                    lightBoxManager.openBox(        
                        "boxArrival",
                        "shadow2",
                        "qnetwork?cmd=open-box&type=arrival", 
                        function() {
                          console.log("box arrival aberta");
                        }
                      );
                });
            },
            execute: function(action) {
                if (typeof action !== "string") {
                    lightBoxManager.openBox(cons.BOX_CONTAINER, cons.SHADOWING,
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
                        lightBoxManager.closeBox(cons.BOX_CONTAINER, cons.SHADOWING);
                    }
                    
                    if (action === "submitArrival") {
                        lightBoxManager.closeBox("boxArrival", "shadow2");
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