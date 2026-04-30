import { saveInscriptions, getInscriptions } from "../Stores/inscriptStores.js";
import * as Dom from "../Dom/elements.js";
import { fermerModal } from "../UI/modalRenderer.js";
import { showToast } from "../UI/messageRenderer.js";
import { dateFormater } from "../Utiles/datesFormater.js";

// Tableau en mémoire, initialisé depuis le localStorage
let etudiants = getInscriptions();


//rechercher
function getFiltered() {
    const inscriptions = getInscriptions();
    const q = Dom.searchInput.value.toLowerCase().trim(); // Ajoutez .value ici !

    if (!q) return inscriptions;

    return inscriptions.filter(et => {
        // Liste des champs dans lesquels chercher
        const fields = [et.nom, et.prenom, et.email, et.adresse, et.telephone, et.formation];
        
        return fields.some(field => 
            field?.toLowerCase().includes(q)
        );
    });
}
Dom.searchInput.addEventListener("input",function(){
const filtrer=getFiltered()
afficherInscriptions(filtrer)
})

// VALIDATION DES CHAMPS REQUIS
export function verifierChamps() {
    document.querySelectorAll(".err").forEach(span => span.textContent = "");
    let estValide = true;

    const champs = [
        { id: "addNom", label: "nom" },
        { id: "addPrenom", label: "prénom" },
        { id: "addEmail", label: "email" },
        { id: "addAdresse", label: "adresse" },
        { id: "addTelephone", label: "téléphone" },
        { id: "addFormation", label: "formation" },
    ];

    champs.forEach(({ id, label }) => {
        const input = document.getElementById(id);
        const errorSpan = input.nextElementSibling;
        if (input.value.trim() === "") {
            errorSpan.textContent = `Le champ ${label} est obligatoire`;
            errorSpan.style.color = "red";
            estValide = false;
        }
    });

    return estValide;
}

// VALIDATION EMAIL
export function validationEmail() {
    let estValide = true;
    const emailInput = document.getElementById("addEmail");
    const emailError = emailInput.nextElementSibling;
    emailError.textContent = "";

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(emailInput.value.trim())) {
        emailError.textContent = "Email invalide";
        estValide = false;
    }
    return estValide;
}

// VALIDATION TÉLÉPHONE
export function validationTelephone() {
    let estValide = true;
    const telephoneInput = document.getElementById("addTelephone");
    const telephoneError = telephoneInput.nextElementSibling;
    telephoneError.textContent = "";

    const regexTel = /^((\+221|00221)?(70|71|75|76|77|78)\d{7})|((\+220|00220)?[235679]\d{6})$/;
    if (!regexTel.test(telephoneInput.value.trim())) {
        telephoneError.textContent = "Numéro invalide";
        estValide = false;
    }
    return estValide;
}

// GESTION DES DOUBLONS AVEC SET
export function getEmailsExistants(idExclu = null) {
    return new Set(
        etudiants
            .filter(e => e.id !== idExclu)
            .map(e => e.email.toLowerCase())
    );
}

export function emailDejaUtilise(email, idExclu = null) {
    const emails = getEmailsExistants(idExclu);
    return emails.has(email.toLowerCase());
}