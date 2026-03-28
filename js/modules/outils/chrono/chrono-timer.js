// 📄 Fichier : /js/modules/outils/chrono/chrono-timer.js
// 🎯 Rôle : Boucle de mise à jour du temps — requestAnimationFrame

// ============================================================
// ÉTAT DE LA BOUCLE
// ============================================================

/** Timestamp du dernier frame */
let dernierTimestamp = null;

/** ID de la boucle RAF (pour pouvoir l'arrêter) */
let idAnimation = null;

/** Indique si la boucle tourne */
let boucleActive = false;

// ============================================================
// BOUCLE PRINCIPALE
// ============================================================

/**
 * Fonction appelée à chaque frame par requestAnimationFrame
 * Met à jour le temps de chaque chrono en cours
 * @param {number} timestamp - fourni par RAF
 */
function boucleTimer(timestamp) {
  if (!boucleActive) return;

  // Calcul du delta depuis le dernier frame
  if (dernierTimestamp !== null) {
    const delta = timestamp - dernierTimestamp;

    // Incrémenter tous les chronos actifs
    getChronos().forEach(c => {
      if (c.enCours) {
        incrementerTemps(c.id, delta);
        mettreAJourAffichageChrono(c.id);
      }
    });
  }

  dernierTimestamp = timestamp;
  idAnimation = requestAnimationFrame(boucleTimer);
}

// ============================================================
// CONTRÔLES DE LA BOUCLE
// ============================================================

/**
 * Démarre la boucle RAF si elle ne tourne pas déjà
 */
function demarrerBoucle() {
  if (boucleActive) return;
  boucleActive = true;
  dernierTimestamp = null;
  idAnimation = requestAnimationFrame(boucleTimer);
}

/**
 * Arrête la boucle RAF
 */
function arreterBoucle() {
  boucleActive = false;
  dernierTimestamp = null;
  if (idAnimation) {
    cancelAnimationFrame(idAnimation);
    idAnimation = null;
  }
}

/**
 * Vérifie si au moins un chrono est en cours
 * Si aucun, arrête la boucle pour économiser les ressources
 */
function verifierEtArreterSiInactif() {
  const unActif = getChronos().some(c => c.enCours);
  if (!unActif) arreterBoucle();
}
