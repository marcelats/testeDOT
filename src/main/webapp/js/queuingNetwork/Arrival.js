/*
 * 
 * author: Marcela Tiemi Shinzato
 */
define(["jquery", "JsonManager"],
function($, jsonManager) {
    "use strict";

    var lastAction = null;
    
    var arrival = {
        initialize: function () {  
            if (!window.observer) {
                window.observer = new MutationObserver((obs) => {
                    const select = document.getElementById("service-center");
                    if (select) {
                        fillSelect();
                        obs.disconnect();
                        window.isObserving = false;
                    }
                });

              window.isObserving = false;
            }
        },
        execute: function () {
            fillSelect();  
            showCurrent();
            const number_clients = document.getElementById("number-clients");
            number_clients.style.opacity = '0.5';
            number_clients.style.pointerEvents = 'none';
            const arrival_time = document.getElementById("arrival-time");
            arrival_time.style.opacity = '0.5';
            arrival_time.style.pointerEvents = 'none';
            const service_center = document.getElementById("service-center");
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
                const select = document.getElementById("service-center");
                if (select) {
                    fillSelect(); 
                    window.observer.disconnect();
                    window.isObserving = false;
                }
                if (!window.isObserving) {
                    window.observer.disconnect(); 
                    window.isObserving = false;
                } else {
                    window.observer.disconnect();
                    window.isObserving = false;
                }  
            });
            $(document).off("click", "#save-bt");
            $(document).on("click", "#save-bt", function() {
                const numberClients = document.getElementById("number-clients");
                let valueNumberClients = parseInt(numberClients.value, 10);
                numberClients.value = valueNumberClients;
                if (isNaN(valueNumberClients) || valueNumberClients < 0) {
                    alert("Number of clients cannot be negative and must be an integer.");
                    return;
                }
                const arrivalTime = document.getElementById("arrival-time");
                if(arrivalTime)  if (isNaN(arrivalTime.value) || arrivalTime.value < 0) {
                    alert("Arrival time cannot be negative and must be a number.");
                    return;
                } 
                
                const serviceCenter = document.getElementById("service-center");
                const serviceCenterValue = serviceCenter.value;
                const parsedNumberClients = numberClients.value;
                const valueArrivalTime = arrivalTime.value;
                const newItem = { parsedNumberClients, valueArrivalTime, serviceCenterValue };
                jsonManager.getGraph().arrivals.push(newItem);
                jsonManager.getGraph().arrivalIndex = jsonManager.getGraph().arrivals.length - 1;
                numberClients.style.opacity = '0.5';
                numberClients.style.pointerEvents = 'none';
                arrivalTime.style.opacity = '0.5';
                arrivalTime.style.pointerEvents = 'none';
                serviceCenter.style.opacity = '0.5';
                serviceCenter.style.pointerEvents = 'none';
            });    
            $(document).off("click", "#next-bt");
            $(document).on("click", "#next-bt", function() {
                if (jsonManager.getGraph().arrivalIndex < jsonManager.getGraph().arrivals.length - 1) {
                    jsonManager.getGraph().arrivalIndex++;
                    showCurrent();
                }
            });
            $(document).off("click", "#prev-bt");
            $(document).on("click", "#prev-bt", function() {
                if (jsonManager.getGraph().arrivalIndex > 0) {
                    jsonManager.getGraph().arrivalIndex--;
                    showCurrent();
                }
            });
            $(document).off("click", "#del-bt");
            $(document).on("click", "#del-bt", function() {
                if (jsonManager.getGraph().arrivals.length === 0) {
                    return;
                }

                jsonManager.getGraph().arrivals.splice(jsonManager.getGraph().arrivalIndex, 1);

                if (jsonManager.getGraph().arrivalIndex >= jsonManager.getGraph().arrivals.length) {
                    jsonManager.getGraph().arrivalIndex = jsonManager.getGraph().arrivals.length - 1;
                }

                if (jsonManager.getGraph().arrivals.length > 0) {
                    showCurrent();
                } else {
                    document.getElementById("number-clients").value = "";
                    document.getElementById("arrival-time").value = "";
                    document.getElementById("service-center").selectedIndex = -1; 
                    const $sel = $("#service-center");
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

            function fillSelect() {
                const select = document.getElementById("service-center");
                select.innerHTML = "";
                jsonManager.getGraph().firstArrivalSCs.forEach(firstArrivalSC => {
                    const option = document.createElement("option");
                    option.value = firstArrivalSC;
                    option.text = firstArrivalSC;
                    select.appendChild(option);
                });
                const $sel = $("#service-center");   
                try {
                    $sel.selectmenu("refresh");
                } catch (e) {
                    $sel.trigger("change");
                }
            }
            function showCurrent() {
                if (jsonManager.getGraph().arrivals.length === 0) {
                    const $sel = $("#service-center");
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
                    document.getElementById("number-clients").value = item.parsedNumberClients;
                    document.getElementById("arrival-time").value = item.valueArrivalTime;
                    document.getElementById("service-center").value = item.serviceCenter;
                    $("#service-center").val(item.serviceCenter).trigger("change");
                }
            }
        },

        getLastAction: function() {
            return lastAction;
        }
    };

    return arrival;
});

