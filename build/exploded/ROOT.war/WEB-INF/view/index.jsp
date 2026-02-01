<%-- 
    Document   : index
    Created on : 29/01/2014, 21:17:34
    Author     : Felipe Osorio Thomé
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <title>ASDA</title>

        <link rel="icon" type="image/png" href="img/favicon.png"/>
        <link rel="stylesheet" type="text/css" href="styles/indexStyles.css">
        <link rel="stylesheet" type="text/css" href="styles/lightBox.css">
        <link rel="stylesheet" type="text/css" href="styles/formStd.css">
        <link rel="stylesheet" type="text/css" href="styles/clearFixHack.css">

        <script type="text/javascript" src="js/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="js/libs/jquery.validate.min.js"></script>
        <script type="text/javascript" src="js/libs/jquery.form.min.js"></script>

        <script type="text/javascript" src="js/index/eventMap.js"></script>
        <script type="text/javascript" src="js/index/simpleLightBox.js"></script>
    </head>
    <body>
        <div id="wrap-login">
            <div id="top-login">
                <img src="img/logo.png"/>
            </div>

            <div id="login-form-div" class="cf">
                <form action="" method="post" id="login" class="standard-form">
                    <div class="field">
                        <label for="user" class="label-top">User</label>
                        <input name="user" id="user" class="input-text dark rel-large"/>
                    </div>

                    <div class="field">
                        <label for="password" class="label-top">Password</label>
                        <input type="password" name="password" id="password" class="input-text dark rel-large"/>
                    </div>

                    <h2>
                        <!--<span id="forgotPassLink" class="link">Forgot your password?</span> | -->
                        <span id="new-user-link" class="link">New user</span>
                    </h2>

                    <div class="right">
                        <input type="submit" value="Log in" class="button"/>
                    </div>
                </form>

            </div>
        </div>

        <div id="shadowing" class="shadowing">
            <div id="wrap-sign-in" class="box">

                <div class="box-content cf">
                    <div class="bt-close-div cf">
                        <span class="box-title">Sign in</span>

                        <span id="bt-sign-in-close">
                            <img src="img/btClose.png"/>
                        </span>
                    </div>

                    <form action="" method="post" id="signin" class="standard-form">
                        <h1>The fields with * are mandatory.</h1>

                        <div class="field">
                            <label for="si-email" class="label-top">Email *</label>
                            <input name="si-email" id="si-email" class="input-text dark large"/>
                        </div>

                        <div class="field">
                            <label for="si-password" class="label-top">Password *</label>
                            <input name="si-password" type="password" id="si-password" class="input-text dark large"/>
                        </div>

                        <div class="field">
                            <label for="si-password" class="label-top">Confirm Password *</label>
                            <input name="si-password2" type="password" id="si-password2" class="input-text dark large"/>
                        </div>

                        <div class="field">
                            <label for="si-name" class="label-top">Name</label>
                            <input name="si-name" id="si-name" class="input-text dark large"/>
                        </div>

                        <div class="field">
                            <label for="si-course" class="label-top">Course</label>
                            <input name="si-course" id="si-course" class="input-text dark large"/>
                        </div>

                        <div class="field">
                            <label for="si-class" class="label-top">Class</label>
                            <input name="si-class" id="si-class" class="input-text dark large"/>
                        </div>

                        <div class="right">
                            <input type="reset" value="Clean" class="button"/>
                            <input type="submit" value="Sign in" class="button"/>
                        </div>
                    </form>
                </div>
            </div>

            <div id="wrap-forgot-pass" class="box">
                <div class="box-content cf">
                    <div class="bt-close-div cf">
                        <span class="box-title">Forgot password</span>

                        <span id="bt-forgot-pass-close">
                            <img src="img/btClose.png"/>
                        </span>
                    </div>

                    <form action="" method="post" id="forgot-pass" class="standard-form">
                        <div class="field">
                            <label for="fp-email" class="label-top">Email</label>
                            <input name="fp-email" id="fp-email" class="input-text dark large" />
                        </div>

                        <div class="right">
                            <input type="submit" value="Send" class="button"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </body>  
</html>
