const STORAGE_KEY   = "inscriptions";
export function getInscriptions() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}


export function saveInscriptions(inscriptions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscriptions));
}
