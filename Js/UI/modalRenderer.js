import * as Dom from "../Dom/elements.js";
import { emailDejaUtilise, modifierEtudiant, supprimerEtudiant, restaurerEtudiant } from "../Services/inscriptServices.js";
import { showToast } from "./messageRenderer.js";


// OUVRIR / FERMER
export function ouvrirModal(modal) {
    modal.classList.remove("hidden");
}


export function fermerModal(modal) {
    modal.classList.add("hidden");
}
