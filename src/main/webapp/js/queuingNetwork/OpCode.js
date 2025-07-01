define(["jquery"],
    function($) {
        "use strict";

        var lastAction = null;

        var OpGen = {
            execute: function() {
                // Usa o blob criado no outro script
                const blobGraph = window.graphBlob;

                if (blobGraph) {
                  const formData = new FormData();
                  formData.append("arquivo", blobGraph, "graph.gv");

                  fetch("/ROOT/api/enviar", {
                    method: "POST",
                    body: formData
                  }).then(res => res.blob()) // <- importante: usa .blob() ao invés de .text()
                        .then(blobCode => {
                          const url = URL.createObjectURL(blobCode); 

                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "code.py"; 
                          document.body.appendChild(a);
                          a.click(); 
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        })
                        .catch(error => {
                          console.error("Erro ao baixar código:", error);
                        });
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };
    return OpGen;
    }
);

