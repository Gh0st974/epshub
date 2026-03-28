// 📄 Fichier : /js/app.js
// 🎯 Rôle : Point d'entrée de l'application, init et enregistrement PWA

/**
 * Initialise l'application EPSHub
 */
function initialiserApp() {
  // Enregistrement du Service Worker pour la PWA
  enregistrerServiceWorker();

  // Chargement du module de démarrage : le Hub
  chargerModule('hub');

  // Écoute des clics sur la barre de navigation
  ecouterNavigation();
}

/**
 * Enregistre le service worker pour le mode offline
 */
function enregistrerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/epshub/service-worker.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch((err) => console.error('❌ Erreur SW :', err));
  }
}

/**
 * Écoute les clics sur les boutons de navigation du bas
 */
function ecouterNavigation() {
  const boutonsNav = document.querySelectorAll('.nav-btn');

  boutonsNav.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const nomModule = bouton.dataset.module;
      chargerModule(nomModule);
      mettreAJourNav(nomModule);
    });
  });
}

// Lancement de l'app quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initialiserApp);
