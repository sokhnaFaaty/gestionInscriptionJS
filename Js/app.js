
import "./Services/inscriptServices.js";
import "./UI/modalRenderer.js";
export function openSidebar() {
  document.getElementById('sidebar').classList.remove('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.remove('hidden');
}

export function closeSidebar() {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.add('hidden');
}