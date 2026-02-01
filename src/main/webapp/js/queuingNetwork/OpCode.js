/*
 * author: Marcela Tiemi Shinzato
 */
require.config({
    paths: {
        JSZip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min"
    }
});

define(["jquery", "LightBoxManager", "Cons", "JSZip", "JsonManager"],
function($, lightBoxManager, cons, JSZip, jsonManager) {
    "use strict";

    var lastAction = null;

    var OpCode = {
        initialize: function() {
            const btn = document.getElementById("op-code");
            btn.style.opacity = '0.3';
            btn.style.pointerEvents = 'none';
            
            window.addEventListener("genClicked", () => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
            $(document).on("click", "#op-code-bt-close", function() {
                lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
            });

            $(document).on("click", "#op-code-bt-ok", function() {
                const textArea = document.getElementById("text-editor");
                if (textArea) {
                    window.codeBlob = new Blob([textArea.value], { type: "text/plain" });
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                }
            });

            $(document).on("click", "#op-code-download", function() {
                const textArea = document.getElementById("text-editor");
                if (textArea) {
                    const codeBlob = new Blob([textArea.value], { type: "text/plain" });
                    window.codeBlob = codeBlob;
                    const url = URL.createObjectURL(codeBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    
                    if(jsonManager.getGraph().parameters["op-param-library"] === 'Java')
                    {
                        const newZip = new JSZip();
                        window.filesList.forEach(file => {
                            if (file.name !== "Controle.java") {
                                newZip.file(file.name, file.content);
                            }
                        });
                        newZip.file("Controle.java", codeBlob);
                        newZip.generateAsync({ type: "blob" })
                        .then(blob => {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = jsonManager.getGraph().name + ".zip";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }); 
                    } 
                    else 
                    {
                        a.download = jsonManager.getGraph().codeName;
                    }
                    
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        },

        execute: function() {              
            lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=editor",
                function() {
                    const graphBlob = window.graphBlob;

                    if (graphBlob) {
                        const formData = new FormData();
                        formData.append("file", graphBlob, jsonManager.getGraph().name + ".gv");
                        const opParam = document.querySelector("#op-param-library");
                        if(jsonManager.getGraph().parameters["op-param-library"])formData.append('lang', jsonManager.getGraph().parameters["op-param-library"]);
                        else formData.append('lang', 'Python');
                        fetch("/ROOT/api/sendcode", {
                            method: "POST",
                            body: formData
                        })
                        .then(response => {
                            if (response.ok) window.dispatchEvent(new Event("codeEditorClicked"));
                            return response.blob();
                        })
                        .then(blobCode => {         
                            if(jsonManager.getGraph().parameters["op-param-library"] === 'Python' || jsonManager.getGraph().parameters["op-param-library"] === 'R' || !jsonManager.getGraph().parameters["op-param-library"])
                            {
                                blobCode.text().then(text => {
                                    const textArea = document.getElementById("textEditor");
                                    if (textArea) {
                                        textArea.value = text;
                                        const blobCode = new Blob([text], { type: "text/plain" });
                                        window.codeBlob = blobCode;
                                        jsonManager.getGraph().code = text;
                                    }
                                });
                            }
                            else if(jsonManager.getGraph().parameters["op-param-library"] === 'Java')
                            {
                                JSZip.loadAsync(blobCode).then(zip => {
                                    const file = zip.file("Controle.java");
                                    if (!file) {
                                        throw new Error("File Controle.java not found in zip");
                                    }
                                    return file.async("text");
                                })
                                .then(textContent => {
                                    const textArea = document.getElementById("textEditor");
                                    if (textArea) {
                                        textArea.value = textContent;
                                        const blobCode = new Blob([textArea.value], { type: "text/plain" });
                                        window.codeBlob = blobCode;
                                        jsonManager.getGraph().code = textContent;
                                    }
                                });
                                JSZip.loadAsync(blobCode)
                                .then(zip => {
                                    const javaFiles = [];
                                    zip.forEach((path, file) => {
                                        if (file.name.endsWith(".java")) {
                                            javaFiles.push(file.async("text").then(text => ({
                                                name: file.name,
                                                content: text
                                            })));
                                        }
                                    });
                                    return Promise.all(javaFiles);
                                }).then(filesList => {
                                    window.filesList = filesList;
                                });
                            }
                            else
                            {
                                blobCode.text().then(text => {
                                    const textArea = document.getElementById("textEditor");
                                    if (textArea) {
                                        textArea.value = text;
                                        const blobCode = new Blob([text], { type: "text/plain" });
                                        window.codeBlob = blobCode;
                                        jsonManager.getGraph().code = text;
                                    }
                                });
                            }
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
