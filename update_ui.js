"use strict";

function updateUI() {

    // Entfernt alle bestehenden Aufgaben im Container und zeigt dann alle Einträge aus der Liste an, 
    // wobei fällige Aufgaben und Erinnerungen visuell hervorgehoben werden, wenn sie bereits abgelaufen sind.
    // Es stellt eine Alarm-Funktion dar.
    let checkboxStatus = speicherCheckboxStatus();

    function eintraege_anzeigen(){
        document.querySelectorAll(".container .task").forEach(e => {
            e.remove();
        });
        
        for (let eintrag of eintraege) {
            html_eintrag(eintrag);

            if(new Date(eintrag.faellig) < new Date()){
                let faellig_rot = document.querySelector(".faellig_datum");
                faellig_rot.classList.add("faellig_datum_rot");
            }
            if(new Date(eintrag.erinnerung) < new Date()){
                let erinnerung_datum_rot = document.querySelector(".erinnerung_datum");
                erinnerung_datum_rot.classList.add("erinnerung_datum_rot");
            }
        }
    }

    // Speichert den aktuellen Status der Checkboxen für alle Einträge in einem Objekt,
    // indem überprüft wird, ob die Checkbox für jeden Eintrag angekreuzt ist, und gibt dieses Objekt zurück.
    function speicherCheckboxStatus() {
        let checkboxStatus = {};
        eintraege.forEach(eintrag => {
            let taskFloating = document.querySelector(`.task-floating[data-id="${eintrag.id}"]`);
            if (taskFloating) {
                let checkbox = taskFloating.parentNode.querySelector(".checkbox");
                if (checkbox) {
                    checkboxStatus[eintrag.id] = checkbox.checked;
                }
            } else {
                console.warn(`Kein Task gefunden für Eintrag mit ID ${eintrag.id}`);
            }
        });
        return checkboxStatus;
    }

    // Funktion zum Wiederherstellen des Checkbox-Status nach dem Neurendern
    function stelleCheckboxStatusWiederHer(checkboxStatus) {
        eintraege.forEach(eintrag => {
            // Finde das .task-floating-Element mit dem entsprechenden data-id-Attribut
            let taskFloating = document.querySelector(`.task-floating[data-id="${eintrag.id}"]`);
            
            // Überprüfe, ob das Element existiert
            if (taskFloating) {
                // Finde die Checkbox im entsprechenden Task-Bereich
                let checkbox = taskFloating.parentNode.querySelector(".checkbox");
                
                // Falls die Checkbox und der gespeicherte Status vorhanden sind
                if (checkbox && checkboxStatus.hasOwnProperty(eintrag.id)) {
                    // Setze den gespeicherten checked-Status
                    checkbox.checked = checkboxStatus[eintrag.id];
                    
                    // Wenn die Checkbox angekreuzt ist, stelle die visuelle Darstellung wieder her
                    if (checkboxStatus[eintrag.id]) {
                        let task_titel = taskFloating.querySelector(".task-title");
                        let task_details = taskFloating.querySelector(".task-details");
                        
                        // Markiere die Task als abgeschlossen
                        task_titel.classList.add("durchgestrichen");
                        task_details.classList.add("durchgestrichen");
                        
                        // Archiv-Icon sichtbar machen
                        let i_archive = taskFloating.parentNode.querySelector(".fa-box-archive");
                        if (i_archive) {
                            i_archive.classList.remove("display_none");
                        }
                    }
                }
            }
        });
    }

    eintraege_anzeigen();

    stelleCheckboxStatusWiederHer(checkboxStatus);

    // Setze Event-Listener für die Archivierung nach jedem Neurendern
    document.querySelectorAll(".archive-btn").forEach(button => {
        let taskId = button.getAttribute("data-id");
        button.addEventListener("click", function() {
            ins_archiv(taskId);
        });
    });

    // Zeigt Details von jedem Eintrag in einem Modal-Fenster.
    // Fügt jedem Element mit der Klasse "task-floating" einen Klick-Event-Listener hinzu,
    // der beim Klicken die zugehörigen Details des Eintrags anzeigt, basierend auf der ID im data-Attribut.
    let taskFloatingElements = document.querySelectorAll(".task-floating");

    taskFloatingElements.forEach(task => {

        task.addEventListener("click", function() {

            const taskId = Number(task.getAttribute("data"));  
            const eintrag = eintraege.find(e => e.id === parseInt(taskId)); 
            if (eintrag) {
                anzeigen(eintrag.id);
            }
        });
    });
}