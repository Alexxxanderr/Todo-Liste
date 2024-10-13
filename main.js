"use strict";

// Allgemeine Selektoren
const modal = document.getElementById("myModal");
const btn = document.getElementById("openModalBtn");
const span = document.getElementsByClassName("close")[0];
const form = document.getElementById("popupForm");
const btn_close = document.getElementById("button_close");
const subheader = document.querySelector(".subheader");
const viewTaskModal = document.getElementById("viewTaskModal");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeViewModal = document.querySelector(".close-view");
const closeEditModal = document.querySelector(".close-edit");
const closeEditForm = document.querySelector("#closeEditForm");
const editTaskBtn = document.getElementById("editTask");
const openModalBtn_archiv = document.getElementById("openModalBtn_archiv");
const container_archiv = document.querySelector(".container_archiv"); // Archivcontainer

let eintraege = [];
let archiv = [];
let currentlyEditingId = null;

// Datum anzeigen
function datum_anzeigen() {
    let datum_heute = new Date();
    let datum_heute_DE = datum_heute.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });
    subheader.innerHTML = datum_heute_DE;
}

datum_anzeigen();
setInterval(datum_anzeigen, 60000);

// Allgemeine Funktion für das Öffnen und Schließen von Modals
function openModal(modalElement) {
    modalElement.style.display = "block";
}

function closeModal(modalElement) {
    modalElement.style.display = "none";
}

// Archiv anzeigen/ausblenden
function open_archiv() {
    if (container_archiv.style.display === "none" || container_archiv.style.display === "") {
        container_archiv.style.display = "block"; // Archiv anzeigen
    } else {
        container_archiv.style.display = "none"; // Archiv ausblenden
    }
}

// Modal Event Listener (allgemein)
btn.onclick = () => openModal(modal);
span.onclick = () => closeModal(modal);
btn_close.onclick = () => closeModal(modal);
closeViewModal.onclick = () => closeModal(modal);
closeEditForm.onclick = () => closeModal(editModal);
openModalBtn_archiv.onclick = () => open_archiv();

window.onclick = (event) => {
    if (event.target == modal) closeModal(modal);
};

// Hier ist der Beginn. Eingabe von Aufgaben.
form.addEventListener("submit", event => {

    event.preventDefault();
    let name = document.getElementById("aufgabe").value.trim();
    let faellig = document.getElementById("faellig").value;
    let erinnerung = document.getElementById("erinnerung").value;

    if (name.length < 3) {
        showAlert("Der Aufgabentitel muss mindestens 3 Zeichen lang sein.");
        return; // Bricht die Ausführung ab, wenn der Titel zu kurz ist
    }

    const beispiel_eintrag = eintraege.findIndex(eintrag => eintrag.id === "1727768393001");
    if (beispiel_eintrag !== -1) {
        eintraege.splice(beispiel_eintrag, 1);
    }

    eintraege.push({
        name: name,
        faellig: faellig,
        erinnerung: erinnerung,
        notizen: "",
        id: Date.now(),
        completed: false,
        isExample: false
    });

    // Ab Hier der Sprung in die updateUI();
    updateUI();
    eintraege_speichern();
    form.reset();
    closeModal(modal);
});

// Anzeigen der Aufgaben.
// Das Intervall für die regelmäßige Aktualisierung der UI.
// Dient hauptsächlich der dynamischen Anzeige von Erinnerungen und Fälligkeiten.
setInterval(function() {
    updateUI();  
}, 60000);

// Löschen von Aufgaben
function loeschen(id) {
    let confirmed = confirm('Willst du endgültig löschen oder doch zuerst ins Archiv verschieben?! Dann klick auf Abbrechen.'); 
	if (confirmed) {
        eintraege = eintraege.filter(eintrag => eintrag.id !== id);
        eintraege_speichern();
        updateUI(); 
    }
}

// Anzeigen von Details der Aufgaben sobald man auf die Aufgabe klickt.
function anzeigen(eintragId) {
    const eintrag = eintraege.find(e => e.id === eintragId); 
    if (eintrag) {
        
        let datum_DE = datum_de(eintrag.erinnerung);

        let faellig = new Date(eintrag.faellig);
        faellig = faellig.toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        document.getElementById("viewAufgabe").textContent = eintrag.name;
        document.getElementById("viewFaellig").textContent = faellig !== "Invalid Date" ? "Am " + faellig : "";
        document.getElementById("viewErinnerung").textContent = datum_DE ? "Am " + datum_DE + " Uhr" : "";
        document.getElementById("viewNotizen").textContent = eintrag.notizen;
        document.getElementById("viewNotizen").textContent = eintrag.notizen;

        // Leere den bisherigen Inhalt in "dateien"
        document.getElementById("dateien").innerHTML = "";

        // Erstelle ein neues Div-Element zur Dateianzeige und hänge es an das <p id="dateien"> an
        const fileItemDiv = document.createElement('div');
        fileItemDiv.classList.add('file-item');
        document.getElementById("dateien").appendChild(fileItemDiv);

        // Zeige die Dateien an, aber ohne Lösch-Icons
        displayFiles(eintragId, false);

        openModal(viewTaskModal);
    } else {
        console.error("Aufgabe nicht gefunden!");
    }
}

// Funktion: Bearbeiten von Aufgaben/Einträgen
function bearbeiten(eintragId) {
    const eintrag = eintraege.find(e => e.id === eintragId);

    if (eintrag && eintrag.isExample) {
        showAlert("Der Beispiel-Eintrag kann nicht bearbeitet werden.");
        return;
    }

    if (eintrag) {
        openModal(editModal);
        currentlyEditingId = eintragId;

        // Setze die Formulardaten
        document.querySelector("#editAufgabe").setAttribute("data-id", eintragId);
        document.querySelector("#editAufgabe").value = eintrag.name;
        document.querySelector("#editFaellig").value = eintrag.faellig;
        document.querySelector("#editErinnerung").value = eintrag.erinnerung;
        document.querySelector("#notizen").value = eintrag.notizen;

        // Verhindere, dass der Dateibereich aus einer alten Aufgabe falsche Dateien anzeigt
        const fileList = document.querySelector('#editModal .file-item');
        fileList.innerHTML = '<p>Keine Dateien hochgeladen.</p>';

        // Lade die Dateien für die aktuelle Aufgabe asynchron
        setTimeout(() => {
            displayFiles(eintragId, true, '#editModal .file-item'); // Passendes Ziel-Element für das editModal
        }, 100); // Ein kleiner Timeout, um sicherzustellen, dass die Aufgabe-Daten korrekt geladen sind
    }
}

// Eventlistener für den Button Änderungen speichern
editTaskBtn.addEventListener("click", e => {
    e.preventDefault();
    if (currentlyEditingId !== null) {
        const eintragToUpdate = eintraege.find(e => e.id === currentlyEditingId);
        if (eintragToUpdate) {
            eintragToUpdate.name = document.querySelector("#editAufgabe").value;
            eintragToUpdate.faellig = document.querySelector("#editFaellig").value;
            eintragToUpdate.erinnerung = document.querySelector("#editErinnerung").value;
            eintragToUpdate.notizen = document.querySelector("#notizen").value;
            eintraege_speichern();
            editForm.reset();
            updateUI();
            closeModal(editModal);
            currentlyEditingId = null;
        }
    }
});

// Schließen des Bearbeitungsmodals
closeViewModal.onclick = () => closeModal(viewTaskModal);
closeEditModal.onclick = () => closeModal(editModal);

// Stellt Einträge aus dem LocalStorage wiederher
eintraege_wiederherstellen();
archiv_wiederherstellen();

// Erster Beispiel-Eintrag
if (!localStorage.getItem("eintraege")) {
    eintraege.push({
        name: "Aufgabentitel",
        faellig: "02.03.2024",
        erinnerung: "05.03.2025 15:00",
        id: "1727768393001",
        notizen: "Lorem ipsum dolor sit amet...",
        completed: false,
        isExample: true
    });
}
html_eintrag(eintraege[0]);

// Selbsterklärend
updateUI();
render_archiv(); 

// Aufruf viewModal für den ersten Beispiel-Eintrag
document.querySelector(".task-floating").addEventListener("click", function() {
        anzeigen("1727768393001");
});

// Das Escapen von Modals
document.addEventListener("keyup", e => {
        if(e.key === "Escape"){
            modal.style.display = "none";
            viewTaskModal.style.display = "none";
            editModal.style.display = "none";
            form.reset();
        }
});

// Custom Alert Meldung
function showAlert(message) {
    document.getElementById("modalBody").innerText = message;
    document.getElementById("alertModal").style.display = "block";
};

document.getElementById("closeModal").onclick = function() {
    document.getElementById("alertModal").style.display = "none"; 
};

window.onclick = function(event) {
    const modal = document.getElementById("alertModal");
    if (event.target === modal) {
        modal.style.display = "none"; 
    }
};

