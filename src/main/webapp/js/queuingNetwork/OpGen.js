/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */
//const fs = require('fs');
let modelType = "True";
let warmupTime = "False";
define(["jquery", "JsonManager","Arrival"],
    function($, jsonManager,arrival) {
        "use strict";

        var lastAction = null;

        var OpGen = {
            execute: function() {
                //gerar o .gv
                //se a linguagem for R, Java ou Python, e tiver multiservers, tem que emitir um aviso
                
                //if opParam_lbrary = r || java || python
                console.log("passando pelo execute do opgen");
                const opParam = document.getElementById("opParam_library");
                const selectedValue = opParam?.value;
                if (selectedValue == 'R' || selectedValue == 'Java' || selectedValue == 'Python')
                {
                    const mapNodes = jsonManager.getGraph().mapNodes;
                    for (let key in mapNodes) 
                    {
                        if (jsonManager.getGraph().mapNodes[key]?.properties?.multiServer_nbrServers !== undefined) 
                        {
                            alert("Remova os multiservers ou use linguagem C");
                            return;
                        }         
                    }  
                }
                //for jsonManager.getGraph().mapNodes.length if node.properties.multiServer_nbrServers exists
                //alert
                
                var parameters = jsonManager.getGraphParameters();
                var execTime = parameters["opParam_execTime"] || 0;
                var numCycles = parameters["opParam_numCycles"] || 0;
                var batchSize = parameters["opParam_batchSize"] || 0;
                var maxEntities = parameters["opParam_maxEntities"] || 0;
                //let modelType = document.getElementById("opParam_open").checked ;
                //let warmupTime = document.getElementById("opParam_timeDefined").checked;

                var selectedModelType = document.querySelector('input[name="modelType"]:checked');
                let content;
                

                var definedValue = parameters["opParam_definedValue"] || 0;
                var seed = parameters["opParam_seed"] || 0;
                if (selectedModelType) {
                    console.log("Valor selecionado:", selectedModelType.value);
                    content = `digraph ${jsonManager.getGraph().name} {\n    comment=" ${execTime} ${numCycles} ${batchSize} ${maxEntities} ${selectedModelType.value} ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;
                } else {
                    console.log("Nenhuma opção selecionada");
                    content = `digraph ${jsonManager.getGraph().name} {\n    comment=" ${execTime} ${numCycles} ${batchSize} ${maxEntities} aberto ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;
                }
                
   
                    Object.values(jsonManager.getGraph().mapNodes).forEach(node => {
                        
                        content += `    ${node.id} [label=${node.type} comment=`;
                        switch (node.type) {
                            case "source":
                                content += `1]\n`;
                                break;
                            case "server":
                                content += `" 2`;
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
                                
                                if(node.properties.server_emptyQueue == 'on')
                                {content += ` ${node.properties.arrival_average} ${node.properties.server_average} 1 true `;}
                                else
                                {content += ` ${node.properties.arrival_average} ${node.properties.server_average} 1 false `;}
                                if(node.properties.server_length == 'on')
                                {content += `true `;}               
                                else
                                {content += `false `;}
                                if(node.properties.arrival_sequence)content +=`${node.properties.arrival_sequence} `;
                                else content +=`0 `;
                                if(node.properties.server_sequence) content +=`${node.properties.server_sequence} `;
                                else content +=`0 `;
                                if(node.properties.server_stdDeviation) content +=`${node.properties.server_stdDeviation} `;
                                else content +=`0 `;
                                if(node.properties.arrival_stdDeviation) content +=`${node.properties.arrival_stdDeviation} `;
                                else content +=`0 `;
                                content +=`"]\n`;
                                break;
                            case "out":
                                content += `3]\n`;
                                break;
                            case "multiServer":
                                
                                content += `" 2`;
                                switch (node.properties.multiServer_arrival_distribution)
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
                                
                                
                                if(node.properties.multiServer_nbrServers)
                                {
                                    if(node.properties.multiServer_emptyQueue=='on')
                                    {
                                        content += ` ${node.properties.arrival_average} ${node.properties.multiServer_average} ${node.properties.multiServer_nbrServers} true `;
                                    }
                                    else
                                    {
                                        content += ` ${node.properties.arrival_average} ${node.properties.multiServer_average} ${node.properties.multiServer_nbrServers} false `;
                                    }
                                    
                                } 
                                else
                                {
                                    if(node.properties.multiServer_emptyQueue=='on')
                                    {
                                        content += ` ${node.properties.arrival_average} ${node.properties.multiServer_average} 1 true `;
                                    }
                                    else
                                    {
                                        content += ` ${node.properties.arrival_average} ${node.properties.multiServer_average} 1 false `;
                                    }
                                }
                                if(node.properties.multiServer_length == 'on')
                                {content += `true `;}
                                else
                                {content += `false `;}    
                                if(node.properties.arrival_sequence) content += `${node.properties.arrival_sequence} `;
                                else content +=`0 `;
                                if(node.properties.multiServer_sequence) content += `${node.properties.multiServer_sequence} `;
                                else content +=`0 `;
                                if(node.properties.multiServer_stdDeviation) content += `${node.properties.multiServer_stdDeviation} `;
                                else content +=`0 `;
                                if(node.properties.arrival_stdDeviation) content += `${node.properties.arrival_stdDeviation} `;
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
                            Object.values(jsonManager.getGraph().mapNodes).forEach(probnode=>{
                                if(probnode.id==targetId){prob = probnode.properties.probability;}});
                            if(prob)content += `    ${node.id} -> ${targetId} [comment=${prob}]\n`;
                            else content += `    ${node.id} -> ${targetId} [comment=1]\n`;
                        });
                    });
                    if(selectedValue == 'C SMPL' || selectedValue == 'C SMPLX' || selectedValue == 'C ParSMPL'|| selectedValue == 'C SIMPACK' || selectedValue == 'C SIMPACK2')
                    {
                        
                    const arrivals = window.arrivals;
                    if (arrivals == 0) 
                        {
                            alert("Necessario adicionar pelo menos uma chegada");
                            return;
                        } 
                    content += `${arrivals.length} `;
                    arrivals.forEach((obj, index) => {
                        console.log(`Objeto ${index}:`);
                        console.log("numberClients:", obj.numberClients);
                        console.log("arrivalTime:", obj.arrivalTime);
                        console.log("serviceCenter:", obj.serviceCenter);
                        content += `${obj.numberClients} ${obj.arrivalTime} ${obj.serviceCenter} `;
                    });}

                    content += "\n}\n";
                    //baixar o .gv
                    const blob = new Blob([content], { type: "text/plain" }); // Criar um arquivo de texto
                    window.graphBlob = blob;
                    const url = URL.createObjectURL(blob); // Criar URL do Blob

                    const a = document.createElement("a"); // Criar link
                    a.href = url;
                    a.download = "graph.gv"; // Nome do arquivo
                    document.body.appendChild(a);
                    a.click(); // Simular clique
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url); // Liberar memória
                    window.dispatchEvent(new Event("genClicou"));
            },
            getLastAction: function() {
                return lastAction;
            }
        };
    return OpGen;
    }
);
  
 function checkModelType() { 

                
                    /*const closed = document.getElementById("opParam_closed");
                    const open = document.getElementById("opParam_open");
                    if (closed.checked) {
                      modelType = "False";
                    } else if (open.checked) {
                      modelType = "True";
                    } */
                
                    const defined = document.getElementById("opParam_timeDefined");
                    const automatic = document.getElementById("opParam_timeAutomatic");
                    if (defined.checked) {
                      warmupTime = "True";
                    } else if (automatic.checked) {
                      warmupTime = "False";
                    }
                }