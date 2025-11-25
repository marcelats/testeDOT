define(["jquery", "LightBoxManager", "JsonManager", "Cons", "OpSaveAs"],
    function($, lightBoxManager, jsonManager, cons, opSaveAs) {
        "use strict";

        var lastAction = null, callback = null;

        var OpSave = {
            
            execute: function(action) {
                
                    //lastAction = action;
                    
                    
                        var filename = jsonManager.getGraph().name; 
                            //jsonManager.setName(filename);
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
if(filename === "untitled") {opSaveAs.execute(); return OpSave;}

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
                                    console.log("success save");
                                },
                                error: function (err) {
                                    console.error('Erro:', err);
                                    alert('Error while verifying graph.');
                                }
                            });
                        
                        
                        if (typeof callback === "function") {
                            callback();
                            callback = null;
                        }
                    
                
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpSave;
    }
);
