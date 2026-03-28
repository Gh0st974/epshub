// 📄 Fichier : /js/modules/chrono/chrono.js
// 🎯 Rôle : Point d'entrée du module Chrono (orchestration)

(function() {
  // Initialisation des modules
  initUI();
  initEvents();
  initTimers();

  // Affichage du mode par défaut (Chrono Simple)
  afficherMode('simple');
})();

/**
 * Affiche le mode sélectionné (simple ou multi)
 * @param {string} mode - 'simple' ou 'multi'
 */
function afficherMode(mode) {
  document.querySelectorAll('.chrono-mode').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelectorAll('.chrono-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.getElementById(`chrono-${mode}`).classList.add('active');
  document.querySelector(`.chrono-tab[data-mode="${mode}"]`).classList.add('active');

  // Réinitialiser les chronos lors du changement de mode
  reinitialiserTousLesChronos();
}
