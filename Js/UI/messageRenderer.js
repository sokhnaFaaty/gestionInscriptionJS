

const TOAST_ICONS = { success: "✓", danger: "✕", warn: "!" };
const TOAST_TITLES = { success: "Succès", danger: "Supprimé", warn: "Attention" };
const TOAST_STYLES = {
    success: "border-green-500 text-green-700 bg-green-50",
    danger: "border-red-500 text-red-700 bg-red-50",
    warn: "border-yellow-500 text-yellow-700 bg-yellow-50"
};
const toastContainer = document.getElementById("toastContainer")


export function showToast(type, title, message) {
    const toast = document.createElement("div");


    toast.className = `pointer-events-auto w-80 p-4 rounded-xl shadow-lg border-l-4 flex gap-3 transform transition-all duration-300 translate-x-full opacity-0 ${TOAST_STYLES[type]}`;
    toast.innerHTML = `
        <div class="flex-shrink-0 font-bold text-lg">${TOAST_ICONS[type]}</div>
        <div class="flex-1">
            <div class="font-bold text-sm">${title}</div>
            ${message ? `<div class="text-xs opacity-90">${message}</div>` : ""}
        </div>
        <button class="toast-close text-gray-400 hover:text-gray-600" title="Fermer">×</button>
        <div class="toast-progress"></div>
    `;


    toastContainer.appendChild(toast);


    setTimeout(() => {
        toast.classList.remove("translate-x-full", "opacity-0");
        toast.classList.add("translate-x-0", "opacity-100");
    }, 10);


    // Fermer manuellement
    toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));


    // Auto-dismiss après 4s
    const timer = setTimeout(() => dismissToast(toast), 4000);
    toast._timer = timer;
}


export function dismissToast(toast) {
    clearTimeout(toast._timer);
    toast.classList.remove("translate-x-0", "opacity-100");
    toast.classList.add("translate-x-full", "opacity-0");
    setTimeout(() => toast.remove(), 240);
}
