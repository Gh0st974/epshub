// 📄 Fichier : /js/modules/outils/chrono/chrono-events.js
// 🎯 Rôle : Écoute des interactions utilisateur et orchestration des actions

import {
  getModeActif, setModeActif,
  demarrerChrono, pauserChrono, resetChrono, ajouterLap,
  demarrerTous, pauserTous, resetTous,
  ajouterChrono, supprimerChrono,
  getChronoById, reinitialiserTout
} from './chrono.js';

import {
  rendreZoneChronos,
  mettreAJourBoutonEtat,
  ajouterLapUI, viderLapsUI,
  ajouterCarteChronoUI, supprimerCarteChronoUI,
  mettreAJourAffichages
} from './chrono-ui.js';

import {
  demarrerTimer, arreterTimer,
  timerEstActif, verifierEtArreterSiInactif
} from './chrono-timer.js';

// ============================================================
// INITIALISATION DES ÉVÉNEMENTS
// ============================================================

/**
 * Point d'entrée — attache tous les écouteurs d'événements
 * Utilise la délégation d'événements sur le conteneur principal
 */
export function initialiserEvenements() {
  const conteneur = document.getElementById('chrono-app');
  if (!conteneur) return;

  // Délégation globale sur le conteneur
  conteneur.addEventListener('click', gererClic);
}

// ============================================================
// GESTIONNAIRE DE CLICS CENTRALISÉ
// ============================================================

/**
 * Redirige chaque clic vers le bon gestionnaire
 * @param {Event} e
 */
function gererClic(e) {
  const cible = e.target;

  // --- Sélecteur de mode ---
  if (cible.matches('.chrono-mode-btn')) {
    gererChangementMode(cible.dataset.mode);
    return;
  }

  // --- Bouton démarrer/pause individuel ---
  if (cible.matches('.btn-demarrer')) {
    gererDemarrerPauser(Number(cible.dataset.id));
    return;
  }

  // --- Bouton lap individuel ---
  if (cible.matches('.btn-lap')) {
    gererLap(Number(cible.dataset.id));
    return;
  }

  // --- Bouton reset individuel ---
  if (cible.matches('.btn-reset')) {
    gererReset(Number(cible.dataset.id));
    return;
  }

  // --- Bouton supprimer (mode multi) ---
  if (cible.matches('.btn-supprimer')) {
    gererSuppression(Number(cible.dataset.id));
    return;
  }

  // --- Contrôles globaux ---
  if (cible.matches('#btn-demarrer-tous')) { gererDemarrerTous(); return; }
  if (cible.matches('#btn-pauser-tous'))   { gererPauserTous();   return; }
  if (cible.matches('#btn-reset-tous'))    { gererResetTous();    return; }
  if (cible.matches('#btn-ajouter-chrono')){ gererAjoutChrono();  return; }
}

// ============================================================
// GESTIONNAIRES D'ACTIONS
// ============================================================

/**
 * Change le mode (simple/multi) et recharge la vue
 * @param {string} mode
 */
function gererChangementMode(mode) {
  if (mode === getModeActif()) return;

  arreterTimer();
  setModeActif(mode);
  rendreZoneChronos();
}

/**
 * Démarre ou met en pause un chrono individuel
 * @param {number} id
 */
function gererDemarrerPauser(id) {
  const chrono = getChronoById(id);
  if (!chrono) return;

  if (chrono.enCours) {
    // Mise en pause
    pauserChrono(id);
    mettreAJourBoutonEtat(id, false);
    verifierEtArreterSiInactif();
  } else {
    // Démarrage
    demarrerChrono(id);
    mettreAJourBoutonEtat(id, true);

    // Lance le timer global si pas encore actif
    if (!timerEstActif()) {
      demarrerTimer(mettreAJourAffichages);
    }
  }
}

/**
 * Enregistre un lap pour un chrono
 * @param {number} id
 */
function gererLap(id) {
  const chrono = getChronoById(id);
  if (!chrono || !chrono.enCours) return;

  ajouterLap(id);
  const numero = chrono.laps.length;
  const temps = chrono.laps[numero - 1];
  ajouterLapUI(id, temps, numero);
}

/**
 * Remet à zéro un chrono individuel
 * @param {number} id
 */
function gererReset(id) {
  resetChrono(id);
  mettreAJourBoutonEtat(id, false);
  viderLapsUI(id);

  // Mise à jour immédiate de l'affichage
  const el = document.getElementById(`chrono-temps-${id}`);
  if (el) el.textContent = '00:00.00';

  verifierEtArreterSiInactif();
}

/**
 * Supprime un chrono (mode multi)
 * @param {number} id
 */
function gererSuppression(id) {
  const chrono = getChronoById(id);
  if (!chrono) return;

  // Ne pas supprimer si c'est le dernier chrono
  const { getChronos } = require('./chrono.js'); // import dynamique évité
  supprimerChrono(id);
  supprimerCarteChronoUI(id);
  verifierEtArreterSiInactif();
}

/**
 * Démarre tous les chronos (mode multi)
 */
function gererDemarrerTous() {
  demarrerTous();

  // Met à jour l'état visuel de chaque bouton
  document.querySelectorAll('.chrono-carte').forEach(carte => {
    mettreAJourBoutonEtat(Number(carte.dataset.id), true);
  });

  if (!timerEstActif()) {
    demarrerTimer(mettreAJourAffichages);
  }
}

/**
 * Met en pause tous les chronos (mode multi)
 */
function gererPauserTous() {
  pauserTous();

  document.querySelectorAll('.chrono-carte').forEach(carte => {
    mettreAJourBoutonEtat(Number(carte.dataset.id), false);
  });

  arreterTimer();
}

/**
 * Remet à zéro tous les chronos (mode multi)
 */
function gererResetTous() {
  resetTous();
  arreterTimer();

  document.querySelectorAll('.chrono-carte').forEach(carte => {
    const id = Number(carte.dataset.id);
    mettreAJourBoutonEtat(id, false);
    viderLapsUI(id);
    const el = document.getElementById(`chrono-temps-${id}`);
    if (el) el.textContent = '00:00.00';
  });
}

/**
 * Ajoute un nouveau chrono dynamiquement (mode multi)
 */
function gererAjoutChrono() {
  const chrono = ajouterChrono();
  ajouterCarteChronoUI(chrono);
}
