<%-- 
    Document   : opSaveAs
    Created on : 21/05/2014, 19:34:15
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="op-save-as-box" class="box-content">
            <div class="bt-close-div cf">
                <span class="box-title">Save As</span>
                <span id="op-save-as-bt-close"><img src="img/btClose.png"/></span>
            </div>
            
            <div id="op-save-as-top" class="files-window">
                <div class="files-header">
                <span class="file-col">Filename</span>
                <span class="author-col">Author</span>
            </div>
                <c:forEach var="file" items="${files}">
                <div class="file-row">
                    <span class="file-item-save" data-filename="${file.graphName}" data-authorname="${file.user.userId}">
                        ${file.graphName}
                    </span>
                    <span class="file-author">
                        ${file.user.userId}
                    </span>
                </div>
            </c:forEach>
            </div>

            <div id="op-save-as-bottom" class="standard-form">
                <form onsubmit="return false;">
                    <label>
                        <span>File name:</span>
                        <input id="op-save-as-filename" type="text" class="input-text large">
                        <input id ="op-save-as-bt-submit" type="button" value="Save as" class="button">
                    </label>
                </form>
            </div>
        </div>
    </body>
</html>