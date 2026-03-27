// 📄 Fichier : /js/app.js
// 🎯 Rôle : Point d'entrée principal — initialise l'application

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

/**
 * Enregistrement du Service Worker pour la PWA
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch(err => console.warn('⚠️ SW échoué :', err));
  }
}

/**
 * Démarrage de l'application
 */
function demarrerApp() {
  initHub();        // Remplit les grilles CA et outils
  initRouter();     // Active la navigation
  initRecherche();  // Active la recherche
  initServiceWorker();

  console.log(`🚀 ${CONFIG.nom} v${CONFIG.version} démarré`);
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', demarrerApp);
