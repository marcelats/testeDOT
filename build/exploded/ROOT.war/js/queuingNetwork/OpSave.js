/*
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */
define(["jquery", "LightBoxManager", "JsonManager", "Cons", "OpSaveAs", "Utils"],
    function($, lightBoxManager, jsonManager, cons, opSaveAs, utils) {
        "use strict";

        var lastAction = null, callback = null;

        var OpSave = {
            
            execute: function(action) {
                jsonManager.nameCodeReport();
                const filename = jsonManager.getGraph().name;
                if(filename === "untitled") 
                {
                    opSaveAs.execute(); 
                    return OpSave;
                }
                console.log(jsonManager.stringifyGraph());
                $.ajax({
                    url: 'qnetwork?cmd=verify',
                    type: 'POST',
                    data: { filename: filename, graphJson: jsonManager.stringifyGraph(), 
                        gvFile: jsonManager.getGraph().gv, codeFile: jsonManager.getGraph().code, 
                        reportFile: jsonManager.getGraph().report, reportName: jsonManager.getGraph().reportName,
                        codeName: jsonManager.getGraph().codeName},
                    success: function () {
                        lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                        jsonManager.setSaved(true);
                        document.title = "ASDA - "+ filename;
                    },
                    error: function (err) {
                        lightBoxManager.showAlert('Error while verifying graph.');
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
