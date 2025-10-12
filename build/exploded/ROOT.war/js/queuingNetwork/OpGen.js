/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */
//const fs = require('fs');
let modelType = "True";
let warmupTime = "False";
define(["jquery", "JsonManager", "LightBoxManager", "Cons"],
    function($, jsonManager, lightBoxManager, cons) {
        "use strict";

        var lastAction = null;

        var OpGen = {
            execute: function() {
                
                
                //baixar o .gv
                lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=showText",
                function() {
                    // Callback: textarea carregado
                    console.log("passando pelo execute do opgen");
                const opParam = document.getElementById("opParam_library");
                const selectedValue = opParam?.value;
                console.log(selectedValue);
                if (selectedValue === 'R' || selectedValue === 'Java' || selectedValue === 'Python')
                {
                    const mapNodes = jsonManager.getGraph().mapNodes;
                    for (let key in mapNodes) 
                    {
                        if (jsonManager.getGraph().mapNodes[key]?.properties?.multiServer_nbrServers !== undefined) 
                        {
                            alert("Remove multiservers or use C language");
                            return;
                        }         
                    }  
                }
                var count = 0;
                var parameters = jsonManager.getGraphParameters();
                var numCycles = parameters["opParam_numCycles"] || 0;
                var batchSize = parameters["opParam_batchSize"] || 0;
                let content;
                var definedValue = parameters["opParam_definedValue"] || 0;
                var seed = parameters["opParam_seed"] || 0;
                const execTimeOp = document.getElementById("opParam_execTimeOp");
                const maxEntitiesOp = document.getElementById("opParam_maxEntitiesOp");
                var execTime = 0;
                if(document.getElementById("opParam_execTime")) execTime = document.getElementById("opParam_execTime").value.trim();
                var maxEntities = 0;
                if(document.getElementById("opParam_maxEntities")) maxEntities = document.getElementById("opParam_maxEntities").value.trim();

                // nenhum radio selecionado
                if (!execTimeOp.checked && !maxEntitiesOp.checked) {
                    alert("Select a model type.");
                    return; // encerra fluxo
                }

                const invalidNodeExists = Object.entries(jsonManager.getGraph().mapNodes).some(([nodeId, node]) => {
                    if (node.type === "server" || node.type === "multiServer") {
                        const soma = Object.values(node.mapTargets)
                            .reduce((a, v) => a + v, 0);

                        if (Object.values(node.mapTargets).length > 1) {
                            const ok = soma >= 99.5 && soma <= 100.5;
                            if (!ok) {
                                alert("The sum of the probabilities for each node must be 100."); 
                                return true; // parar iteração
                            }
                        }
                    }
                    return false;
                });

                if (invalidNodeExists) return; // interrompe execute()


                if (execTimeOp.checked) {
                    if (execTime === "" || Number(execTime) === 0) {
                        alert("Execution time must be different from zero");
                        return;
                    }
                    content = `digraph ${jsonManager.getGraph().name} {\n    comment=" ${execTime} ${numCycles} ${batchSize} 0 aberto ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;
                }

                if (maxEntitiesOp.checked) {
                    if (maxEntities === "" || Number(maxEntities) === 0) {
                        alert("Max number of entities must be different from zero.");
                        return;
                    }
                    content = `digraph ${jsonManager.getGraph().name} {\n    comment=" 0 ${numCycles} ${batchSize} ${maxEntities} fechado ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;
                }               

                Object.values(jsonManager.getGraph().mapNodes).forEach(node => {

                    switch (node.type) {
                        case "source":
                            content += `    ${node.id} [label=Source comment=1]\n`;
                            break;
                        case "server":
                            content += `    ${node.id} [label=CPU${count} comment=" 2`;
                            count+=1;
                            switch (node.properties.arrival_distribution)
                            {
                                case "Normal":
                                    content += ` 0`;
                                    break;
                                case "Exponential":
                                    content += ` 1`;
                                    break;
                                case "Uniform":
                                    content += ` 2`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }
                            switch (node.properties.server_distribution)
                            {
                                case "Normal":
                                    content += ` 0`;
                                    break;
                                case "Exponential":
                                    content += ` 1`;
                                    break;
                                case "Uniform":
                                    content += ` 2`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }

                            if(node.properties.server_emptyQueue === 'on')
                            {content += ` ${node.properties.arrival_average} ${node.properties.server_average} 1 true `;}
                            else
                            {content += ` ${node.properties.arrival_average} ${node.properties.server_average} 1 false `;}
                            if(node.properties.server_length === 'on')
                            {content += `true `;}               
                            else
                            {content += `false `;}
                            if(node.properties.arrival_sequence)content +=`${node.properties.arrival_sequence} `;
                            else content +=`0 `;
                            if(node.properties.server_sequence) content +=`${node.properties.server_sequence} `;
                            else content +=`0 `;
                            if(node.properties.arrival_stdDeviation) content +=`${node.properties.arrival_stdDeviation} `;
                            else content +=`0 `;
                            if(node.properties.server_stdDeviation) content +=`${node.properties.server_stdDeviation} `;
                            else content +=`0 `;
                            content +=`"]\n`;
                            break;
                        case "out":
                            content += `    ${node.id} [label=Destination comment=3]\n`;
                            break;
                        case "multiServer":
                            content += `    ${node.id} [label=CPU comment=" 2`;
                            switch (node.properties.ms_arrival_distribution)
                            {
                                case "Normal":
                                    content += ` 0`;
                                    break;
                                case "Exponential":
                                    content += ` 1`;
                                    break;
                                case "Uniform":
                                    content += ` 2`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }
                            switch (node.properties.multiServer_distribution)
                            {
                                case "Normal":
                                    content += ` 0`;
                                    break;
                                case "Exponential":
                                    content += ` 1`;
                                    break;
                                case "Uniform":
                                    content += ` 2`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }


                            if(node.properties.multiServer_nbrServers)
                            {
                                if(node.properties.multiServer_emptyQueue === 'on')
                                {
                                    content += ` ${node.properties.ms_arrival_average} ${node.properties.multiServer_average} ${node.properties.multiServer_nbrServers} true `;
                                }
                                else
                                {
                                    content += ` ${node.properties.ms_arrival_average} ${node.properties.multiServer_average} ${node.properties.multiServer_nbrServers} false `;
                                }

                            } 
                            else
                            {
                                if(node.properties.multiServer_emptyQueue === 'on')
                                {
                                    content += ` ${node.properties.ms_arrival_average} ${node.properties.multiServer_average} 1 true `;
                                }
                                else
                                {
                                    content += ` ${node.properties.ms_arrival_average} ${node.properties.multiServer_average} 1 false `;
                                }
                            }
                            if(node.properties.multiServer_length === 'on')
                            {content += `true `;}
                            else
                            {content += `false `;}    
                            if(node.properties.ms_arrival_sequence) content += `${node.properties.ms_arrival_sequence} `;
                            else content +=`0 `;
                            if(node.properties.multiServer_sequence) content += `${node.properties.multiServer_sequence} `;
                            else content +=`0 `;
                            if(node.properties.multiServer_stdDeviation) content += `${node.properties.multiServer_stdDeviation} `;
                            else content +=`0 `;
                            if(node.properties.ms_arrival_stdDeviation) content += `${node.properties.ms_arrival_stdDeviation} `;
                            else content +=`0 `;
                            content +=`"]\n`;
                            break;
                        default:
                            content += `" 2 1 1 1 0.1 "]\n`;
                    }
                });

                Object.values(jsonManager.getGraph().mapNodes).forEach(node => {
                    Object.keys(node.mapTargets).forEach(targetId => {
                        var prob;
                        //Object.values(jsonManager.getGraph().mapNodes).forEach(probnode=>{
                        //    if(probnode.id === targetId){
                                //if(probnode.properties.probability) prob = probnode.properties.probability;
                                //if(probnode.properties.ms_probability) prob = probnode.properties.ms_probability;
                        //    }
                        //});
                        prob = node.mapTargets[targetId];
                        if(prob)content += `    ${node.id} -> ${targetId} [comment=${prob}]\n`;
                        else content += `    ${node.id} -> ${targetId} [comment=1]\n`;
                    });
                });
                if(selectedValue === 'C SMPL' || selectedValue === 'C SMPLX' || selectedValue === 'C ParSMPL'|| selectedValue === 'C SIMPACK' || selectedValue === 'C SIMPACK2')
                {
                    const arrivals = jsonManager.getGraph().arrivals;
                    if (arrivals === 0) 
                        {
                            alert("Add at least one arrival");
                            return;
                        } 
                    var length = 0;
                     arrivals.forEach((obj, index) => {
                         length+=1;
                    });

                    content += `Arrivals ${length} `;
                    arrivals.forEach((obj, index) => {
                        console.log(`Objeto ${index}:`);
                        console.log("numberClients:", obj.numberClients);
                        console.log("arrivalTime:", obj.arrivalTime);
                        console.log("serviceCenter:", obj.serviceCenter);
                        content += `${obj.numberClients} ${obj.arrivalTime} ${obj.serviceCenter} `;
                    });
                }

                content += "\n}\n";
                    const blob = new Blob([content], { type: "text/plain" }); // Criar um arquivo de texto
                    window.graphBlob = blob;
                    blob.text().then(texto => {
                        
                        /*const textarea = document.getElementById("textShow");
                        console.log("Tentando pegar textShow:", document.getElementById("textShow"));
console.log("HTML do body:", document.body.innerHTML.includes("textShow"));
setTimeout(() => {
  console.log("Agora existe?", document.getElementById("textShow"));
}, 1000);
                        if (textarea) {
                            textarea.value = texto;
                            window.dispatchEvent(new Event("genClicou"));
                        } else {
                            console.error("Textarea ainda não foi carregado.");
                        }*/
                        console.log(texto);
                        
                        /*document.addEventListener("DOMContentLoaded", function() {
  waitForElement("textShow", function(el) {
    console.log("Elemento encontrado:", el);
    el.value = texto;
    window.dispatchEvent(new Event("genClicou"));
  });
});*/
                                                                                                            onDOMReady(() => {
  waitForElement("textShow", function(el) {
    console.log("Elemento encontrado:", el);
    el.value = texto;
    window.dispatchEvent(new Event("genClicou"));
  });
});

console.log("dps do domcontentloaded");
                        
                    });
                });
            },
            getLastAction: function() {
                return lastAction;
            }
        };
    return OpGen;
    }
);
  
 function checkModelType() { 
    const defined = document.getElementById("opParam_timeDefined");
    const automatic = document.getElementById("opParam_timeAutomatic");
    if (defined.checked) {
      warmupTime = "True";
    } else if (automatic.checked) {
      warmupTime = "False";
    }
}

function waitForElement(id, callback) {
  console.log("entrou no waitforelement");
  const el = document.getElementById(id);
  if (el) return callback(el);

  // Se o body ainda não existe, espera
  if (!document.body) {
    console.warn("Body ainda não existe, tentando novamente...");
    setTimeout(() => waitForElement(id, callback), 50);
    return;
  }

  const observer = new MutationObserver(() => {
    console.log("checando mutações no DOM...");
    const el = document.getElementById(id);
    if (el) {
      console.log("Elemento encontrado dentro do observer!");
      observer.disconnect();
      callback(el);
    }
  });

  // 🔥 Observa o body inteiro, porque o modal é injetado dinamicamente
  observer.observe(document.body, { childList: true, subtree: true });
}
function onDOMReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}