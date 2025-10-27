<div id="opParamBox" class="boxContent paramModal" style="display: none;">
    <div class="btCloseDiv cf">
        <span class="boxTitle">Parametrize the model</span>
        <span id="opParam-btClose"><img src="img/btClose.png"/></span>
    </div>

    <div id="opParam-form" class="standardForm">
        <form class="right">
            <fieldset>
                <legend>Language</legend>
                <select id="opParam_library" class="inputText">
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
                    <label for="opParam_batchSize" class="labelLeft">Batch size</label>
                    <input id="opParam_batchSize" type="text" class="inputText small">
                </div>


                <div class="field" id="seed">
                    <label for="opParam_seed" class="labelLeft">Random number generation seed</label>
                    <input id="opParam_seed" type="text" class="inputText small" min="0" max="15" step="1">
                </div>                                 
            <!--<fieldset>
                <legend>Model type</legend>-->

                <div class="fieldRow">
                    <!--<input id="opParam_execTimeOp" type="radio" name="modeltype" value="execTime">-->
                    <label for="opParam_execTime">Execution time</label>
                    <input id="opParam_execTime" type="text" class="inputText small" >
                </div><br>

                <!--<div class="fieldRow">
                    <input id="opParam_maxEntitiesOp" type="radio" name="modeltype" value="maxEntities">
                    <label for="opParam_maxEntitiesOp">Max number of entities</label>
                    <input id="opParam_maxEntities" type="text" class="inputText small">
                </div>
            </fieldset>-->

            <fieldset id="warmup_fieldset">
                <legend>Warmup Time</legend>

                <input id="opParam_timeAutomatic"type="radio" name="warmupTime" checked>
                <label for="opParam_timeAutomatic" class="labelLeft">Automatic</label>

                <input id="opParam_timeDefined" type="radio" name="warmupTime">
                <label for="opParam_timeDefined" class="labelLeft">Defined</label>

                <input id="opParam_definedValue" type="text" class="inputText small">
            </fieldset>

            <input id ="chegada-bt" type="button" value="Arrival" class="button">

            <input id ="opParam-btSubmit" type="button" value="Ok" class="button"><!-- onclick="checkModelType()">-->


        </form>
    </div>
</div>
