<%-- 
    Document   : opOpen
    Created on : 21/05/2014, 21:18:58
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>

    </head>
    <body>
        <div id="current-user" data-user-id="${currentUserId}" style="display:none;"></div>
        <div id="op-open-box" class="box-content">
            <div class="bt-close-div cf">
                <span class="box-title">Open</span>
                <span id="op-open-bt-close"><img src="img/btClose.png"/></span>
            </div>

            <div id="op-open-top" class="files-window">
                <div class="files-header">
                    <span class="file-col">Filename</span>
                    <span class="author-col">Author</span>
                    <span class="privacy-col">Public</span>
                    <span class="date-col">Date</span>
                </div>

                <c:forEach var="file" items="${files}">
                    <div class="file-row-open"
                        data-filename="${file.graphName}"
                        data-authorname="${file.user.userId}">
                        <span class="file-col">
                            ${file.graphName}
                        </span>
                        <span class="author-col">
                            ${file.user.userId}
                        </span>
                        <span class="privacy-col">
                            <span class="checkbox" data-filename-checkbox="${file.graphName}" public="${file.publicGraph ? "✔" : ""}" data-author-checkbox="${file.user.userId}">
                                ${file.publicGraph ? "✔" : ""}
                            </span>
                        </span>                      
                        <span class="date-col">
                            <span>${file.formattedCreatedAt}</span>
                        </span>
                    </div>
                </c:forEach>
            </div>
            <div id="op-open-bottom" class="standard-form">
                <form>
                    <div class="form-row">
                        <label for="op-open-filename">File name:</label>
                        <input id="op-open-filename" type="text" class="input-text large">
                    </div>

                    <div class="form-row">
                        <label for="op-open-author">Author:</label>
                        <input id="op-open-author" type="text" class="input-text large">
                    </div>

                    <div class="form-buttons">
                        <input id="op-open-bt-submit" type="button" value="Open" class="button">
                        <input id="op-copy-bt-submit" type="button" value="Copy" class="button">
                        <input id="op-rename-bt-submit" type="button" value="Rename" class="button">
                        <input id="op-delete-bt-submit" type="button" value="Delete" class="button">
                        <input id="op-graph-bt-submit" type="button" value="Graph" class="button">
                        <input id="op-code-bt-submit" type="button" value="Code" class="button">
                        <input id="op-report-bt-submit" type="button" value="Report" class="button">
                    </div>

                    <div class="form-row">
                        <label for="op-open-new-name">Rename to:</label>
                        <input id="op-open-new-name" type="text" class="inputText large">
                    </div>
                </form>
            </div>
        </div>

        <div id="rename-modal" class="modal" style="display:none;">
            <div class="modal-content">
                <span id="rename-close" class="close">&times;</span>
                <h3 id="rename-title"></h3>
                <input type="text" id="rename-input" class="input-text large">
                <div class="modal-buttons">
                    <button id="rename-ok" class="button">OK</button>
                    <button id="rename-cancel" class="button">Cancel</button>
                </div>
            </div>
        </div>
    </body>
</html>

