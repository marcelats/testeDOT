define(["jquery"],
    function($) {
        "use strict";

        var lastAction = null;

        var OpExecute = {
            initialize: function() {
                const btn = document.getElementById("opExecute");
                btn.style.opacity = '0.3';
      btn.style.pointerEvents = 'none';

                window.addEventListener("codeEditorClicou", () => {
                    btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
                });
            },
            execute: function() {
                console.log("passando pelo opexecute");
                // Usa o blob criado no outro script
                const blobCode = window.codeBlob;
                console.log(blobCode.text());
                if (blobCode) {
                  const formData = new FormData();
                  formData.append("arquivo", blobCode, "code.py");

                  fetch("/ROOT/api/executar", {
                    method: "POST",
                    body: formData
                  }).then(res => res.blob()) // <- importante: usa .blob() ao invés de .text()
                        .then(blobReport => {
                          const url = URL.createObjectURL(blobReport); 
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "report.txt"; 
                          document.body.appendChild(a);
                          a.click(); 
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        })
                        .catch(error => {
                          console.error("Erro ao baixar relatorio:", error);
                        });
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };
    return OpExecute;
    }
);


