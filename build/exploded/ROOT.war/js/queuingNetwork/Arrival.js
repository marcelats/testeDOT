/* global arrivals */

define(["jquery","LightBoxManager","Cons","JsonManager"],
function($, lightBoxManager, cons, jsonManager) {
    "use strict";

    var lastAction = null;
    window.arrivals = [];
    var arrival = {
        initialize: function() {
            
        },
        getArrivals: function(){
      return arrivals;
        },
        
execute: function () {
    window.arrivals = [];
let indiceAtual = 0;
    const number_clients = document.getElementById("number_clients");
            number_clients.style.opacity = '0.5';
            number_clients.style.pointerEvents = 'none';
            const arrival_time = document.getElementById("arrival_time");
            arrival_time.style.opacity = '0.5';
            arrival_time.style.pointerEvents = 'none';
            const service_center = document.getElementById("service_center");
            service_center.style.opacity = '0.5';
            service_center.style.pointerEvents = 'none';
            $(document).on("click", "#new-bt", function() {
                    number_clients.style.opacity = '1';
            number_clients.style.pointerEvents = 'auto';
            
            arrival_time.style.opacity = '1';
            arrival_time.style.pointerEvents = 'auto';
            
            service_center.style.opacity = '1';
            service_center.style.pointerEvents = 'auto';
            const select = document.getElementById("service_center");
  if (select) {
    preencherSelect(select);
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      const select = document.getElementById("service_center");
      if (select) {
        preencherSelect(select);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
            
            
                });
            $(document).on("click", "#save-bt", function() {
                const numberClients = document.getElementById("number_clients").value;
            const arrivalTime = document.getElementById("arrival_time").value;
            const serviceCenter = document.getElementById("service_center").value;
            
            console.log("Number of clients:", numberClients);
            console.log("Arrival time:", arrivalTime);
            console.log("Service center:", serviceCenter);
            
            if (isNaN(numberClients) || isNaN(arrivalTime)) {
        alert("Por favor, preencha todos os campos com números válidos.");
        return;
    }
    const novoItem = { numberClients, arrivalTime, serviceCenter };
    window.arrivals.push(novoItem);
indiceAtual = window.arrivals.length - 1;
    console.log("Item adicionado:", novoItem);
    console.log("Lista atual:", window.arrivals);
            
                    number_clients.style.opacity = '0.5';
            number_clients.style.pointerEvents = 'none';
            
            arrival_time.style.opacity = '0.5';
            arrival_time.style.pointerEvents = 'none';
            
            service_center.style.opacity = '0.5';
            service_center.style.pointerEvents = 'none';
            
                });    
                
        $(document).on("click", "#next-bt", function() {
           if (indiceAtual < window.arrivals.length - 1) {
        indiceAtual++;
        exibirAtual();
    } else {
        console.log("Último item já exibido.");
    } 
        });
        $(document).on("click", "#prev-bt", function() {
            if (indiceAtual > 0) {
        indiceAtual--;
        exibirAtual();
    } else {
        console.log("Primeiro item já exibido.");
    }
        });
        $(document).on("click", "#del-bt", function() {
           if (window.arrivals.length === 0) {
        console.log("Lista vazia. Nada para remover.");
        return;
    }

    console.log(`Removendo item ${indiceAtual + 1}`);
    window.arrivals.splice(indiceAtual, 1);

    // Ajustar índice após remoção
    if (indiceAtual >= window.arrivals.length) {
        indiceAtual = window.arrivals.length - 1;
    }

    if (window.arrivals.length > 0) {
        exibirAtual();
    } else {
        console.log("Lista vazia após remoção.");
    } 
        });
  

  function preencherSelect(select) {
    const opcoes = [];
    Object.values(jsonManager.getGraph().mapNodes).forEach(no => {
      if (no.type === "source") {
        Object.keys(no.mapTargets).forEach(target => {
          const jaExiste = opcoes.some(opcao => opcao.value === String(target));
          if (!jaExiste) {
            opcoes.push({ value: String(target), text: String(target) });
          }
        });
      }
      /*if (no.type === "server" || no.type === "multiServer") {
        Object.keys(no.mapTargets).forEach(target => {
            var targetNode;
            Object.values(jsonManager.getGraph().mapNodes).forEach(no => {
                if(no.id === target)
                {
                    if(targetNode.type === "source")
            {
                const jaExiste = opcoes.some(opcao => opcao.value === String(target));
          if (!jaExiste) {
            opcoes.push({ value: String(target), text: String(target) });
          }
            }
                }
            });
        });
      }*/
    });

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
    if (indiceAtual >= 0 && indiceAtual < window.arrivals.length) {
        const item = window.arrivals[indiceAtual];
        console.log(`Exibindo item ${indiceAtual + 1} de ${window.arrivals.length}`);
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

