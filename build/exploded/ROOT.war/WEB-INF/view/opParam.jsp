<%-- 
    Document   : opParameters
    Created on : 23/05/2014, 16:16:07
    Author     : Felipe Osorio Thomé
    Author     : Marcela Tiemi Shinzato
--%>
<div id="op-param-box" class="box-content param-modal" style="display: none;">
    <div class="bt-close-div cf">
        <span class="box-title">Parametrize the model</span>
        <span id="op-param-bt-close"><img src="img/btClose.png"/></span>
    </div>

    <div id="op-param-form" class="standard-form">
        <form class="right">
            <fieldset>
                <legend>Language</legend>
                <select id="op-param-library" class="input-text">
                    <!--<option value="R">R</option>-->
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C SMPL">C SMPL</option>
                    <option value="C SMPLX">C SMPLX</option>
                </select>
            </fieldset>

            <fieldset>
                <legend>General</legend>

                <div class="field">
                    <label for="op-param-batch-size" class="label-left">Batch size</label>
                    <input id="op-param-batch-size" type="text" class="input-text small">
                </div>
                
                <div class="field" id="seed">
                    <label for="op-param-seed" class="label-left">Random number generation seed</label>
                    <input id="op-param-seed" type="text" class="input-text small" min="0" max="15" step="1">
                </div>                                 
            

                <div class="field">
                    <label for="op-param-exec-time" class="label-left">Execution time</label>
                    <input id="op-param-exec-time" type="text" class="input-text small" >
                </div><br>

            <fieldset id="warmup-fieldset">
                <legend>Warmup Time</legend>

                <input id="op-param-time-automatic"type="radio" name="warmup-time" checked>
                <label for="op-param-time-automatic" class="label-left">Automatic</label>

                <input id="op-param-time-defined" type="radio" name="warmup-time">
                <label for="op-param-time-defined" class="label-left">Defined</label>

                <input id="op-param-defined-value" type="text" class="input-text small">
            </fieldset>
            <input id ="arrival-bt" type="button" value="Arrival" class="button">
            <input id ="op-param-bt-submit" type="button" value="Ok" class="button">
        </form>
    </div>
</div>
