function getNoteCount() {
    var default_result = 12;

    // Get URL parameter.
    var url = new URL(window.location.href);
    var valueString = url.searchParams.get("notes");
    if (valueString === null) {
        return default_result;
    }

    // Parse URL parameter.
    var valueInt = Number.parseInt(valueString);
    if (Number.isNaN(valueInt) || valueInt < 1 || valueInt > 12 || (12 % valueInt != 0)) {
        return default_result;
    }
    return valueInt;
}

function createNoteButton(index, note) {
    var noteSpan = document.createElement("span");
    var button = document.createElement("button");
    var label = document.createElement("input");

    // Note span (button + label input).
    noteSpan.setAttribute("class", "note-span");

    // Button.
    button.setAttribute("class", "note-button");
    button.innerHTML = index.toString();
    var onpush = function() {
        play(note);
    }
    var onrelease = function() {
        if(stop()) {
            label.select();
            label.focus();
        }
    }
    button.onmousedown = onpush;
    button.onmouseup =  onrelease;
    button.onmouseleave = onrelease;

    // Label input.
    label.setAttribute("class", "note-label");
    label.setAttribute("type", "text");

    noteSpan.appendChild(button);
    noteSpan.appendChild(label);
    return noteSpan;
}

function initialize() {
    var noteCount = getNoteCount();
    document.getElementById("header").innerHTML="Using " + noteCount + " notes";

    var sequence = document.getElementById("sequence");
    var rowCount = 25;
    var colCount = 4;
    for (var row = 0; row < rowCount; ++row) {
        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row-div");
        for (var col = 0; col < colCount; ++col) {
            // Pick random notes spaced equally. Use C (value "3") as a starting point.
            var note = Math.floor(Math.random() * noteCount) * (12 / noteCount) + 3;
            var index = row + rowCount * col;
            var button = createNoteButton(index, note);
            rowDiv.appendChild(button);
        }
        sequence.appendChild(rowDiv);
    }
}
