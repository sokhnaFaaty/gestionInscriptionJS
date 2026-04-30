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

// CRÉER UNE LIGNE <tr>
export function ajouterInscription(etudiant) {
    const ligne = document.createElement("tr");
    ligne.classList.add("tr");
    ligne.dataset.id = etudiant.id;

    ligne.innerHTML = `
        <td class="px-4 py-3 text-white font-medium max-w-[100px] truncate">${etudiant.nom}</td>
        <td class="px-4 py-3 text-white max-w-[100px] truncate">${etudiant.prenom}</td>
        <td class="px-4 py-3 text-white max-w-[160px] truncate">${etudiant.email}</td>
        <td class="px-4 py-3 text-white max-w-[120px] truncate">${etudiant.adresse}</td>
        <td class="px-4 py-3 text-white whitespace-nowrap">${etudiant.telephone}</td>
        <td class="px-4 py-3 text-white whitespace-nowrap">${etudiant.formation}</td>
        <td class="px-4 py-3 text-white whitespace-nowrap">${etudiant.date}</td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="flex items-center gap-3">
            <button class="btnModifier text-[#7b82c4] hover:opacity-70 transition-opacity text-sm" title="Modifier">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btnArchiver text-red-400 hover:opacity-70 transition-opacity text-sm" title="Archiver">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
    `;
    return ligne;
}
// SOUMISSION FORMULAIRE AJOUT
Dom.formAjouter.addEventListener("submit", function (e) {
    e.preventDefault();

    if (verifierChamps() && validationEmail() && validationTelephone()) {

        // ── Récupération de l'email saisi AVANT la vérification doublon
        const emailSaisi = Dom.addEmail.value.trim();

        if (emailDejaUtilise(emailSaisi)) {
            Dom.errAddEmail.textContent = "Cet email est déjà utilisé";
            Dom.errAddEmail.style.color = "red";
            return;
        }

        const newEtudiant = {
            id: Date.now(),
            nom: Dom.addNom.value.trim(),
            prenom: Dom.addPrenom.value.trim(),
            email: emailSaisi,
            adresse: Dom.addAdresse.value.trim(),
            telephone: Dom.addTelephone.value.trim(),
            formation: Dom.addFormation.value,
            date: dateFormater()
        };

        etudiants.push(newEtudiant);
        saveInscriptions(etudiants);
        fermerModal(Dom.modalAjouter);

        afficherInscriptions();
        Dom.formAjouter.reset();
        showToast("success", "Succès", "Étudiant ajouté avec succès !");
    }
});