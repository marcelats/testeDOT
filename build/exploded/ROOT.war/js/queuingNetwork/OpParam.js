define(["jquery", "jquery-ui", "LightBoxManager", "JsonManager", "Arrival"],
    function($, ui, lightBoxManager, jsonManager, arrival) {
        "use strict";

        var lastAction = null, callback = null;

        var OpParam = {
            initialize: function() {
                $("#opParamBox").dialog({
                    autoOpen: false,
                    modal: false,
                    width: 300,
                    resizable: false,
                    dialogClass: "no-titlebar", // remove cabeçalho nativo
                    show: { effect: "fadeIn", duration: 200 },   // efeito na abertura
                    hide: { effect: "fadeOut", duration: 200 }   // efeito no fechamento
                });

                /* Close button of the light box. */
                $(document).on("click", "#opParam-btClose", function() {
                    $("#opParamBox").dialog("close");
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
                    $("#opParamBox").dialog("open");      
                    $("#opParamBox").values(jsonManager.getGraphParameters());
                    callback = action;
                } else {
                    lastAction = action;
                    
                    if (action === "submit") {
                        
                        const input_batchSize = document.getElementById("opParam_batchSize");      
                        if(input_batchSize && !input_batchSize.disabled)  if (isNaN(input_batchSize.value) || input_batchSize.value < 0) {
                            alert("Batch size cannot be negative and must be a number.");
                            return;
                          } 
                        
                        const input_seed = document.getElementById("opParam_seed");

                        
                          let valor = parseInt(input_seed.value, 10);
                          input_seed.value = valor;

                          if (isNaN(valor) || valor < 0 || valor > 15) {
                            alert("Seed must be between 0 and 15.");
                            return;
                          } 
                        
                        const input_execTime = document.getElementById("opParam_execTime");      
                        if(input_execTime && !input_execTime.disabled)  if (isNaN(input_execTime.value) || input_execTime.value < 0) {
                            alert("Execution time cannot be negative and must be a number.");
                            return;
                          } 
                          
                        const input_maxEntities = document.getElementById("opParam_maxEntities");      
                        if(input_maxEntities && !input_maxEntities.disabled)  if (isNaN(input_maxEntities.value) || input_maxEntities.value < 0) {
                            alert("Max number of entities cannot be negative and must be a number.");
                            return;
                          } 
                        
                        

                        
                        var parameters = $("#opParamBox").values();
                        jsonManager.setGraphParameters(parameters);
                        $("#opParamBox").dialog("close");
                        const btnCode = document.getElementById("opCode");
                        btnCode.style.opacity = '0.3';
                        btnCode.style.pointerEvents = 'none';
                        const btnExecute = document.getElementById("opExecute");
                        btnExecute.style.opacity = '0.3';
                        btnExecute.style.pointerEvents = 'none';
                        window.flag = false;
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