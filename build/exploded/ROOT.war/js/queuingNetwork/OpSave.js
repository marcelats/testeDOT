define(["jquery", "LightBoxManager", "JsonManager", "Cons", "OpOpen"],
    function($, lightBoxManager, jsonManager, cons, opOpen) {
        "use strict";

        var lastAction = null, callback = null;

        var OpSave = {
            initialize: function() {
                /* Close button of the light box. */
                $(document).on("click", "#opSave-btClose", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#opSave-btSubmit", function() {
                    OpSave.execute("submit");
                });
                document.addEventListener("click", function(e) {
                    if (e.target && e.target.classList.contains("file-item-save")) {
                        var filename = e.target.getAttribute("data-filename");
                        console.log("filename:", filename);
                        document.getElementById("opSave-filename").value = filename;
                    }
                });
            },
            execute: function(action) {
                if (typeof action !== "string") {
                    lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                        "qnetwork?cmd=open-box&type=save", function() {
                        $("#opSave-filename").focus();
                    });

                    callback = action;

                } else {
                    lastAction = action;
                    
                    if (action === "submit") {
                        var filename = $("#opSave-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);

                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                            
                        } 
                        else {
                            jsonManager.setName(filename);
                            console.log(filename + "_" + window.langSelecionada + ".txt");
                            console.log(jsonManager.stringifyGraph());
                            var codename;
                            if(window.langSelecionada === "Python") codename = filename + ".py";
else if (window.langSelecionada === "Java") codename = filename + ": Controle.java";
else if (window.langSelecionada === "R") codename = filename + ".r";
else if (window.langSelecionada === "C SMPL" || window.langSelecionada === "C SMPLX") codename = filename + ".c";
else codename = filename;
console.log(codename);
var reportname;
                            if(window.langSelecionada === "Python") reportname = filename + "_Python.txt";
else if (window.langSelecionada === "Java") reportname = filename + "_Java.txt";
else if (window.langSelecionada === "R") reportname = filename + "_R.txt";
else if (window.langSelecionada === "C SMPL") reportname = filename + "_C_SMPL.txt";
else if (window.langSelecionada === "C SMPLX") reportname = filename + "_C_SMPLX.txt";
else codename = filename;


                            $.ajax({
                                url: 'qnetwork?cmd=verify',
                                type: 'POST',
                                data: { filename: filename, graphJson: jsonManager.stringifyGraph(), 
                                    gv_file: window.gv, code_file: window.code, 
                                    report_file: window.report, report_name: filename + "_" + window.langSelecionada + ".txt",
                                    code_name: codename},
                                success: function () {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);

                                    jsonManager.setSaved(true);

                                    document.title = "ASDA - "+ filename;
                                },
                                error: function (err) {
                                    console.error('Erro:', err);
                                    alert('Error while verifying graph.');
                                }
                            });
                        }
                        
                        if (typeof callback === "function") {
                            callback();
                            callback = null;
                        }
                    }
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpSave;
    }
);