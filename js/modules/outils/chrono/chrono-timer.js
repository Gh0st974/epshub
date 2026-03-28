// 📄 Fichier : /js/modules/chrono/chrono-timer.js
// 🎯 Rôle : Logique des chronos (simple et multi)

const chronos = {
  simple: {
    etat: 'arret', // 'arret', 'demarre', 'pause'
    tempsDepart: 0,
    tempsPause: 0,
    tempsTotal: 0,
    intervalId: null,
    dernierTemps: 0
  }
};

/**
 * Initialise les timers
 */
function initTimers() {
  // Rien à faire ici pour l'instant
}

/**
 * Démarre un chrono
 * @param {string} id - Identifiant du chrono
 */
function demarrerChrono(id) {
  if (!chronos[id]) {
    chronos[id] = {
      etat: 'arret',
      tempsDepart: 0,
      tempsPause: 0,
      tempsTotal: 0,
      intervalId: null,
      dernierTemps: 0
    };
  }

  if (chronos[id].etat === 'demarre') return;

  if (chronos[id].etat === 'arret') {
    chronos[id].tempsDepart = performance.now() - chronos[id].tempsTotal;
  } else {
    // Reprise après une pause
    chronos[id].tempsDepart = performance.now() - (chronos[id].tempsPause - chronos[id].tempsDepart);
  }

  chronos[id].etat = 'demarre';
  chronos[id].intervalId = setInterval(() => {
    const maintenant = performance.now();
    chronos[id].tempsTotal = maintenant - chronos[id].tempsDepart;
    mettreAJourAffichage(id, chronos[id].tempsTotal);
  }, 10);

  mettreAJourBoutons(id, 'demarre');
}

/**
 * Met en pause un chrono
 * @param {string} id - Identifiant du chrono
 */
function mettreEnPauseChrono(id) {
  if (chronos[id].etat !== 'demarre') return;

  clearInterval(chronos[id].intervalId);
  chronos[id].tempsPause = performance.now();
  chronos[id].etat = 'pause';
  mettreAJourBoutons(id, 'pause');
}

/**
 * Réinitialise un chrono
 * @param {string} id - Identifiant du chrono
 */
function reinitialiserChrono(id) {
  clearInterval(chronos[id].intervalId);
  chronos[id].etat = 'arret';
  chronos[id].tempsDepart = 0;
  chronos[id].tempsPause = 0;
  chronos[id].tempsTotal = 0;
  chronos[id].dernierTemps = 0;
  mettreAJourAffichage(id, 0);
  mettreAJourBoutons(id, 'arret');
  effacerLaps(id);
}

/**
 * Démarre tous les chronos
 */
function demarrerTousLesChronos() {
  Object.keys(chronos).forEach(id => {
    if (id !== 'simple') {
      demarrerChrono(id);
    }
  });
}

/**
 * Arrête tous les chronos
 */
function arreterTousLesChronos() {
  Object.keys(chronos).forEach(id => {
    if (id !== 'simple' && chronos[id].etat === 'demarre') {
      mettreEnPauseChrono(id);
    }
  });
}

/**
 * Réinitialise tous les chronos
 */
function reinitialiserTousLesChronos() {
  Object.keys(chronos).forEach(id => {
    reinitialiserChrono(id);
  });
}

/**
 * Arrête un chrono (utilisé lors de la suppression)
 * @param {string} id - Identifiant du chrono
 */
function arreterChrono(id) {
  if (chronos[id]) {
    clearInterval(chronos[id].intervalId);
    delete chronos[id];
  }
}
