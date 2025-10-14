/* global arrivals */

define(["jquery", "JsonManager", "LightBoxManager"],
function($, jsonManager, lightBoxManager) {
    "use strict";
    var indexAtual = 0;
    
    var prob = {
        
        execute: function (id) {
            var self = this;

            const mapTargets = jsonManager.getGraph().mapNodes[id].mapTargets;
    console.log(jsonManager.getGraph().mapNodes[id].mapTargets);
    const keys = Object.keys(mapTargets);
    console.log(keys);
    const key = keys[indexAtual];
    console.log(key);
    const value = mapTargets[key];
    console.log(value);
    const lastIndex = keys.length - 1;
    console.log(lastIndex);
    const prob_value = document.getElementById("target_server");
    console.log(indexAtual);
                if (indexAtual === lastIndex) {
                    console.log("→ Este é o último elemento!");
                    indexAtual = 0;
                    document.getElementById("saida").textContent = key;
                    prob_value.disabled = true;
                    prob_value.value = 100 - Object.values(mapTargets).reduce((total, valor) => total + parseFloat(valor), 0) + mapTargets[key];
                    $(document).off("click", "#prob-btSubmit");
                    $(document).on("click", "#prob-btSubmit", function() {
                        lightBoxManager.closeBox("shadow3","boxProb");
                    });
                    mapTargets[key] = parseFloat(prob_value.value);
                    console.log(indexAtual);
                    return;
                }
                
                else
                {
                    console.log("nao eh o ultimo elemento");
                    exibirAtual(keys, mapTargets, indexAtual, prob_value);
                    console.log(indexAtual);
                    //document.getElementById("saida").textContent = key;
                    //prob_value.disabled = false;
                    //prob_value.value = value;
                    $(document).off("click", "#prob-btSubmit");
                    $(document).on("click", "#prob-btSubmit", function() {
                        const entries = Object.entries(mapTargets).sort(([a], [b]) => a - b); // garante a ordem numérica das chaves

                        let soma = 0;
                        for (const [k, valor] of entries) {
                            if (k == key) break;
                            soma += parseFloat(valor);
                             // para quando chegar na chave desejada
                        }
                        if (isNaN(prob_value.value) || prob_value.value < 0) {
                            alert("Probability cannot be negative and must be a number.");
                            return;}
                        if(soma + parseFloat(prob_value.value) > 100){
                            console.log(mapTargets);
                            console.log(parseFloat(prob_value.value));
                            console.log(mapTargets[key]);
                            alert("The sum of probabilities for each node cannot exceed 100.");
                            self.execute(id);
                            /*this.onclick = function() {
                                console.log("this.onclick");
                                    const input = document.getElementById("target_server");
                                    const novoValor = parseFloat(input.value);
                                    if (!isNaN(novoValor)) {
                                        mapTargets[key] = novoValor;
                                        
                                        //input.value = "";
                                        //input.style.display = "none";
                                        this.onclick = null; // remove override
                                        document.getElementById("prob-btSubmit").addEventListener("click", arguments.callee);
                                        exibirAtual(keys, mapTargets, indexAtual, prob_value);
                                    } else {
                                        alert("Input a valid value");
                                    }
                                };*/
                            }
                        else
                        {
                            console.log("a soma nao excedeu");
                            mapTargets[key] = parseFloat(prob_value.value);
                            indexAtual += 1;
                            self.execute(id);
                            return;
                        }
                        
                    });
                }
                
            //document.getElementById("saida").textContent = key;
            //prob_value.disabled = false;
            //prob_value.value = value;
        }
        
        /*execute: function (id) {

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = mapTargets[key];
                
                console.log("Chave:", key, "Valor:", value);
                const prob_value = document.getElementById("target_server");
                if (i === lastIndex) {
                    console.log("→ Este é o último elemento!");
                    document.getElementById("saida").textContent = key;
                    prob_value.disabled = true;
                    prob_value.value = 100 - Object.values(mapTargets).reduce((total, valor) => total + valor, 0);
                    $(document).on("click", "#prob-btSubmit", function() {
                        lightBoxManager.closeBox("shadow3","boxProb");
                    });
                }
                else
                {
                    document.getElementById("saida").textContent = key;
                    prob_value.disabled = false;
                    prob_value.value = value;
                    $(document).on("click", "#prob-btSubmit", function() {
                        if(Object.values(mapTargets).reduce((total, valor) => total + valor, 0) + prob_value.value > 100)
                            alert("The sum of probabilities for each node cannot exceed 100.");
                        else
                        {
                            mapTargets[key] = prob_value.value;
                        }
                    });
                }
            }


            //obter id do no (hidden field)
            //obter jsonManager.getGraph().mapNodes[id].mapTargets
            //para cada mapTarget obter key e value
            //
            //se estamos no ultimo elemento de mapTargets 
            //(acho que pode incrementar um i e comparar com mapTargets.length)
            //o input fica disabled e eh calculado como 100 - soma(mapTargets)
            //o ok fecha a box
            //
            //senao
            //key e mostrada no jsp e value na caixa de input editavel
            //cada vez que o usuario clica em ok verifica se soma(maptargets)>100
            //se sim, emite aviso 
            //se nao, altera maptarget[key] e passa para o proximo target
            
            
        },*/       
    };
    
    function exibirAtual(keys, mapTargets, indexAtual, prob_value) {
        const key = keys[indexAtual];
        const value = mapTargets[key];
        document.getElementById("saida").textContent = key;
        prob_value.disabled = false;
        prob_value.value = value;
    }

    return prob;
});


