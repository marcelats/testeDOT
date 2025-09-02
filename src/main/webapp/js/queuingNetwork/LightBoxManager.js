define([], function () {
    "use strict";

    return {
        openBox: function (shadowing, box, callback) {
            $("#" + shadowing).fadeIn("fast", function () {
                //$("#" + box).show();
                $("#" + box).css({ 
                    display: "block" // apenas mostra o modal
                });
                /*$("#" + box).css({
                    display: "inline-block",
                    top: $(window).height() > $("#" + box).outerHeight()
                        ? ($(window).height() - $("#" + box).outerHeight()) / 2
                        : 0
                });

                $(window).resize(function () {
                    $("#" + box).css({
                        top: $(window).height() > $("#" + box).outerHeight()
                            ? ($(window).height() - $("#" + box).outerHeight()) / 2
                            : 0
                    });
                });*/

                if (typeof callback === "function") {
                    callback();
                }
            });
        },

        closeBox: function (shadowing, box, callback) {
            $("#" + box).css("display", "none");
            $("#" + shadowing).fadeOut("fast", function () {
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    };
});
