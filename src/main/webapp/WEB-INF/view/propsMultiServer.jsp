<%-- 
    Document   : multiServerProperties
    Created on : 11/02/2014, 19:19:32
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="ms-properties" class="standard-form">
            <form>
                <input type="hidden" id="caller-id">
                <input type="hidden" id="caller-type">

                <fieldset>
                    <legend>Server type</legend>
                    <div class="field">
                        <label for="ms-nbr-servers" class="label-left">Number of servers</label>
                        <input id="ms-nbr-servers" type="text" class="input-text small" value="1">
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Queue statistics</legend>
                    <div class="field">
                        <label for="ms-empty-queue" class="label-left">Empty queue</label>
                        <input id="ms-empty-queue" type="checkbox">
                    </div>

                    <div class="field">
                        <label for="ms-length" class="label-left">Length (max / min)</label>
                        <input id="ms-length" type="checkbox">
                    </div>
                </fieldset>

                <fieldset disabled id="ms-arrival-fieldset">
                    <legend>Arrival distribution</legend>
                    <div class="field">
                        <select id="ms-arrival-distribution" class="input-text">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="ms-arrival-average" class="label-left">Average</label>
                        <input id="ms-arrival-average" type="text" class="input-text small">
                    </div>

                    <div class="field" class="ms-arrival-sd">
                        <label for="ms-arrival-sd" class="label-left">Standard deviation</label>
                        <input type="text" id="ms-arrival-sd" class="input-text small">
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Service distribution</legend>
                    <div class="field">
                        <select id="ms-distribution" class="input-text">
                            <option>Exponential</option>
                            <option>HyperExponential</option>
                            <option>Normal</option>
                            <option>Uniform</option>
                            <option>Erlang</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="ms-average" class="label-left">Average</label>
                        <input id="ms-average" type="text" class="input-text small">
                    </div>

                    <div class="field" class="ms-sd">
                        <label for="ms-sd" class="label-left">Standard deviation</label>
                        <input type="text" id="ms-sd" class="input-text small">
                    </div>
                    
                </fieldset><br>
                <div class="field">
                    <input id ="ms-prob-bt" type="button" value="Probabilities" class="button">
                </div>
                <input id="ms-bt-cancel" type="button" value="Cancel" class="button">
                <input id ="ms-bt-submit" type="button" value="Ok" class="button">
            </form>
        </div>
    </body>
</html>