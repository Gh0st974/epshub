// 📄 Fichier : /js/router.js
// 🎯 Rôle : Navigation entre les vues de l'application

/**
 * Active une vue et met à jour la navbar
 * @param {string} idVue - ID de la vue à afficher
 */
function naviguerVers(idVue) {
  document.querySelectorAll('.vue').forEach(vue => {
    vue.classList.remove('active');
  });

  const vueCible = document.getElementById(idVue);
  if (vueCible) vueCible.classList.add('active');

  document.querySelectorAll('.navbar__btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.vue === idVue) btn.classList.add('active');
  });

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

  document.querySelectorAll('.navbar__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idVue = btn.dataset.vue;
      if (idVue) naviguerVers(idVue);
    });
  });

  document.getElementById('btn-retour-chrono')
    ?.addEventListener('click', () => naviguerVers('vue-outils'));

  document.getElementById('btn-retour-scoreboard')
    ?.addEventListener('click', () => naviguerVers('vue-outils'));

  document.addEventListener('click', (e) => {
    const carte = e.target.closest('.hub-carte[data-id]');
    if (!carte) return;

    const id = carte.dataset.id;

    if (id === 'chrono') {
      naviguerVers('vue-chrono');
      initChrono();
    }

    if (id === 'scoreboard') {
      naviguerVers('vue-scoreboard');
      const conteneur = document.getElementById('scoreboard-conteneur');
      if (conteneur) initialiserScoreboard(conteneur);
    }
  });
}
