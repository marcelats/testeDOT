/*
 * (Singleton) Top options controller.
 * 
 * author: Felipe Osorio Thomé
 */

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
  if (e.target && e.target.classList.contains("file-item")) {
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
                            alert("You need enter a valid filename.");
                            
                        //console.log(jsonManager.);
                            
                        } 
                        
                        
                        
                        else {
                            $.ajax({
  url: 'qnetwork?cmd=verify',
  type: 'POST',
  data: { filename: filename, graphJson: jsonManager.stringifyGraph() },
  success: function (res) {
    // res agora é um objeto JSON com a propriedade "existe"
    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);

                    jsonManager.setSaved(true);

                    document.title = filename;
  },
  error: function (err) {
    console.error('Erro:', err);
    alert('Erro ao verificar o graph.');
  }
});

                            //save(filename);
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

        /* --- Private methods. --- */

        function save(filename) {
            var tempFilename = jsonManager.getName();

            jsonManager.setName(filename);

            $.ajax({
                url: "qnetwork?cmd=save",
                type: "POST",
                data: "graphJson=" + jsonManager.stringifyGraph(),
                async: false,
                success: function() {
                    lightBoxManager.closeBox(cons.SHADOWING, cons.BOX_CONTAINER);

                    jsonManager.setSaved(true);

                    document.title = filename;
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    var errorHeader = xhr.getResponseHeader('fot-error');

                    jsonManager.setName(tempFilename);

                    if (errorHeader != null) {
                        alert(errorHeader);
                    } else {
                        alert(thrownError);
                    }
                }
            });
        }


        return OpSave;
    }
);