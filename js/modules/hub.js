// 📄 Fichier : /js/modules/hub.js
// 🎯 Rôle : Écoute les clics sur les cartes du Hub

/**
 * Initialise les interactions de la page Hub
 * Appelé automatiquement par le router après injection du HTML
 */
(function() {
  // Sélectionne toutes les cartes du Hub
  const cartes = document.querySelectorAll('.hub-carte');

  cartes.forEach((carte) => {
    carte.addEventListener('click', () => {
      const nomModule = carte.dataset.module;
      // Charge le module correspondant
      chargerModule(nomModule);
      // Met à jour la nav si un bouton nav correspond
      mettreAJourNav(nomModule);
    });
  });
})();
