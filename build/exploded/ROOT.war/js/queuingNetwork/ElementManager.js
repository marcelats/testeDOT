/* *
 * Add, remove or link elements in a div.
 *
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */
define([
    "jquery",
    "jsPlumb",
    "DrawArea",
    "PropertiesArea",
    "JsonManager",
    "Utils"
], function ($, jsPlumb, drawArea, propertiesArea, jsonManager, utils) {

    "use strict";

    function ElementManager(folder, format, drawArea) {
        this.folder = folder;
        this.format = format;
        this.drawArea = drawArea;
        this.prevElement = null;
        this.prevEndPoint = null;
    }

    ElementManager.prototype.add = function (type, position, id) {

        const elementDiv = document.createElement("div");
        const img = document.createElement("img");
        const idDiv = document.createElement("div");

        elementDiv.id = id;            
        elementDiv.name = type;

        img.src = this.folder + type + this.format;

        idDiv.className = "id-div";
        idDiv.textContent = "?";       

        $(elementDiv).css({
            position: "absolute",
            left: position.x + "px",
            top: position.y + "px"
        });

        elementDiv.appendChild(idDiv);
        elementDiv.appendChild(img);

        this.addEventHandlers(elementDiv);

        document.getElementById(this.drawArea).appendChild(elementDiv);

        //this.updateVisualIndexes();
        //updateDOMIndexes();
        
        console.log(
  "snapshot:",
  structuredClone(jsonManager.getGraph())
);
        return elementDiv;
    };

    ElementManager.prototype.addEventHandlers = function (element) {

        $(element).click((event) => {
            drawArea.ctrl(event, element);
        });

        $(element).dblclick(() => {
            propertiesArea.ctrl(element);
        });

        $(element).draggable({
            drag: () => jsPlumb.repaint(element),
            stop: (event) => {
                jsonManager.changeNodePosition(element);
                utils.stopPropagation(event);
            }
        });
    };

    ElementManager.prototype.remove = function (element) {

        this.prevElement = null;
        this.prevEndPoint = null;

        jsPlumb.detachAllConnections(element);
        jsPlumb.removeAllEndpoints(element);

        element.parentNode.removeChild(element);

        delete jsonManager.getMapNodes()[element.id];

        Object.values(jsonManager.getMapNodes()).forEach((node) => {
            delete node.mapTargets[element.id];
        });
        
        jsonManager.removeNode(element);

        //this.updateVisualIndexes();
        this.updateDOMIndexes();
    };

    ElementManager.prototype.linkElements = function (element) {

        if (!element) return null;

        const graph = jsonManager.getGraph();

        const sourceOpts = {
            anchor: "RightMiddle",
            isSource: true,
            endpoint: "Blank",
            maxConnections: -1
        };

        const targetOpts = {
            anchor: "LeftMiddle",
            isTarget: true,
            endpoint: "Blank",
            maxConnections: -1
        };

        const connectorOpts = {
            paintStyle: { lineWidth: 3, strokeStyle: "#660700" },
            overlays: [["PlainArrow", { location: 1, width: 15, length: 12 }]]
        };

        const getEndpoint = (el, type) => {
            const eps = jsPlumb.getEndpoints(el) || [];
            for (const ep of eps) {
                if (type === "source" && ep.isSource) return ep;
                if (type === "target" && ep.isTarget) return ep;
            }
            return jsPlumb.addEndpoint(el, type === "source" ? sourceOpts : targetOpts);
        };

        if (!this.prevElement) {

            const sourceType = jsonManager.getMapNodes()[element.id]?.type;
            if (sourceType === "out") return null;

            this.prevElement = element;
            this.prevEndPoint = getEndpoint(element, "source");
            return null;
        }

        const sourceEl = this.prevElement;
        const targetEl = element;

        const sourceType = jsonManager.getMapNodes()[sourceEl.id]?.type;
        const targetType = jsonManager.getMapNodes()[targetEl.id]?.type;

        if (
            targetType === "source" ||
            (sourceType === "source" && targetType === "out")
        ) {
            this.prevElement = null;
            this.prevEndPoint = null;
            return null;
        }

        const exists = jsPlumb.select({
            source: sourceEl,
            target: targetEl
        }).length > 0;

        if (exists) {
            this.prevElement = null;
            this.prevEndPoint = null;
            return null;
        }

        const connection = jsPlumb.connect({
            source: this.prevEndPoint,
            target: getEndpoint(targetEl, "target")
        }, connectorOpts);
console.log(
  "snapshot:",
  structuredClone(jsonManager.getMapNodes())
);
        //jsonManager.getMapNodes()[sourceEl.id].mapTargets[targetEl.id] = 100;

        this.prevElement = null;
        this.prevEndPoint = null;
console.log(
  "snapshot:",
  structuredClone(jsonManager.getGraph())
);
        return connection;
    };

    ElementManager.prototype.updateVisualIndexes = function () {

        let index = 0;

        const $container = $("#" + this.drawArea);

        $container.children("div").each(function () {

            const $element = $(this);
            const realId = $element.attr("id");

            if (!realId) return; 

            const $idDiv = $element.children(".id-div");
            if ($idDiv.length === 0) return;

            $idDiv.text(index);
            $element.attr("data-node-index", index);

            if (jsonManager.getMapNodes()[realId]) {
                jsonManager.getMapNodes()[realId].index = index;
            }

            index++;
        });
    };

    ElementManager.prototype.updateDOMIndexes = function () {
        let index = 0;
        const mapNodes = jsonManager.getGraph().mapNodes;
        $("#" + this.drawArea).children("div").each(function () {
            const el = this;
            const nodeId = el.id;
            if (!nodeId || !mapNodes[nodeId]) return;
            //mapNodes[nodeId].index = index;
            $(el).children(".id-div").text(index);
            index++;
        });
    };

    return ElementManager;
});
