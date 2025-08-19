/*
 * author: Felipe Osorio Thomé
 */

require(["jquery", "DrawArea", "PropertiesArea", "TopOptions", "ActiveTool", "ElementManager", "JqueryPlugins", "Cons", "domReady!"],
    function($, drawArea, propertiesArea, topOptions, activeTool, ElementManager, jqueryPlugins, cons) {
        "use strict";

        /*
         * Fill the entire window.
         * Before, I had used css calc function, but when the window has the properties div opened
         * the calc was replaced by a value calculated by jquery and this breaks the layout.
         * Sorry for this, but I did not find any better solution to accomplish this "dynamic fill".
         */
        $("#" + cons.CENTER).height(($(window).height() -
            $("#" + cons.TOP).height() - $("#" + cons.BOTTOM).height()));
        $("#" + cons.DRAW_AREA).width(($(window).width() -
            $("#" + cons.LEFT_TOOLS).outerWidth()));

        /* On resize must be recalculated */
       $(window).resize(function() {
            var propertiesAreaWidth;

            $("#" + cons.CENTER).height(($(window).height() -
                $("#" + cons.TOP).height() - $("#" + cons.BOTTOM).height()));

            if ($("#" + cons.PROPERTIES_AREA).css("display") !== "none") {
                propertiesAreaWidth = $("#" + cons.PROPERTIES_AREA).width();
            } else {
                propertiesAreaWidth = 0;
            }

            $("#" + cons.DRAW_AREA).width(($(window).width() -
                $("#" + cons.LEFT_TOOLS).outerWidth() - propertiesAreaWidth));
        });

        /* Creating an instance of ElementManager. */
        var elementManager = new ElementManager(cons.FOLDER, cons.FORMAT, cons.DRAW_AREA);
        
        /* Initializing the three app main sectors. */
        topOptions.initialize(elementManager);
        drawArea.initialize(elementManager);
        propertiesArea.initialize();
        /* Initializing jquery plugins. */
        jqueryPlugins.initialize();
        const btn = document.getElementById("multiServer");
            btn.style.opacity = '0.3';
            btn.style.pointerEvents = 'none';
            btn.tabIndex = -1;
            
        /* Registering main events. */
        var eventMap = function() {
            /* topMenu event map */
            $("#opNew").click(function() {
                topOptions.ctrl("new");
            });
            $("#opSave").click(function() {
                topOptions.ctrl("save");
            });
            $("#opOpen").click(function() {
                topOptions.ctrl("open");
            });
            $("#opParam").click(function() {
                topOptions.ctrl("parameters");
            });
            $("#opGen").click(function() {
                topOptions.ctrl("generate");
            });
            $("#opExecute").click(function() {
                topOptions.ctrl("execute");
            });
            $("#opCode").click(function() {
                topOptions.ctrl("code");
            });
            $("#opManual").click(function() {
                topOptions.ctrl("manual");
            });

            /* leftMenu event map */
            $("#server").click(function() {
                activeTool.setTool("server");
            });
            $("#multiServer").click(function() {
                activeTool.setTool("multiServer");
            });
            $("#source").click(function() {
                activeTool.setTool("source");
            });
            $("#out").click(function() {
                activeTool.setTool("out");
            });
            $("#link").click(function() {
                activeTool.setTool("link");
            });
            $("#erase").click(function() {
                activeTool.setTool("erase");
            });

            /* The drawArea click event mapping */
            $("#drawArea").click(function(event) {
                drawArea.ctrl(event);
            });

            $(document).bind('ajaxComplete', function(event, xhr, options) {
                var redirectHeader = xhr.getResponseHeader('fot-redirect');

                if (xhr.readyState == 4 && redirectHeader != null) {
                    window.location.href = redirectHeader;
                }
            });
            
            
        }();
     
        const allowed = ['C SMPL', 'C SMPLX', 'C ParSMPL', 'C SIMPACK', 'C SIMPACK2'];
      
        function applyVisibilityLogic() {
    const opParam = document.querySelector("#opParam_library");
    if (!opParam) return;

    const selected = opParam.value;

    const seed = document.getElementById("seed");
    if (seed) {
      seed.style.opacity = allowed.includes(selected) ? '0.3' : '1';
      seed.style.pointerEvents = allowed.includes(selected) ? 'none' : 'auto';
      seed.tabIndex = allowed.includes(selected) ? -1 : 0;
      seed.disabled = allowed.includes(selected) ? true : false;
    }
    
    /*const opParam_closed = document.getElementById("opParam_closed");
    if (opParam_closed) {
      opParam_closed.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      opParam_closed.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      opParam_closed.tabIndex = allowed.includes(selected) ? 0 : -1;
      if(allowed.includes(selected)){opParam_closed.disabled = false;}
    }
    
    const opParam_open = document.getElementById("opParam_open");
    if (opParam_open) {
      opParam_open.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      opParam_open.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      opParam_open.tabIndex = allowed.includes(selected) ? 0 : -1;
      if(allowed.includes(selected)){opParam_open.disabled = false;}
    }*/
    
    const chegada = document.getElementById("chegada-bt");
    if(chegada){
        chegada.style.opacity = allowed.includes(selected) ? '1' : '0.3';
        chegada.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
        chegada.tabIndex = allowed.includes(selected) ? 0 : -1;
    }

    const multiServer = document.getElementById("multiServer");
    if (multiServer) {
      if(allowed.includes(selected)) multiServer.disabled = false;
      multiServer.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      multiServer.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      multiServer.tabIndex = allowed.includes(selected) ? 0 : -1;
    }

    const fieldset = document.getElementById("queueStatsFieldset");
    if (fieldset) {
      if(allowed.includes(selected)) fieldset.disabled = false;
      fieldset.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      fieldset.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      fieldset.tabIndex = allowed.includes(selected) ? 0 : -1;
      fieldset.disabled = allowed.includes(selected) ? false : true;
    }
    const arrivalSelect = document.getElementById("arrival_distribution");
    if(arrivalSelect){
        if(allowed.includes(selected)){
            for (let option of arrivalSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = false;
                }
            }
        }else{
            for (let option of arrivalSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = true;
                }
            }
            if (arrivalSelect.selectedOptions[0].disabled) {
                for (let opt of arrivalSelect.options) {
                    if (!opt.disabled) {
                        arrivalSelect.value = opt.value;
                        break;
                    }
                }
            }
        }
    }
    const serverSelect = document.getElementById("server_distribution");
    if(serverSelect){
        if(allowed.includes(selected)){
            for (let option of serverSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = false;
                }
            }
        }else{
            for (let option of serverSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = true;
                }
            }
            if (serverSelect.selectedOptions[0].disabled) {
                for (let opt of serverSelect.options) {
                    if (!opt.disabled) {
                        serverSelect.value = opt.value;
                        break;
                    }
                }
            }
        } 
    }
    const multiserverArrivalSelect = document.getElementById("ms_arrival_distribution");
    if(multiserverArrivalSelect){
        if(allowed.includes(selected)){
            for (let option of multiserverArrivalSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = false;
                }
            }
        }else{
            for (let option of multiserverArrivalSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = true;
                }
            }
            if (multiserverArrivalSelect.selectedOptions[0].disabled) {
                for (let opt of multiserverArrivalSelect.options) {
                    if (!opt.disabled) {
                        multiserverArrivalSelect.value = opt.value;
                        break;
                    }
                }
            }
        }
    }
        
    const multiserverSelect = document.getElementById("multiServer_distribution");
    if(multiserverSelect){
        if(allowed.includes(selected)){
            for (let option of multiserverSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                option.disabled = false;
                }
            }
        }else{
            for (let option of multiserverSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = true;
                }
            }
            if (multiserverSelect.selectedOptions[0].disabled) {
                for (let opt of multiserverSelect.options) {
                    if (!opt.disabled) {
                        multiserverSelect.value = opt.value;
                        break;
                    }
                }
            }
        }
    }
    const arrival_sequence = document.getElementById("arrival_sequence");
    if (arrival_sequence) {
        if(allowed.includes(selected)) arrival_sequence.disabled = false;
      arrival_sequence.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      arrival_sequence.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      arrival_sequence.tabIndex = allowed.includes(selected) ? 0 : -1;
    }
    const server_sequence = document.getElementById("server_sequence");
    if (server_sequence) {
        if(allowed.includes(selected)) server_sequence.disabled = false;
      server_sequence.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      server_sequence.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      server_sequence.tabIndex = allowed.includes(selected) ? 0 : -1;
    }
    
    const opParam_batchSize = document.getElementById("opParam_batchSize");
    if (opParam_batchSize) {
      opParam_batchSize.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      opParam_batchSize.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
      opParam_batchSize.tabIndex = allowed.includes(selected) ? 0 : -1;
    }
}

    function updateserver_sd(distribution) {
    const selected = distribution.value;
    console.log("Selecionado:", selected);

    const server_sd = document.getElementById("server_stdDeviation");
    if (!server_sd) {
      console.warn("server_sd não encontrado.");
      return;
    }
    if (selected!='Exponential') {
      server_sd.style.opacity = '1';
      server_sd.style.pointerEvents = 'auto';
      server_sd.tabIndex = 0;
      server_sd.disabled = false;
    } else {
      server_sd.style.opacity = '0.3';
      server_sd.style.pointerEvents = 'none';
      server_sd.tabIndex = -1;
      server_sd.disabled = true;
    }
  }

  function updatearrival_sd(distribution) {
    const selected = distribution.value;
    console.log("Selecionado:", selected);

    const arrival_sd = document.getElementById("arrival_stdDeviation");
    if (!arrival_sd) {
      console.warn("arrival_sd não encontrado.");
      return;
    }
    if (selected!='Exponential') {
      arrival_sd.style.opacity = '1';
      arrival_sd.style.pointerEvents = 'auto';
      arrival_sd.tabIndex = 0;
      arrival_sd.disabled = false;
    } else {
      arrival_sd.style.opacity = '0.3';
      arrival_sd.style.pointerEvents = 'none';
      arrival_sd.tabIndex = -1;
      arrival_sd.disabled = true;
    }
  }
  
  function updatemultiserver_sd(distribution) {
    const selected = distribution.value;
    console.log("Selecionado:", selected);

    const multiserver_sd = document.getElementById("multiServerSD");
    if (!multiserver_sd) {
      console.warn("server_sd não encontrado.");
      return;
    }
    if (selected!='Exponential') {
      multiserver_sd.style.opacity = '1';
      multiserver_sd.style.pointerEvents = 'auto';    
      multiserver_sd.tabIndex = 0;
      multiserver_sd.disabled = false;
    } else {
      multiserver_sd.style.opacity = '0.3';
      multiserver_sd.style.pointerEvents = 'none';
      multiserver_sd.tabIndex = -1;
      multiserver_sd.disabled = true;
    }
  }
  
  function updatemsarrival_sd(distribution) {
    const selected = distribution.value;
    console.log("Selecionado:", selected);

    const msarrival_sd = document.getElementById("multiServerArrivalSD");
    if (!msarrival_sd) {
      console.warn("server_sd não encontrado.");
      return;
    }
    if (selected!='Exponential') {
      msarrival_sd.style.opacity = '1';
      msarrival_sd.style.pointerEvents = 'auto';  
      msarrival_sd.tabIndex = 0;
      msarrival_sd.disabled = false;
    } else {
      msarrival_sd.style.opacity = '0.3';
      msarrival_sd.style.pointerEvents = 'none';
      msarrival_sd.tabIndex = -1;
      msarrival_sd.disabled = true;
    }
  }

  function attachOpParamListener(opParam) {
    if (opParam.dataset.listenerAttached === "true") return;

    opParam.addEventListener("change", () => {
      applyVisibilityLogic();
      console.log(`Linguagem selecionada: ${opParam.value}`);
      window.langSelecionada = opParam.value;
    });

    opParam.dataset.listenerAttached = "true";
  }
  
  function attachSAListener(distribution) {
    if (distribution.dataset.listenerAttached === "true") return;

    distribution.addEventListener("change", () => {
      updatearrival_sd(distribution);
      console.log(`Distribuicao selecionada: ${distribution.value}`);
    });

    distribution.dataset.listenerAttached = "true";
  }
  
  function attachSSListener(distribution) {
    if (distribution.dataset.listenerAttached === "true") return;

    distribution.addEventListener("change", () => {
      updateserver_sd(distribution);
      console.log(`Distribuicao selecionada: ${distribution.value}`);
    });

    distribution.dataset.listenerAttached = "true";
  }
  
  function attachMSAListener(distribution) {
    if (distribution.dataset.listenerAttached === "true") return;

    distribution.addEventListener("change", () => {
      updatemsarrival_sd(distribution);
      console.log(`Distribuicao selecionada: ${distribution.value}`);
    });

    distribution.dataset.listenerAttached = "true";
  }
  
  function attachMSSListener(distribution) {
    if (distribution.dataset.listenerAttached === "true") return;

    distribution.addEventListener("change", () => {
      updatemultiserver_sd(distribution);
      console.log(`Distribuicao selecionada: ${distribution.value}`);
    });

    distribution.dataset.listenerAttached = "true";
  }

  // Observa quando #opParam_library for inserido
  function observeOpParam() {
    const check = () => {
      const opParam = document.querySelector("#opParam_library");
      if (opParam) {
        attachOpParamListener(opParam);
        applyVisibilityLogic();
      }
    };

    check(); // Caso já esteja no DOM

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  function observeSS() {
    const check = () => {
      const distribution = document.querySelector("#server_distribution");
      if (distribution) {
        attachSSListener(distribution);
        updateserver_sd(distribution);
      }
    };

    check(); // Caso já esteja no DOM

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  function observeSA() {
    const check = () => {
      const distribution = document.querySelector("#arrival_distribution");
      if (distribution) {
        attachSAListener(distribution);
        updatearrival_sd(distribution);
      }
    };

    check(); // Caso já esteja no DOM

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  function observeMSS() {
    const check = () => {
      const distribution = document.querySelector("#multiServer_distribution");
      if (distribution) {
        attachMSSListener(distribution);
        updatemultiserver_sd(distribution);
      }
    };

    check(); // Caso já esteja no DOM

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  function observeMSA() {
    const check = () => {
      const distribution = document.querySelector("#ms_arrival_distribution");
      if (distribution) {
        attachMSAListener(distribution);
        updatemsarrival_sd(distribution);
      }
    };

    check(); // Caso já esteja no DOM

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Observa quando seed, multiServer e queueStatsFieldset forem inseridos
  function observeVisibilityTargets() {
    const observer = new MutationObserver(() => {
      applyVisibilityLogic(); // Executa quando qualquer nó novo entra no DOM
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Inicia as observações
  observeOpParam();
  observeSS();
  observeSA();
  observeMSS();
  observeMSA();
  observeVisibilityTargets();
  

document.addEventListener("DOMContentLoaded", function () {
    console.log("oi1");
    const fileItems = document.querySelectorAll('.file-item');
    const inputField = document.getElementById('opOpen-filename');

    fileItems.forEach(item => {
        console.log("oi2");
        item.addEventListener('click', function () {
            console.log("oi3");
            const fileName = this.getAttribute('data-filename');
            inputField.value = fileName;
        });
    });
});


  
    /*const fieldset = document.getElementById("queueStatsFieldset");
    if (fieldset) {
        console.log("fieldset encontrado");
      fieldset.style.opacity = '0.3';
      fieldset.style.pointerEvents = 'none';
    }else{console.log("fieldset nao encontrado");}*/
    });
