/*
 * (Singleton) Keep the last tool that the user selected.
 * 
 * author: Felipe Osorio Thomé
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
    // opcional: mover foco do teclado para o elemento
    el.focus();
    // atributo ARIA (bom para acessibilidade)
    el.setAttribute('aria-selected', 'true');
  }
        }

        return {
            setTool: function(toolId) {
                //define a imagem de tool para sem foco
                tool = toolId;
                defineStatus();
            },
            getTool: function() {
                return tool;
            }
        };
    }
);