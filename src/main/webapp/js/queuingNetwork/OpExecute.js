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
            execute: function() {
                // Usa o blob criado no outro script
                const blobCode = window.codeBlob;
                //console.log(blobCode.text());
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
                        novoZip.file("Controle.java", blobCode);
                        // Gera o zip e envia
                        novoZip.generateAsync({ type: "blob" })
                          .then(blob => {
                            formData.append("arquivo", blob, "code.zip");
                            const url = URL.createObjectURL(blob);
                            console.log("URL temporário do ZIP:", url);

                            // Você pode colar esse URL no navegador ou usá-lo num <a> pra baixar
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "debug.zip";
                            a.click();
                            URL.revokeObjectURL(url);
                          })
                          .catch(err => {
                            console.error("Erro ao gerar ou enviar o zip:", err);
                          });   
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


