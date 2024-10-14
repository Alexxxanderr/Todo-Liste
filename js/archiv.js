"use strict";

function ins_archiv(eintragId) {
    // Finde den Index des Eintrags im "eintraege"-Array
    const index = eintraege.findIndex(eintrag => eintrag.id === eintragId);
    
    // Überprüfen, ob der Eintrag gefunden wurde
    if (index !== -1) {
        let eintrag = eintraege[index];

        // Überprüfe, ob es sich um den Beispiel-Eintrag handelt
        if (eintrag.isExample) {
            showAlert("Der Beispiel-Eintrag kann nicht archiviert werden.");
            return; // Beende die Funktion
        }

        // Entferne den Eintrag aus "eintraege" und speichere ihn
        const [archivierterEintrag] = eintraege.splice(index, 1);

        // Füge den Eintrag zum "archiv"-Array hinzu
        archiv.push(archivierterEintrag);

        // Aktualisiere das Archiv in der UI
        render_archiv(); 

        eintraege_speichern();
        archiv_speichern();

        // Aktualisiere die normale UI, um den verschobenen Eintrag zu entfernen
        updateUI(); 
    } else {
        console.log('Eintrag nicht gefunden.');
    }
}

function render_archiv() {
    const container_archiv = document.querySelector(".container_archiv");

    // Entferne alle bisherigen archivierten Einträge aus dem Container
    container_archiv.innerHTML = "";

    // Falls das Archiv leer ist, zeige den Platzhaltertext an
    if (archiv.length === 0) {
        container_archiv.innerHTML = "<p>Es gibt noch keine Aufgaben im Archiv.</p>";
    } else {
        // Rendere alle archivierten Einträge neu
        archiv.forEach(eintrag => {
            const archiv_eintrag = html_archiv_eintrag(eintrag); // Nutze eine spezielle Funktion für archivierte Einträge
            
            // Überprüfen, ob das Erinnerungsdatum abgelaufen ist, und wenn ja, rot einfärben
            if (new Date(eintrag.erinnerung) < new Date()) {
                archiv_eintrag.querySelector(".erinnerung_datum").classList.add("erinnerung_datum_rot");
            }

            // Überprüfen, ob das Fälligkeitsdatum abgelaufen ist, und wenn ja, rot einfärben
            if (new Date(eintrag.faellig) < new Date()) {
                archiv_eintrag.querySelector(".faellig_datum").classList.add("faellig_datum_rot");
            }

            // Füge den archivierten Eintrag zum Container hinzu
            container_archiv.appendChild(archiv_eintrag);
        });
    }

    // Zeige den Archiv-Container an
    container_archiv.style.display = "none";
}

// Funktion, die speziell archivierte Einträge ohne Bearbeitungsfunktionen rendert
function html_archiv_eintrag(eintrag) {
    let task = document.createElement("div");
    task.setAttribute("class", "task");

    let task_info = document.createElement("div");
    task_info.setAttribute("class", "task-info");

    let task_floating = document.createElement("div");
    task_floating.setAttribute("class", "task-floating");
    task_floating.setAttribute("data-id", eintrag.id);

    let task_titel = document.createElement("div");
    task_titel.setAttribute("class", "task-title durchgestrichen ellipsis"); // Durchgestrichen für archivierte Einträge
    task_titel.innerHTML = eintrag.name;

    let task_details = document.createElement("div");
    task_details.setAttribute("class", "task-details durchgestrichen");

    let faellig_datum = document.createElement("div");
    faellig_datum.setAttribute("class", "faellig_datum");
  
    let erinnerung_datum = document.createElement("div");
    erinnerung_datum.setAttribute("class", "erinnerung_datum");

    // Fälligkeitsdatum und Erinnerung formatieren
    let faellig = new Date(eintrag.faellig).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    let erinnerung = datum_de(eintrag.erinnerung);

    // Fälligkeits- und Erinnerungsinformationen hinzufügen
    if (eintrag.faellig !== "") {
        faellig_datum.innerHTML = `&nbsp;<i style="font-size:13px" class="fa">&#xf073;</i>&nbsp; ${faellig}`;
        task_details.appendChild(faellig_datum);
    }

    if (eintrag.erinnerung !== "") {
        erinnerung_datum.innerHTML = `&#128276; ${erinnerung} Uhr`;
        task_details.appendChild(erinnerung_datum);
    }

    task_floating.appendChild(task_titel);
    task_floating.appendChild(task_details);
    task_info.appendChild(task_floating);
    task.appendChild(task_info);

    // Hier füge ich das "Wiederherstellen"-Icon hinzu
    let task_actions = document.createElement("div");
    task_actions.setAttribute("class", "task-actions");

    let restore_icon = document.createElement("i");
    restore_icon.setAttribute("class", "fa-solid fa-rotate-left");
    restore_icon.setAttribute("title", "Wiederherstellen");

    let i_loeschen = document.createElement("i");
    i_loeschen.setAttribute("class", "fa-solid fa-trash-can");
    i_loeschen.onclick = () => archiv_loeschen(eintrag.id);
    
    // Event Listener, um den Eintrag wiederherzustellen
    restore_icon.onclick = () => aus_archiv(eintrag.id);

    task_actions.appendChild(restore_icon);
    task_actions.appendChild(i_loeschen);
    task.appendChild(task_actions);

    return task; // Gib das HTML-Element zurück
}

function archiv_loeschen(eintragID) {
    let confirmed = confirm('Willst du endgültig diese Aufgabe löschen?'); 
	if (confirmed) {
        archiv = archiv.filter(eintrag => eintrag.id !== eintragID);
        archiv_speichern();
        eintraege_speichern()
        render_archiv(); 
    }
}

// Funktion, um einen Eintrag aus dem Archiv wiederherzustellen
function aus_archiv(eintragId) {
    // Finde den Index des Eintrags im "archiv"-Array
    const index = archiv.findIndex(eintrag => eintrag.id === eintragId);

    // Überprüfen, ob der Eintrag gefunden wurde
    if (index !== -1) {
        // Entferne den Eintrag aus dem "archiv"-Array und füge ihn wieder ins "eintraege"-Array hinzu
        const [wiederhergestellterEintrag] = archiv.splice(index, 1);
        eintraege.unshift(wiederhergestellterEintrag);

        archiv_speichern();
        eintraege_speichern()

        // Aktualisiere das Archiv in der UI
        render_archiv();

        // Aktualisiere die normale UI, um den wiederhergestellten Eintrag anzuzeigen
        updateUI();
    } else {
        console.log('Eintrag nicht gefunden.');
    }
}
