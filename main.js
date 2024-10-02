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
const closeViewModal = document.querySelector(".close-view");
const closeEditModal = document.querySelector(".close-edit");
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
openModalBtn_archiv.onclick = () => open_archiv();

window.onclick = (event) => {
    if (event.target == modal) closeModal(modal);
};

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
        completed: false,
        isExample: false
    });

    updateUI();
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
    let confirmed = confirm('Willst du wirklich diese Aufgabe löschen?'); 
	if (confirmed) {
        eintraege = eintraege.filter(eintrag => eintrag.id !== id);
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

        openModal(viewTaskModal);
    } else {
        console.error("Aufgabe nicht gefunden!");
    }
}



// Bearbeiten von Aufgaben/Einträgen
function bearbeiten(eintragId) {
    const eintrag = eintraege.find(e => e.id === eintragId);
    if (eintrag && eintrag.isExample) {
        showAlert("Der Beispiel-Eintrag kann nicht bearbeitet werden.");
        return;
    }

    if (eintrag) {
        openModal(editModal);
        currentlyEditingId = eintragId;
        document.querySelector("#editAufgabe").value = eintrag.name;
        document.querySelector("#editFaellig").value = eintrag.faellig;
        document.querySelector("#editErinnerung").value = eintrag.erinnerung;
        document.querySelector("#notizen").value = eintrag.notizen;
    }
}

// Eventlistener für das Bearbeiten von Aufgaben/Einträgen
editTaskBtn.addEventListener("click", e => {
    e.preventDefault();
    if (currentlyEditingId !== null) {
        const eintragToUpdate = eintraege.find(e => e.id === currentlyEditingId);
        if (eintragToUpdate) {
            eintragToUpdate.name = document.querySelector("#editAufgabe").value;
            eintragToUpdate.faellig = document.querySelector("#editFaellig").value;
            eintragToUpdate.erinnerung = document.querySelector("#editErinnerung").value;
            eintragToUpdate.notizen = document.querySelector("#notizen").value;
            updateUI();
            closeModal(editModal);
            currentlyEditingId = null;
        }
    }
});

// Schließen des Bearbeitungsmodals
closeViewModal.onclick = () => closeModal(viewTaskModal);
closeEditModal.onclick = () => closeModal(editModal);

// Erster Beispiel-Eintrag
if (eintraege.length === 0) {
    eintraege.push({
        name: "Aufgabentitel",
        faellig: "02.03.2024",
        erinnerung: "05.03.2025 15:00",
        id: "1727768393001",
        notizen: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        completed: false,
        isExample: true 
    });
}
html_eintrag(eintraege[0]);

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
