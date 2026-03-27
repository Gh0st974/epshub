// 📄 Fichier : /js/router.js
// 🎯 Rôle : Navigation entre les vues de l'application

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

/**
 * Initialise les événements de navigation
 */
function initRouter() {

  // Clics sur les boutons navbar
  document.querySelectorAll('.navbar__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idVue = btn.dataset.vue;
      if (idVue) naviguerVers(idVue);
    });
  });

  // Retour depuis le chrono vers les outils
  document.getElementById('btn-retour-chrono')
    ?.addEventListener('click', () => naviguerVers('vue-outils'));

  // Clics sur les cartes d'outils (hub)
  document.addEventListener('click', (e) => {
    const carte = e.target.closest('.hub-carte[data-id]');
    if (!carte) return;

    const id = carte.dataset.id;

    // Carte Chrono
    if (id === 'chrono') {
      naviguerVers('vue-chrono');
      initChrono();
    }

    // 📌 Autres outils à brancher ici au fur et à mesure
    // if (id === 'minuteur') { naviguerVers('vue-minuteur'); initMinuteur(); }
  });
}
