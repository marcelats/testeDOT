<%-- 
    Document   : queuingNetwork
    Created on : 29/01/2014, 21:20:05
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
--%>
<jsp:include page="/WEB-INF/view/opParam.jsp" />


<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <title>ASDA</title>

        <link rel="icon" type="image/png" href="img/favicon.png" />
        <link rel="stylesheet" href="js/libs/jquery-ui-1.10.4.custom.css">
        <link rel="stylesheet" type="text/css" href="styles/queuingNetwork.css">
        <link rel="stylesheet" type="text/css" href="styles/formStd.css">
        <link rel="stylesheet" type="text/css" href="styles/lightBox.css">
        <link rel="stylesheet" type="text/css" href="styles/clearFixHack.css">

        <script data-main="js/queuingNetwork/main.js" src="js/libs/require.js"></script>
        <script src="js/queuingNetwork/require.cfg.js"></script>
    </head>

    <body>
        <div id="global">
            <div id="top">
                <div id="top-title">
                    ASDA - Ambiente de Simulação Distribuída Automático<br>
                    (Automatic Distributed Simulation Environment)
                </div>
                <div id="top-menu">

                    <ul class="menu">
                        <li>
                            <div id="op-new">
                            <img src="img/icon/new.gif"/></div><span class="line1">New</span>
                            <span class="line2">Document</span>
                        </li>
                        <li>
                            <div id="op-save"><img src="img/icon/save.gif"/></div>
                            <span class="line1">Save</span>
                            <span class="line2">&nbsp;</span>
                        </li>
                        <li>
                            <div id="op-save-as"><img src="img/icon/save.gif"/></div>
                            <span class="line1">Save As</span>
                            <span class="line2">&nbsp;</span>
                        </li>
                        <li>
                            <div id="op-open"><img src="img/icon/open.gif"/></div>
                            <span class="line1">Open</span>
                            <span class="line2">&nbsp;</span>
                        </li>
                        <li>
                            <div id="op-param"><img src="img/icon/param.gif"/></div>
                            <span class="line1">Model</span>
                            <span class="line2">Parameters</span>
                        </li>    
                        <li>
                            <div id="op-gen"><img src="img/icon/exec.gif"/></div>
                            <span class="line1">Generate</span>
                            <span class="line2">&nbsp;</span>
                        </li>
                        <li>
                            <div id="op-code"><img src="img/icon/code.gif"/></div>
                            <span class="line1">Source</span>
                            <span class="line2">Code</span>
                        </li>
                        <li>
                            <div id="op-execute"><img src="img/icon/report.gif"/></div>
                            <span class="line1">Execute</span>
                            <span class="line2">&nbsp;</span>
                        </li>
                        <li>
                            <div id="op-manual"><img src="img/icon/manual.gif"/></div>
                            <span class="line1">Help</span>
                            <span class="line2">&nbsp;</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="center">
                <div id="left-menu">
                    <ul class="menu menu-block">
                    <li><div id="server" class="node" tabindex="0"><img src="img/icon/server.gif" title="One Server"/></div></li>
                    <li><div id="multiserver" class="node" tabindex="0"><img src="img/icon/multiServer.gif" title="Multiple Servers"/></div></li>
                    <li><div id="source" class="node" tabindex="0"><img src="img/icon/source.gif" title="Source"/></div></li>
                    <li><div id="out" class="node" tabindex="0"><img src="img/icon/out.gif" title="Out"/></div></li>
                    <li><div id="link" class="node" tabindex="0"><img src="img/icon/link.gif" title="Link"/></div></li>
                    <li><div id="erase" class="node" tabindex="0"><img src="img/icon/erase.gif" title="Erase"/></div></li>
                    </ul>
                </div>

                <div id="draw-area"></div>
                <div id="properties-area"></div>
            </div>

            <div id="bottom">
                <div id="bottom-status">
                    <div id="status-left"></div>
                    <div id="status-middle">&nbsp;</div>
                    <div id="status-right">&nbsp;</div>
                </div>
            </div>
        </div>
        
        <div id="shadowing" class="shadowing">
            <div id="box-container" class="box"></div>
        </div>
        <div id="shadow2" class="shadow2">
            <div id="box-arrival" class="box"></div>
        </div>
        <div id="shadow3" class="shadow3">
            <div id="box-prob" class="box"></div>
        </div>
    </body>
</html>