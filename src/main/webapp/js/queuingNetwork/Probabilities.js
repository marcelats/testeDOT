define(["jquery", "JsonManager", "LightBoxManager"],
function ($, jsonManager, lightBoxManager) {
    "use strict";

    var currentIndex = 0;

    var prob = {
        execute: function (id) {
            const box = document.getElementById("box-prob");
            if (!box) {
                return;
            }

            const output = box.querySelector("#output");
            const probValue = box.querySelector("#target-server");

            if (!output || !probValue) {
                return;
            }
            var self = this;

            const mapTargets = jsonManager.getGraph().mapNodes[id].mapTargets;
            const keys = Object.keys(mapTargets);
            const lastIndex = keys.length - 1;

            const key = keys[currentIndex];

            output.textContent = key;

            if (currentIndex === lastIndex) {
                probValue.disabled = true;

                const sum = Object.values(mapTargets)
                    .reduce((total, v) => total + parseFloat(v), 0);

                probValue.value = 100 - sum + mapTargets[key];
                mapTargets[key] = parseFloat(probValue.value);

                currentIndex = 0;

                $(document).off("click", "#prob-bt-submit");
                $(document).on("click", "#prob-bt-submit", function () {
                    lightBoxManager.closeBox("shadow3", "box-prob");
                });

                return;
            }

            probValue.disabled = false;
            probValue.value = mapTargets[key];

            $(document).off("click", "#prob-bt-submit");
            $(document).on("click", "#prob-bt-submit", function () {

                const value = parseFloat(probValue.value);
                if (isNaN(value) || value < 0) {
                    lightBoxManager.showlightBoxManager.showAlert("Probability cannot be negative and must be a number.");
                    return;
                }

                const entries = Object.entries(mapTargets)
                    .sort(([a], [b]) => a - b);

                let sum = 0;
                for (const [k, v] of entries) {
                    if (k == key) break;
                    sum += parseFloat(v);
                }

                if (sum + value > 100) {
                    lightBoxManager.showAlert("The sum of probabilities for each node cannot exceed 100.");
                    return;
                }

                mapTargets[key] = value;
                currentIndex++;
                self.execute(id);
            });
        }
    };

    return prob;
});
