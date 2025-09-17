<%-- 
    Document   : opParameters
    Created on : 23/05/2014, 16:16:07
    Author     : Felipe Osorio Thomé
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div class="boxContentTextEditor">
            <div class="btCloseDiv cf">
                <span class="boxTitle">Code Editor</span>
                <span id="opCode-btClose"><img src="img/btClose.png"/></span>
            </div>
           
            <textarea id="textEditor"></textarea>
            <br>
            <input id ="opCode-download" type="button" value="Download" class="button">
            <input id ="opCode-btOk" type="button" value="Ok" class="button">
        </div>
    </body>
</html>