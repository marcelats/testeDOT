
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%--<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>--%>
        <div id="opSaveAsBox" class="boxContent" style="display:none;" position:fixed; 
     z-index:1000; left:50%; transform:translateX(-50%);">
            <div class="btCloseDiv cf">
                <span class="boxTitle">Save as</span>
                <span id="opSaveAs-btClose"><img src="img/btClose.png"/></span>
            </div>
            
            <div id="opSaveAs-top" class="filesWindow">
                <c:forEach var="arquivo" items="${arquivos}">
                    <span class="file-item" data-filename="${arquivo}">${arquivo}</span><br>
                </c:forEach>
            </div>

            <div id="opSaveAs-bottom" class="standardForm">
                <form>
                    <label>
                        <span>File name:</span>
                        <input id="opSaveAs-filename" type="text" class="inputText large">
                        <input id ="opSaveAs-btSubmit" type="button" value="Save as" class="button">
                    </label>
                </form>
            </div>
        </div>
    <%-- </body>
</html>--%>
