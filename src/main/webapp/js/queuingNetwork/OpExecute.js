/*
 * author: Marcela Tiemi Shinzato
 */
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
            const btn = document.getElementById("op-execute");
            btn.style.opacity = '0.3';
            btn.style.pointerEvents = 'none';

            window.addEventListener("codeEditorClicked", () => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                window.flag = true;
            });
            
            $(document).on("click", "#show-text-bt-close", function() {
                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
            });

            $(document).on("click", "#show-text-download", function() {
                const textArea = document.getElementById("textShow");
                if (textArea) {
                    const blobCode = new Blob([textArea.value], { type: "text/plain" });
                    const url = URL.createObjectURL(blobCode);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = !window.flag
                        ? jsonManager.getGraph().name + ".gv"
                        : jsonManager.getGraph().reportName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        },

        execute: async function() {
            lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=showText",
                async function() {
                    const titleSpan = document.querySelector(".boxTitle");

            if (window.flag === true) {
                titleSpan.textContent = "Report File";
            } else {
                titleSpan.textContent = "Graph File";
            }
                    const blobCode = window.codeBlob;
                    if (blobCode) {
                        const formData = new FormData();
                        formData.append('lang', jsonManager.getGraph().parameters.op_param_library);

                        if (jsonManager.getGraph().parameters.op_param_library === 'R') {
                            formData.append("file", blobCode, jsonManager.getGraph().name + ".r");
                        } else if (jsonManager.getGraph().parameters.op_param_library === 'Java') {
                            const newZip = new JSZip();

                            window.filesList.forEach(file => {
                                if (file.name !== "Controle.java") {
                                    newZip.file(file.name, file.content);
                                }
                            });

                            const textControl = await blobCode.text();
                            newZip.file("Controle.java", textControl);

                            try {
                                const zipBlob = await newZip.generateAsync({ type: "blob" });
                                formData.append("file", zipBlob, jsonManager.getGraph().name + ".zip");
                            } catch (err) {
                            }
                        } else if (jsonManager.getGraph().parameters.op_param_library === 'C SMPL' || jsonManager.getGraph().parameters.op_param_library === 'C SMPLX') {
                            formData.append("file", blobCode, jsonManager.getGraph().name + ".c");
                        } else {
                            formData.append("file", blobCode, jsonManager.getGraph().name + ".py");
                        }

                        fetch("/ROOT/api/execute", {
                            method: "POST",
                            body: formData
                        })
                        .then(res => res.blob())
                        .then(blobReport => {  
                            blobReport.text().then(text => {
                                jsonManager.getGraph().report = text;
                                    const textArea = document.getElementById("text-show");
                                    if (textArea) {
                                        textArea.value = text;
                                        const blobReport = new Blob([text], { type: "text/plain" });
  
                                    }
                                });
                        })
                        .catch(error => {
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
