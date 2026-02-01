/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */

define(["OpNew", "OpSaveAs", "OpOpen", "OpParam", "OpGen", "OpCode", "OpExecute", "Arrival", "OpSave"],
    function(opNew, opSaveAs, opOpen, opParam, opGen, opCode, opExecute, arrival, opSave) {
        "use strict";
        var elementManager = null;
        var TopOptions = {
            initialize: function(manager) {
                elementManager = manager;
                opSaveAs.initialize();
                opNew.initialize(opSaveAs);
                opOpen.initialize(elementManager);
                opParam.initialize();
                opCode.initialize();
                opExecute.initialize();
                arrival.initialize();
            },
            ctrl: function(option) {
                if (option === "new") {
                    opNew.execute();
                } else if (option === "save") {
                    opSave.execute();
                } else if (option === "saveAs") {
                    opSaveAs.execute();
                } else if (option === "open") {
                    opOpen.execute();
                } else if (option === "parameters") {
                    opParam.execute();
                } else if (option === "generate") {
                    opGen.execute();
                } else if (option === "execute") {
                    opExecute.execute();
                } else if (option === "code") {
                    opCode.execute();
                } else if (option === "manual") {
                    //opHelp.execute();
                }
            }
        };

        return TopOptions;
    }
);