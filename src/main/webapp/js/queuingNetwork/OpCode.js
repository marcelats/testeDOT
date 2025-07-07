define(["jquery","LightBoxManager","Cons"],
function($, lightBoxManager, cons) {
    "use strict";

    var lastAction = null;

    var OpCode = {
        initialize: function() {
            $(document).on("click", "#opCode-btClose", function() {
                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
            });

            $(document).on("click", "#opCode-btOk", function() {
                const textarea = document.getElementById("textEditor");
                if (textarea) {
                    const textoAtual = textarea.value;
                    const blobCode = new Blob([textoAtual], { type: "text/plain" });
                    window.codeBlob = blobCode;
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                } else {
                    console.error("Textarea não encontrado.");
                }
            });

            $(document).on("click", "#opCode-download", function() {
                const textarea = document.getElementById("textEditor");
                if (textarea) {
                    const textoAtual = textarea.value;
                    const blobCode = new Blob([textoAtual], { type: "text/plain" });
                    window.codeBlob = blobCode;

                    const url = URL.createObjectURL(blobCode);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "code.py";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } else {
                    console.error("Textarea não encontrado.");
                }
            });
        },

        execute: function(action) {
            lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=editor",
                function() {
                    // Callback: textarea carregado
                    const blobGraph = window.graphBlob;

                    if (blobGraph) {
                        const formData = new FormData();
                        formData.append("arquivo", blobGraph, "graph.gv");

                        fetch("/ROOT/api/enviar", {
                            method: "POST",
                            body: formData
                        })
                        .then(res => res.blob())
                        .then(blobCode => {
                            window.codeBlob = blobCode;
                            blobCode.text().then(texto => {
                                const textarea = document.getElementById("textEditor");
                                if (textarea) {
                                    textarea.value = texto;
                                } else {
                                    console.error("Textarea ainda não foi carregado.");
                                }
                            });
                        })
                        .catch(error => {
                            console.error("Erro ao baixar código:", error);
                        });
                    }
                }
            );
        },

        getLastAction: function() {
            return lastAction;
        }
    };

    return OpCode;
});
