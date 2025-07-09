define(["jquery","LightBoxManager","Cons","JSZip"],
function($, lightBoxManager, cons,JSZip) {
    "use strict";

    var lastAction = null;

    var OpCode = {
        initialize: function() {
            const btn = document.getElementById("opCode");
                btn.style.opacity = '0.3';
      btn.style.pointerEvents = 'none';
      

document.querySelector("#opParam_library")?.addEventListener("change", function () {
    window.langSelecionado = this.value;
});


                window.addEventListener("genClicou", () => {
                    btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
                });
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
                    if(window.langSelecionada === 'Python')
                    {
                        a.download = "code.py";
                    }
                    else if(window.langSelecionada === 'Java')
                    {
                        a.download = "code.zip";
                    } 
                    else 
                    {
                        a.download = "code.r";
                    }
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
                        const opParam = document.querySelector("#opParam_library");
                        formData.append('lang', window.langSelecionada);
                        console.log(window.langSelecionada);
                        fetch("/ROOT/api/enviar", {
                            method: "POST",
                            body: formData
                        })
                        .then(res => res.blob())
                        .then(blobCode => {
                            window.codeBlob = blobCode;
                            const url = URL.createObjectURL(window.codeBlob);
                            const a = document.createElement("a");
                            a.href = url;
                            if(window.langSelecionada === 'Python')
                            {
                                a.download = "code.py";
                            }
                            else if(window.langSelecionada === 'Java')
                            {
                                a.download = "code.zip";
                            } 
                            else 
                            {
                                a.download = "code.r";
                            }
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            
                            
                            if(window.langSelecionada === 'Python' || window.langSelecionada === 'R')
                            {
                                blobCode.text().then(texto => {
                                    const textarea = document.getElementById("textEditor");
                                    if (textarea) {
                                        textarea.value = texto;
                                    } else {
                                        console.error("Textarea ainda não foi carregado.");
                                    }
                                });
                            }
                            else
                            {
                                JSZip.loadAsync(blobCode).then(zip => {
                                // Encontra o arquivo Controle.java (case-sensitive!)
                                const file = zip.file("Controle.java");
                                if (!file) {
                                  throw new Error("Arquivo Controle.java não encontrado no zip");
                                }
                                // Lê o conteúdo como texto
                                return file.async("text");
                              })
                              .then(conteudoTexto => {
                                console.log("Conteúdo de Controle.java:", conteudoTexto);
                              })
                              .catch(error => {
                                console.error("Erro:", error);
                              });
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao baixar código:", error);
                        });
                    }
                }
            );
    
            window.dispatchEvent(new Event("codeEditorClicou"));

        },

        getLastAction: function() {
            return lastAction;
        }
    };

    return OpCode;
});
