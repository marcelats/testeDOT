<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="opSaveBox" class="boxContent">
            <div class="btCloseDiv cf">
                <span class="boxTitle">Save</span>
                <span id="opSave-btClose"><img src="img/btClose.png"/></span>
            </div>
            
            <div id="opSave-top" class="filesWindow">
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

            <div id="opSave-bottom" class="standardForm">
                <form onsubmit="return false;">
                    <label>
                        <span>File name:</span>
                        <input id="opSave-filename" type="text" class="inputText large">
                        <input id ="opSave-btSubmit" type="button" value="Save" class="button">
                    </label>
                </form>
            </div>
        </div>
    </body>
</html>