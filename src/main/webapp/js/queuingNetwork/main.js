require(["jquery", "DrawArea", "PropertiesArea", "TopOptions", "ActiveTool", "ElementManager", "JqueryPlugins", "Cons", "JsonManager", "domReady!"],
    function($, drawArea, propertiesArea, topOptions, activeTool, ElementManager, jqueryPlugins, cons, jsonManager) {
        "use strict";

        $("#" + cons.CENTER).height(($(window).height() -
            $("#" + cons.TOP).height() - $("#" + cons.BOTTOM).height()));
        $("#" + cons.DRAW_AREA).width(($(window).width() -
            $("#" + cons.LEFT_TOOLS).outerWidth()));

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
            $("#opSaveAs").click(function() {
                topOptions.ctrl("saveAs");
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
            /*const seed = document.getElementById("seed");
            if (seed) {
                seed.style.opacity = allowed.includes(selected) ? '0.3' : '1';
                seed.style.pointerEvents = allowed.includes(selected) ? 'none' : 'auto';
                seed.tabIndex = allowed.includes(selected) ? -1 : 0;
                seed.disabled = allowed.includes(selected) ? true : false;
            }  */

            //document.getElementById("opParam_execTime").disabled = true;
            //document.getElementById("opParam_maxEntities").disabled = true;
            document.getElementById("opParam_definedValue").disabled = true;
            //const execTimeInput = document.getElementById("opParam_execTime");
            //const maxEntitiesInput = document.getElementById("opParam_maxEntities");
            const definedValueInput = document.getElementById("opParam_definedValue");

            function atualizarModelType() {
                //execTimeInput.disabled = !document.getElementById("opParam_execTimeOp").checked;
                //maxEntitiesInput.disabled = !document.getElementById("opParam_maxEntitiesOp").checked;
            }

            function atualizarWarmup() {
                definedValueInput.disabled = !document.getElementById("opParam_timeDefined").checked;
            }

            const radios = document.querySelectorAll("input[name='modeltype']");
            if(radios){radios.forEach(radio => radio.addEventListener("change", atualizarModelType));}

            const radioswarmup = document.querySelectorAll("input[name='warmupTime']");
            if(radioswarmup){radioswarmup.forEach(radio => radio.addEventListener("change", atualizarWarmup));}

            atualizarModelType();
            atualizarWarmup();

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
            
            const warmup = document.getElementById("warmup_fieldset");
            if(warmup) if(allowed.includes(selected)) warmup.disabled = false;
            else warmup.disabled = true;

            const fieldset = document.getElementById("queueStatsFieldset");
            if (fieldset) {
                if(allowed.includes(selected)) 
                {
                    fieldset.disabled = false;
                    fieldset.style.opacity = '1';
                    fieldset.style.pointerEvents = 'auto';
                    fieldset.tabIndex = 0;
                }
                else
                {
                    fieldset.disabled = true;
                    fieldset.style.opacity = '0.3';
                    fieldset.style.pointerEvents = 'none';
                    fieldset.tabIndex = -1;
                }
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
            if(allowed.includes(selected)){Object.values(jsonManager.getGraph().mapNodes).forEach(node => {
    const props = node.properties;
    const campos = [
        "arrival_distribution",
        "ms_arrival_distribution",
        "server_distribution",
        "multiServer_distribution"
    ];

    campos.forEach(key => {
        if (props[key] && ["HyperExponential", "Erlang"].includes(props[key])) {
            props[key] = "Exponential";
        }
    });
});

}
            const arrival_sequence = document.getElementById("arrival_sequence");
            if (arrival_sequence) {
                if(allowed.includes(selected)){          
                    arrival_sequence.disabled = false;
                    arrival_sequence.style.opacity = '1';
                    arrival_sequence.style.pointerEvents = 'auto';
                    arrival_sequence.tabIndex = 0;
                } 
                else{
                    arrival_sequence.disabled = true;
                    arrival_sequence.style.opacity = '0.3';
                    arrival_sequence.style.pointerEvents = 'none';
                    arrival_sequence.tabIndex = -1;
                } 
            }
            const server_sequence = document.getElementById("server_sequence");
            if (server_sequence) {
                if(allowed.includes(selected)){
                    server_sequence.disabled = false;
                    server_sequence.style.opacity = '1';
                    server_sequence.style.pointerEvents = 'auto';
                    server_sequence.tabIndex = 0;
                }else{
                    server_sequence.disabled = true;
                    server_sequence.style.opacity = '0.3';
                    server_sequence.style.pointerEvents = 'none';
                    server_sequence.tabIndex = -1;
                }
            }
            const ms_arrival_sequence = document.getElementById("ms_arrival_sequence");
            if (ms_arrival_sequence) {
                if(allowed.includes(selected)){          
                    ms_arrival_sequence.disabled = false;
                    ms_arrival_sequence.style.opacity = '1';
                    ms_arrival_sequence.style.pointerEvents = 'auto';
                    ms_arrival_sequence.tabIndex = 0;
                } 
                else{
                    ms_arrival_sequence.disabled = true;
                    ms_arrival_sequence.style.opacity = '0.3';
                    ms_arrival_sequence.style.pointerEvents = 'none';
                    ms_arrival_sequence.tabIndex = -1;
                } 
            }
            const multiServer_sequence = document.getElementById("multiServer_sequence");
            if (multiServer_sequence) {
                if(allowed.includes(selected)){
                    multiServer_sequence.disabled = false;
                    multiServer_sequence.style.opacity = '1';
                    multiServer_sequence.style.pointerEvents = 'auto';
                    multiServer_sequence.tabIndex = 0;
                }else{
                    multiServer_sequence.disabled = true;
                    multiServer_sequence.style.opacity = '0.3';
                    multiServer_sequence.style.pointerEvents = 'none';
                    multiServer_sequence.tabIndex = -1;
                }
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

            // Dentro desse fieldset, procura o elemento com a classe server_stdDeviation
            const server_sd = document.getElementById("server_stdDeviation");

            if (!server_sd) {
                console.warn("server_sd não encontrado no mesmo fieldset.");
                return;
            }

            if (selected !== "Exponential") {
                console.log("não exponential");
                server_sd.style.opacity = "1";
                server_sd.style.pointerEvents = "auto";
                server_sd.tabIndex = 0;
                server_sd.disabled = false;
            } else {
                console.log("exponential");
                server_sd.style.opacity = "0.3";
                server_sd.style.pointerEvents = "none";
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
            if (selected !== 'Exponential') {
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

            const multiserver_sd = document.getElementById("multiServer_stdDeviation");
            if (!multiserver_sd) {
                console.warn("server_sd não encontrado.");
                return;
            }
            if (selected !== 'Exponential') {
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
            const msarrival_sd = document.getElementById("ms_arrival_stdDeviation");
            if (!msarrival_sd) {
                console.warn("server_sd não encontrado.");
                return;
            }
            if (selected !== 'Exponential') {
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
                //window.langSelecionada = opParam.value;
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
            console.log("attachSSListener");
            if (distribution.dataset.listenerAttached === "true") return;
            console.log("sem listener attached");
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

        function observeOpParam() {
            const check = () => {
                const opParam = document.querySelector("#opParam_library");
                if (opParam) {
                    attachOpParamListener(opParam);
                    applyVisibilityLogic();
                }
            };

            check();

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

            check();

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
        
        function observeVisibilityTargets() {
            const observer = new MutationObserver(() => {
                applyVisibilityLogic();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        
        observeOpParam();
        observeSS();
        observeSA();
        observeMSS();
        observeMSA();
        observeVisibilityTargets();

        $("#textEditor").parent().css({
            width: "900px",
            maxWidth: "none"
        });
    });
