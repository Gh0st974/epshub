// 📄 Fichier : /js/modules/outils/chrono/chrono.js
// 🎯 Rôle : Logique métier pure — état des chronos, laps, calculs

// ============================================================
// ÉTAT GLOBAL
// ============================================================

/** Mode actif : 'simple' ou 'multi' */
let modeActif = 'simple';

/** Liste des chronos actifs */
let chronos = [];

/** Compteur d'ID auto-incrémenté */
let prochainId = 1;

// ============================================================
// FABRIQUE
// ============================================================

/**
 * Crée un objet chrono initialisé
 * @param {string} label - Nom affiché
 * @returns {object}
 */
function creerChrono(label = '') {
  const id = prochainId++;
  return {
    id,
    label: label || `Chrono ${id}`,
    tempsEcoule: 0,
    enCours: false,
    laps: []
  };
}

// ============================================================
// GETTERS
// ============================================================

/** Retourne le mode actif */
function getModeActif() {
  return modeActif;
}

/** Retourne la liste des chronos */
function getChronos() {
  return chronos;
}

/**
 * Retourne un chrono par son id
 * @param {number} id
 * @returns {object|undefined}
 */
function getChronoById(id) {
  return chronos.find(c => c.id === id);
}

// ============================================================
// ACTIONS SUR LE MODE
// ============================================================

/**
 * Change le mode et réinitialise tous les chronos
 * @param {'simple'|'multi'} mode
 */
function setModeActif(mode) {
  modeActif = mode;
  reinitialiserTout();
}

// ============================================================
// ACTIONS SUR LES CHRONOS
// ============================================================

/**
 * Ajoute un nouveau chrono à la liste
 * @param {string} label
 * @returns {object} le chrono créé
 */
function ajouterChrono(label = '') {
  const c = creerChrono(label);
  chronos.push(c);
  return c;
}

/**
 * Supprime un chrono par son id
 * @param {number} id
 */
function supprimerChrono(id) {
  chronos = chronos.filter(c => c.id !== id);
}

/**
 * Démarre ou met en pause un chrono
 * @param {number} id
 */
function toggleChrono(id) {
  const c = getChronoById(id);
  if (!c) return;
  c.enCours = !c.enCours;
}

/**
 * Remet un chrono à zéro
 * @param {number} id
 */
function resetChrono(id) {
  const c = getChronoById(id);
  if (!c) return;
  c.enCours = false;
  c.tempsEcoule = 0;
  c.laps = [];
}

/**
 * Enregistre un lap sur un chrono
 * @param {number} id
 */
function lapChrono(id) {
  const c = getChronoById(id);
  if (!c || !c.enCours) return;
  c.laps.push(c.tempsEcoule);
}

/**
 * Ajoute du temps écoulé à un chrono (appelé par le timer)
 * @param {number} id
 * @param {number} delta - ms écoulées
 */
function incrementerTemps(id, delta) {
  const c = getChronoById(id);
  if (!c || !c.enCours) return;
  c.tempsEcoule += delta;
}

// ============================================================
// RESET GLOBAL
// ============================================================

/**
 * Réinitialise tous les chronos et repart d'un chrono vide
 */
function reinitialiserTout() {
  chronos = [];
  prochainId = 1;
  ajouterChrono();
}

// ============================================================
// UTILITAIRES TEMPS
// ============================================================

/**
 * Formate un temps en ms → "MM:SS.cc"
 * @param {number} ms
 * @returns {string}
 */
function formaterTemps(ms) {
  const centisecondes = Math.floor((ms % 1000) / 10);
  const secondes      = Math.floor((ms / 1000) % 60);
  const minutes       = Math.floor(ms / 60000);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(secondes).padStart(2, '0');
  const cc = String(centisecondes).padStart(2, '0');

  return `${mm}:${ss}.${cc}`;
}
