/*
 * (Singleton) Properties area controller. He can be called by to ways: double
 * click on an added element or by the buttons in the properties form.
 * 
 * author: Felipe Osorio Thomé
 */

define(["JsonManager", "Cons"],
    function(jsonManager, cons) {
        "use strict";

        var propertiesArea = {
            initialize: function() {
                /* The propertiesArea click event mapping */
                $(document).on("click", "#btSubmit", function() {
                    propertiesArea.ctrl("submit");
                });
                $(document).on("click", "#btCancel", function() {
                    propertiesArea.ctrl("cancel");
                });
                document.addEventListener("DOMContentLoaded", function () {
    const serverSelect = document.getElementById("server_distribution");
    if (serverSelect) {
        for (let option of serverSelect.options) {
            if (option.text === "HyperExponential" || option.text === "Erlang") {
                option.disabled = true;
            }
        }
    }
});

                const arrivalSelect = document.getElementById("arrival_distribution");
                if(arrivalSelect){
                    for (let option of arrivalSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = true;
                }
            }
                }
                const serverSelect = document.getElementById("server_distribution");
                if(serverSelect){
                    for (let option of serverSelect.options) {
                if (option.text === "HyperExponential" || option.text === "Erlang") {
                    option.disabled = true;
                }
            }
                }
            },
            ctrl: function(element) {
                /* Invoked from an element. */
                if (typeof element !== "string") {
                    /* If already opened close it */
                    if ($("#" + cons.PROPERTIES_AREA).css("display") !== "none") {
                        closeDiv(element);
                    }
                    if (element.name === "server") {
                        openDiv(element);
                    }
                    if (element.name === "multiServer") {
                        openDiv(element);
                    }
                }
                /* Invoked from within propertiesArea div. */
                else {
                    closeDiv();

                    if (element === "submit") {
                        var properties = $("#" + cons.PROPERTIES_AREA).values();
                        var callerId = $("#" + cons.HIDDEN_FIELD_ID).val();
                        var tempElement = document.getElementById(callerId);

                        jsonManager.setNodeProperties(tempElement, properties);
                        const btnCode = document.getElementById("opCode");
                            btnCode.style.opacity = '0.3';
                            btnCode.style.pointerEvents = 'none';
                            const btnExecute = document.getElementById("opExecute");
                            btnExecute.style.opacity = '0.3';
                            btnExecute.style.pointerEvents = 'none';
                    }
                }
            }
        };

        /* --- Private methods. --- */

        function openDiv(element) {
            /* The jquery width() returns a value without "px". */
            $("#" + cons.DRAW_AREA).width($("#" + cons.DRAW_AREA).outerWidth()
                - $("#" + cons.PROPERTIES_AREA).outerWidth());
            $("#" + cons.PROPERTIES_AREA).css("display", "inline");

            $("#" + cons.PROPERTIES_AREA).load(
                "qnetwork?cmd=open-properties&type=" + element.name,
                function() {
                    prepareForm(element);
                    const serverSelect = document.getElementById("server_distribution");
        if (serverSelect) {
            for (let option of serverSelect.options) {
                if (["HyperExponential", "Erlang"].includes(option.text.trim())) {
                    option.disabled = true;
                }
            }
        }
        const arrivalSelect = document.getElementById("arrival_distribution");
        if (arrivalSelect) {
            for (let option of arrivalSelect.options) {
                if (["HyperExponential", "Erlang"].includes(option.text.trim())) {
                    option.disabled = true;
                }
            }
        }
                }
            );

        }

        function prepareForm(element) {
            document.getElementById(cons.HIDDEN_FIELD_ID).value = element.id;
            document.getElementById(cons.HIDDEN_FIELD_TYPE).value = element.name;

            $("#" + cons.PROPERTIES_AREA).values(jsonManager.getNodeProperties(element));
        }

        function closeDiv() {
            $("#" + cons.DRAW_AREA).width($("#" + cons.DRAW_AREA).outerWidth()
                + $("#" + cons.PROPERTIES_AREA).outerWidth());
            $("#" + cons.PROPERTIES_AREA).css("display", "none");
        }

        return propertiesArea;
    }
);