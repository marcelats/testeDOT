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
                const graph = jsonManager.getGraph();
                $.ajax({
                    url: 'qnetwork?cmd=verify',
                    type: 'POST',
                    data: { 
                        filename: filename, 
                        graphJson: jsonManager.stringifyGraph(), 
                        gvFile: graph.gv, 
                        codeFile: graph.code, 
                        reportFile: graph.report, 
                        reportName: graph.reportName,
                        codeName: graph.codeName},
                    success: function () {
                        lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);
                        jsonManager.setSaved(true);
                        document.title = "ASDA - "+ filename;
                    },
                    error: function (err) {
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
