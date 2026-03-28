// 📄 Fichier : /js/modules/outils/chrono/chrono.js
// 🎯 Rôle : Logique métier pure — état des chronos, lap times, calculs

// ============================================================
// ÉTAT GLOBAL DU MODULE CHRONO
// ============================================================

/** État du mode actif : 'simple' ou 'multi' */
let modeActif = 'simple';

/**
 * Structure d'un chrono :
 * {
 *   id: number,
 *   label: string,
 *   tempsEcoule: number,   // en millisecondes
 *   enCours: boolean,
 *   laps: number[]         // tableau de temps en ms au moment du lap
 * }
 */
let chronos = [];

/** Compteur d'ID unique pour les chronos */
let prochainId = 1;

// ============================================================
// FABRIQUE — Création d'un chrono
// ============================================================

/**
 * Crée un nouvel objet chrono avec des valeurs initiales
 * @param {string} label - Nom affiché du chrono
 * @returns {object} Objet chrono initialisé
 */
export function creerChrono(label = '') {
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
// GESTION DE L'ÉTAT — Mode
// ============================================================

/** Retourne le mode actif ('simple' ou 'multi') */
export function getModeActif() {
  return modeActif;
}

/**
 * Définit le mode actif et réinitialise les chronos
 * @param {'simple'|'multi'} mode
 */
export function setModeActif(mode) {
  modeActif = mode;
  reinitialiserTout();
}

// ============================================================
// GESTION DE L'ÉTAT — Chronos
// ============================================================

/** Retourne la liste complète des chronos */
export function getChronos() {
  return chronos;
}

/**
 * Retourne un chrono par son ID
 * @param {number} id
 * @returns {object|undefined}
 */
export function getChronoById(id) {
  return chronos.find(c => c.id === id);
}

/**
 * Ajoute un nouveau chrono à la liste
 * @param {string} label - Optionnel
 * @returns {object} Le chrono créé
 */
export function ajouterChrono(label = '') {
  const chrono = creerChrono(label);
  chronos.push(chrono);
  return chrono;
}

/**
 * Supprime un chrono par son ID
 * @param {number} id
 */
export function supprimerChrono(id) {
  chronos = chronos.filter(c => c.id !== id);
}

// ============================================================
// LOGIQUE MÉTIER — Actions sur un chrono
// ============================================================

/**
 * Démarre un chrono (passe enCours à true)
 * @param {number} id
 */
export function demarrerChrono(id) {
  const chrono = getChronoById(id);
  if (chrono && !chrono.enCours) {
    chrono.enCours = true;
  }
}

/**
 * Met en pause un chrono
 * @param {number} id
 */
export function pauserChrono(id) {
  const chrono = getChronoById(id);
  if (chrono && chrono.enCours) {
    chrono.enCours = false;
  }
}

/**
 * Remet à zéro un chrono (temps + laps)
 * @param {number} id
 */
export function resetChrono(id) {
  const chrono = getChronoById(id);
  if (chrono) {
    chrono.tempsEcoule = 0;
    chrono.enCours = false;
    chrono.laps = [];
  }
}

/**
 * Enregistre un lap time pour un chrono
 * @param {number} id
 */
export function ajouterLap(id) {
  const chrono = getChronoById(id);
  if (chrono && chrono.enCours) {
    chrono.laps.push(chrono.tempsEcoule);
  }
}

/**
 * Met à jour le temps écoulé d'un chrono (appelé par le timer)
 * @param {number} id
 * @param {number} delta - Millisecondes écoulées depuis le dernier tick
 */
export function mettreAJourTemps(id, delta) {
  const chrono = getChronoById(id);
  if (chrono && chrono.enCours) {
    chrono.tempsEcoule += delta;
  }
}

// ============================================================
// LOGIQUE MÉTIER — Actions globales (mode multi)
// ============================================================

/** Démarre tous les chronos */
export function demarrerTous() {
  chronos.forEach(c => { c.enCours = true; });
}

/** Met en pause tous les chronos */
export function pauserTous() {
  chronos.forEach(c => { c.enCours = false; });
}

/** Remet à zéro tous les chronos */
export function resetTous() {
  chronos.forEach(c => {
    c.tempsEcoule = 0;
    c.enCours = false;
    c.laps = [];
  });
}

// ============================================================
// UTILITAIRES — Formatage du temps
// ============================================================

/**
 * Formate un temps en millisecondes → "MM:SS.ms"
 * @param {number} ms - Temps en millisecondes
 * @returns {string} Temps formaté
 */
export function formaterTemps(ms) {
  const minutes = Math.floor(ms / 60000);
  const secondes = Math.floor((ms % 60000) / 1000);
  const centimes = Math.floor((ms % 1000) / 10);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(secondes).padStart(2, '0');
  const cc = String(centimes).padStart(2, '0');

  return `${mm}:${ss}.${cc}`;
}

// ============================================================
// INITIALISATION
// ============================================================

/**
 * Réinitialise complètement le module
 * (appelé au changement de mode ou à la destruction)
 */
export function reinitialiserTout() {
  chronos = [];
  prochainId = 1;

  if (modeActif === 'simple') {
    ajouterChrono('Chrono');
  } else {
    ajouterChrono('Chrono 1');
    ajouterChrono('Chrono 2');
  }
}
