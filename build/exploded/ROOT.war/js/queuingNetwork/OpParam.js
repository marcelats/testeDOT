define(["jquery", "LightBoxManager", "JsonManager", "Arrival"],
    function($, lightBoxManager, jsonManager, arrival) {
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
                        var parameters = $("#opParamBox").values();
                        jsonManager.setGraphParameters(parameters);
                        $("#opParamBox").dialog("close");
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