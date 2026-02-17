/*
 * (Singleton) Properties area controller. He can be called by to ways: double
 * click on an added element or by the buttons in the properties form.
 * 
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */

define(["JsonManager", "Cons", "LightBoxManager", "Probabilities", "Utils"],
    function(jsonManager, cons, lightBoxManager, prob, utils) {
        "use strict";

        var propertiesArea = {
            initialize: function() {
                /* The propertiesArea click event mapping */
                $(document).on("click", "#server-bt-submit", function() {
                    propertiesArea.ctrl("submit");
                });
                $(document).on("click", "#ms-bt-submit", function() {
                    propertiesArea.ctrl("submit");
                });
                $(document).on("click", "#server-bt-cancel", function() {
                    propertiesArea.ctrl("cancel");
                });
                $(document).on("click", "#ms-bt-cancel", function() {
                    propertiesArea.ctrl("cancel");
                });
                $(document).on("click", "#prob-bt", function() {
                    if(Object.keys(jsonManager.getGraph().mapNodes[document.getElementById(cons.HIDDEN_FIELD_ID).value].mapTargets).length === 0)
                        document.getElementById("prob-bt").disabled=true;
                    else
                    {
                        lightBoxManager.openBox(  
                            "shadow3",
                            "box-prob",
                            "qnetwork?cmd=open-box&type=prob", 
                            function() {
                                prob.execute(document.getElementById(cons.HIDDEN_FIELD_ID).value);
                            }
                        );
                    }
                });
                
                $(document).on("click", "#ms-prob-bt", function() {
                    if(Object.keys(jsonManager.getGraph().mapNodes[document.getElementById(cons.HIDDEN_FIELD_ID).value].mapTargets).length === 0)
                        document.getElementById("ms-prob-bt").disabled=true;
                    else
                    {
                        lightBoxManager.openBox(  
                            "shadow3",
                            "box-prob",
                            "qnetwork?cmd=open-box&type=prob", 
                            function() {
                                prob.execute(document.getElementById(cons.HIDDEN_FIELD_ID).value);
                            }
                        );
                    }
                });
            },
            execute: function() {
                    lightBoxManager.closeBox("shadow3", "box-prob");
            },
            ctrl: function(element) {
                /* Invoked from an element. */
                if (typeof element !== "string") {
                    /* If already opened close it */
                    if ($("#" + cons.PROPERTIES_AREA).css("display") !== "none") {
                        closeDiv(element);
                    }
                    if (element.name === "server" || element.name === "multiServer") {
                        openDiv(element);
                    }
                }
                /* Invoked from within propertiesArea div. */
                else {
                    if (element === "cancel") {closeDiv(element);}
                    if (element === "submit") {
                        var callerId = $("#" + cons.HIDDEN_FIELD_ID).val();
                        var tempElement = document.getElementById(callerId);                 
                        //server
                        const inputServer = document.getElementById("server-average");
                        if(inputServer)  if (isNaN(inputServer.value) || inputServer.value < 0) {
                            alert("Average cannot be negative and must be a number.");
                            return;
                        } 
                        //multiserver
                        const inputMultiserver = document.getElementById("ms-average");
                        if(inputMultiserver)  if (isNaN(inputMultiserver.value) || inputMultiserver.value < 0) {
                            alert("Average cannot be negative and must be a number.");
                            return;
                        } 
                        //arrival
                        const inputArrival = document.getElementById("arrival-average");
                        if(inputArrival && !inputArrival.disabled)  if (isNaN(inputArrival.value) || inputArrival.value < 0) {
                            alert("Arrival average cannot be negative and must be a number.");
                            console.log("arrival average");
                            return;
                        } 
                        //ms arrival
                        const inputMsArrival = document.getElementById("ms-arrival-average");
                        if(inputMsArrival && !inputMsArrival.disabled)  if (isNaN(inputMsArrival.value) || inputMsArrival.value < 0) {
                            alert("Arrival average cannot be negative and must be a number.");
                            console.log("ms arrival average");
                            return;
                        } 
                        //desvio padrao
                        const inputServerSd = document.getElementById("server-sd");
                        if(inputServerSd && !inputServerSd.disabled){
                            let valueServerSd = parseInt(inputServerSd.value, 10);
                            inputServerSd.value = valueServerSd;
                            if (isNaN(valueServerSd) || valueServerSd < 0) {
                            alert("Standard deviation cannot be negative and must be an integer.");
                            return;
                          } 
                        }  
                        //multiserver
                        const inputMultiserverSd = document.getElementById("ms-sd");
                        if(inputMultiserverSd && !inputMultiserverSd.disabled){  
                            let valueMultiserverSd = parseInt(inputMultiserverSd.value, 10);
                            inputMultiserverSd.value = valueMultiserverSd;
                            if (isNaN(valueMultiserverSd) || valueMultiserverSd < 0) {
                            alert("Standard deviation cannot be negative and must be an integer.");
                            return;
                          } 
                        }
                        //arrival
                        const inputArrivalSd = document.getElementById("arrival-sd");
                        if(inputArrivalSd && !inputArrivalSd.disabled){
                            let valueArrivalSd = parseInt(inputArrivalSd.value, 10);
                            if (isNaN(valueArrivalSd) || valueArrivalSd < 0) {
                                alert("Arrival standard deviation cannot be negative and must be an integer.");
                                return;
                            } 
                          inputArrivalSd.value = valueArrivalSd;
                        }
                        //ms arrival
                        const inputMsArrivalSd = document.getElementById("ms-arrival-sd");
                        if(inputMsArrivalSd && !inputMsArrivalSd.disabled) {  
                            let valueMsArrivalSd = parseInt(inputMsArrivalSd.value, 10);
                            inputMsArrivalSd.value = valueMsArrivalSd;
                            if (isNaN(valueMsArrivalSd) || valueMsArrivalSd < 0) {
                                alert("Arrival standard deviation cannot be negative and must be an integer.");
                                return;
                            } 
                        }
                        var properties = $("#" + cons.PROPERTIES_AREA).values();
                        jsonManager.setNodeProperties(tempElement, properties);
                        Object.keys(jsonManager.getGraph().mapNodes[callerId].mapTargets).forEach(target => {
                            if (target !== callerId) {
                                if(jsonManager.getGraph().mapNodes[target].type === "server")
                                {
                                    jsonManager.getGraph().mapNodes[target].properties["arrival-distribution"] = "None";
                                    jsonManager.getGraph().mapNodes[target].properties["arrival-average"] = "None";
                                    jsonManager.getGraph().mapNodes[target].properties["arrival-sd"] = 0;
                                }
                                else
                                {
                                    jsonManager.getGraph().mapNodes[target].properties["ms-arrival-distribution"] = "None";
                                    jsonManager.getGraph().mapNodes[target].properties["ms-arrival-average"] = "None";
                                    jsonManager.getGraph().mapNodes[target].properties["ms-arrival-sd"] = 0;
                                }   
                            }
                        });
                        utils.resetCodeExecute();
                        closeDiv();
                    }
                }
            }
        };

        /* --- Private methods. --- */

        function openDiv(element) {
            /* The jquery width() returns a value without "px". */
            $("#" + cons.DRAW_AREA).width($("#" + cons.DRAW_AREA).outerWidth()
                - $("#" + cons.PROPERTIES_AREA).outerWidth());
            $("#" + cons.PROPERTIES_AREA).css("display", "inline");
            $("#" + cons.PROPERTIES_AREA).load(
                "qnetwork?cmd=open-properties&type=" + element.name,
                function() {
                    prepareForm(element);
console.log(
  "snapshot:",
  structuredClone(jsonManager.getGraph())
);
                    const isFirstArrival =
                        jsonManager.getGraph().firstArrivalSCs
                            .some(sc => Number(sc) === Number(element.id));
                    console.log(isFirstArrival);
                    console.log(jsonManager.getGraph().firstArrivalSCs);
                    console.log(Number(element.id));

                    if (element.name === "server") {
                        const fs = document.getElementById("arrival-fieldset");
                        if (fs) fs.disabled = !isFirstArrival;
                        syncArrivalDisabled("server", !isFirstArrival);
                    }

                    if (element.name === "multiServer") {
                        const fs = document.getElementById("ms-arrival-fieldset");
                        if (fs) fs.disabled = !isFirstArrival;
                        syncArrivalDisabled("multiServer", !isFirstArrival);
                    }
                }
            );
        }

        function prepareForm(element) {
            document.getElementById(cons.HIDDEN_FIELD_ID).value = element.id;
            document.getElementById(cons.HIDDEN_FIELD_TYPE).value = element.name;
            $("#" + cons.PROPERTIES_AREA).values(jsonManager.getNodeProperties(element));
        }

        function closeDiv() {
            $("#" + cons.DRAW_AREA).width($("#" + cons.DRAW_AREA).outerWidth()
                + $("#" + cons.PROPERTIES_AREA).outerWidth());
            $("#" + cons.PROPERTIES_AREA).css("display", "none");
        }
        
        function syncArrivalDisabled(type, disabled) {
            if (type === "server") {
                const avg = document.getElementById("arrival-average");
                const sd  = document.getElementById("arrival-sd");

                if (avg) avg.disabled = disabled;
                if (sd)  sd.disabled  = disabled;
            }

            if (type === "multiServer") {
                const avg = document.getElementById("ms-arrival-average");
                const sd  = document.getElementById("ms-arrival-sd");

                if (avg) avg.disabled = disabled;
                if (sd)  sd.disabled  = disabled;
            }
        }


        return propertiesArea;
    }
);