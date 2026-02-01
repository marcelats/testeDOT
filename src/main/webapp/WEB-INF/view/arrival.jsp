<%-- 
    Document   : opParameters
    Created on : 23/05/2014, 16:16:07
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
        <div class="small-box-content arrival-modal">
           <span class="box-title">Arrivals</span>
           <div>
                <input id ="prev-bt" type="button" value="Prev" class="button">
                <input id ="next-bt" type="button" value="Next" class="button">
                <input id ="new-bt" type="button" value="New" class="button">
                <input id ="save-bt" type="button" value="Save" class="button">
                <input id ="del-bt" type="button" value="Del" class="button">
           </div>
           
           <div class="field">
                <label for="number-clients" class="label-left">Number of clients</label>
                <input id="number-clients" type="text" class="input-text small">
            </div>
           
           <div class="field">
                <label for="arrival-time" class="label-left">Arrival time</label>
                <input id="arrival-time" type="text" class="input-text small">
            </div>
           
           <fieldset>
                <legend>Service center</legend>
                <select id="service-center" class="input-text">
                </select>
            </fieldset>
                        
           
           <div><input id ="arrival-bt-submit" type="button" value="Ok" class="button"></div>
        </div>
    </body>
</html>

