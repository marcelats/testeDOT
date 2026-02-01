<%-- 
    Document   : opNew
    Created on : 02/06/2014, 01:15:55
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="op-new-box" class="small-box-content">
            <div class="bt-close-div cf">
                <span class="box-title">New</span>
                <span id="op-ew-bt-close"><img src="img/btClose.png"/></span>
            </div>

            <div id="op-new-form" class="standard-form">
                <form>
                    <span class="label-top">Do you want to save the changes?</span>
                    <input id ="op-new-bt-yes" type="button" value="Yes" class="button">
                    <input id="op-new-bt-no" type="button" value="No" class="button">
                    <input id="op-new-bt-cancel" type="button" value="Cancel" class="button">
                </form>
            </div>
        </div>
    </body>
</html>
