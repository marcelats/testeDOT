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
                    alert("Selecione um tipo de modelo.");
                    return; // encerra fluxo
                }

                if (execTimeOp.checked) {
                    if (execTime === "" || Number(execTime) === 0) {
                        alert("Preencha Execution time com um valor diferente de zero.");
                        return;
                    }
                    content = `digraph ${jsonManager.getGraph().name} {\n    comment=" ${execTime} ${numCycles} ${batchSize} 0 aberto ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;
                }

                if (maxEntitiesOp.checked) {
                    if (maxEntities === "" || Number(maxEntities) === 0) {
                        alert("Preencha Max number of entities com um valor diferente de zero.");
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
                                if(node.properties.multiServer_emptyQueue === 'on')
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
                                if(node.properties.multiServer_emptyQueue === 'on')
                                {
                                    content += ` ${node.properties.arrival_average} ${node.properties.multiServer_average} 1 true `;
                                }
                                else
                                {
                                    content += ` ${node.properties.arrival_average} ${node.properties.multiServer_average} 1 false `;
                                }
                            }
                            if(node.properties.multiServer_length === 'on')
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
                            if(probnode.id === targetId){
                                prob = probnode.properties.probability;
                            }
                        });
                        if(prob)content += `    ${node.id} -> ${targetId} [comment=${prob}]\n`;
                        else content += `    ${node.id} -> ${targetId} [comment=1]\n`;
                    });
                });
                if(selectedValue === 'C SMPL' || selectedValue === 'C SMPLX' || selectedValue === 'C ParSMPL'|| selectedValue === 'C SIMPACK' || selectedValue === 'C SIMPACK2')
                {
                    const arrivals = window.arrivals;
                    if (arrivals === 0) 
                        {
                            alert("Necessario adicionar pelo menos uma chegada");
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
    const defined = document.getElementById("opParam_timeDefined");
    const automatic = document.getElementById("opParam_timeAutomatic");
    if (defined.checked) {
      warmupTime = "True";
    } else if (automatic.checked) {
      warmupTime = "False";
    }
}