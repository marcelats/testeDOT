<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
     <body>
        <div id="opOpenBox" class="boxContent">
            <div class="btCloseDiv cf">
                <span class="boxTitle">Open</span>
                <span id="opOpen-btClose"><img src="img/btClose.png"/></span>
            </div>

            <div id="opOpen-top" class="filesWindow">
            <!-- Cabeçalho -->
            <div class="filesHeader">
                <span class="file-col">Filename</span>
                <span class="author-col">Author</span>
            </div>

            <!-- Lista de arquivos -->
            <c:forEach var="arquivo" items="${arquivos}">
                <div class="file-row">
                    <span class="file-item-open" data-filename="${arquivo.graphName}" data-authorname="${arquivo.user.userId}">
                        ${arquivo.graphName}
                    </span>
                    <span class="file-author">
                        ${arquivo.user.userId}
                    </span>
                </div>
            </c:forEach>
        </div>

            
            <div id="opOpen-bottom" class="standardForm">
                <form>
    <div class="form-row">
        <label for="opOpen-filename">File name:</label>
        <input id="opOpen-filename" type="text" class="inputText large">
    </div>

    <div class="form-row">
        <label for="opOpen-author">Author:</label>
        <input id="opOpen-author" type="text" class="inputText large">
    </div>

    <div class="form-buttons">
        <input id="opOpen-btSubmit" type="button" value="Edit" class="button">
        <input id="opCopy-btSubmit" type="button" value="Copy" class="button">
        <input id="opPublic-btSubmit" type="button" value="Public" class="button">
        <input id="opPrivate-btSubmit" type="button" value="Private" class="button">
        <input id="opRename-btSubmit" type="button" value="Rename" class="button">
        <input id="opDelete-btSubmit" type="button" value="Delete" class="button">
    </div>

    <div class="form-row">
        <label for="opOpen-newname">Rename to:</label>
        <input id="opOpen-newname" type="text" class="inputText large">
    </div>
</form>

            </div>
        </div>
    </body>
</html>