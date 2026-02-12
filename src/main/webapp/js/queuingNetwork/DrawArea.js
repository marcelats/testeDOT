/*
 * (Singleton) Draw area controller. He can be called by to ways: clicking on
 * the div drawArea or an added element.
 * 
 * author: Felipe Osorio Thomé
 */
define(["ActiveTool", "DivManager", "IdManager", "JsonManager", "Cons", "Utils", "HistoryManager", "jsPlumb"],
function(activeTool, divManager, idManager, jsonManager, cons, utils, history, jsPlumb) {
    

    "use strict";

    var elementManager = null;

    var DrawArea = {
        initialize: function(manager) {
            elementManager = manager;
        },
        ctrl: function(event, element) {
            var tool = activeTool.getTool();
            if (typeof element === "undefined") {
                if (tool === "server" || tool === "multiserver" || tool === "source" || tool === "out") {
                    addElement(utils.captureCoordinates(event), tool);
                }
            }
            else {
                if (tool === "erase") {
                    console.log(element);
                    if(isNode(element)) remElement(element);
                    else remLink(element);
                } else if (tool === "link") {
                    if(isNode(element)) linkElements(element);
                }
                utils.stopPropagation(event);
            }
        },
        linkElements: function(element){linkElements(element);}
    };

    function isNode(obj) {
        return obj instanceof HTMLElement;
    };

    function addElement(coordinates, tool) {
        var drawArea = document.getElementById(cons.DRAW_AREA);
        var drawAreaPosition = utils.getObjPosition(drawArea);
        var position = {
            x: coordinates.x - drawAreaPosition.x - cons.HALF_ELEM_SIZE,
            y: coordinates.y - drawAreaPosition.y - cons.HALF_ELEM_SIZE
        };
        var id = idManager.getNewCid();
        history.execute({
            redo: () => {
                var element = elementManager.add(tool, position, id);
                jsonManager.add(element);
                elementManager.updateDOMIndexes();
            },
            undo: () => elementManager.remove(document.getElementById(id))
        });
    }

    function remElement(element) {   
        const nodeData = structuredClone(jsonManager.getMapNodes()[element.id]);

        history.execute({
            redo: () => elementManager.remove(element),
            undo: () => {
                const el = elementManager.add(nodeData.type, {x: nodeData.x, y: nodeData.y}, nodeData.id);
                jsonManager.add(nodeData);
                elementManager.updateDOMIndexes();
            }
        });
    }
    
    function remLink(connection){
        
        const sourceId = connection.sourceId;
        const targetId = connection.targetId;

        history.execute({
            redo: () => elementManager.removeLink(connection),
            undo: () => elementManager.linkByIds(sourceId, targetId)
        });

    }
    
    function linkElements(element) {

        const previewConnection = elementManager.linkElements(element);

        divManager.blockDiv(cons.LEFT_TOOLS);

        if (previewConnection !== 0 && previewConnection !== null) {

            const sourceId = previewConnection.source.id;
            const targetId = previewConnection.target.id;

            elementManager.removeLink(previewConnection);

            history.execute({

                redo: function () {
                    const conn = elementManager.linkByIds(sourceId, targetId);
                    jsonManager.linkNodes(conn);
                },

                undo: function () {
                    const conn = jsPlumb.select({
                        source: sourceId,
                        target: targetId
                    }).get(0);

                    if (conn) {
                        elementManager.removeLink(conn);
                    }
                }

            });
        }
    }

    return DrawArea;
});

