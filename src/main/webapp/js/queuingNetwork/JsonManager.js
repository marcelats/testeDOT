/* *
 * (Singleton) Json manager. Keeps the graph in json format.
 *
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */
define([
    "jquery",
    "jsPlumb",
    "IdManager",
    "Utils"
], function ($, jsPlumb, idManager, utils) {

    "use strict";

    function Graph() {
        this.name = "untitled";
        this.parameters = {};
        this.mapNodes = {};
        this.arrivals = [];
        this.firstArrivalSCs = [];
        this.arrivalIndex = 0;
        this.nSources = 0;
        this.nServers = 0;
        this.nOuts = 0;
        this.gv = "";
        this.codeName = "";
        this.code = "";
        this.reportName = "";
        this.report = "";
    }

    function Node(id, type, x, y) {
        this.id = id;          
        this.index = null;     
        this.type = type;
        this.x = x;
        this.y = y;
        this.properties = {};
        this.mapTargets = {};
        this.hasPrev = 0;
    }

    var graph = new Graph(),
        saved = true,
        loading = false;

    var JsonManager = {

        setGraph: function (pGraph) {
            console.log(
  "snapshot:",
  structuredClone(pGraph)
);
            graph = pGraph;

            for (const id in graph.mapNodes) {
                if (!graph.mapNodes[id].mapTargets) {
                    graph.mapNodes[id].mapTargets = {};
                }
                if (graph.mapNodes[id].hasPrev === null) {
                    graph.mapNodes[id].hasPrev = 0;
                }
            }
            console.log(
  "snapshot:",
  structuredClone(graph)
);

            saved = true;
        },

        getGraph: function () {
            return graph;
        },

        setName: function (name) {
            graph.name = name;
        },

        getName: function () {
            return graph.name;
        },

        setGraphParameters: function (parameters) {
            graph.parameters = parameters;
            saved = false;
        },

        getGraphParameters: function () {
            return graph.parameters;
        },

        add: function (element) {

            graph.mapNodes[element.id] = new Node(
                element.id,
                element.name,
                $(element).css("left"),
                $(element).css("top")
            );

            saved = false;
            utils.resetCodeExecute();

            if (element.name === "source") graph.nSources += 1;
            else if (element.name === "out") graph.nOuts += 1;
            else graph.nServers += 1;
        },

        removeNode: function (element) {

            if (element.name === "source") graph.nSources -= 1;
            else if (element.name === "out") graph.nOuts -= 1;
            else graph.nServers -= 1;

            //jsPlumb.detachAllConnections(element);

            //delete graph.mapNodes[element.id];

            saved = false;
            utils.resetCodeExecute();
        },

        linkNodes: function (connection) {

            if (loading) return;

            if (connection) {
                if (graph.mapNodes[connection.sourceId].type === "out") return 0;
                if (
                    graph.mapNodes[connection.sourceId].type === "source" &&
                    graph.mapNodes[connection.targetId].type === "out"
                ) return 0;
                if (graph.mapNodes[connection.targetId].type === "source") return 0;
            }
            if (graph.mapNodes[connection.sourceId].type === "source")
            {
                graph.firstArrivalSCs.push(String(connection.targetId));
            }
            graph.mapNodes[connection.sourceId].mapTargets[connection.targetId] = 0;
            graph.mapNodes[connection.targetId].hasPrev = 1;
            if((graph.mapNodes[connection.sourceId].type==="server" || graph.mapNodes[connection.sourceId].type === "multiServer") 
                && (graph.mapNodes[connection.targetId].type==="server" || graph.mapNodes[connection.targetId].type === "multiServer")){
                    if(Object.keys(graph.mapNodes[connection.sourceId].mapTargets).length === 1) 
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
                        var zeroes = [];
                

                        for (const [key, value] of Object.entries(graph.mapNodes[connection.sourceId].mapTargets)) {
                            if (value === 0) {
                                zeroes.push(key);
                            }}
                                
                        if(zeroes.length !== 0)  
                        {
                            Object.keys(graph.mapNodes[connection.sourceId].mapTargets).forEach(key => {
                                graph.mapNodes[connection.sourceId].mapTargets[key] = 0;
                                if(graph.mapNodes[connection.targetId].type === "server")
                                    graph.mapNodes[key].properties.probability = 0;
                                else 
                                    graph.mapNodes[key].properties.ms_probability = 0;
                            });
                        }
                    }
                    graph.mapNodes[connection.targetId].source = connection.sourceId;
                }
            this.nullButtons();
        },


        changeNodePosition: function (element) {
            graph.mapNodes[element.id].x = $(element).css("left");
            graph.mapNodes[element.id].y = $(element).css("top");
            saved = false;
        },

        setNodeProperties: function (element, properties) {
            graph.mapNodes[element.id].properties = properties;
            saved = false;
        },

        getNodeProperties: function (element) {
            return graph.mapNodes[element.id].properties;
        },

        stringifyGraph: function () {
            return JSON.stringify(graph);
        },

        parseGraph: function (stringJson) {
            graph = JSON.parse(stringJson);
            return graph;
        },

        setSaved: function (pSaved) {
            saved = pSaved;
        },

        isSaved: function () {
            return saved;
        },

        clearGraph: function () {
            graph = new Graph();
        },

        nullButtons: function () {
            saved = false;
            utils.resetCodeExecute();
        },

        nameCodeReport: function () {

            var filename = graph.name;

            if (graph.parameters["op-param-library"] === "Python") {
                graph.codeName = filename + ".py";
                graph.reportName = filename + "_Python.txt";
            } else if (graph.parameters["op-param-library"] === "Java") {
                graph.codeName = filename + ": Controle.java";
                graph.reportName = filename + "_Java.txt";
            } else {
                graph.codeName = filename;
                graph.reportName = filename;
            }
        },
        
        getMapNodes: function () {
            return graph.mapNodes;
        },
        
        setLoading: function (v) {
            loading = v;
        }
    };

    return JsonManager;
});
