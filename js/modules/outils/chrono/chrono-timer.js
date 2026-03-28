// 📄 Fichier : /js/modules/outils/chrono/chrono-timer.js
// 🎯 Rôle : Gestion de la boucle de temps via requestAnimationFrame

import { getChronos, mettreAJourTemps } from './chrono.js';

// ============================================================
// ÉTAT DU TIMER
// ============================================================

/** Référence au frame courant (pour pouvoir l'annuler) */
let rafId = null;

/** Timestamp du dernier appel de la boucle */
let dernierTimestamp = null;

/** Callback appelé à chaque tick (pour déclencher le rendu UI) */
let callbackTick = null;

// ============================================================
// BOUCLE PRINCIPALE
// ============================================================

/**
 * Boucle requestAnimationFrame — appelée ~60x par seconde
 * Met à jour les temps de tous les chronos en cours
 * @param {DOMHighResTimeStamp} timestamp
 */
function boucle(timestamp) {
  // Calcul du delta depuis le dernier frame
  if (dernierTimestamp === null) {
    dernierTimestamp = timestamp;
  }

  const delta = timestamp - dernierTimestamp;
  dernierTimestamp = timestamp;

  // Mise à jour de chaque chrono actif
  const chronos = getChronos();
  chronos.forEach(chrono => {
    if (chrono.enCours) {
      mettreAJourTemps(chrono.id, delta);
    }
  });

  // Notification de l'UI
  if (callbackTick) {
    callbackTick();
  }

  // Continuation de la boucle
  rafId = requestAnimationFrame(boucle);
}

// ============================================================
// CONTRÔLES DU TIMER
// ============================================================

/**
 * Démarre la boucle de mise à jour
 * @param {function} onTick - Callback UI appelé à chaque frame
 */
export function demarrerTimer(onTick) {
  if (rafId !== null) return; // Déjà en cours

  callbackTick = onTick;
  dernierTimestamp = null;
  rafId = requestAnimationFrame(boucle);
}

/**
 * Arrête complètement la boucle de mise à jour
 */
export function arreterTimer() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
    dernierTimestamp = null;
  }
}

/**
 * Vérifie si le timer global est actif
 * @returns {boolean}
 */
export function timerEstActif() {
  return rafId !== null;
}

/**
 * Vérifie s'il reste au moins un chrono en cours
 * Si non, arrête la boucle automatiquement
 */
export function verifierEtArreterSiInactif() {
  const chronos = getChronos();
  const auMoinsUnActif = chronos.some(c => c.enCours);
  if (!auMoinsUnActif) {
    arreterTimer();
  }
}
