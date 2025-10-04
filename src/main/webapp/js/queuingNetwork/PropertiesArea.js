/*
 * (Singleton) Properties area controller. He can be called by to ways: double
 * click on an added element or by the buttons in the properties form.
 * 
 * author: Felipe Osorio Thomé
 */

define(["JsonManager", "Cons"],
    function(jsonManager, cons) {
        "use strict";

        var propertiesArea = {
            initialize: function() {
                /* The propertiesArea click event mapping */
                $(document).on("click", "#btSubmit", function() {
                    propertiesArea.ctrl("submit");
                });
                $(document).on("click", "#btCancel", function() {
                    propertiesArea.ctrl("cancel");
                });

            },
            ctrl: function(element) {
                /* Invoked from an element. */
                if (typeof element !== "string") {
                    /* If already opened close it */
                    if ($("#" + cons.PROPERTIES_AREA).css("display") !== "none") {
                        closeDiv(element);
                    }
                    if (element.name === "server") {
                        openDiv(element);
                    }
                    if (element.name === "multiServer") {
                        openDiv(element);
                    }
                }
                /* Invoked from within propertiesArea div. */
                else {
                    closeDiv();

                    if (element === "submit") {
                        var callerId = $("#" + cons.HIDDEN_FIELD_ID).val();
                        var tempElement = document.getElementById(callerId);
                        console.log(tempElement);
                        var source = jsonManager.getGraph().mapNodes[callerId].source;
                        console.log(source);
                        if(source !== -1)
                        {
                            var max = 100 - Object.values(jsonManager.getGraph().mapNodes[source].mapTargets).reduce((total, valor) => total + valor, 0);
                            var input = "";
                            if(jsonManager.getGraph().mapNodes[callerId].type === "server") input = parseFloat(document.getElementById("probability").value);
                            else input = parseFloat(document.getElementById("ms_probability").value);
                            if(input > max) {
                                alert("The sum of the probabilities for each node cannot exceed 100.");
                                return;
                            }
                            console.log(jsonManager.getGraph().mapNodes[source]);
                            jsonManager.getGraph().mapNodes[source].mapTargets[callerId] = input;
                            var zeroes = [];
                            for (const [key, value] of Object.entries(jsonManager.getGraph().mapNodes[source].mapTargets)) {
                                if (value === 0) {
                                    zeroes.push(key);
                                }
                            }
                            console.log(jsonManager.getGraph().mapNodes[source].mapTargets);
                            console.log(zeroes);
                            if (zeroes.length == 1) {
                                jsonManager.getGraph().mapNodes[source].mapTargets[zeroes[0]] = max - input;
                                if(jsonManager.getGraph().mapNodes[callerId].type === "server") jsonManager.getGraph().mapNodes[zeroes[0]].properties.probability = max - input;
                                else jsonManager.getGraph().mapNodes[zeroes[0]].properties.ms_probability = max - input;
                            }
                        }
                        

                        var properties = $("#" + cons.PROPERTIES_AREA).values();
                        
                        
                        jsonManager.setNodeProperties(tempElement, properties);

                        const btnCode = document.getElementById("opCode");
                        btnCode.style.opacity = '0.3';
                        btnCode.style.pointerEvents = 'none';
                        const btnExecute = document.getElementById("opExecute");
                        btnExecute.style.opacity = '0.3';
                        btnExecute.style.pointerEvents = 'none';
                        window.flag = false;
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
                    if(jsonManager.getGraph().opcoes.some(opcao => opcao.value === String(element.id)))
                    {
                        if(element.name === "server") 
                        {
                            const arrivalFieldset = document.getElementById("arrival_fieldset");
                            if(arrivalFieldset) arrivalFieldset.disabled = false;
                        }
                        if(element.name === "multiServer")
                        {
                            const ms_arrivalFieldset = document.getElementById("ms_arrival_fieldset");
                            if(ms_arrivalFieldset) ms_arrivalFieldset.disabled = false;
                        }
                    }
                    else
                    {
                        if(element.name === "server") 
                        {
                            const arrivalFieldset = document.getElementById("arrival_fieldset");
                            if(arrivalFieldset) arrivalFieldset.disabled = true;
                        }
                        if(element.name === "multiServer")
                        {
                            const ms_arrivalFieldset = document.getElementById("ms_arrival_fieldset");
                            if(ms_arrivalFieldset) ms_arrivalFieldset.disabled = true;
                        }
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

        return propertiesArea;
    }
);