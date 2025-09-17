document.getElementById("opRename-btSubmit").addEventListener("click", function() {
    const filename = document.getElementById("opOpen-filename").value;
    if (!filename) {
        alert("Selecione um arquivo primeiro.");
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
        alert("Digite um novo nome.");
        return;
    }

    $.ajax({
        url: "qnetwork?cmd=rename",
        type: "POST",
        data: { oldName: oldName, newName: newName },
        success: function() {
            alert("Arquivo renomeado com sucesso!");
            document.querySelector('.file-row-open[data-filename="' + oldName + '"] .file-col').textContent = newName;
            document.querySelector('.file-row-open[data-filename="' + oldName + '"]').dataset.filename = newName;
            document.getElementById("opOpen-filename").value = newName;
        },
        error: function(xhr, thrownError) {
            var errorHeader = xhr.getResponseHeader('fot-error');
            alert(errorHeader !== null ? errorHeader : thrownError);
        },
        complete: function() {
            document.getElementById("renameModal").style.display = "none";
        }
    });
};

