<%-- 
    Document   : multiServerProperties
    Created on : 11/02/2014, 19:19:32
    Author     : Felipe Osorio Thomé
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="multiServerProperties" class="standardForm">
            <form>
                <input type="hidden" id="callerId">
                <input type="hidden" id="callerType">

                <fieldset>
                    <legend>Server type</legend>
                    <div class="field">
                        <label for="multiServer_nbrServers" class="labelLeft">Number of servers</label>
                        <input id="multiServer_nbrServers" type="text" class="inputText small" value="1">
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Queue statistics</legend>
                    <div class="field">
                        <label for="multiServer_emptyQueue" class="labelLeft">Empty queue</label>
                        <input id="multiServer_emptyQueue" type="checkbox">
                    </div>

                    <div class="field">
                        <label for="multiServer_length" class="labelLeft">Length (max / min)</label>
                        <input id="multiServer_length" type="checkbox">
                    </div>
                </fieldset>

                <fieldset disabled id="ms_arrival_fieldset">
                    <legend>Arrival distribution</legend>
                    <div class="field">
                        <select id="ms_arrival_distribution" class="inputText">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="ms_arrival_average" class="labelLeft">Average</label>
                        <input id="ms_arrival_average" type="text" class="inputText small">
                    </div>

                    <div class="field" class="multiServerArrivalSD">
                        <label for="ms_arrival_stdDeviation" class="labelLeft">Standard deviation</label>
                        <input type="text" id="ms_arrival_stdDeviation" class="inputText small">
                    </div>

                    <div class="field">
                        <label for="ms_arrival_sequence" class="labelLeft">Random number generation seed</label>
                        <input type="text" id="ms_arrival_sequence" class="inputText small">
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Service distribution</legend>
                    <div class="field">
                        <select id="multiServer_distribution" class="inputText">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="multiServer_average" class="labelLeft">Average</label>
                        <input id="multiServer_average" type="text" class="inputText small">
                    </div>

                    <div class="field" class="multiServerSD">
                        <label for="multiServer_stdDeviation" class="labelLeft">Standard deviation</label>
                        <input type="text" id="multiServer_stdDeviation" class="inputText small">
                    </div>
                    <div class="field">
                        <label for="multiServer_sequence" class="labelLeft">Random number generation seed</label>
                        <input id="multiServer_sequence" type="text" class="inputText small">
                    </div>
                    
                </fieldset><br>
                <div class="field">
                    <label for="ms_probability" class="labelLeft">Probability</label>
                    <input id="ms_probability" type="text" class="inputText small">
                </div>
                <input id="btCancel" type="button" value="Cancel" class="button">
                <input id ="btSubmit" type="button" value="Ok" class="button">
            </form>
        </div>
    </body>
</html>