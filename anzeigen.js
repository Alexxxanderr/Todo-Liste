"use strict";

function html_eintrag(eintrag){

    let erinnerung = datum_de(eintrag.erinnerung);

    let faellig = new Date(eintrag.faellig);
  
    faellig = faellig.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    let task = document.createElement("div");
    task.setAttribute("class", "task");
    
    let task_info = document.createElement("div");
    task_info.setAttribute("class", "task-info");
    
    let checkbox = document.createElement("input");
    checkbox.setAttribute("class", "checkbox");
    checkbox.setAttribute("type", "checkbox");
    
    let task_floating = document.createElement("div");
    task_floating.setAttribute("class", "task-floating");
    
    let task_titel = document.createElement("div");
    task_titel.setAttribute("class", "task-title");
    task_titel.innerHTML = eintrag.name;
  
    let task_details = document.createElement("div");
    task_details.setAttribute("class", "task-details");
    task_details.innerHTML = "Bewerben Digistore";

    if (eintrag.completed) {
        task_titel.classList.add("durchgestrichen");
        task_details.classList.add("durchgestrichen");
    }

    if(eintrag.faellig === "" && eintrag.erinnerung === ""){
        task_details.innerHTML = "Setze ein Fälligkeitsdatum oder eine Erinnerung.";
    } else if (eintrag.faellig !== "" && eintrag.erinnerung === ""){
        task_details.innerHTML = `&nbsp;<i style=\"font-size:13px\" class=\"fa\">&#xf073;</i>&nbsp; ${faellig}`;
    } else if (eintrag.faellig === "" && eintrag.erinnerung !== ""){
        task_details.innerHTML = `&#128276; ${erinnerung}  Uhr`;
    } else {
        task_details.innerHTML = `&nbsp;<i style=\"font-size:13px\" class=\"fa\">&#xf073;</i>&nbsp; ${faellig} •  &#128276; ${erinnerung}  Uhr`;
    }

    task_floating.insertAdjacentElement("afterbegin", task_titel);
    task_floating.insertAdjacentElement("beforeend", task_details);
    task_info.insertAdjacentElement("afterbegin", checkbox);
    task_info.insertAdjacentElement("beforeend", task_floating);
    
    let task_actions = document.createElement("div");
    task_actions.setAttribute("class", "task-actions");
    
    let i_archive = document.createElement("i");
    i_archive.setAttribute("class", "fa-solid fa-box-archive");
    i_archive.onclick = () => bearbeiten(eintrag.id);

    let i_bearbeiten = document.createElement("i");
    i_bearbeiten.setAttribute("class", "fa-solid fa-pen-to-square");
    i_bearbeiten.onclick = () => bearbeiten(eintrag.id);

    let i_loeschen = document.createElement("i");
    i_loeschen.setAttribute("class", "fa-solid fa-trash-can");
    i_loeschen.onclick = () => loeschen(eintrag.id);
   
    task_actions.insertAdjacentElement("afterbegin", i_loeschen);
    task_actions.insertAdjacentElement("afterbegin", i_bearbeiten);
    task_actions.insertAdjacentElement("afterbegin", i_archive);
    task.insertAdjacentElement("afterbegin", task_info);
    task.insertAdjacentElement("beforeend", task_actions);
    
    let subheader = document.querySelector(".subheader");
    subheader.insertAdjacentElement("afterend", task);

    i_archive.classList.add("display_none");

    checkbox.addEventListener("change", e => {
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
    });
    
    return task;

}
