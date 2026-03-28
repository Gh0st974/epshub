// 📄 Fichier : /js/router.js
// 🎯 Rôle : Navigation entre les vues de l'application

// ============================================================
// MOTEUR DE NAVIGATION
// ============================================================

/**
 * Active une vue et met à jour la navbar
 * @param {string} idVue - ID de la vue à afficher
 */
function naviguerVers(idVue) {
  // Masquer toutes les vues
  document.querySelectorAll('.vue').forEach(vue => {
    vue.classList.remove('active');
  });

  // Afficher la vue cible
  const vueCible = document.getElementById(idVue);
  if (vueCible) vueCible.classList.add('active');

  // Mettre à jour la navbar
  document.querySelectorAll('.navbar__btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.vue === idVue) btn.classList.add('active');
  });

  // Focus sur l'input si vue recherche
  if (idVue === 'vue-recherche') {
    setTimeout(() => {
      const input = document.getElementById('input-recherche');
      if (input) input.focus();
    }, 100);
  }
}

// ============================================================
// ROUTES DES MODULES — Ajouter ici chaque nouveau module
// ============================================================
// 📌 FORMAT : 'id-carte-hub' → 'id-vue-dans-le-DOM'
// 📌 L'id doit correspondre à celui déclaré dans config.js
// 📌 La vue doit exister dans index.html
// ============================================================

const ROUTES_MODULES = {
  // --- Outils ---
  'chrono': 'vue-chrono',

  // --- Champs d'apprentissage (à compléter) ---
  // 'ca1': 'vue-ca1',
};

// ============================================================
// INITIALISATION DU ROUTER
// ============================================================

/**
 * Initialise les événements de navigation :
 * - Boutons navbar
 * - Cartes des modules (hub + recherche)
 */
function initRouter() {

  // Clics sur les boutons navbar
  document.querySelectorAll('.navbar__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idVue = btn.dataset.vue;
      if (idVue) naviguerVers(idVue);
    });
  });

  // Clics sur les cartes du hub et des résultats de recherche
  document.addEventListener('click', (e) => {
    const carte = e.target.closest('.hub-carte');
    if (!carte) return;

    const idModule = carte.dataset.id;
    const idVue = ROUTES_MODULES[idModule];

    if (idVue) {
      naviguerVers(idVue);
    }
  });
}
