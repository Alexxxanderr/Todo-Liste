"use strict";

// Speichert die eintraege im LocalStorage
function eintraege_speichern(){
    localStorage.setItem("eintraege", JSON.stringify(eintraege));
}

// Speichert den Archiv im LocalStorage
function archiv_speichern(){
    localStorage.setItem("archiv", JSON.stringify(archiv));
}

// Stellt die Eintraege aus dem LocalStorage wiederher
function eintraege_wiederherstellen(){
    let gespeicherte_eintraege = localStorage.getItem("eintraege");

    if(gespeicherte_eintraege !== null){
        JSON.parse(gespeicherte_eintraege).forEach(eintrag => {
            eintraege.push({
                name: eintrag.name,
                faellig: eintrag.faellig,
                erinnerung: eintrag.erinnerung,
                notizen: eintrag.notizen,
                id: eintrag.id,
                completed: eintrag.completed,
                isExample: eintrag.isExample
            });
        });
    } 
}

// Stellt den Archiv aus dem LocalStorage wiederher
function archiv_wiederherstellen(){
    let gespeicherte_archive = localStorage.getItem("archiv");
    if(gespeicherte_archive !== null){
        JSON.parse(gespeicherte_archive).forEach(eintrag => {
            archiv.push({
                name: eintrag.name,
                faellig: eintrag.faellig,
                erinnerung: eintrag.erinnerung,
                notizen: eintrag.notizen,
                id: eintrag.id,
                completed: eintrag.completed,
                isExample: eintrag.isExample
            });
        })
    }
}
