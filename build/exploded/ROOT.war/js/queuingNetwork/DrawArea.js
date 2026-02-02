/*
 * (Singleton) Draw area controller. He can be called by to ways: clicking on
 * the div drawArea or an added element.
 * 
 * author: Felipe Osorio Thomé
 */
define(["ActiveTool", "DivManager", "IdManager", "JsonManager", "Cons", "Utils"],
function(activeTool, divManager, idManager, jsonManager, cons, utils) {
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
                    remElement(element);
                } else if (tool === "link") {
                    linkElements(element);
                }
                utils.stopPropagation(event);
            }
        },
        linkElements: function(element){linkElements(element);}
    };

    function addElement(coordinates, tool) {
        var drawArea = document.getElementById(cons.DRAW_AREA);
        var drawAreaPosition = utils.getObjPosition(drawArea);
        var position = {
            x: coordinates.x - drawAreaPosition.x - cons.HALF_ELEM_SIZE,
            y: coordinates.y - drawAreaPosition.y - cons.HALF_ELEM_SIZE
        };
        var element = elementManager.add(tool, position, idManager.getNewCid());
        console.log(element);
        jsonManager.add(element);
        console.log(
  "snapshot:",
  structuredClone(jsonManager.getGraph())
);
        elementManager.updateDOMIndexes();
    }

    function remElement(element) {   
        elementManager.remove(element);
    }
    function linkElements(element) {

            var connection;
            connection = elementManager.linkElements(element);
            

            divManager.blockDiv(cons.LEFT_TOOLS);
            
            if(connection !== 0 && connection !== null) {
                jsonManager.linkNodes(connection);
            
            }
        }

    return DrawArea;
});

