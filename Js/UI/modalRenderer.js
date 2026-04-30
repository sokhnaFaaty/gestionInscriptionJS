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

// BOUTON "Ajouter un étudiant"
Dom.btnAddStudent.addEventListener("click", function () {
    ouvrirModal(Dom.modalAjouter);
      

});

// BOUTON "Restaurer"
Dom.btnRestore.addEventListener("click", function () {
    afficherArchives();
    ouvrirModal(Dom.drawerRestaurer);
});

// BOUTON "Restaurer tout"
document.getElementById("btnRestaurerGroupe").addEventListener("click", function () {
    const archives = JSON.parse(localStorage.getItem("archives")) || [];
    archives.forEach(e => restaurerEtudiant(e.id));
    afficherArchives();
    showToast("success", "Restauré", "Tous les étudiants ont été restaurés !");
});

// DÉLÉGATION : Modifier / Archiver
Dom.studentsTableBody.addEventListener("click", function (e) {
    const btnModifier = e.target.closest(".btnModifier");
    const btnArchiver = e.target.closest(".btnArchiver");

    if (btnModifier) {
        const id = Number(btnModifier.closest("tr").dataset.id);
        ouvrirModalModifier(id);
    }

    if (btnArchiver) {
        const id = Number(btnArchiver.closest("tr").dataset.id);
        ouvrirModalSupprimer(id);
    }
});
//afficher arcive
function afficherArchives() {
    const archives = JSON.parse(localStorage.getItem("archives")) || [];
     const btnRestaurerGroupe = document.getElementById("btnRestaurerGroupe");
    
     Dom.archivedListContainer.innerHTML = "";

    if (archives.length===0) {
        Dom.archivedListContainer.innerHTML = `
        
      <div class="text-center py-16">
        <div class="text-[#444] text-5xl mb-3"><i class="fa-solid fa-box-open"></i></div>
        <p class="text-[#666] text-sm">Aucun étudiant archivé pour le moment</p>
        <p class="text-[#555] text-xs mt-1">Les étudiants archivés apparaîtront ici</p>
    </div>`
            btnRestaurerGroupe.disabled = true;
        return; //liste vide
    
    

}

    if (btnRestaurerGroupe){
btnRestaurerGroupe.disabled = true;
    } 


archives.forEach(e => {
    Dom.archivedListContainer.innerHTML += `
        <div class="bg-[#2a2750] rounded-lg p-4 mb-3 flex items-center gap-3">
            <input type="checkbox" class="checkArchive w-4 h-4 accent-green-400 cursor-pointer flex-shrink-0" data-id="${e.id}"/>
            <div class="flex-1">
                <p class="text-white font-semibold text-sm">${e.prenom} ${e.nom}</p>
                <p class="text-[#8a90a8] text-xs mt-0.5">${e.formation} — ${e.email}</p>
            </div>
            <button class="btnRestaurer text-green-400 text-xs border border-green-400 px-3 py-1 rounded hover:bg-green-400 hover:text-white transition-all" data-id="${e.id}">
                Restaurer
            </button>
        </div>
    `;
});
}


    //Restauration dynamique
    Dom.archivedListContainer.addEventListener("click",function(e){
        const btn=e.target.closest(".btnRestaurer");
        if(btn){
            const id=Number(btn.dataset.id);
            restaurerEtudiant(id);
            afficherArchives();//rafraichr drawer bi
           showToast("success", "Restauré", "L'étudiant a été restauré avec succès !");
    }
    if(e.target.classlist.contains("checkArchive")){
        const checked=Dom.archivedListContainer.querySelectorAll(".checkArchive:checked").length;
        document.getElementById("btnRestaurerGroupe").disabled=checked<3;
    }
    });

// Comptage des checkboxes (change)
Dom.archivedListContainer.addEventListener("change", function (e) {
    if (e.target.classList.contains("checkArchive")) {
        const checked = Dom.archivedListContainer.querySelectorAll(".checkArchive:checked").length;
        document.getElementById("btnRestaurerGroupe").disabled = checked < 3;
    }
});
    // OUVRIR MODAL MODIFIER + pré-remplissage
export function ouvrirModalModifier(id) {
    const etudiants = JSON.parse(localStorage.getItem("inscriptions")) || [];
    const etudiant  = etudiants.find(e => e.id === id);
    if (!etudiant) return;

    document.getElementById("editNom").value       = etudiant.nom;
    document.getElementById("editPrenom").value    = etudiant.prenom;
    document.getElementById("editEmail").value     = etudiant.email;
    document.getElementById("editAdresse").value   = etudiant.adresse;
    document.getElementById("editTelephone").value = etudiant.telephone;
    document.getElementById("editFormation").value = etudiant.formation;

    document.getElementById("submitEditBtn").dataset.id = id;

    ouvrirModal(Dom.modalModifier);
}



// OUVRIR MODAL SUPPRIMER
export function ouvrirModalSupprimer(id) {
    const etudiants = JSON.parse(localStorage.getItem("inscriptions")) || [];
    const etudiant  = etudiants.find(e => e.id === id);
    if (!etudiant) return;

    document.getElementById("deleteStudentName").textContent =
        etudiant.prenom + " " + etudiant.nom;
    document.getElementById("confirmDeleteBtn").dataset.id = id;

    ouvrirModal(Dom.modalSupprimer);
}




document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    const id = +this.dataset.id;
    supprimerEtudiant(id);
    fermerModal(Dom.modalSupprimer);
    showToast("danger", "Archivé", "L'étudiant a été supprime.");
});
 
// SOUMISSION FORMULAIRE MODIFIER
document.getElementById("formModifier").addEventListener("submit", function (e) {
    e.preventDefault();

    const id         = Number(document.getElementById("submitEditBtn").dataset.id);
    const emailSaisi = document.getElementById("editEmail").value.trim();

    // Vérification doublon en excluant l'étudiant en cours de modification
    if (emailDejaUtilise(emailSaisi, id)) {
        const errEmail = document.getElementById("errEditEmail");
        errEmail.textContent = "Cet email est déjà utilisé";
        errEmail.style.color = "red";
        return;
    }


    modifierEtudiant(id, {
        nom:       document.getElementById("editNom").value.trim(),
        prenom:    document.getElementById("editPrenom").value.trim(),
        email:     emailSaisi,
        adresse:   document.getElementById("editAdresse").value.trim(),
        telephone: document.getElementById("editTelephone").value.trim(),
        formation: document.getElementById("editFormation").value,
    });

    fermerModal(Dom.modalModifier);
     showToast("success", "Succès", "Étudiant modifié avec succès !");
});

// FERMETURE DES MODALS (btnFermer)
const modalsAvecBoutons = [
    { modal: Dom.modalAjouter,    selecteur: "#modal-ajouter .btnFermer"    },
    { modal: Dom.modalModifier,   selecteur: "#modal-modifier .btnFermer"   },
    { modal: Dom.modalSupprimer,  selecteur: "#modal-supprimer .btnFermer"  },
    { modal: Dom.drawerRestaurer, selecteur: "#drawer-restaurer .btnFermer" },
];

modalsAvecBoutons.forEach(function ({ modal, selecteur }) {
    document.querySelectorAll(selecteur).forEach(function (btn) {
        btn.addEventListener("click", function () {
            fermerModal(modal);
        });
    });
});

// Clic en dehors → fermer
[Dom.modalAjouter, Dom.modalModifier, Dom.modalSupprimer].forEach(function (modal) {
    modal.addEventListener("click", function (e) {
        if (e.target === modal) fermerModal(modal);
    });
});

//sidebar
export function openSidebar() {
    document.getElementById("sidebar").classList.remove("-translate-x-full");
    document.getElementById("sidebarOverlay").classList.remove("hidden");
}

export function closeSidebar() {
    document.getElementById("sidebar").classList.add("-translate-x-full");
    document.getElementById("sidebarOverlay").classList.add("hidden");
}

document.getElementById("btnBurger").addEventListener("click", openSidebar);
document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);
