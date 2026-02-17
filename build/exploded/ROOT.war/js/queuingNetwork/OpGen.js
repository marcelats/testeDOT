/*
 * author: Marcela Tiemi Shinzato
 */
let modelType = "True";
let warmupTime = "False";
define(["jquery", "JsonManager", "LightBoxManager", "Cons"],
    function($, jsonManager, lightBoxManager, cons) {
        "use strict";

        var lastAction = null;

        var OpGen = {
            execute: function() {
                const mapNodes = jsonManager.getGraph().mapNodes;
                if (jsonManager.getGraph().parameters["op-param-library"] === 'R' || jsonManager.getGraph().parameters["op-param-library"] === 'Java' || jsonManager.getGraph().parameters["op-param-library"] === 'Python')
                {
                    for (let key in mapNodes) 
                    {
                        if (mapNodes[key]?.properties?.["ms-nbr-servers"] !== undefined) 
                        {
                            alert("Remove multiservers or use C language");
                            return;
                        }         
                    }  
                }
                
                var batchSize = jsonManager.getGraph().parameters["op-param-batch-size"] || 0;
                let content;
                var definedValue = jsonManager.getGraph().parameters["op-param-defined-value"] || 0;
                var seed = jsonManager.getGraph().parameters["op-param-seed"] || 1;

                
    /*if (opParam_timeDefined == "on") {
      warmupTime = "True";
    } else if (opParam_timeAutomatic == "on") {
      warmupTime = "False";
    }*/
                
                //var maxEntities = 0;
                
                
                if(jsonManager.getGraph().nServers === 0){
                    alert("Model has no servers");
                    return;
                }
                
                const errors = [];

                for (const key in mapNodes) {
                    const node = mapNodes[key];
                    if (node.type === "source" && Object.keys(node.mapTargets).length === 0)
                        errors.push(`Node ${node.index} (source) is not linked`);
                    if (node.type !== "source" && node.hasPrev === 0) {
                        errors.push(`Node ${node.index} (${node.type}) is not linked`);
                    }
                }

                if (errors.length > 0) {
                  errors.forEach(msg => alert(" - " + msg));
                  return; 
                }
                
                for (const node of Object.values(mapNodes)) {
                    if ((node.type === "server" && node.properties?.["server-average"] === undefined) || (node.type === "multiServer" && node.properties?.["ms-average"] === undefined)) {
                        alert(`Server ${node.index}'s service average is undefined`);
                        return;
                    } 
                    
                    if(jsonManager.getGraph().firstArrivalSCs.some(obj => obj.value === node.id) && ((node.type === "server" && (node.properties["arrival-average"] === undefined || node.properties["arrival-average"] === ''))
                            || (node.type === "multiServer" && (node.properties["ms-arrival-average"] === undefined || node.properties["ms-arrival-average"] === '')))){
                        alert(`Server ${node.index}'s arrival average is undefined`);
                        return;
                    }
                }
    
    
                if (["Java", "Python"].includes(jsonManager.getGraph().parameters["op-param-library"])) {
                    for (const node of Object.values(mapNodes)) {
                        for (const key of [
                            "arrival-distribution",
                            "ms-arrival-distribution",
                            "server-distribution",
                            "ms-distribution"
                        ]) {
                            if (["HyperExponential", "Erlang"].includes(node.properties[key])) {
                                alert(`Distributions must be Exponential, Normal or Uniform`);
                                return;
                            }
                        }
                    }
                }
         
                const invalidNodeExists = Object.entries(mapNodes).some(([nodeId, node]) => {
                    if (node.type === "server" || node.type === "multiServer") {
                        const sum = Object.values(node.mapTargets)
                            .reduce((a, v) => a + v, 0);

                        if (Object.values(node.mapTargets).length > 1) {
                            const ok = sum >= 99.5 && sum <= 100.5;
                            if (!ok) {
                                alert("The sum of the probabilities for each node must be 100."); 
                                return true;
                            }
                        }
                    }
                    return false;
                });

                if (invalidNodeExists) return; 
                if (!jsonManager.getGraph().parameters["op-param-exec-time"] || jsonManager.getGraph().parameters["op-param-exec-time"] === "" || Number(jsonManager.getGraph().parameters["op-param-exec-time"]) === 0) {
                    alert("Execution time must be different from zero");
                    return;
                }
                content = `digraph ${jsonManager.getGraph().name} {\n    comment=" ${jsonManager.getGraph().parameters["op-param-exec-time"]} 0 ${batchSize} 0 aberto ${warmupTime} ${definedValue} ${seed} " rankdir=LR\n`;

                Object.values(mapNodes).forEach(node => {

                    switch (node.type) {
                        case "source":
                            content += `    ${node.index} [label=Source comment=1]\n`;
                            break;
                        case "server":
                            content += `    ${node.index} [label=CPU${node.index} comment=" 2`;
                            switch (node.properties["arrival-distribution"])
                            {
                                case "None":
                                    content += ` None`;
                                    break;
                                case "Normal":
                                    content += ` 0`;
                                    break;
                                case "Exponential":
                                    content += ` 1`;
                                    break;
                                case "Uniform":
                                    content += ` 2`;
                                    break;
                                case "HyperExponential":
                                    content += ` 3`;
                                    break;
                                case "Erlang":
                                    content += ` 4`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }
                            switch (node.properties["server-distribution"])
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
                                case "HyperExponential":
                                    content += ` 3`;
                                    break;
                                case "Erlang":
                                    content += ` 4`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }
                            if(node.properties["server-empty-queue"] === 'on')
                            {content += ` ${node.properties["arrival-average"]} ${node.properties["server-average"]} 1 true `;}
                            else
                            {content += ` ${node.properties["arrival-average"]} ${node.properties["server-average"]} 1 false `;}
                            if(node.properties["server-length"] === 'on')
                            {content += `true `;}               
                            else
                            {content += `false `;}
                            if(node.properties["arrival-sequence"])content +=`${node.properties["arrival-sequence"]} `;
                            else content += `0 `;
                            content += `${seed} `;
                            if(node.properties["arrival-sd"]) content +=`${node.properties["arrival-sd"]} `;
                            else content += `0 `;
                            if(node.properties["server-sd"]) content +=`${node.properties["server-sd"]} `;
                            else content += `0 `;
                            if(jsonManager.getGraph().firstArrivalSCs.some(obj => parseInt(obj.value) === parseInt(node.index))) content += `true `;
                            else content += `false `;
                            content +=`"]\n`;
                            break;
                        case "out":
                            content += `    ${node.index} [label=Destination comment=3]\n`;
                            break;
                        case "multiServer":
                            content += `    ${node.index} [label=CPU comment=" 2`;
                            switch (node.properties["ms-arrival-distribution"])
                            {
                                case "None":
                                    content += ` None`;
                                    break;
                                case "Normal":
                                    content += ` 0`;
                                    break;
                                case "Exponential":
                                    content += ` 1`;
                                    break;
                                case "Uniform":
                                    content += ` 2`;
                                    break;
                                case "HyperExponential":
                                    content += ` 3`;
                                    break;
                                case "Erlang":
                                    content += ` 4`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }
                            switch (node.properties["ms-distribution"])
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
                                case "HyperExponential":
                                    content += ` 3`;
                                    break;
                                case "Erlang":
                                    content += ` 4`;
                                    break;
                                default:
                                    content += ` 0`;    
                            }
                            if(node.properties["ms-nbr-servers"])
                            {
                                if(node.properties["ms-empty-queue"] === 'on')
                                {
                                    content += ` ${node.properties["ms-arrival-average"]} ${node.properties["ms-average"]} ${node.properties["ms-nbr-servers"]} true `;
                                }
                                else
                                {
                                    content += ` ${node.properties["ms-arrival-average"]} ${node.properties["ms-average"]} ${node.properties["ms-nbr-servers"]} false `;
                                }

                            } 
                            else
                            {
                                if(node.properties["ms-empty-queue"] === 'on')
                                {
                                    content += ` ${node.properties["ms-arrival-average"]} ${node.properties["ms-average"]} 1 true `;
                                }
                                else
                                {
                                    content += ` ${node.properties["ms-arrival-average"]} ${node.properties["ms-average"]} 1 false `;
                                }
                            }
                            if(node.properties["ms-length"] === 'on')
                            {content += `true `;}
                            else
                            {content += `false `;}    
                            if(node.properties["ms-arrival-sequence"]) content += `${node.properties["ms-arrival-sequence"]} `;
                            else content +=`0 `;
                            content += `${seed} `;

                            if(node.properties["ms-sd"]) content += `${node.properties["ms-sd"]} `;
                            else content +=`0 `;
                            if(node.properties["ms-arrival-sd"]) content += `${node.properties["ms-arrival-sd"]} `;
                            else content +=`0 `;
                            if(jsonManager.getGraph().firstArrivalSCs.some(obj => parseInt(obj.value) === parseInt(node.index))) content += `true `;
                            else content += `false `;
                            content +=`"]\n`;
                            break;
                        default:
                            content += `" 2 1 1 1 0.1 "]\n`;
                    }
                });

                Object.values(mapNodes).forEach(node => {
                    Object.keys(node.mapTargets).forEach(targetId => {
                        var prob;
                        prob = node.mapTargets[targetId];
                        if(prob)content += `    ${node.index} -> ${mapNodes[targetId].index} [comment=${prob}]\n`;
                        else content += `    ${node.index} -> ${mapNodes[targetId].index} [comment=1]\n`;
                    });
                });
                if(jsonManager.getGraph().parameters["op-param-library"] === 'C SMPL' || jsonManager.getGraph().parameters["op-param-library"] === 'C SMPLX' || jsonManager.getGraph().parameters["op-param-library"] === 'C ParSMPL'|| jsonManager.getGraph().parameters["op-param-library"] === 'C SIMPACK' || jsonManager.getGraph().parameters["op-param-library"] === 'C SIMPACK2')
                {
                    const arrivals = jsonManager.getGraph().arrivals;
                    if (arrivals.length === 0) 
                        {
                            alert("Add at least one arrival");
                            return;
                        } 
                    //var length = 0;

                    content += `Arrivals ${arrivals.length} `;
                    arrivals.forEach((obj, index) => {
                        console.log(obj);
                        content += `${obj["parsedNumberClients"]} ${obj["valueArrivalTime"]} ${obj["serviceCenterValue"]} `;
                    });
                }

                content += "\n}\n";
                console.log(content);
                lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=showText",
                function() {
                    const blob = new Blob([content], { type: "text/plain" });
                    window.graphBlob = blob;
                     
                    blob.text().then(text => {
                        jsonManager.getGraph().gv = text;
                        onDOMReady(() => {
                            waitForElement("text-show", function(el) {
                                el.value = text;
                                window.dispatchEvent(new Event("genClicked"));
                            });
                        });                    
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
    const defined = document.getElementById("op-param-time-defined");
    const automatic = document.getElementById("op-param-time-automatic");
    if (defined.checked) {
      warmupTime = "True";
    } else if (automatic.checked) {
      warmupTime = "False";
    }
}

function waitForElement(id, callback) {
    const el = document.getElementById(id);
    if (el) return callback(el);

    if (!document.body) {
        setTimeout(() => waitForElement(id, callback), 50);
        return;
    }

    const observer = new MutationObserver(() => {
        const el = document.getElementById(id);
        if (el) {
            observer.disconnect();
            callback(el);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function onDOMReady(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}