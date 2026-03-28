// 📄 Fichier : /js/modules/chrono/chrono-events.js
// 🎯 Rôle : Gestion des interactions utilisateur

/**
 * Initialise les écouteurs d'événements
 */
function initEvents() {
  // Onglets de sélection du mode
  document.querySelectorAll('.chrono-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      afficherMode(tab.dataset.mode);
    });
  });

  // Boutons du mode Chrono Simple
  document.querySelectorAll('#chrono-simple .chrono-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      gererActionChrono('simple', btn.dataset.action);
    });
  });

  // Boutons du mode Multi-Chrono (globaux)
  document.querySelector('.chrono-start-all').addEventListener('click', () => {
    demarrerTousLesChronos();
  });

  document.querySelector('.chrono-pause-all').addEventListener('click', () => {
    arreterTousLesChronos();
  });

  document.querySelector('.chrono-reset-all').addEventListener('click', () => {
    reinitialiserTousLesChronos();
  });

  document.getElementById('chrono-add-btn').addEventListener('click', () => {
    const chronoCount = document.querySelectorAll('.chrono-multi-item').length;
    const newId = `multi-${chronoCount + 1}`;
    ajouterChronoMulti(newId);
    initChronoMulti(newId);
  });
}

/**
 * Initialise les écouteurs pour un chrono multi
 * @param {string} id - Identifiant du chrono
 */
function initChronoMulti(id) {
  document.querySelectorAll(`.${id}-start, .${id}-pause, .${id}-reset, .${id}-lap`).forEach(btn => {
    btn.addEventListener('click', () => {
      gererActionChrono(id, btn.dataset.action);
    });
  });

  document.querySelector(`.${id}-remove`).addEventListener('click', () => {
    supprimerChronoMulti(id);
    arreterChrono(id);
  });
}

/**
 * Gère une action sur un chrono (démarrer, pause, réinitialiser, laps)
 * @param {string} id - Identifiant du chrono
 * @param {string} action - 'start', 'pause', 'reset', 'lap'
 */
function gererActionChrono(id, action) {
  switch (action) {
    case 'start':
      demarrerChrono(id);
      break;
    case 'pause':
      mettreEnPauseChrono(id);
      break;
    case 'reset':
      reinitialiserChrono(id);
      break;
    case 'lap':
      ajouterLap(id);
      break;
  }
}
