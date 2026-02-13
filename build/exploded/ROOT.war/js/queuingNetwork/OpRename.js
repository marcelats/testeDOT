/*
 * author: Marcela Tiemi Shinzato
 */
document.getElementById("opRename-btSubmit").addEventListener("click", function() {
    const filename = document.getElementById("opOpen-filename").value;
    if (!filename) {
        lightBoxManager.showAlert("Select a file first.");
        return;
    }
    document.getElementById("renameTitle").textContent = "Rename " + filename + " to:";
    document.getElementById("renameInput").value = "";
    document.getElementById("renameModal").style.display = "block";
});

document.getElementById("renameClose").onclick =
document.getElementById("renameCancel").onclick = function() {
    document.getElementById("renameModal").style.display = "none";
};

document.getElementById("renameOk").onclick = function() {
    const newName = document.getElementById("renameInput").value.trim();
    const oldName = document.getElementById("opOpen-filename").value;

    if (!newName) {
        lightBoxManager.showAlert("Input a new file name.");
        return;
    }

    $.ajax({
        url: "qnetwork?cmd=rename",
        type: "POST",
        data: { oldName: oldName, newName: newName },
        success: function() {
            lightBoxManager.showAlert("The file was renamed.");
            document.querySelector('.file-row-open[data-filename="' + oldName + '"] .file-col').textContent = newName;
            document.querySelector('.file-row-open[data-filename="' + oldName + '"]').dataset.filename = newName;
            document.getElementById("opOpen-filename").value = newName;
        },
        error: function(xhr, thrownError) {
            var errorHeader = xhr.getResponseHeader('fot-error');
            lightBoxManager.showAlert(errorHeader !== null ? errorHeader : thrownError);
        },
        complete: function() {
            document.getElementById("renameModal").style.display = "none";
        }
    });
};

