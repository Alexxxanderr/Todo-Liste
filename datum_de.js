"use strict";

function datum_de(erinnerungInput){
    if (erinnerungInput) {
        // Das Datum im ISO-Format parsen
        const date = new Date(erinnerungInput);
        
        // Tag, Monat, Jahr und Uhrzeit in deutschem Format extrahieren
        const tag = String(date.getDate()).padStart(2, '0');
        const monat = String(date.getMonth() + 1).padStart(2, '0'); // Monat von 0-11, daher +1
        const jahr = date.getFullYear();
        const stunden = String(date.getHours()).padStart(2, '0');
        const minuten = String(date.getMinutes()).padStart(2, '0');
        
        // Formatierung im deutschen Stil
        const deutschesDatum = `${tag}.${monat}.${jahr} ${stunden}:${minuten}`;
        
        // Ausgabe
        return deutschesDatum;
    }
}


