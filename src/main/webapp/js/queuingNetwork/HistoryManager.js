define([], function () {

    function HistoryManager() {
        this.undoStack = [];
        this.redoStack = [];
    }

    HistoryManager.prototype.execute = function (command) {
        command.redo();
        this.undoStack.push(command);
        this.redoStack = [];
    };

    HistoryManager.prototype.undo = function () {
        const command = this.undoStack.pop();
        if (!command) return;

        command.undo();
        this.redoStack.push(command);
    };

    HistoryManager.prototype.redo = function () {
        const command = this.redoStack.pop();
        if (!command) return;

        command.redo();
        this.undoStack.push(command);
    };

    return new HistoryManager();
});
