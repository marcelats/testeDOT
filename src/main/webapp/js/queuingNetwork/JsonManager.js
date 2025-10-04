/*
 * (Singleton) Json manager. Keeps the graph in json format.
 * 
 * author: Felipe Osorio Thomé
 */

define(["jquery", "jsPlumb", "IdManager"],
    function($, jsPlumb, idManager) {
        "use strict";

        function Graph() {
            this.name = "untitled";
            this.parameters = {};
            this.mapNodes = {};
            this.arrivals = [];
            this.opcoes = [];
            this.arrivalIndex = 0;
        }

        function Node(id, type, x, y) {
            this.id = id;
            this.type = type;
            this.x = x;
            this.y = y;
            this.properties = {};
            this.mapTargets = {};
            this.source = -1;
        }

        var graph = new Graph(), saved = true;

        var JsonManager = {
            setGraph: function(pGraph) {
                graph = pGraph;
            },
            getGraph: function() {
                return graph;
            },
            setName: function(name) {
                graph.name = name;
            },
            getName: function() {
                return graph.name;
            },
            setGraphParameters: function(parameters) {
                graph.parameters = parameters;

                saved = false;
            },
            getGraphParameters: function() {
                return graph.parameters;
            },
            addNode: function(element) {
                graph.mapNodes[element.id] = new Node(element.id, element.name,
                    $(element).css("left"), $(element).css("top"));

                saved = false;
                const btnCode = document.getElementById("opCode");
                btnCode.style.opacity = '0.3';
                btnCode.style.pointerEvents = 'none';
                const btnExecute = document.getElementById("opExecute");
                btnExecute.style.opacity = '0.3';
                btnExecute.style.pointerEvents = 'none';
            },
            removeNode: function(element) {
                 var father = element.parentNode;

            jsPlumb.detachAllConnections(element);
            father.removeChild(element);
            console.log("antes de remover nos");
            console.log("arrivals atual:", graph.arrivals);
            console.log("opcoes atual:", graph.opcoes);
            if(graph.opcoes.some(op => op.value === element.id))
            {
                graph.opcoes = graph.opcoes.filter(op => op.value !== element.id);
                console.log("removeu se o no era opcoes");
                console.log("opcoes atual:", graph.opcoes);
                graph.arrivals.forEach(a => {
                    if (a.serviceCenter === element.id) {
                        graph.arrivals = graph.arrivals.filter(a => a.serviceCenter !== element.id);
                        console.log("removeu se o no era arrivals");
                        console.log("arrivals atual:", graph.arrivals);
                    }
                });
            }
            console.log("mapTargets");
            console.log(graph.mapNodes[element.id].mapTargets);
            if (graph.mapNodes[element.id].type === "source") {
                Object.keys(graph.mapNodes[element.id].mapTargets).forEach(target => {
                    console.log("graph.opcoes");
                    console.log(graph.opcoes);
                    console.log("target:");
                    console.log(target);
                    if (graph.opcoes.some(op => op.value === target)) {
                        var isInSource = false;
                        Object.values(graph.mapNodes).forEach(node => {
                            if (node.type === "source") {
                                if (String(target) in node.mapTargets && String(node.id) !== element.id) {
                                    isInSource = true;
                                    console.log("isinsource=true");
                                    console.log(node.id, typeof node.id);
                                    console.log(element.id, typeof element.id);
                                }
                            }
                        });
                        if(!isInSource){
                            graph.opcoes = graph.opcoes.filter(op => op.value !== target);
                            console.log("removeu se o target era opcoes");
                            console.log("opcoes atual:", graph.opcoes);
                            const arrivalFieldset = document.getElementById("arrival_fieldset");
                            if(arrivalFieldset) arrivalFieldset.disabled = true;
                            const ms_arrivalFieldset = document.getElementById("ms_arrival_fieldset");
                            if(ms_arrivalFieldset) ms_arrivalFieldset.disabled = true;
                            graph.arrivals.forEach(a => {
                                console.log(a.serviceCenter, typeof a.serviceCenter);
                                console.log(target, typeof target);
                                if (String(a.serviceCenter) === target) {
                                    graph.arrivals = graph.arrivals.filter(a => String(a.serviceCenter) !== target);
                                    console.log("removeu se o target era arrivals");
                                    console.log("arrivals atual:", graph.arrivals);
                                }
                            });
                        }      
                    }
                });
            }
            if (graph.mapNodes[element.id].type === "server" || graph.mapNodes[element.id].type === "multiServer") {
                var source = graph.mapNodes[element.id].source;
                if(source !== -1)
                {
                    if(Object.keys(graph.mapNodes[source].mapTargets).length === 2) 
                    {
                        graph.mapNodes[source].mapTargets[0] = 100;
                        graph.mapNodes[source].mapTargets[1] = 100;
                        if(graph.mapNodes[element.id].type === "server")
                        {
                            graph.mapNodes[source.mapTargets[0]].properties.probability = 100;
                            graph.mapNodes[source.mapTargets[1]].properties.probability = 100;
                        }
                        else
                        {
                            graph.mapNodes[source.mapTargets[0]].properties.ms_probability = 100;
                            graph.mapNodes[source.mapTargets[1]].properties.ms_probability = 100;
                        }
                    }
                    if(Object.keys(source.mapTargets).length > 2) 
                    {
                        Object.keys(graph.mapNodes[source].mapTargets).forEach(key => {
                            graph.mapNodes[source].mapTargets[key] = 0;
                            if(graph.mapNodes[element.id].type === "server")
                                graph.mapNodes[source.mapTargets[key]].properties.probability = 0;
                            else 
                                graph.mapNodes[source.mapTargets[key]].properties.ms_probability = 0;
                        });
                    }
                }
            }
            // 1. Remove do graph.mapNodes
            delete graph.mapNodes[element.id];

            // 2. Recria mapeamento de ID antigo -> novo ID sequencial
            const novoMapa = new Map();
            const chavesAntigas = Object.keys(graph.mapNodes);
            chavesAntigas.forEach((oldId, index) => {
                novoMapa.set(oldId, index);
                console.log("novoMapa:");
                console.log(novoMapa);
            });

            // 3. Atualiza os nós com os novos IDs
            const novosMapNodes = {};
            chavesAntigas.forEach((oldId) => {
                const no = graph.mapNodes[oldId];
                const novoId = novoMapa.get(oldId);

                // Atualiza id no objeto
                no.id = novoId;
                graph.arrivals.forEach(a => {
                    if (a.serviceCenter === oldId) {
                        a.serviceCenter = novoId;
                    }
                });

                graph.opcoes.forEach(a => {
                    if (a === oldId) {
                        a = novoId;
                    }
                });
                console.log("atualizando ids");
                console.log("arrivals atual:", graph.arrivals);
                console.log("opcoes atual:", graph.opcoes);

                // Atualiza targets
                const novosTargets = {};
                Object.keys(no.mapTargets).forEach((targetIdAntigo) => {
                    const novoTarget = novoMapa.get(targetIdAntigo);
                    if (novoTarget !== undefined) {
                        novosTargets[novoTarget] = no.mapTargets[targetIdAntigo];
                    }
                });
                if(no.source !== -1) no.source = novoMapa.get(no.source);
                no.mapTargets = novosTargets;
                //console.log(no.mapTargets);
                novosMapNodes[novoId] = no;
            });
            graph.mapNodes = novosMapNodes;
            console.log("novosMapNode:");
            console.log(novosMapNodes);
            // 4. Atualiza a interface (DOM)
            $(".idDiv").each(function() {
                const $div = $(this);
                //const $element = $div.closest("div");
                const $element = $div.parent();
                console.log("element:");
                console.log($element);
                const oldId = $element.attr("id");
                
                console.log("oldId:");
                console.log(oldId);
                const novoId = novoMapa.get(oldId);
                console.log("novoId:");
                console.log(novoId);
                if (novoId !== undefined) {
                    jsPlumb.removeAllEndpoints($element);
                    $element.attr("id", novoId);
                    $div.text(novoId);
                }
            });

            // 5. Recriar conexões jsPlumb
            Object.values(graph.mapNodes).forEach((no) => {
                Object.keys(no.mapTargets).forEach((targetId) => {
                    jsPlumb.connect({
                        source: no.id.toString(),
                        target: targetId.toString(),
                        paintStyle: {lineWidth: 3, strokeStyle: "#660700"},
                        anchors: ["RightMiddle", "LeftMiddle"],
                        endpoint: "Blank",
                        overlays: [["PlainArrow", {location: 1, width: 15, length: 12}]]
                    });
                });
            });
                      
                idManager.setStartCid(Object.keys(graph.mapNodes).length-1);

                saved = false;
                const btnCode = document.getElementById("opCode");
                btnCode.style.opacity = '0.3';
                btnCode.style.pointerEvents = 'none';
                const btnExecute = document.getElementById("opExecute");
                btnExecute.style.opacity = '0.3';
                btnExecute.style.pointerEvents = 'none';

            },
            linkNodes: function(connection) {
                if(connection){
                    if(graph.mapNodes[connection.sourceId].type==="out"){console.log("caso 1 jsonmanager");return 0;}
                    if(graph.mapNodes[connection.sourceId].type==="source" && graph.mapNodes[connection.targetId].type === "out"){console.log("caso 2 jsonmanager");return 0;}
                    if(graph.mapNodes[connection.targetId].type==="source"){console.log("caso 3 jsonmanager");return 0;}
                }
                    
                graph.mapNodes[connection.sourceId].mapTargets[connection.targetId] = 1;

                saved = false;
                const btnCode = document.getElementById("opCode");
                btnCode.style.opacity = '0.3';
                btnCode.style.pointerEvents = 'none';
                const btnExecute = document.getElementById("opExecute");
                btnExecute.style.opacity = '0.3';
                btnExecute.style.pointerEvents = 'none';
                if(graph.mapNodes[connection.sourceId].type==="source") 
                {
                    if(!graph.opcoes.some(op => op.value === String(connection.targetId)))
                    {
                        console.log("graph.opcoes:", graph.opcoes);
                        console.log("connection.targetId:", connection.targetId, typeof connection.targetId);
                        if(graph.opcoes[0])console.log("comparação direta:", graph.opcoes[0].value === String(connection.targetId));

                        graph.opcoes.push({ value: String(connection.targetId), 
                            text: String(connection.targetId) });
                        /*
                        const arrivalFieldset = document.getElementById("arrival_fieldset");
                        if(arrivalFieldset){ arrivalFieldset.disabled = false;
                        console.log("ativou arrival_fieldset");}
                    else console.log("nao encontrou arrival_fieldset");
                        const ms_arrivalFieldset = document.getElementById("ms_arrival_fieldset");
                        if(ms_arrivalFieldset){ ms_arrivalFieldset.disabled = false;
                        console.log("ativou ms_arrival_fieldset");}
                        else console.log("nao encontrou ms_arrival_fieldset");*/
                    }
                }
                console.log("opcoes atual:", graph.opcoes);
                if((graph.mapNodes[connection.sourceId].type==="server" || graph.mapNodes[connection.sourceId].type === "multiServer") 
                && (graph.mapNodes[connection.targetId].type==="server" || graph.mapNodes[connection.targetId].type === "multiServer")){
                    if(Object.keys(graph.mapNodes[connection.sourceId].mapTargets).length===1) 
                    {
                        const key = Object.keys(graph.mapNodes[connection.sourceId].mapTargets)[0];
                        graph.mapNodes[connection.sourceId].mapTargets[key] = 100;

                        if(graph.mapNodes[connection.targetId].type==="server")
                            graph.mapNodes[connection.targetId].properties.probability = 100;
                        else 
                            graph.mapNodes[connection.targetId].properties.ms_probability = 100;
                    }
                    else
                    {
                        Object.keys(graph.mapNodes[connection.sourceId].mapTargets).forEach(key => {
                            graph.mapNodes[connection.sourceId].mapTargets[key] = 0;
                            if(graph.mapNodes[connection.targetId].type==="server")
                                graph.mapNodes[key].properties.probability = 0;
                            else 
                                graph.mapNodes[key].properties.ms_probability = 0;
                        });
                    }
                    graph.mapNodes[connection.targetId].source = connection.sourceId;
                }
            },
            changeNodePosition: function(element) {
                graph.mapNodes[element.id].x = $(element).css("left");
                graph.mapNodes[element.id].y = $(element).css("top");

                saved = false;
            },
            setNodeProperties: function(element, properties) {
                graph.mapNodes[element.id].properties = properties;

                saved = false;
            },
            getNodeProperties: function(element) {
                return graph.mapNodes[element.id].properties;
            },
            stringifyGraph: function() {
                console.log(JSON.stringify(graph));
                return JSON.stringify(graph);
            },
            parseGraph: function(stringJson) {
                graph = JSON.parse(stringJson);

                return graph;
            },
            setSaved: function(pSaved) {
                saved = pSaved;
            },
            isSaved: function() {
                return saved;
            },
            clearGraph: function() {
                graph = new Graph();
                console.log("graph e graph.opcoes:");
                console.log(graph);
                console.log(graph.opcoes);
            }
        };

        return JsonManager;
    }
);