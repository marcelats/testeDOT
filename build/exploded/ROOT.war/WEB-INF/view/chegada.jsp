<%-- 
    Document   : opParameters
    Created on : 23/05/2014, 16:16:07
    Author     : Felipe Osorio Thomé
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div class="boxContent arrivalModal">
           <span class="boxTitle">Arrivals</span>
           <div>
                <input id ="prev-bt" type="button" value="Prev" class="button">
                <input id ="next-bt" type="button" value="Next" class="button">
                <input id ="new-bt" type="button" value="New" class="button">
                <input id ="save-bt" type="button" value="Save" class="button">
                <input id ="del-bt" type="button" value="Del" class="button">
           </div>
           
           <div class="field">
                <label for="number_clients" class="labelLeft">Number of clients</label>
                <input id="number_clients" type="text" class="inputText small">
            </div>
           
           <div class="field">
                <label for="arrival_time" class="labelLeft">Arrival time</label>
                <input id="arrival_time" type="text" class="inputText small">
            </div>
           
           <fieldset>
                <legend>Service center</legend>
                <select id="service_center" class="inputText">
                </select>
            </fieldset>
                        
           
           <div><input id ="chegada-btSubmit" type="button" value="Ok" class="button"></div>
        </div>
    </body>
</html>

