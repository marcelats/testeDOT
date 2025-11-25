/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */

define(["jquery", "LightBoxManager", "JsonManager", "Cons", "IdManager", "jsPlumb"],
    function($, lightBoxManager, jsonManager, cons, idManager, jsPlumb) {
        "use strict";

        var lastAction = null, callback = null;

        var OpNew = {
            initialize: function(opSaveAs) {
                this.opSaveAs = opSaveAs;
                /* Close button of the light box. */
                $(document).on("click", "#opNew-btClose", function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                });

                $(document).on("click", "#opNew-btYes", function() {
                    OpNew.execute("yes");
                });

                $(document).on("click", "#opNew-btNo", function() {
                    OpNew.execute("no");
                });

                $(document).on("click", "#opNew-btCancel", function() {
                    OpNew.execute("cancel");
                });
            },
            execute: function(action) {
                if (!jsonManager.isSaved()) {
                    if (typeof action !== "string") {
                        lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                            "qnetwork?cmd=open-box&type=new");

                        callback = action;
                        console.log(callback);

                    } else {
                        lastAction = action;
                        
                        lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);

                        if (action === "yes") {
                            if(jsonManager.getGraph().name === "untitled") this.opSaveAs.execute(callback);
                            else {var filename = jsonManager.getGraph().name; 
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
if(filename === "untitled") {console.log(callback);this.opSaveAs.execute(callback); }else{

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
                                    jsonManager.clearGraph();
                    //window.gv = "";
                    //window.code = "";
                    //window.report = "";
                    jsonManager.setSaved(true);
                    idManager.setStartCid(-1);
                    $("#" + cons.DRAW_AREA).empty();
                    jsPlumb.reset(); 
                    document.title = "ASDA";
                    const btnCode = document.getElementById("opCode");
                    btnCode.style.opacity = '0.3';
                    btnCode.style.pointerEvents = 'none';
                    const btnExecute = document.getElementById("opExecute");
                    btnExecute.style.opacity = '0.3';
                    btnExecute.style.pointerEvents = 'none';
                    window.flag = false;
                    //lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    console.log(callback);
                    if (typeof callback === "function") {
                        
                            callback();
                            callback = null;
                        }
                    //return;
                                },
                                error: function (err) {
                                    console.error('Erro:', err);
                                    alert('Error while verifying graph.');
                                }
                            });
}
                        
                        /*if (typeof callback === "function") {
                            callback();
                            callback = null;
                        }*/
                    
                }//console.log(callback);if (typeof callback === "function") {
                 //           callback();
                 //           callback = null;
                 //       }

                        } else if (action === "no") {
                            jsonManager.clearGraph();
                            //window.gv = "";
                            //window.code = "";
                            //window.report = "";
                            jsonManager.setSaved(true);
                            $("#" + cons.DRAW_AREA).empty();
                            idManager.setStartCid(-1);
                            jsPlumb.reset(); 
                            document.title = "ASDA";
                            const btnCode = document.getElementById("opCode");
                            btnCode.style.opacity = '0.3';
                            btnCode.style.pointerEvents = 'none';
                            const btnExecute = document.getElementById("opExecute");
                            btnExecute.style.opacity = '0.3';
                            btnExecute.style.pointerEvents = 'none';
                            window.flag = false;
                            lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                            //return;
                            console.log(callback);
                            if (typeof callback === "function") {
                            callback();
                            callback = null;
                        }
                        }else{console.log(callback);if (typeof callback === "function") {
                            callback();
                            callback = null;
                        }}

                        
                    }
                    
                } else {
                    jsonManager.clearGraph();
                    //window.gv = "";
                    //window.code = "";
                    //window.report = "";
                    jsonManager.setSaved(true);
                    idManager.setStartCid(-1);
                    $("#" + cons.DRAW_AREA).empty();
                    jsPlumb.reset(); 
                    document.title = "ASDA";
                    const btnCode = document.getElementById("opCode");
                    btnCode.style.opacity = '0.3';
                    btnCode.style.pointerEvents = 'none';
                    const btnExecute = document.getElementById("opExecute");
                    btnExecute.style.opacity = '0.3';
                    btnExecute.style.pointerEvents = 'none';
                    window.flag = false;
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                    //return;
                    //console.log(callback);
                    if (typeof callback === "function") {
                            callback();
                            callback = null;}
                }
                
                
            },
            getLastAction: function() {
                return lastAction;
            }
        };

        return OpNew;
    }
);