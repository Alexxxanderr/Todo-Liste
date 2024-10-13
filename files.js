"use strict";

let db;

// IndexedDB öffnen oder erstellen
const request = window.indexedDB.open('DB_fuer_Dateien', 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB erfolgreich geöffnet');
};

function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    let id = document.querySelector("#editAufgabe").getAttribute("data-id");
    id = parseInt(id);

    if (!file) {
        console.error("Keine Datei ausgewählt");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const fileContent = event.target.result;
        const blob = new Blob([fileContent], { type: file.type });

        const transaction = db.transaction('files', 'readwrite');
        const objectStore = transaction.objectStore('files');

        const data = {
            name: file.name,
            size: file.size,
            type: file.type,
            content: fileContent,
            taskId: id  
        };

        const request = objectStore.add(data);
        request.onsuccess = () => {
            console.log('Datei erfolgreich gespeichert');
            // Hier stellen wir sicher, dass die Datei nach dem Upload angezeigt wird
            displayFiles(id, true, '#editModal .file-item'); // Aktualisiere die Datei-Liste im editModal
            fileInput.value = ''; // Dateiinput zurücksetzen
        };
        request.onerror = (error) => {
            console.error('Fehler beim Speichern:', error);
        };
    };
    reader.readAsArrayBuffer(file);
}


// Funktion zum Anzeigen der gespeicherten Dateien
function displayFiles(taskId, showDeleteIcon = true, targetElementSelector = '.file-item') {
    const fileList = document.querySelector(targetElementSelector);
    fileList.innerHTML = ''; // Leere den Dateiliste-Container

    const transaction = db.transaction('files', 'readonly');
    const objectStore = transaction.objectStore('files');

    const request = objectStore.getAll();
    request.onsuccess = (event) => {
        const files = event.target.result;

        // Konvertiere taskId in String und vergleiche mit file.taskId
        const filteredFiles = files.filter(file => String(file.taskId) === String(taskId)); // Filtern nach Aufgabe-ID

        if (filteredFiles.length === 0) {
            fileList.innerHTML = '<p>Keine Dateien hochgeladen.</p>';
        } else {
            filteredFiles.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.classList.add('dateiDiv');

                // Erstelle einen Link zur Datei
                const link = document.createElement('a');
                link.href = '#'; // Verhindere direkten Link (wird später per Klick geöffnet)
                link.textContent = file.name;
                link.onclick = (e) => {
                    e.preventDefault();
                    openFile(file.id); // Funktion zum Öffnen der Datei
                };
                fileItem.appendChild(link);

                // Lösch-Icon nur anzeigen, wenn `showDeleteIcon` true ist
                if (showDeleteIcon) {
                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon', 'm-left');
                    deleteIcon.title = 'Löschen'; // Tooltip für das Icon
                    deleteIcon.onclick = () => deleteFile(file.id); // Funktionsaufruf zum Löschen der Datei
                    fileItem.appendChild(deleteIcon); // Füge das Icon zum Dateielement hinzu
                }

                fileList.appendChild(fileItem);
            });
        }
    };

    request.onerror = (error) => {
        console.error("Fehler beim Abrufen der Dateien:", error);
    };
}



function openFile(id) {
    const transaction = db.transaction('files', 'readonly');
    const objectStore = transaction.objectStore('files');

    const request = objectStore.get(id);
    request.onsuccess = (event) => {
        const file = event.target.result;
        const blob = new Blob([file.content], { type: file.type });
        const url = URL.createObjectURL(blob);

        // Öffne die Datei in einem neuen Tab
        window.open(url);
    };
    request.onerror = (error) => {
        console.error('Fehler beim Abrufen der Datei:', error);
    };
}

// Funktion zum Löschen einer Datei
function deleteFile(id) {
    const transaction = db.transaction('files', 'readwrite');
    const objectStore = transaction.objectStore('files');

    // Zuerst holen wir uns die Datei, um die taskId zu erhalten
    const requestGet = objectStore.get(id);
    requestGet.onsuccess = (event) => {
        const file = event.target.result;
        if (!file) {
            console.error('Datei nicht gefunden.');
            return;
        }

        // Lösche die Datei aus der Datenbank
        const requestDelete = objectStore.delete(id);
        requestDelete.onsuccess = () => {
            console.log('Datei erfolgreich gelöscht');

            // Rufe displayFiles mit der entsprechenden taskId auf, um die Dateiliste zu aktualisieren
            displayFiles(file.taskId, true, '#editModal .file-item'); // Bei Bedarf anpassen, ob editModal oder andere Modal angezeigt wird
        };
        requestDelete.onerror = (error) => {
            console.error('Fehler beim Löschen der Datei:', error);
        };
    };

    requestGet.onerror = (error) => {
        console.error('Fehler beim Abrufen der Datei:', error);
    };
}

request.onsuccess = () => {
    console.log('Datei erfolgreich gespeichert');
    displayFiles(); // Aktualisiere die Dateiliste nach dem Hochladen
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB erfolgreich geöffnet');
    displayFiles(); // Rufe die Funktion zum Anzeigen der Dateien auf, sobald die IndexedDB geöffnet ist
};