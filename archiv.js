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

        console.log(`Eintrag mit der ID ${eintragId} wurde ins Archiv verschoben.`);
        console.log(eintraege);
        console.log(archiv);
        updateUI(); 
    } else {
        console.log('Eintrag nicht gefunden.');
    }
}