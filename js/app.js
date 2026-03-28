// 📄 Fichier : /js/app.js
// 🎯 Rôle : Point d'entrée principal — initialise tous les modules

// ============================================================
// RECHERCHE
// ============================================================

/**
 * Initialise la recherche de modules
 */
function initRecherche() {
  const input = document.getElementById('input-recherche');
  if (!input) return;

  input.addEventListener('input', () => {
    const terme = input.value.toLowerCase().trim();

    if (terme === '') {
      afficherResultatsRecherche([]);
      return;
    }

    const resultats = MODULES_RECHERCHE.filter(module =>
      module.label.toLowerCase().includes(terme)
    );

    afficherResultatsRecherche(resultats);
  });
}

// ============================================================
// SERVICE WORKER — PWA
// ============================================================

/**
 * Enregistrement du Service Worker pour le mode hors-ligne
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch(err => console.warn('⚠️ SW échoué :', err));
  }
}

// ============================================================
// INITIALISATION DES MODULES — Ajouter ici chaque nouveau module
// ============================================================
// 📌 Appeler la fonction init du module ici
// 📌 Le module doit être chargé dans index.html avant app.js
// ============================================================

/**
 * Initialise tous les modules actifs
 */
function initModules() {
  // --- Outils ---
  if (typeof initChrono === 'function') initChrono();

  // --- Champs d'apprentissage (à compléter) ---
  // if (typeof initCA1 === 'function') initCA1();
}

// ============================================================
// DÉMARRAGE
// ============================================================

/**
 * Point d'entrée principal — lancé au chargement du DOM
 */
function demarrerApp() {
  initHub();          // Remplit les grilles CA et outils
  initRouter();       // Active la navigation
  initRecherche();    // Active la recherche
  initModules();      // Initialise les modules actifs
  initServiceWorker();

  console.log(`🚀 ${CONFIG.nom} v${CONFIG.version} démarré`);
}

document.addEventListener('DOMContentLoaded', demarrerApp);
