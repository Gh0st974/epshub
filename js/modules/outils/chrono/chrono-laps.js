// 📄 Fichier : /js/modules/chrono/chrono-laps.js
// 🎯 Rôle : Gestion des laps times

const laps = {
  simple: []
};

/**
 * Ajoute un lap à un chrono
 * @param {string} id - Identifiant du chrono
 */
function ajouterLap(id) {
  if (!chronos[id] || chronos[id].etat !== 'demarre') return;

  const maintenant = performance.now();
  const tempsActuel = maintenant - chronos[id].tempsDepart;
  const tempsTour = tempsActuel - chronos[id].dernierTemps;

  if (!laps[id]) {
    laps[id] = [];
  }

  laps[id].push({
    tempsTour: tempsTour,
    tempsCumule: tempsActuel
  });

  chronos[id].dernierTemps = tempsActuel;
  afficherLaps(id, laps[id]);
}

/**
 * Efface les laps d'un chrono
 * @param {string} id - Identifiant du chrono
 */
function effacerLaps(id) {
  if (laps[id]) {
    laps[id] = [];
    afficherLaps(id, []);
  }
}
