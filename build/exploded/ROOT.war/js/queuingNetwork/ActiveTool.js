/*
 * (Singleton) Keep the last tool that the user selected.
 * 
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */

define(["Cons"],
    function(cons) {
        "use strict";

        var tool = "none";
        function clearAllFocus() {
            document.querySelectorAll('.node.focused').forEach(n => {
                n.classList.remove('focused');
                n.removeAttribute('aria-selected');
            });
        }
        
        function defineStatus() {
            document.getElementById(cons.STATUS_TOOL).innerHTML =
                "Current tool: " + tool;
            clearAllFocus();
            const el = document.getElementById(tool);
            if (el) {
                el.classList.add('focused');
                el.focus();
                el.setAttribute('aria-selected', 'true');
            }
        }

        return {
            setTool: function(toolId) {
                tool = toolId;
                defineStatus();
            },
            getTool: function() {
                return tool;
            }
        };
    }
);