/*
 * author: Marcela Tiemi Shinzato
 */

define(["LightBoxManager", "Cons"],
function(lightBoxManager, cons) {
    "use strict";

    var lastAction = null;

    var OpHelp = {

        execute: function() {              
            lightBoxManager.openBox(cons.SHADOWING, cons.BOX_CONTAINER,
                "qnetwork?cmd=open-box&type=help",
                function() {
                }
            );
        },

        getLastAction: function() {
            return lastAction;
        }
    };

    return OpHelp;
});

