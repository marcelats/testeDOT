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
            console.log("execute do arrival");
            console.log("window.arrivals");
            console.log(window.arrivals);
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
                const numberClients = document.getElementById("number_clients").value;
                const arrivalTime = document.getElementById("arrival_time").value;
                const serviceCenter = document.getElementById("service_center").value;

                console.log("Number of clients:", numberClients);
                console.log("Arrival time:", arrivalTime);
                console.log("Service center:", serviceCenter);

                if (isNaN(numberClients) || isNaN(arrivalTime)) {
                    alert("Fill the fields with valid values");
                    return;
                }
                const novoItem = { numberClients, arrivalTime, serviceCenter };
                window.arrivals.push(novoItem);
                console.log("push");
                window.arrivalIndex = window.arrivals.length - 1;
                console.log("Item adicionado:", novoItem);
                console.log("Lista atual:", window.arrivals);

                number_clients.style.opacity = '0.5';
                number_clients.style.pointerEvents = 'none';

                arrival_time.style.opacity = '0.5';
                arrival_time.style.pointerEvents = 'none';

                service_center.style.opacity = '0.5';
                service_center.style.pointerEvents = 'none';
            });    
            $(document).off("click", "#next-bt");
            $(document).on("click", "#next-bt", function() {
                if (window.arrivalIndex < window.arrivals.length - 1) {
                    window.arrivalIndex++;
                    exibirAtual();
                } else {
                    console.log("Último item já exibido.");
                } 
            });
            $(document).off("click", "#prev-bt");
            $(document).on("click", "#prev-bt", function() {
                if (window.arrivalIndex > 0) {
                    window.arrivalIndex--;
                    exibirAtual();
                } else {
                    console.log("Primeiro item já exibido.");
                }
            });
            $(document).off("click", "#del-bt");
            $(document).on("click", "#del-bt", function() {
                if (window.arrivals.length === 0) {
                    console.log("Lista vazia. Nada para remover.");
                    return;
                }

                console.log(`Removendo item ${window.arrivalIndex + 1}`);
                window.arrivals.splice(window.arrivalIndex, 1);

                // Ajustar índice após remoção
                if (window.arrivalIndex >= window.arrivals.length) {
                    window.arrivalIndex = window.arrivals.length - 1;
                }

                if (window.arrivals.length > 0) {
                    exibirAtual();
                } else {
                    console.log("Lista vazia após remoção.");
                    document.getElementById("number_clients").value = null;
                    document.getElementById("arrival_time").value = null;
                    document.getElementById("service_center").value = null;
                } 
            });

            function preencherSelect(select) {

                /*Object.values(jsonManager.getGraph().mapNodes).forEach(no => {
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
                opcoes.forEach(opcao => {
                    const option = document.createElement("option");
                    option.value = opcao.value;
                    option.textContent = opcao.text;
                    select.appendChild(option);
                });
            }
            function exibirAtual() {
                if (window.arrivals.length === 0) {
                    console.log("Lista vazia.");
                    return;
                }
                if (window.arrivalIndex >= 0 && window.arrivalIndex < window.arrivals.length) {
                    const item = window.arrivals[window.arrivalIndex];
                    console.log(`Exibindo item ${window.arrivalIndex + 1} de ${window.arrivals.length}`);
                    console.log(`numberClients: ${item.numberClients}, arrivalTime: ${item.arrivalTime}, serviceCenter: ${item.serviceCenter}`);
                    document.getElementById("number_clients").value = item.numberClients;
                    document.getElementById("arrival_time").value = item.arrivalTime;
                    document.getElementById("service_center").value = item.serviceCenter;
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

