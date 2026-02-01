<%-- 
    Document   : showText
    Author     : Marcela Tiemi Shinzato
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div class="box-content-text-editor" id="modal-show-text">
            <div class="bt-close-div cf">
                <span class="box-title">Graph File</span>
                <span id="show-text-bt-close"><img src="img/btClose.png"/></span>
            </div>
           
            <textarea readonly id="text-show"></textarea>
            <br>
            <input id ="show-text-download" type="button" value="Download" class="button">
        </div>
    </body>
</html>
