// 📄 Fichier : js/modules/outils/chrono/chrono-timer.js
// 🎯 Rôle : Logique métier — gestion du tick, calcul du temps, état des chronos

// ─── Registre de tous les chronos actifs ──────────────────────────────────────
const chronoRegistre = {};

/**
 * Crée un chrono avec un identifiant unique
 * @param {string} id - Identifiant du chrono
 */
function chronoCreer(id) {
  chronoRegistre[id] = {
    id,
    enCours: false,
    debut: 0,         // timestamp de démarrage
    accumule: 0,      // ms accumulées avant la dernière pause
    intervalId: null,
    laps: [],
    dernierLapMs: 0,  // temps total au dernier lap
  };
}

/**
 * Démarre ou reprend un chrono
 * @param {string} id
 * @param {function} onTick - callback appelé à chaque tick avec le temps en ms
 */
function chronoDemarrer(id, onTick) {
  const c = chronoRegistre[id];
  if (!c || c.enCours) return;

  c.enCours = true;
  c.debut = performance.now();

  // Tick toutes les 30ms (≈ centièmes fluides)
  c.intervalId = setInterval(() => {
    const elapsed = chronoGetMs(id);
    onTick(elapsed);
  }, 30);
}

/**
 * Met en pause un chrono
 * @param {string} id
 */
function chronoPauser(id) {
  const c = chronoRegistre[id];
  if (!c || !c.enCours) return;

  clearInterval(c.intervalId);
  c.accumule += performance.now() - c.debut;
  c.enCours = false;
}

/**
 * Remet à zéro un chrono
 * @param {string} id
 */
function chronoReset(id) {
  const c = chronoRegistre[id];
  if (!c) return;

  clearInterval(c.intervalId);
  c.enCours = false;
  c.debut = 0;
  c.accumule = 0;
  c.intervalId = null;
  c.laps = [];
  c.dernierLapMs = 0;
}

/**
 * Supprime un chrono du registre
 * @param {string} id
 */
function chronoSupprimer(id) {
  chronoReset(id);
  delete chronoRegistre[id];
}

/**
 * Retourne le temps écoulé en millisecondes
 * @param {string} id
 * @returns {number}
 */
function chronoGetMs(id) {
  const c = chronoRegistre[id];
  if (!c) return 0;
  if (!c.enCours) return c.accumule;
  return c.accumule + (performance.now() - c.debut);
}

/**
 * Enregistre un lap pour un chrono
 * @param {string} id
 * @returns {object|null} le lap enregistré
 */
function chronoAjouterLap(id) {
  const c = chronoRegistre[id];
  if (!c) return null;

  const totalMs = chronoGetMs(id);
  const splitMs = totalMs - c.dernierLapMs;
  const numero = c.laps.length + 1;

  const lap = { numero, totalMs, splitMs };
  c.laps.unshift(lap); // plus récent en premier
  c.dernierLapMs = totalMs;

  return lap;
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
 * Retourne tous les IDs enregistrés
 * @returns {string[]}
 */
function chronoGetTousIds() {
  return Object.keys(chronoRegistre);
}
