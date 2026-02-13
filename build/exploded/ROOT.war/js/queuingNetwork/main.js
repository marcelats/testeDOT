/*
 * author: Felipe Osorio Thomé
 * author: Marcela Tiemi Shinzato
 */
require([
    "jquery", "DrawArea", "PropertiesArea", "TopOptions",
    "ActiveTool", "ElementManager", "JqueryPlugins",
    "Cons", "JsonManager", "domReady!", "HistoryManager",
    "LightBoxManager"
], function (
    $, drawArea, propertiesArea, topOptions,
    activeTool, ElementManager, jqueryPlugins,
    cons, jsonManager, _, history, lightBoxManager
) {
    "use strict";

    /* ---------------- Layout ---------------- */

    function resizeLayout() {
        $("#" + cons.CENTER).height(
            $(window).height() -
            $("#" + cons.TOP).height() -
            $("#" + cons.BOTTOM).height()
        );

        const propertiesAreaWidth =
            $("#" + cons.PROPERTIES_AREA).css("display") !== "none"
                ? $("#" + cons.PROPERTIES_AREA).width()
                : 0;

        $("#" + cons.DRAW_AREA).width(
            $(window).width() -
            $("#" + cons.LEFT_TOOLS).outerWidth() -
            propertiesAreaWidth
        );
    }

    resizeLayout();
    $(window).resize(resizeLayout);

    /* ---------------- Init ---------------- */

    const elementManager = new ElementManager(
        cons.FOLDER, cons.FORMAT, cons.DRAW_AREA
    );

    topOptions.initialize(elementManager);
    drawArea.initialize(elementManager);
    propertiesArea.initialize();
    jqueryPlugins.initialize();

    const btnMulti = document.getElementById("multiserver");
    if (btnMulti) {
        btnMulti.style.opacity = "0.3";
        btnMulti.style.pointerEvents = "none";
        btnMulti.tabIndex = -1;
    }

    /* ---------------- Events ---------------- */

    (function registerEvents() {

        $("#op-new").click(() => topOptions.ctrl("new"));
        $("#op-save").click(() => topOptions.ctrl("save"));
        $("#op-save-as").click(() => topOptions.ctrl("saveAs"));
        $("#op-open").click(() => topOptions.ctrl("open"));
        $("#op-param").click(() => topOptions.ctrl("parameters"));
        $("#op-gen").click(() => topOptions.ctrl("generate"));
        $("#op-code").click(() => topOptions.ctrl("code"));
        $("#op-execute").click(() => topOptions.ctrl("execute"));
        $("#op-manual").click(() => topOptions.ctrl("manual"));

        $("#server").click(() => activeTool.setTool("server"));
        $("#multiserver").click(() => activeTool.setTool("multiserver"));
        $("#source").click(() => activeTool.setTool("source"));
        $("#out").click(() => activeTool.setTool("out"));
        $("#link").click(() => activeTool.setTool("link"));
        $("#erase").click(() => activeTool.setTool("erase"));
        $("#undo-btn").click(function(){
            history.undo();
        });
        $("#redo-btn").click(function(){
            history.redo();
        });

        $("#draw-area").click(event => drawArea.ctrl(event));
        
        $("#alert-ok-btn").click(function(){
            lightBoxManager.closeAlert();
        });

        $(document).bind("ajaxComplete", function (_, xhr) {
            const redirect = xhr.getResponseHeader("fot-redirect");
            if (xhr.readyState === 4 && redirect) {
                window.location.href = redirect;
            }
        });
    })();

    /* ---------------- Visibility Logic ---------------- */

    const allowed = ["C SMPL", "C SMPLX"];
    let visibilityRunning = false;

    function muteUnmute(el, enabled) {
        if (!el) return;
        el.style.opacity = enabled ? "1" : "0.3";
        el.style.pointerEvents = enabled ? "auto" : "none";
        el.tabIndex = enabled ? 0 : -1;
        el.disabled = !enabled;
    }

    function disableEnable(select, enabled) {
        if (!select) return;

        for (const opt of select.options) {
            if (opt.text === "HyperExponential" || opt.text === "Erlang") {
                opt.disabled = !enabled;
            }
        }

        if (!enabled && select.selectedOptions[0]?.disabled) {
            for (const opt of select.options) {
                if (!opt.disabled) {
                    select.value = opt.value;
                    break;
                }
            }
        }
    }

    function updateStdDeviation(sdInput, distribution) {
        if (!sdInput || !distribution) return;

        const complex =
            ["HyperExponential", "Normal", "Uniform", "Erlang"]
                .includes(distribution.value);

        muteUnmute(sdInput, complex);
    }

    function applyVisibilityLogic() {
        if (visibilityRunning) return;
        visibilityRunning = true;

        try {
            const opParam = document.getElementById("op-param-library");
            if (!opParam) return;

            const selected = opParam.value;
            const enabled = allowed.includes(selected);

            const definedValue = document.getElementById("op-param-defined-value");
            if (definedValue) {
                definedValue.disabled = true;
                const radio = document.getElementById("op-param-time-defined");
                if (radio) {
                    radio.onchange = () => {
                        definedValue.disabled = !radio.checked;
                    };
                }
            }

            muteUnmute(document.getElementById("arrival-bt"), enabled);
            muteUnmute(document.getElementById("multiserver"), enabled);
            muteUnmute(document.getElementById("queue-stats-fieldset"), enabled);
            muteUnmute(document.getElementById("arrival-sequence"), enabled);
            muteUnmute(document.getElementById("server-sequence"), enabled);
            muteUnmute(document.getElementById("ms-arrival-sequence"), enabled);
            muteUnmute(document.getElementById("ms-sequence"), enabled);
            muteUnmute(document.getElementById("opParam-batchSize"), enabled);

            const warmup = document.getElementById("warmup-fieldset");
            if (warmup) warmup.disabled = !enabled;

            disableEnable(document.getElementById("arrival-distribution"), enabled);
            disableEnable(document.getElementById("server-distribution"), enabled);
            disableEnable(document.getElementById("ms-arrival-distribution"), enabled);
            disableEnable(document.getElementById("ms-distribution"), enabled);

            if (enabled) {
                Object.values(jsonManager.getGraph().mapNodes).forEach(node => {
                    const props = node.properties;
                    ["arrival-distribution", "server-distribution",
                     "ms-arrival-distribution", "ms-distribution"]
                        .forEach(k => {
                            if (["HyperExponential", "Erlang"].includes(props[k])) {
                                props[k] = "Exponential";
                            }
                        });
                });
            }
        } finally {
            visibilityRunning = false;
        }
    }

    /* ---------------- Observers ---------------- */

    function observe(selector, handler) {
        const check = () => {
            const el = document.querySelector(selector);
            if (!el || el._listenerAttached) return;

            el._listenerAttached = true;
            handler(el);
        };

        check();
        new MutationObserver(check)
            .observe(document.body, { childList: true, subtree: true });
    }
    
    function observeDistribution(selector, sdId) {
        const check = () => {
            const dist = document.querySelector(selector);
            if (!dist || dist._listenerAttached) return;

            dist._listenerAttached = true;

            const update = () => {
                const sd = document.getElementById(sdId);
                updateStdDeviation(sd, dist);
            };

            update();
            dist.addEventListener("change", update);
        };

        check();
        new MutationObserver(check)
            .observe(document.body, { childList: true, subtree: true });
    }


    observe("#op-param-library", el => {
        el.addEventListener("change", applyVisibilityLogic);
        applyVisibilityLogic();
    });

    observeDistribution("#server-distribution", "server-sd");
    observeDistribution("#arrival-distribution", "arrival-sd");
    observeDistribution("#ms-distribution", "ms-sd");
    observeDistribution("#ms-arrival-distribution", "ms-arrival-sd");


    new MutationObserver(applyVisibilityLogic)
        .observe(document.body, { childList: true, subtree: true });

    $("#textEditor").parent().css({
        width: "900px",
        maxWidth: "none"
    });
});
