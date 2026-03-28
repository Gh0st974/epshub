// 📄 Fichier : js/modules/outils/chrono/chrono-timer.js
// 🎯 Rôle : Logique métier pure — gestion des chronos (start/pause/reset/laps)

// Registre de tous les chronos actifs
// Structure : { id: { debut, cumul, intervalle, laps, enCours } }
const chronoRegistre = {};

/**
 * Crée un nouveau chrono avec un id donné
 * @param {string} id
 */
function chronoCreer(id) {
  chronoRegistre[id] = {
    debut: 0,        // timestamp du dernier démarrage
    cumul: 0,        // temps cumulé avant la dernière pause (ms)
    intervalle: null,
    laps: [],
    enCours: false
  };
}

/**
 * Démarre ou reprend un chrono
 * @param {string} id
 * @param {function} callbackTick - appelé à chaque tick avec le temps en ms
 */
function chronoDemarrer(id, callbackTick) {
  const c = chronoRegistre[id];
  if (!c || c.enCours) return;

  c.debut = Date.now();
  c.enCours = true;

  c.intervalle = setInterval(() => {
    const ms = chronoGetMs(id);
    callbackTick(id, ms);
  }, 47); // ~21fps, fluide sans surcharger
}

/**
 * Met en pause un chrono
 * @param {string} id
 */
function chronoPauser(id) {
  const c = chronoRegistre[id];
  if (!c || !c.enCours) return;

  clearInterval(c.intervalle);
  c.cumul += Date.now() - c.debut;
  c.enCours = false;
}

/**
 * Remet à zéro un chrono
 * @param {string} id
 */
function chronoReset(id) {
  const c = chronoRegistre[id];
  if (!c) return;

  clearInterval(c.intervalle);
  c.debut = 0;
  c.cumul = 0;
  c.intervalle = null;
  c.laps = [];
  c.enCours = false;
}

/**
 * Ajoute un lap au chrono
 * @param {string} id
 */
function chronoAjouterLap(id) {
  const c = chronoRegistre[id];
  if (!c) return;

  const ms = chronoGetMs(id);
  const numero = c.laps.length + 1;

  // Calcul du temps depuis le dernier lap
  const dernierLapMs = c.laps.length > 0 ? c.laps[c.laps.length - 1].total : 0;
  const delta = ms - dernierLapMs;

  c.laps.push({ numero, total: ms, delta });
}

/**
 * Retourne le temps écoulé en ms pour un chrono
 * @param {string} id
 * @returns {number}
 */
function chronoGetMs(id) {
  const c = chronoRegistre[id];
  if (!c) return 0;
  if (c.enCours) return c.cumul + (Date.now() - c.debut);
  return c.cumul;
}

/**
 * Retourne l'état complet d'un chrono
 * @param {string} id
 * @returns {object}
 */
function chronoGetEtat(id) {
  return chronoRegistre[id] || null;
}

/**
 * Retourne tous les ids enregistrés
 * @returns {string[]}
 */
function chronoGetTousIds() {
  return Object.keys(chronoRegistre);
}

/**
 * Supprime un chrono du registre
 * @param {string} id
 */
function chronoSupprimer(id) {
  const c = chronoRegistre[id];
  if (!c) return;
  clearInterval(c.intervalle);
  delete chronoRegistre[id];
}
