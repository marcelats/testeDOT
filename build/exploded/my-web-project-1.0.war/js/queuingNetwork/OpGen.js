/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */
//const fs = require('fs');
let modelType = "True";
let warmupTime = "False";
define(["jquery", "JsonManager"],
    function($, jsonManager) {
        "use strict";

        var lastAction = null;

        var OpGen = {
            execute: function() {
                //gerar o .gv
                var parameters = jsonManager.getGraphParameters();
                var execTime = parameters["opParam_execTime"] || 0;
                var numCycles = parameters["opParam_numCycles"] || 0;
                var batchSize = parameters["opParam_batchSize"] || 0;
                var maxEntities = parameters["opParam_maxEntities"] || 0;
                //let modelType = document.getElementById("opParam_open").checked ;
                //let warmupTime = document.getElementById("opParam_timeDefined").checked;
             
                var definedValue = parameters["opParam_definedValue"] || 0;
                var seed = parameters["opParam_seed"] || 0;
                let content = `digraph ${jsonManager.getGraph().name} {\n    comment=" ${execTime} ${numCycles} ${batchSize} ${maxEntities} ${modelType} ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;
                
                    Object.values(jsonManager.getGraph().mapNodes).forEach(node => {
                        content += `    ${node.id} [label=${node.type} comment=`;
                        switch (node.type) {
                            case "source":
                                content += `1]\n`;
                                break;
                            case "server":
                                content += `" 2 None `;
                                switch (node.properties.server_distribution)
                                {
                                    case "Normal":
                                        content += `0`;
                                        break;
                                    case "Exponential":
                                        content += `1`;
                                        break;
                                    case "Uniform":
                                        content += `2`;
                                        break;
                                    default:
                                        content += `0`;    
                                }
                                content += ` None ${node.properties.server_average} "]\n`;
                                break;
                            case "out":
                                content += `3]\n`;
                                break;
                            default:
                                content += `" 2 1 1 1 0.1 "]\n`;
                        }
                    });
                
                    Object.values(jsonManager.getGraph().mapNodes).forEach(node => {
                        Object.keys(node.mapTargets).forEach(targetId => {
                            content += `    ${node.id} -> ${targetId}\n`;
                        });
                    });
                
                    content += "}\n";
                    //baixar o .gv
                    const blob = new Blob([content], { type: "text/plain" }); // Criar um arquivo de texto
                    const url = URL.createObjectURL(blob); // Criar URL do Blob

                    const a = document.createElement("a"); // Criar link
                    a.href = url;
                    a.download = "graph.gv"; // Nome do arquivo
                    document.body.appendChild(a);
                    a.click(); // Simular clique
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url); // Liberar memória
            },
            getLastAction: function() {
                return lastAction;
            }
        };
    return OpGen;
    }
);
  
 function checkModelType() { 

                
                    const closed = document.getElementById("opParam_closed");
                    const open = document.getElementById("opParam_open");
                    if (closed.checked) {
                      modelType = "False";
                    } else if (open.checked) {
                      modelType = "True";
                    } 
                
                    const defined = document.getElementById("opParam_timeDefined");
                    const automatic = document.getElementById("opParam_timeAutomatic");
                    if (defined.checked) {
                      warmupTime = "True";
                    } else if (automatic.checked) {
                      warmupTime = "False";
                    }
                }