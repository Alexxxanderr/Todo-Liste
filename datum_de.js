"use strict";

// Wandelt ein gegebenes Datum im Eingabeformat in ein deutsches Datumsformat um (TT.MM.JJJJ HH:MM),
// wobei es die führenden Nullen für Tag, Monat, Stunde und Minute sicherstellt.
function datum_de(erinnerungInput){
    if (erinnerungInput) {

        const date = new Date(erinnerungInput);
        const tag = String(date.getDate()).padStart(2, '0');
        const monat = String(date.getMonth() + 1).padStart(2, '0'); 
        const jahr = date.getFullYear();
        const stunden = String(date.getHours()).padStart(2, '0');
        const minuten = String(date.getMinutes()).padStart(2, '0');
        const deutschesDatum = `${tag}.${monat}.${jahr} ${stunden}:${minuten}`;

        return deutschesDatum;
    }
}
