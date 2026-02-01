<%-- 
    Document   : serverProperties
    Created on : 04/02/2014, 05:18:58
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
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
        <div id="server-properties" class="standard-form">
            <form>
                <input type="hidden" id="caller-id">
                <input type="hidden" id="caller-type">

                <fieldset disabled id="queue-stats-fieldset">
                    <legend>Queue statistics</legend>
                    <div class="field">
                        <label for="server-empty-queue" class="label-left">Empty queue</label>
                        <input id="server-empty-queue" type="checkbox">
                    </div>

                    <div class="field">
                        <label for="server-length" class="label-left">Length (max / min)</label>
                        <input id="server-length" type="checkbox">
                    </div>
                </fieldset>

                <fieldset disabled id="arrival-fieldset">
                    <legend>Arrival distribution</legend>
                    <div class="field">
                        <select id="arrival-distribution" class="input-text">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                            <option value="None" style="display:none;"></option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="arrival-average" class="label-left">Average</label>
                        <input type="text" id="arrival-average" class="input-text small">
                    </div>

                    <div class="field">
                        <label for="arrival-sd" class="label-left">Standard deviation</label>
                        <input type="text" id="arrival-sd" class="input-text small" disabled>
                    </div>
                </fieldset>
                
                <fieldset id="fieldset-sd">
                    <legend>Service distribution</legend>
                    <div class="field">
                        <select id="server-distribution" class="input-text">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="server-average" class="label-left">Average</label>
                        <input type="text" id="server-average" class="input-text small">
                    </div>

                    <div class="field">
                        <label for="server-sd" class="label-left">Standard deviation</label>
                        <input type="text" id="server-sd" class="input-text small">
                    </div>
                </fieldset><br>
                <div class="field">
                    <input id ="prob-bt" type="button" value="Probabilities" class="button">
                </div>

                <input id="server-bt-cancel" type="button" value="Cancel" class="button">
                <input id ="server-bt-submit" type="button" value="Ok" class="button">
            </form>
        </div>
    </body>
</html>