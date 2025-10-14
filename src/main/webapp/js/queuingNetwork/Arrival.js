/* global arrivals */

define(["jquery", "JsonManager"],
function($, jsonManager) {
    "use strict";

    var lastAction = null;
    
    var arrival = {
        initialize: function () {
            console.log("initiliaze do arrival");   
            if (!window.observer) {
                console.log("novo mutation observer");
                window.observer = new MutationObserver((obs) => {
                    const select = document.getElementById("service_center");
                    if (select) {
                        preencherSelect(select);
                        obs.disconnect(); // desconecta quando encontrar
                        window.isObserving = false; // atualiza flag
                    }
                });

              window.isObserving = false; // flag de controle
            }
        },
        execute: function () {
            preencherSelect(document.getElementById("service_center"));
            console.log("execute do arrival");
            console.log("jsonManager.getGraph().arrivals");
            console.log(jsonManager.getGraph().arrivals);
            exibirAtual();
            const number_clients = document.getElementById("number_clients");
            number_clients.style.opacity = '0.5';
            number_clients.style.pointerEvents = 'none';
            const arrival_time = document.getElementById("arrival_time");
            arrival_time.style.opacity = '0.5';
            arrival_time.style.pointerEvents = 'none';
            const service_center = document.getElementById("service_center");
            service_center.style.opacity = '0.5';
            service_center.style.pointerEvents = 'none';
            $(document).off("click", "#new-bt");
            $(document).on("click", "#new-bt", function() {
                number_clients.style.opacity = '1';
                number_clients.style.pointerEvents = 'auto';

                arrival_time.style.opacity = '1';
                arrival_time.style.pointerEvents = 'auto';

                service_center.style.opacity = '1';
                service_center.style.pointerEvents = 'auto';
                const select = document.getElementById("service_center");


                if (select) {
                    preencherSelect(select); // já existe? preenche direto
                    window.observer.disconnect(); // desconecta quando encontrar
                        window.isObserving = false;
                }
                console.log("antes de if (!window.isObserving)");
                if (!window.isObserving) {
                    window.observer.disconnect(); // desconecta quando encontrar
                    window.isObserving = false;
                } else {
                    console.log("Observer já ativo — não será ativado novamente");
                    window.observer.disconnect(); // desconecta quando encontrar
                    window.isObserving = false;
                }  
                console.log("depois de if (!window.isObserving)");
            });
            $(document).off("click", "#save-bt");
            $(document).on("click", "#save-bt", function() {
                
  
                
                const numberClients = document.getElementById("number_clients");
                let valor_numberClients = parseInt(numberClients.value, 10);
                        console.log(valor_numberClients);
                          numberClients.value = valor_numberClients;
                          console.log(numberClients.value);
                          if (isNaN(valor_numberClients) || valor_numberClients < 0) {
                            alert("Number of clients cannot be negative and must be an integer.");
                            return;
                          }
                
                
                const arrivalTime = document.getElementById("arrival_time");
                console.log(arrivalTime.value);
                if(arrivalTime)  if (isNaN(arrivalTime.value) || arrivalTime.value < 0) {
                            alert("Arrival time cannot be negative and must be a number.");
                            return;
                          } 
                
                const serviceCenter = document.getElementById("service_center").value;

                console.log("Number of clients:", numberClients.value);
                console.log("Arrival time:", arrivalTime.value);
                console.log("Service center:", serviceCenter);

                /*if (isNaN(numberClients) || isNaN(arrivalTime)) {
                    alert("Fill the fields with valid values");
                    return;
                }*/
                const value_numberClients = numberClients.value;
                const value_arrivalTime = arrivalTime.value;
                const novoItem = { value_numberClients, value_arrivalTime, serviceCenter };
                jsonManager.getGraph().arrivals.push(novoItem);
                console.log("push");
                jsonManager.getGraph().arrivalIndex = jsonManager.getGraph().arrivals.length - 1;
                console.log("Item adicionado:", novoItem);
                console.log("Lista atual:", jsonManager.getGraph().arrivals);

                number_clients.style.opacity = '0.5';
                number_clients.style.pointerEvents = 'none';

                arrival_time.style.opacity = '0.5';
                arrival_time.style.pointerEvents = 'none';

                service_center.style.opacity = '0.5';
                service_center.style.pointerEvents = 'none';
            });    
            $(document).off("click", "#next-bt");
            $(document).on("click", "#next-bt", function() {
                if (jsonManager.getGraph().arrivalIndex < jsonManager.getGraph().arrivals.length - 1) {
                    jsonManager.getGraph().arrivalIndex++;
                    exibirAtual();
                } else {
                    console.log("Último item já exibido.");
                } 
            });
            $(document).off("click", "#prev-bt");
            $(document).on("click", "#prev-bt", function() {
                if (jsonManager.getGraph().arrivalIndex > 0) {
                    jsonManager.getGraph().arrivalIndex--;
                    exibirAtual();
                } else {
                    console.log("Primeiro item já exibido.");
                }
            });
            $(document).off("click", "#del-bt");
            $(document).on("click", "#del-bt", function() {
                if (jsonManager.getGraph().arrivals.length === 0) {
                    console.log("Lista vazia. Nada para remover.");
                    return;
                }

                console.log(`Removendo item ${jsonManager.getGraph().arrivalIndex + 1}`);
                jsonManager.getGraph().arrivals.splice(jsonManager.getGraph().arrivalIndex, 1);

                // Ajustar índice após remoção
                if (jsonManager.getGraph().arrivalIndex >= jsonManager.getGraph().arrivals.length) {
                    jsonManager.getGraph().arrivalIndex = jsonManager.getGraph().arrivals.length - 1;
                }

                if (jsonManager.getGraph().arrivals.length > 0) {
                    exibirAtual();
                } else {
                    console.log("Lista vazia após remoção.");
                    document.getElementById("number_clients").value = "";
                    document.getElementById("arrival_time").value = "";
                    document.getElementById("service_center").selectedIndex = -1; // nenhuma opção selecionada
                    const $sel = $("#service_center");
                    if ($sel.find("option[value='']").length === 0) {
                      $sel.prepend($("<option>", { value: "", text: "" }));
                    }
                    $sel.val("");
                    try {
                      $sel.selectmenu("refresh");
                    } catch (e) {
                      $sel.trigger("change");
                    }
                } 
            });

            function preencherSelect(select) {

                /*Object.values(jsonManager.getGraph()..mapNodes).forEach(no => {
                    if (no.type === "source") {
                        Object.keys(no.mapTargets).forEach(target => {
                            const jaExiste = opcoes.some(opcao => opcao.value === String(target));
                            if (!jaExiste) {
                                window.opcoes.push({ value: String(target), text: String(target) });
                            }
                        });
                    }
                });*/

                select.innerHTML = "";
                console.log("graph e graph.opcoes:");
                console.log(jsonManager.getGraph());
                console.log(jsonManager.getGraph().opcoes);
                jsonManager.getGraph().opcoes.forEach(opcao => {
                    const option = document.createElement("option");
                    option.value = opcao.value;
                    option.textContent = opcao.text;
                    select.appendChild(option);
                });
            }
            function exibirAtual() {
                if (jsonManager.getGraph().arrivals.length === 0) {
                    console.log("Lista vazia.");
                    const $sel = $("#service_center");
                    if ($sel.find("option[value='']").length === 0) {
                      $sel.prepend($("<option>", { value: "", text: "" }));
                    }
                    $sel.val("");
                    try {
                      $sel.selectmenu("refresh");
                    } catch (e) {
                      $sel.trigger("change");
                    }
                    return;
                }
                if (jsonManager.getGraph().arrivalIndex >= 0 && jsonManager.getGraph().arrivalIndex < jsonManager.getGraph().arrivals.length) {
                    const item = jsonManager.getGraph().arrivals[jsonManager.getGraph().arrivalIndex];
                    console.log(`Exibindo item ${jsonManager.getGraph().arrivalIndex + 1} de ${jsonManager.getGraph().arrivals.length}`);
                    console.log(`numberClients: ${item.numberClients}, arrivalTime: ${item.arrivalTime}, serviceCenter: ${item.serviceCenter}`);
                    document.getElementById("number_clients").value = item.value_numberClients;
                    document.getElementById("arrival_time").value = item.value_arrivalTime;
                    // jQuery
                    document.getElementById("service_center").value = item.serviceCenter;
                    $("#service_center").val(item.serviceCenter).trigger("change");
                    console.log("item.serviceCenter");
                    console.log(item.serviceCenter);
                    console.log("opcoes");
                    console.log(jsonManager.getGraph().opcoes);
                } else {
                    console.log("Nenhum item para exibir.");
                }
            }
        },

        getLastAction: function() {
            return lastAction;
        }
    };

    return arrival;
});

