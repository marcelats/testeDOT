define(["jquery"],
    function($) {
        "use strict";

        var lastAction = null;

        var OpGen = {
            execute: function() {
                // Usa o blob criado no outro script
                const blob = window.graphBlob;

                if (blob) {
                  const formData = new FormData();
                  formData.append("arquivo", blob, "graph.gv");

                  fetch("/ROOT/enviar", {
                    method: "POST",
                    body: formData
                  }).then(res => res.text()).then(console.log);
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };
    return OpGen;
    }
);

