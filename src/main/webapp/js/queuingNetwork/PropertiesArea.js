/*
 * (Singleton) Properties area controller. He can be called by to ways: double
 * click on an added element or by the buttons in the properties form.
 * 
 * author: Felipe Osorio Thomé
 */

define(["JsonManager", "Cons", "LightBoxManager", "Probabilities"],
    function(jsonManager, cons, lightBoxManager, prob) {
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
                /*$(document).on("click", "#prob-btSubmit", function() {
                      
                
                const mapTargets = jsonManager.getGraph().mapNodes[id].mapTargets;
                console.log(jsonManager.getGraph().mapNodes[id].mapTargets);
                const keys = Object.keys(mapTargets);
                console.log(keys);
                const key = keys[indexAtual];
                console.log(key);
                const value = mapTargets[key];
                console.log(value);
                const lastIndex = keys.length - 1;
                console.log(lastIndex);
                const prob_value = document.getElementById("target_server");
                if (indexAtual === lastIndex) {
                    console.log("→ Este é o último elemento!");
                    indexAtual = 0;
                    document.getElementById("saida").textContent = key;
                    prob_value.disabled = true;
                    prob_value.value = 100 - Object.values(mapTargets).reduce((total, valor) => total + valor, 0);
                    $(document).on("click", "#prob-btSubmit", function() {
                        lightBoxManager.closeBox("shadow3","boxProb");
                    });
                }
                else
                {
                    console.log("nao eh o ultimo elemento");
                    exibirAtual(keys, mapTargets, indexAtual, prob_value);
                    //document.getElementById("saida").textContent = key;
                    //prob_value.disabled = false;
                    //prob_value.value = value;
                    $(document).on("click", "#prob-btSubmit", function() {
                        if(Object.values(mapTargets).reduce((total, valor) => total + valor, 0) + prob_value.value > 100){
                            alert("The sum of probabilities for each node cannot exceed 100.");
                            this.onclick = function() {
                                console.log("this.onclick");
                                    const input = document.getElementById("target_server");
                                    const novoValor = parseFloat(input.value);
                                    if (!isNaN(novoValor)) {
                                        mapTargets[key] = novoValor;
                                        
                                        input.value = "";
                                        input.style.display = "none";
                                        this.onclick = null; // remove override
                                        document.getElementById("prob-btSubmit").addEventListener("click", arguments.callee);
                                        exibirAtual(keys, mapTargets, indexAtual, prob_value);
                                    } else {
                                        alert("Input a valid value");
                                    }
                                };
                            }
                        else
                        {
                            console.log("a soma nao excedeu");
                            mapTargets[key] = prob_value.value;
                            indexAtual += 1;
                            
                        }
                    });
                }
            });    */
 
 
                $(document).on("click", "#prob-bt", function() {
                    console.log(Object.keys(jsonManager.getGraph().mapNodes[document.getElementById(cons.HIDDEN_FIELD_ID).value].mapTargets));
                    if(Object.keys(jsonManager.getGraph().mapNodes[document.getElementById(cons.HIDDEN_FIELD_ID).value].mapTargets).length === 0)
                        document.getElementById("prob-bt").disabled=true;
                    else
                    {
                        
                        lightBoxManager.openBox(  
                            "shadow3",
                            "boxProb",
                            "qnetwork?cmd=open-box&type=prob", 
                            function() {
                                console.log("antes de prob.execute()");
                                prob.execute(document.getElementById(cons.HIDDEN_FIELD_ID).value);
                                console.log("depois de prob.execute()");
                            }
                        );
                    }
                });
                
                $(document).on("click", "#ms_prob-bt", function() {
                    console.log(Object.keys(jsonManager.getGraph().mapNodes[document.getElementById(cons.HIDDEN_FIELD_ID).value].mapTargets));
                    if(Object.keys(jsonManager.getGraph().mapNodes[document.getElementById(cons.HIDDEN_FIELD_ID).value].mapTargets).length === 0)
                        document.getElementById("ms_prob-bt").disabled=true;
                    else
                    {
                        
                        lightBoxManager.openBox(  
                            "shadow3",
                            "boxProb",
                            "qnetwork?cmd=open-box&type=prob", 
                            function() {
                                console.log("antes de prob.execute()");
                                prob.execute(document.getElementById(cons.HIDDEN_FIELD_ID).value);
                                console.log("depois de prob.execute()");
                            }
                        );
                    }
                });
                
            },
            execute: function() {
                
                
                    lightBoxManager.closeBox("shadow3","boxProb");


  
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
                    

                    if (element === "submit") {
                        var callerId = $("#" + cons.HIDDEN_FIELD_ID).val();
                        var tempElement = document.getElementById(callerId);
                        console.log(tempElement);
                        /*var source = jsonManager.getGraph().mapNodes[callerId].source;
                        console.log(source);
                        if(source !== -1)
                        {
                            
                            console.log(jsonManager.getGraph().mapNodes[source]);
                            
                            
                            var max = 100 - Object.values(jsonManager.getGraph().mapNodes[source].mapTargets).reduce((total, valor) => total + valor, 0)
                                    + jsonManager.getGraph().mapNodes[source].mapTargets[callerId];
                            var input = "";
                            if(jsonManager.getGraph().mapNodes[callerId].type === "server") input = parseFloat(document.getElementById("probability").value);
                            else input = parseFloat(document.getElementById("ms_probability").value);
                            if(input > max) {
                                console.log(input, typeof input);
                                console.log(max, typeof max);
                                alert("The sum of the probabilities for each node cannot exceed 100.");
                                return;
                            }
                            jsonManager.getGraph().mapNodes[source].mapTargets[callerId] = input;
                            
                        }*/
                        //server
                        const input_server = document.getElementById("server_average");
                        


                        if(input_server)  if (isNaN(input_server.value) || input_server.value < 0) {
                            alert("Average cannot be negative and must be a number.");
                            return;
                          } 
                          //multiserver
                          const input_multiserver = document.getElementById("multiServer_average");
                        


                        if(input_multiserver)  if (isNaN(input_multiserver.value) || input_multiserver.value < 0) {
                            alert("Average cannot be negative and must be a number.");
                            return;
                          } 
                        //arrival
                        const input_arrival = document.getElementById("arrival-average");
                        if(input_arrival && !input_arrival.disabled)  if (isNaN(input_arrival.value) || input_arrival.value < 0) {
                            alert("Arrival average cannot be negative and must be a number.");
                            return;
                          } 
                        //ms arrival
                         const input_msarrival = document.getElementById("ms_arrival_average");
                        if(input_msarrival && !input_msarrival.disabled)  if (isNaN(input_msarrival.value) || input_msarrival.value < 0) {
                            alert("Arrival average cannot be negative and must be a number.");
                            return;
                          } 
                          
                          //desvio padrao
                          
                          const input_serversd = document.getElementById("server_stdDeviation");
                        


                        if(input_serversd && !input_serversd.disabled){
                            let valor_serversd = parseInt(input_serversd.value, 10);
                            input_serversd.value = valor_serversd;
                            if (isNaN(valor_serversd) || valor_serversd < 0) {
                            alert("Standard deviation cannot be negative and must be an integer.");
                            return;
                          } 
                        }  
                          //multiserver
                          const input_multiserversd = document.getElementById("multiServer_stdDeviation");
                        

                        if(input_multiserversd && !input_multiserversd.disabled){  let valor_multiserversd = parseInt(input_multiserversd.value, 10);
                            input_multiserversd.value = valor_multiserversd;
                            if (isNaN(valor_multiserversd) || valor_multiserversd < 0) {
                            alert("Standard deviation cannot be negative and must be an integer.");
                            return;
                          } 
                        }
                      
                        //arrival
                        const input_arrivalsd = document.getElementById("arrival_stdDeviation");
                        if(input_arrivalsd && !input_arrivalsd.disabled){console.log(input_arrivalsd);
                            console.log("Valor bruto:", JSON.stringify(input_arrivalsd.value));

                            let valor_arrivalsd = parseInt(input_arrivalsd.value, 10);
                            
                            if (isNaN(valor_arrivalsd) || valor_arrivalsd < 0) {
                                console.log(valor_arrivalsd);
                            alert("Arrival standard deviation cannot be negative and must be an integer.");
                            return;
                          } 
                          input_arrivalsd.value = valor_arrivalsd;
                        }
                        //ms arrival
                         const input_msarrivalsd = document.getElementById("ms_arrival_stdDeviation");
                        if(input_msarrivalsd && !input_msarrivalsd.disabled) {  let valor_msarrivalsd = parseInt(input_msarrivalsd.value, 10);
                            input_msarrivalsd.value = valor_msarrivalsd;
                            if (isNaN(valor_msarrivalsd) || valor_msarrivalsd < 0) {
                            alert("Arrival standard deviation cannot be negative and must be an integer.");
                            return;
                          } 
                        }
                        var properties = $("#" + cons.PROPERTIES_AREA).values();
                        
                        
                        jsonManager.setNodeProperties(tempElement, properties);
                        Object.keys(jsonManager.getGraph().mapNodes[callerId].mapTargets).forEach(target => {



                            jsonManager.getGraph().mapNodes[target].properties.arrival_distribution = "None";


                            jsonManager.getGraph().mapNodes[target].properties.arrival_average = "None";


                            jsonManager.getGraph().mapNodes[target].properties.arrival_stdDeviation = 0;


                        });

                        const btnCode = document.getElementById("opCode");
                        btnCode.style.opacity = '0.3';
                        btnCode.style.pointerEvents = 'none';
                        const btnExecute = document.getElementById("opExecute");
                        btnExecute.style.opacity = '0.3';
                        btnExecute.style.pointerEvents = 'none';
                        window.flag = false;
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

            
            /*var zeroes = [];
            
            var source = jsonManager.getGraph().mapNodes[element.id].source;
            if(source !== -1)
                for (const [key, value] of Object.entries(jsonManager.getGraph().mapNodes[source].mapTargets)) {
                    if (value === 0) {
                        zeroes.push(key);
                    }
                }
            console.log(jsonManager.getGraph().mapNodes[source].mapTargets);
            console.log(zeroes);
            if (zeroes.length == 1) {
                var max = 100 - Object.values(jsonManager.getGraph().mapNodes[source].mapTargets).reduce((total, valor) => total + valor, 0) 
                        + jsonManager.getGraph().mapNodes[source].mapTargets[element.id];
                jsonManager.getGraph().mapNodes[source].mapTargets[zeroes[0]] = max;
                if(jsonManager.getGraph().mapNodes[element.id].type === "server")
                    jsonManager.getGraph().mapNodes[zeroes[0]].properties.probability = max;
                else jsonManager.getGraph().mapNodes[zeroes[0]].properties.ms_probability = max;
            }*/
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