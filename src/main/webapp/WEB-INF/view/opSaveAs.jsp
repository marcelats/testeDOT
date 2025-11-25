<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="opSaveAsBox" class="boxContent">
            <div class="btCloseDiv cf">
                <span class="boxTitle">Save As</span>
                <span id="opSaveAs-btClose"><img src="img/btClose.png"/></span>
            </div>
            
            <div id="opSaveAs-top" class="filesWindow">
                <div class="filesHeader">
                <span class="file-col">Filename</span>
                <span class="author-col">Author</span>
            </div>
                <c:forEach var="arquivo" items="${arquivos}">
                <div class="file-row">
                    <span class="file-item-save" data-filename="${arquivo.graphName}" data-authorname="${arquivo.user.userId}">
                        ${arquivo.graphName}
                    </span>
                    <span class="file-author">
                        ${arquivo.user.userId}
                    </span>
                </div>
            </c:forEach>
            </div>

            <div id="opSaveAs-bottom" class="standardForm">
                <form onsubmit="return false;">
                    <label>
                        <span>File name:</span>
                        <input id="opSaveAs-filename" type="text" class="inputText large">
                        <input id ="opSaveAs-btSubmit" type="button" value="Save as" class="button">
                    </label>
                </form>
            </div>
        </div>
    </body>
</html>