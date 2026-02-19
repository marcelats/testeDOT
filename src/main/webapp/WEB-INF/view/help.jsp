<%-- 
    Document   : help
    Author     : Marcela Tiemi Shinzato
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        
            <div class="bt-close-div cf">
                <span class="box-title">Help</span>
                <span id="op-code-bt-close"><img src="img/btClose.png"/></span>
            </div>
            <div style="text-align: left;">
                <p><b>Modelling</b>
                <br><p><b>Nodes:</b> Servers, multiservers, sources and outs. 
            <br>To insert a node, click once the icon and once in the screen. 
            <br>The multiservers are only available if you use C language.
            <br>You can drag nodes by clicking the cursor icon and then dragging the desired node.
                <br><p><b>Link:</b> To connect nodes, click once the link icon, then click once the first node and click once the second node.
            <br>You can connect:
            <br>-Source to server/mutiserver;
            <br>-Server/multiserver to server/multiserver;
            <br>-Server/multiserver to out.
            <br>Each source can only be connected to one server/multiserver.
            <br>A server/multiserver can be connected to itself.
                <br><p><b>Delete:</b> You can delete nodes and links by clicking once the trash can icon and then clicking once the node or link.
                <br><p><b>Undo and redo:</b> You can undo and redo your actions.
            <br>
                <br><p><b>Parametrizing service centers</b>
            <br><p>Click the cursor icon and then click twice the desired service center.
            <br>Arrival distribution is only available if the service center is connected to a source.
            <br>The HyperExponential and Erlang distributions are only available if you use C language.
            <br>If the service center links to more than one node, you must click Probabilities button. 
            <br>Insert the probability to the target from 0 to 100. 
            <br>The last probability will be automatically calculated.
            <br>
            <br><p><b>Parametrizing the model</b>
            <br><p>The Batch Size field can be empty.
            <br>The seed must be between 0 and 15.
            <br>The execution time is in miliseconds.
            <br>If the Warmup Time is automatic, the statistics of the first 5% of simulated time are automatically eliminated.
            <br>If you use C language you must click the Arrival button.
            <br>Click New, input number of clients, arrival time and service center.
            <br>Click Save. 
            <br>You can navigate through the saved arrivals by pressing Prev and Next. 
            <br>You can delete the current shown arrival by pressing Del.
            <br>
            <br><p><b>Simulating the system</b>
            <br><p>Click Generate. If there are errors, you will be notified.
            <br>Close the text file.
            <br>Click Source Code.
            <br>Close the text file.
            <br>Click Execute.
            <br>Close the text file.
            <br>Note that if you modify your system, the Source Code and Execute buttons will be blocked.
            <br>
            <br><p><b>Using the file system</b>
            <br><p>Anytime you can:
            <br>-Start a new file. You can save or discard the current one.
            <br>-Save the current file. If it is the first time you will be asked to name it.
            <br>-Save as new file. You must give it a name.
            <br>-Open one of your files. Click Open, then type or click the name
            <br> then click Open.
            <br>-Make your file public or private. Check or uncheck the Public box.
            <br>-Copy one of your files or a public file. After copying you can open it.
            <br>-Rename of your files.
            <br>-Delete of your files.
            <br>-See the graph, source code and report files of any available file.
            </div>
    </body>
</html>