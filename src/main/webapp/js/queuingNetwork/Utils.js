/*
 * (Singleton)
 * 
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */

define([],
    function() {
        "use strict";

        var Utils = {
            getObjPosition: function(obj) {
                var position = {
                    x: 0,
                    y: 0
                };

                if (obj.offsetParent) {
                    do {
                        position.x += obj.offsetLeft;
                        position.y += obj.offsetTop;
                        obj = obj.offsetParent;
                    } while (obj);
                }
                return position;
            },
            captureCoordinates: function(event) {
                var coordinates = {x: event.clientX, y: event.clientY};

                return coordinates;
            },
            /* Cross-browser stop propagation */
            stopPropagation: function(event) {
                if (typeof event.stopPropagation !== "undefined") {
                    event.stopPropagation();
                }
                else {
                    event.cancelBubble = true;
                }
            },
            mapIsEmpty: function(map) {
                for (var key in map) {
                    if (map.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            },
            resetCodeExecute: function(){
                const btnCode = document.getElementById("op-code");
                btnCode.style.opacity = '0.3';
                btnCode.style.pointerEvents = 'none';
                const btnExecute = document.getElementById("op-execute");
                btnExecute.style.opacity = '0.3';
                btnExecute.style.pointerEvents = 'none';
                window.flag = false;
            }
        };

        return Utils;
    }
);