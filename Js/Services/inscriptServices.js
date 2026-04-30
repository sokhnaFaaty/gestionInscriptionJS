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
