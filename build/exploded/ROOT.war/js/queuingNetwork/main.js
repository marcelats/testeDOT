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
    }
    
    const chegada = document.getElementById("chegada");
    if(chegada){
        chegada.style.opacity = allowed.includes(selected) ? '1' : '0.3';
        chegada.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
    }

    const multiServer = document.getElementById("multiServer");
    if (multiServer) {
      multiServer.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      multiServer.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
    }

    const fieldset = document.getElementById("queueStatsFieldset");
    if (fieldset) {
      fieldset.style.opacity = allowed.includes(selected) ? '1' : '0.3';
      fieldset.style.pointerEvents = allowed.includes(selected) ? 'auto' : 'none';
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
    } else {
      server_sd.style.opacity = '0.3';
      server_sd.style.pointerEvents = 'none';
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
    } else {
      arrival_sd.style.opacity = '0.3';
      arrival_sd.style.pointerEvents = 'none';
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
    } else {
      multiserver_sd.style.opacity = '0.3';
      multiserver_sd.style.pointerEvents = 'none';
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
    } else {
      msarrival_sd.style.opacity = '0.3';
      msarrival_sd.style.pointerEvents = 'none';
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
  
    /*const fieldset = document.getElementById("queueStatsFieldset");
    if (fieldset) {
        console.log("fieldset encontrado");
      fieldset.style.opacity = '0.3';
      fieldset.style.pointerEvents = 'none';
    }else{console.log("fieldset nao encontrado");}*/
    });
