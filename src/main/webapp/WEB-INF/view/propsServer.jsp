<%-- 
    Document   : serverProperties
    Created on : 04/02/2014, 05:18:58
    Author     : Felipe Osorio Thomé
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script data-main="js/queuingNetwork/main.js" src="js/libs/require.js"></script>
        <script src="js/queuingNetwork/require.cfg.js"></script>
    </head>
    <body>
        <div id="serverProperties" class="standardForm">
            <form>
                <input type="hidden" id="callerId">
                <input type="hidden" id="callerType">

                <fieldset disabled id="queueStatsFieldset">
                    <legend>Queue statistics</legend>
                    <div class="field">
                        <label for="server_emptyQueue" class="labelLeft">Empty queue</label>
                        <input id="server_emptyQueue" type="checkbox">
                    </div>

                    <div class="field">
                        <label for="server_length" class="labelLeft">Length (max / min)</label>
                        <input id="server_length" type="checkbox">
                    </div>
                </fieldset>

                <fieldset disabled id="arrival_fieldset">
                    <legend>Arrival distribution</legend>
                    <div class="field">
                        <select id="arrival_distribution" class="inputText">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="arrival_average" class="labelLeft">Average</label>
                        <input type="text" id="arrival_average" class="inputText small">
                    </div>

                    <div class="field" id="arrival_stdDeviation">
                        <label for="arrival_stdDeviation" class="labelLeft">Standard deviation</label>
                        <input type="text" id="arrival_stdDeviation" class="inputText small">
                    </div>

                    <div class="field">
                        <label for="arrival_sequence" class="labelLeft">Random number generation seed</label>
                        <input disabled type="text" id="arrival_sequence" class="inputText small">
                    </div>
                </fieldset>
                
                <fieldset id="fieldset_sd">
                    <legend>Service distribution</legend>
                    <div class="field">
                        <select id="server_distribution" class="inputText">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="server_average" class="labelLeft">Average</label>
                        <input type="text" id="server_average" class="inputText small">
                    </div>

                    <div class="field">
                        <label for="server_stdDeviation" class="labelLeft">Standard deviation</label>
                        <input type="text" id="server_stdDeviation" class="inputText small">
                    </div>

                    <div class="field">
                        <label for="server_sequence" class="labelLeft">Random number generation seed</label>
                        <input disabled type="text" id="server_sequence" class="inputText small">
                    </div>
                </fieldset><br>
                <!--<div class="field">
                    <label for="probability" class="labelLeft">Probability</label>
                    <input id="probability" type="text" class="inputText small">
                </div>-->
                <div class="field">
                    <input id ="prob-bt" type="button" value="Probabilities" class="button">
                </div>

                <input id="btCancel" type="button" value="Cancel" class="button">
                <input id ="btSubmit" type="button" value="Ok" class="button">
            </form>
        </div>
    </body>
</html>