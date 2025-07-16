require.config({
  paths: {
    JSZip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min"
  }
});
define(["jquery","JSZip"],
    function($,JSZip) {
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
            execute: async function() {
                // Usa o blob criado no outro script
                const blobCode = window.codeBlob;
                console.log(blobCode.text());
                if (blobCode) {
                    const formData = new FormData();
                    formData.append('lang', window.langSelecionada);
                    console.log(window.langSelecionada);
                    if(window.langSelecionada === 'Python')
                    {
                        formData.append("arquivo", blobCode, "code.py");
                    }
                    else if(window.langSelecionada === 'Java')
                    {
                        const novoZip = new JSZip();

                        // Adiciona todos os arquivos, exceto "Controle.java"
                        window.listaArquivos.forEach(arquivo => {
                          if (arquivo.nome !== "Controle.java") {
                            novoZip.file(arquivo.nome, arquivo.conteudo);
                          }
                        });
                        // Adiciona o "Controle.java" a partir de blobCode
                        const controleTexto = await blobCode.text();
                        novoZip.file("Controle.java", controleTexto);
                        // Gera o zip e envia
                        try {
                            const zipBlob = await novoZip.generateAsync({ type: "blob" });
                            formData.append("arquivo", zipBlob, "code.zip");
                          } catch (err) {
                            console.error("Erro ao gerar ou enviar o zip:", err);
                          }
                    }
                    else
                    {
                        formData.append("arquivo", blobCode, "code.r");
                    }
                    fetch("/ROOT/api/executar", {
                          method: "POST",
                          body: formData
                        })
                        .then(res => res.blob()) // <- importante: usa .blob() ao invés de .text()
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


