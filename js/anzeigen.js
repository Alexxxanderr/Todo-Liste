"use strict";

// Diese Funktion erstellt die HTML-Struktur einer Aufgabe und fügt sie in die Benutzeroberfläche ein. 
// Sie verarbeitet auch Aufgabenattribute wie Fälligkeitsdatum, Erinnerung und Bearbeitungs-/Lösch-Optionen.
function html_eintrag(eintrag) {
    
    if (!eintrag) {
        console.error('Der Eintrag ist nicht definiert.');
        return;
    }

    // Konvertiert die Erinnerungs- und Fälligkeitsdaten in deutsche Datumsformate, 
    let faellig = new Date(eintrag.faellig);
    faellig = faellig.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    let erinnerung = datum_de(eintrag.erinnerung);
    
    // Erstellt verschiedene HTML-Elemente zur Darstellung einer Aufgabe, 
    // inklusive einer Checkbox, dem Titel, Details, sowie den Fälligkeits- und Erinnerungsdaten.
    let task = document.createElement("div");
    task.setAttribute("class", "task");

    let task_info = document.createElement("div");
    task_info.setAttribute("class", "task-info");

    let checkbox = document.createElement("input");
    checkbox.setAttribute("class", "checkbox");
    checkbox.setAttribute("type", "checkbox");

    let task_floating = document.createElement("div");
    task_floating.setAttribute("class", "task-floating");
    task_floating.setAttribute("data", eintrag.id);
    task_floating.setAttribute("data-id", eintrag.id);

    let task_titel = document.createElement("div");
    task_titel.setAttribute("class", "task-title ellipsis");
    task_titel.innerHTML = eintrag.name;

    let task_details = document.createElement("div");
    task_details.setAttribute("class", "task-details");

    let faellig_datum = document.createElement("div");
    faellig_datum.setAttribute("class", "faellig_datum");
  
    let erinnerung_datum = document.createElement("div");
    erinnerung_datum.setAttribute("class", "erinnerung_datum");

    // File-Upload-Element der Aufgabe zuordnen
    let fileUpload = document.querySelector("#fileUpload");
    fileUpload.onclick = () => uploadFile(eintrag.id);

    // Überprüft, ob ein Fälligkeitsdatum und/oder eine Erinnerung vorhanden ist und zeigt die entsprechenden Informationen an.
    // Wenn keine Daten vorhanden sind, wird eine Aufforderung zum Setzen von Datum oder Erinnerung angezeigt.
    if (eintrag.faellig === "" && eintrag.erinnerung === "") {
        task_details.innerHTML = "Setze ein Fälligkeitsdatum oder eine Erinnerung.";
        task_details.classList.add("extra_padding_left");
    } else if (eintrag.faellig !== "" && eintrag.erinnerung === "") {
        faellig_datum.innerHTML = `&nbsp;<i style="font-size:13px" class="fa">&#xf073;</i>&nbsp; ${faellig}`;
        task_details.insertAdjacentElement("beforeend", faellig_datum);
    } else if (eintrag.faellig === "" && eintrag.erinnerung !== "") {
        erinnerung_datum.innerHTML = `&#128276; ${erinnerung} Uhr`;
        task_details.insertAdjacentElement("beforeend", erinnerung_datum);
    } else {
        faellig_datum.innerHTML = `&nbsp;<i style="font-size:13px" class="fa">&#xf073;</i>&nbsp; ${faellig}`;
        erinnerung_datum.innerHTML = `&#128276; ${erinnerung} Uhr`;
        task_details.insertAdjacentElement("beforeend", faellig_datum);
        task_details.insertAdjacentElement("beforeend", erinnerung_datum);
    }

    // Überprüfe den Eintrag auf den "completed"-Status und wende das Durchstreichen an
    if (eintrag.completed) {
        task_titel.classList.add("durchgestrichen");
        task_details.classList.add("durchgestrichen");
        checkbox.checked = true;  // Checkbox auf "checked" setzen, wenn der Eintrag abgeschlossen ist
    } else {
        checkbox.checked = false;  // Checkbox auf "unchecked" setzen, wenn der Eintrag nicht abgeschlossen ist
    }

    // Fügt die verschiedenen Teile der Aufgabe (Titel, Details, Checkbox, Aktionen) in das HTML-Element ein
    // und positioniert die Aufgabe unterhalb der Subheader-Elemente in der Seite.
    task_floating.insertAdjacentElement("afterbegin", task_titel);
    task_floating.insertAdjacentElement("beforeend", task_details);
    task_info.insertAdjacentElement("afterbegin", checkbox);
    task_info.insertAdjacentElement("beforeend", task_floating);

    let task_actions = document.createElement("div");
    task_actions.setAttribute("class", "task-actions");

    let i_archive = document.createElement("i");
    i_archive.setAttribute("class", "fa-solid fa-box-archive");
    i_archive.setAttribute("title", "In das Archiv verschieben");
    i_archive.onclick = () => ins_archiv(eintrag.id);

    let i_bearbeiten = document.createElement("i");
    i_bearbeiten.setAttribute("class", "fa-solid fa-pen-to-square");
    i_bearbeiten.setAttribute("title", "Bearbeiten");
    i_bearbeiten.onclick = () => bearbeiten(eintrag.id);

    let i_loeschen = document.createElement("i");
    i_loeschen.setAttribute("class", "fa-solid fa-trash-can");
    i_loeschen.setAttribute("title", "Aufgabe löschen");
    i_loeschen.onclick = () => loeschen(eintrag.id);

    task_actions.insertAdjacentElement("afterbegin", i_loeschen);
    task_actions.insertAdjacentElement("afterbegin", i_bearbeiten);
    task_actions.insertAdjacentElement("afterbegin", i_archive);
    task.insertAdjacentElement("afterbegin", task_info);
    task.insertAdjacentElement("beforeend", task_actions);

    let subheader = document.querySelector(".subheader");
    subheader.insertAdjacentElement("afterend", task);

    // Zeige das Archiv-Symbol nur, wenn die Aufgabe abgeschlossen ist
    if (eintrag.completed) {
        i_archive.classList.remove("display_none");
    } else {
        i_archive.classList.add("display_none");
    }

    // Event-Listener zur Checkbox: Aktualisiert den Status der Aufgabe und das visuelle Erscheinungsbild
    checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            task_titel.classList.add("durchgestrichen");
            task_details.classList.add("durchgestrichen");
            i_archive.classList.remove("display_none");
            eintrag.completed = true;
        } else {
            task_titel.classList.remove("durchgestrichen");
            task_details.classList.remove("durchgestrichen");
            i_archive.classList.add("display_none");
            eintrag.completed = false;
        }

        // Speichere die Einträge erneut in `localStorage`, um den aktualisierten Status zu sichern
        eintraege_speichern();
    });

    return task;
}