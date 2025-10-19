require.config({
    paths: {
        JSZip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min"
    }
});

define(["jquery", "JSZip", "JsonManager", "LightBoxManager", "Cons"],
function($, JSZip, jsonManager, lightBoxManager, cons) {
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
                window.flag = true;
            });
            
            $(document).on("click", "#showText-btClose", function() {
                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
            });

            $(document).on("click", "#showText-download", function() {
                const textarea = document.getElementById("textShow");
                if (textarea) {
                    const textoAtual = textarea.value;
                    const blobCode = new Blob([textoAtual], { type: "text/plain" });
                    const url = URL.createObjectURL(blobCode);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = !window.flag
                        ? jsonManager.getGraph().name + ".gv"
                        : jsonManager.getGraph().name + "_" + window.langSelecionado + ".txt";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } else {
                    console.error("Textarea não encontrado.");
                }
            });
        },

        execute: async function() {
            lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=showText",
                async function() {
                    const blobCode = window.codeBlob;
                    if (blobCode) {
                        const formData = new FormData();
                        formData.append('lang', window.langSelecionada);

                        if (window.langSelecionada === 'R') {
                            formData.append("arquivo", blobCode, jsonManager.getGraph().name + ".r");
                        } else if (window.langSelecionada === 'Java') {
                            const novoZip = new JSZip();

                            window.listaArquivos.forEach(arquivo => {
                                if (arquivo.nome !== "Controle.java") {
                                    novoZip.file(arquivo.nome, arquivo.conteudo);
                                }
                            });

                            const controleTexto = await blobCode.text();
                            novoZip.file("Controle.java", controleTexto);

                            try {
                                const zipBlob = await novoZip.generateAsync({ type: "blob" });
                                formData.append("arquivo", zipBlob, jsonManager.getGraph().name + ".zip");
                            } catch (err) {
                                console.error("Erro ao gerar ou enviar o zip:", err);
                            }
                        } else if (window.langSelecionada === 'C SMPL' || window.langSelecionada === 'C SMPLX') {
                            formData.append("arquivo", blobCode, jsonManager.getGraph().name + ".c");
                        } else {
                            formData.append("arquivo", blobCode, jsonManager.getGraph().name + ".py");
                        }

                        fetch("/ROOT/api/executar", {
                            method: "POST",
                            body: formData
                        })
                        .then(res => res.blob())
                        .then(blobReport => {
                            
                            /*const url = URL.createObjectURL(blobReport);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = jsonManager.getGraph().name + ".txt";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);*/
                            blobReport.text().then(texto => {
                                window.report = texto;
                                    const textarea = document.getElementById("textShow");
                                    if (textarea) {
                                        textarea.value = texto;
                                        
                                        const blobReport = new Blob([texto], { type: "text/plain" });
  
                                    } else {
                                        console.error("Textarea ainda não foi carregado.");
                                    }
                                });
                        })
                        .catch(error => {
                            console.error("Error when downloading report", error);
                        });
                    }
                }
            );
        },

        getLastAction: function() {
            return lastAction;
        }
    };

    return OpExecute;
});
