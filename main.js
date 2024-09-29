"use strict";

// Elemente holen
let modal = document.getElementById("myModal");
let btn = document.getElementById("openModalBtn");
let span = document.getElementsByClassName("close")[0];
let form = document.getElementById("popupForm");
let btn_close = document.getElementById("button_close");

let eintraege = [];

// Das Modal öffnen, wenn auf den Button geklickt wird
btn.onclick = function() {
    modal.style.display = "block";
}

// Das Modal schließen, wenn auf die Schließen-Schaltfläche geklickt wird
span.onclick = function() {
    modal.style.display = "none";
}
btn_close.onclick = function() {
    modal.style.display = "none";
}

// Das Modal schließen, wenn außerhalb des Modals geklickt wird
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Formularübertragung verarbeiten
form.addEventListener("submit", event => {

    event.preventDefault();
    let name = document.getElementById("aufgabe").value;
    let faellig = document.getElementById("faellig").value;
    let erinnerung = document.getElementById("erinnerung").value;

    if(eintraege[0].name === "Aufgabentitel"){
        eintraege.pop(eintraege[0]);
    }

    eintraege.push({
        name: name,
        faellig: faellig,
        erinnerung: erinnerung,
        notizen: "",
        id: Date.now(),
        completed: false
    });

    updateUI();

    // Formularfelder nach dem Hinzufügen zurücksetzen
    document.querySelector("#aufgabe").value = "";
    document.querySelector("#faellig").value = "";
    document.querySelector("#erinnerung").value = "";

    modal.style.display = "none";
});

// Anzein der Aufgaben
function updateUI() {
    document.querySelectorAll(".container .task").forEach(e => {
        e.remove();
    });
    
    for (let eintrag of eintraege) {
        html_eintrag(eintrag);
    }
}

// Löschen von Aufgaben
function loeschen(id) {
    let check = confirm('Willst du wirklich diese Aufgabe löschen?'); 
	if (check === true) {
        eintraege = eintraege.filter(eintrag => eintrag.id !== id);
        updateUI(); 
    }
}




// Modal für Bearbeiten
const editModal = document.getElementById("editModal");
const closeEditModal = document.querySelector(".close-edit");
const editTaskBtn = document.getElementById("editTask");

// Variable zur Speicherung der ID des zu bearbeitenden Eintrags
let currentlyEditingId = null;

// Beispiel für das Öffnen des Bearbeitungsformulars
function bearbeiten(eintragId) {
    editModal.style.display = "block";

    // Speichere die aktuelle Eintrags-ID, die bearbeitet wird
    currentlyEditingId = eintragId;

    // Finde die Aufgabe und fülle das Formular mit den aktuellen Werten
    const eintrag = eintraege.find(e => e.id === eintragId);
    if (eintrag) {
        document.querySelector("#editAufgabe").value = eintrag.name;
        document.querySelector("#editFaellig").value = eintrag.faellig;
        document.querySelector("#editErinnerung").value = eintrag.erinnerung;
        document.querySelector("#notizen").value = eintrag.notizen;
    }
}

// Event Listener zum Speichern der Änderungen (wird nur einmalig hinzugefügt)
editTaskBtn.addEventListener("click", e => {
    e.preventDefault();

    // Prüfe, ob currentlyEditingId gesetzt ist
    if (currentlyEditingId !== null) {
        // Finde den Eintrag und aktualisiere ihn mit den neuen Werten
        const eintragToUpdate = eintraege.find(e => e.id === currentlyEditingId);
        if (eintragToUpdate) {
            eintragToUpdate.name = document.querySelector("#editAufgabe").value;
            eintragToUpdate.faellig = document.querySelector("#editFaellig").value;
            eintragToUpdate.erinnerung = document.querySelector("#editErinnerung").value;
            eintragToUpdate.notizen = document.querySelector("#notizen").value;

            // UI aktualisieren
            updateUI();

            // Modal schließen und ID zurücksetzen
            editModal.style.display = "none";
            currentlyEditingId = null;
        }
    }
});

// Schließen des Bearbeitungsmodals
closeEditModal.onclick = () => {
    editModal.style.display = "none";
    currentlyEditingId = null;  // Setze die aktuell bearbeitete Aufgabe zurück
};

document.getElementById("closeEditForm").onclick = () => {
    editModal.style.display = "none";
    currentlyEditingId = null;  // Setze die aktuell bearbeitete Aufgabe zurück
};




// Erster Beispiel-Eintrag
if(eintraege.length === 0){
    eintraege.push({
        name: "Aufgabentitel",
        faellig: "02.03.2024",
        erinnerung: "05.03.2024 15:00",
        notizen: "",
        completed: false
    });
}

html_eintrag(eintraege[0]);