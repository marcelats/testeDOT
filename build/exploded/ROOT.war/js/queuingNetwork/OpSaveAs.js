define(["jquery", "LightBoxManager", "JsonManager", "Cons"],
    function($, lightBoxManager, jsonManager, cons) {
        "use strict";

        var lastAction = null, callback = null;

        var OpSaveAs = {
            initialize: function() {
                /* Close button of the light box. */
                $(document).on("click", "#opSaveAs-btClose", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#opSaveAs-btSubmit", function() {
                    OpSaveAs.execute("submit");
                });
                document.addEventListener("click", function(e) {
                    if (e.target && e.target.classList.contains("file-item-save")) {
                        var filename = e.target.getAttribute("data-filename");
                        console.log("filename:", filename);
                        document.getElementById("opSaveAs-filename").value = filename;
                    }
                });
            },
            execute: function(action) {
                if (typeof action !== "string") {
                    this.callback = action;
                    console.log(this.callback);
                    console.trace("OpSaveAs: set callback trace");
                    lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                        "qnetwork?cmd=open-box&type=saveAs", function() {
                        $("#opSaveAs-filename").focus();
                    });

                    

                } else {
                    lastAction = action;
                    
                    if (action === "submit") {
                        var filename = $("#opSaveAs-filename").val(),
                            re = new RegExp(cons.REG_EXP_FILENAME);

                        if (filename.match(re) === null) {
                            alert("You need to enter a valid filename.");
                            
                        } 
                        else {
                            jsonManager.setName(filename);
                            //window.langSelecionada = document.getElementById("opParam_library").value;
                            //console.log(filename + "_" + window.langSelecionada + ".txt");
                            console.log(jsonManager.stringifyGraph());
                            //var codename, reportname;
                            if(jsonManager.getGraph().parameters.opParam_library === "Python") {
                                jsonManager.getGraph().code_name = filename + ".py";
                                jsonManager.getGraph().report_name = filename + "_Python.txt";
                            }
else if (jsonManager.getGraph().parameters.opParam_library === "Java") {
    jsonManager.getGraph().code_name = filename + ": Controle.java";
    jsonManager.getGraph().report_name = filename + "_Java.txt";
}

else if (jsonManager.getGraph().parameters.opParam_library === "R"){ 
    jsonManager.getGraph().code_name = filename + ".r";
    jsonManager.getGraph().report_name = filename + "_R.txt";
}
else if (jsonManager.getGraph().parameters.opParam_library === "C SMPL")
    {
        jsonManager.getGraph().code_name = filename + ".c";
        jsonManager.getGraph().report_name = filename + "_C_SMPL.txt";
    } 
else if (jsonManager.getGraph().parameters.opParam_library === "C SMPLX") 
    {
        jsonManager.getGraph().code_name = filename + ".c";
        jsonManager.getGraph().report_name = filename + "_C_SMPLX.txt";
    }
else {
    jsonManager.getGraph().code_name = filename;
    jsonManager.getGraph().report_name = filename;
}


//console.log(codename);

//console.log(filename);


                            $.ajax({
                                url: 'qnetwork?cmd=verify',
                                type: 'POST',
                                data: { filename: filename, graphJson: jsonManager.stringifyGraph(), 
                                    gv_file: jsonManager.getGraph().gv, code_file: jsonManager.getGraph().code, 
                                    report_file: jsonManager.getGraph().report, report_name: jsonManager.getGraph().report_name,
                                    code_name: jsonManager.getGraph().code_name},
                                success: function () {
                                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);

                                    jsonManager.setSaved(true);

                                    document.title = "ASDA - "+ filename;
                                    console.log(this.callback);
                    if (typeof this.callback === "function") {
                            this.callback();
                            this.callback = null;
                        }
                        console.trace("OpSaveAs: use callback trace");
                                },
                                error: function (err) {
                                    console.error('Erro:', err);
                                    alert('Error while verifying graph.');
                                }
                            });
                        }
                        
                        if (typeof this.callback === "function") {
                            this.callback();
                            this.callback = null;
                        }
                    }
                }
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpSaveAs;
    }
);