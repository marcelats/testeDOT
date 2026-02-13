/*
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */
define(["jquery", "jquery-ui", "domReady!", "LightBoxManager", "JsonManager", "Arrival", "Utils"],
    function($, _, dr, lightBoxManager, jsonManager, arrival, utils) {
        "use strict";

        var lastAction = null, callback = null;

        var OpParam = {
            initialize: function() {
                $("#op-param-box").dialog({
                    autoOpen: false,
                    modal: false,
                    width: 300,
                    resizable: false,
                    dialogClass: "no-titlebar", 
                    show: { effect: "fadeIn", duration: 200 },   
                    hide: { effect: "fadeOut", duration: 200 }  
                });

                /* Close button of the light box. */
                $(document).on("click", "#op-param-bt-close", function() {
                    $("#op-param-box").dialog("close");
                });
                
                $(document).on("click", "#op-param-bt-submit", function() {
                    OpParam.execute("submit");
                });

                $(document).on("click", "#arrival-bt-submit", function() {
                    OpParam.execute("submitArrival");
                });

                $(document).on("click", "#arrival-bt", function() {
                    lightBoxManager.openBox(  
                        "shadow2",
                        "box-arrival",
                        "qnetwork?cmd=open-box&type=arrival", 
                        function() {
                            arrival.execute();
                        }
                    );
                });
            },
            execute: function(action) {
                if (typeof action !== "string") {
                    $("#op-param-box").dialog("open");      
                    $("#op-param-box").values(jsonManager.getGraphParameters());
                    callback = action;
                } else {
                    lastAction = action;
                    if (action === "submit") {   
                        const opParamLibrary = document.getElementById("op-param-library");      
                        const inputBatchSize = document.getElementById("op-param-batch-size");      
                        if(inputBatchSize && !inputBatchSize.disabled) { 
                            if (isNaN(inputBatchSize.value) || inputBatchSize.value < 0) {
                                lightBoxManager.showAlert("Batch size cannot be negative and must be a number.");
                                return;
                            } 
                        }
                        const inputSeed = document.getElementById("op-param_seed");
                        let value = parseInt(inputSeed.value, 10);
                        inputSeed.value = value;
                        if (isNaN(value) || value < 0 || value > 15) {
                            lightBoxManager.showAlert("Seed must be between 0 and 15.");
                            return;
                        } 
                        const inputExecTime = document.getElementById("op-param-exec-time");      
                        if(inputExecTime && !inputExecTime.disabled) 
                        { 
                            if (isNaN(inputExecTime.value) || inputExecTime.value < 0) 
                            {
                                lightBoxManager.showAlert("Execution time cannot be negative and must be a number.");
                                return;
                            }
                        } 
                        const booleanWarmupTime = document.getElementById("op-param-exec-time");      
                        if(booleanWarmupTime && !booleanWarmupTime.disabled) 
                        { 
                            if (isNaN(booleanWarmupTime.value) || booleanWarmupTime.value < 0) 
                            {
                                lightBoxManager.showAlert("Execution time cannot be negative and must be a number.");
                                return;
                            }
                            var parameters = $("#op-param-box").values();
                            jsonManager.setGraphParameters(parameters);
                            $("#op-param-box").dialog("close");
                            utils.resetCodeExecute();
                        }
                    }
                    
                    if (action === "submitArrival") {
                        lightBoxManager.closeBox("shadow2","box-arrival");
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