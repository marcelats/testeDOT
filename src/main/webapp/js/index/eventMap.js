/* author: Felipe Osorio Thomé
   author: Marcela Tiemi Shinzato */

/* Event mapping */
$(document).ready(function() {
    validateLogIn();

    $("#new-user-link").click(function() {
        openLightBox("shadowing", "wrap-sign-in");
        /* Now, the container div is not 'display:none' anymore */
        validateSignIn();
    });

    $("#forgot-pass-link").click(function() {
        openLightBox("shadowing", "wrap-forgot-pass");
        /* Now, the container div is not 'display:none' anymore */
        validateForgotPass();
    });

    $("#bt-sign-in-close").click(function() {
        closeLightBox("shadowing", "wrap-sign-in");
    });

    $("#bt-forgot-pass-close").click(function() {
        closeLightBox("shadowing", "wrap-forgot-pass");
    });

    /* Centering the div. */
    $("#wrap-login").css({
        top: $(window).height() > $("#wrap-login").outerHeight() ?
            (($(window).height() - $("#wrap-login").outerHeight()) / 2) * 0.8 : 0
    });

    $(window).resize(function() {
        $("#wrap-login").css({
            top: $(window).height() > $("#wrap-login").outerHeight() ?
                (($(window).height() - $("#wrap-login").outerHeight()) / 2) * 0.8 : 0
        });
    });
});

$(document).bind('ajaxComplete', function(event, xhr, options) {
    var redirectHeader = xhr.getResponseHeader('fot-redirect');

    if (xhr.readyState === 4 && redirectHeader !== null) {
        window.location.href = redirectHeader;
    }
});

function validateLogIn() {
    $('#login').validate({
        rules: {
            user: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            user: {
                required: "Please enter your user"
            },
            password: {
                required: "Please enter your password."
            }
        },
        /* ---Ajax--- */
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                url: "accounts?cmd=login",
                clearForm: true,
                error: function(xhr, ajaxOptions, thrownError) {
                    var errorHeader = xhr.getResponseHeader('fot-error');
                    
                    if(errorHeader !== null) {
                        lightBoxManager.showAlert(errorHeader);
                    }else {
                        lightBoxManager.showAlert(thrownError);
                    }
                }
            });
        }
    });
}

function validateSignIn() {
    $('#signin').validate({
        rules: {
            "si-email": {
                required: true,
                email: true
            },
            "si-password": {
                required: true
            },
            "si-password2": {
                required: true,
                equalTo: "#si_password"
            }
        },
        messages: {
            "si-email": {
                required: "Please enter your email",
                email: "Please enter a valid email"
            },
            "si-password": {
                required: "Please enter your password"
            },
            "si-password2": {
                required: "Please repeat your password",
                equalTo: "Please enter the password as above"
            }
        },
        /* ---Ajax--- */
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                url: "accounts?cmd=signin",
                clearForm: true,
                success: function() {
                    lightBoxManager.showAlert("Registration done successfully!");
                },
                error: function(xhr, thrownError) {
                    var errorHeader = xhr.getResponseHeader('fot-error');
                    
                    if(errorHeader !== null) {
                        lightBoxManager.showAlert(errorHeader);
                    }else {
                        lightBoxManager.showAlert(thrownError);
                    }
                }
            });
        }
    });
}

function validateForgotPass() {
    $('#forgot-pass').validate({
        rules: {
            "fp-email": {
                required: true,
                email: true
            }
        },
        messages: {
            "fp-email": {
                required: "Please enter your email",
                email: "Please enter a valid email"
            }
        },
        /* ---Ajax--- */
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                url: "accounts?cmd=forgot-pass",
                clearForm: true
            });
        }
    });
}