require.config({
  paths: {
    JSZip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min"
  }
});

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
                    if(window.langSelecionada === 'Python' || window.langSelecionada === 'R')
                    { 
                        const a = document.createElement("a");
                        a.href = url;
                    }
                    if(window.langSelecionada === 'Python')
                    {
                        a.download = "code.py";
                    }
                    else if(window.langSelecionada === 'R')
                    {
                        a.download = "code.r";
                    }
                    else 
                    {
                        const novoZip = new JSZip();
                        window.listaArquivos.forEach(arquivo => {
                            if (arquivo.nome !== "Controle.java") {
                                  // Adiciona cada arquivo ao ZIP
                                  novoZip.file(arquivo.nome, arquivo.conteudo);
                                }});
                                novoZip.file("Controle.java", blobCode);
                                // Gera o ZIP e inicia o download
                                novoZip.generateAsync({ type: "blob" })
                                  .then(blob => {
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "code.zip";
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                  })
                                  .catch(err => {
                                    console.error("Erro ao gerar o zip:", err);
                                  }); 
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
                                  const textarea = document.getElementById("textEditor");
                                if (textarea) {
                                        textarea.value = conteudoTexto;
                                    } else {
                                        console.error("Textarea ainda não foi carregado.");
                                    }
                              })
                              .catch(error => {
                                console.error("Erro:", error);
                              });
                              JSZip.loadAsync(blobCode)
                                .then(zip => {
                                  const arquivosJava = [];
                                  zip.forEach((caminho, file) => {
                                    if (file.name.endsWith(".java")) {
                                      arquivosJava.push(file.async("text").then(texto => ({
                                        nome: file.name,
                                        conteudo: texto
                                      })));
                                    }
                                  });
                                  return Promise.all(arquivosJava);
                                }).then(listaArquivos => {
                                    window.listaArquivos = listaArquivos;});
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
