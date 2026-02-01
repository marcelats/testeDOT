<%-- 
    Document   : textEditor
    Author     : Marcela Tiemi Shinzato
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div class="box-content-text-editor">
            <div class="bt-close-div cf">
                <span class="box-title">Code Editor</span>
                <span id="op-code-bt-close"><img src="img/btClose.png"/></span>
            </div>
           
            <textarea id="text-editor"></textarea>
            <br>
            <input id ="op-code-download" type="button" value="Download" class="button">
            <input id ="op-code-bt-ok" type="button" value="Ok" class="button">
        </div>
    </body>
</html>