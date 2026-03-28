// 📄 Fichier : /js/modules/outils/chrono/chrono-events.js
// 🎯 Rôle : Écoute des interactions utilisateur du module Chrono

// ============================================================
// INITIALISATION PRINCIPALE
// ============================================================

/**
 * Point d'entrée — appelé par app.js
 * Construit la vue et branche tous les événements
 */
function initChrono() {
  // Réinitialiser l'état métier
  reinitialiserTout();

  // Construire le DOM (chrono-ui.js)
  construireVueChrono();

  // Brancher les listeners
  ecouterRetour();
  ecouterSwitcherMode();
  ecouterAjoutChrono();
  ecouterActionsChrono();

  console.log('⏱️ Module Chrono initialisé');
}

// ============================================================
// NAVIGATION
// ============================================================

/**
 * Bouton "← Retour" — retourne au hub
 */
function ecouterRetour() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'chrono-btn-retour') {
      arreterBoucle();
      naviguerVers('vue-hub');
    }
  });
}

// ============================================================
// SWITCHER DE MODE
// ============================================================

/**
 * Bascule entre mode simple et multi
 */
function ecouterSwitcherMode() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.chrono-mode-btn');
    if (!btn) return;

    const mode = btn.dataset.mode;
    if (mode === getModeActif()) return;

    // Arrêter la boucle avant le reset
    arreterBoucle();

    // Changer le mode (reset inclus dans setModeActif)
    setModeActif(mode);

    // Rafraîchir l'affichage
    rafraichirListeChronos();
    mettreAJourModeUI(mode);
  });
}

// ============================================================
// AJOUT DE CHRONO (mode multi)
// ============================================================

/**
 * Ajoute un nouveau chrono en mode multi
 */
function ecouterAjoutChrono() {
  document.addEventListener('click', (e) => {
    if (e.target.id !== 'chrono-btn-ajouter') return;

    const nouveau = ajouterChrono();
    const liste   = document.getElementById('chrono-liste');
    if (!liste) return;

    liste.appendChild(creerCarteChronoUI(nouveau));
    mettreAJourModeUI(getModeActif());
  });
}

// ============================================================
// ACTIONS SUR LES CHRONOS
// ============================================================

/**
 * Délégation d'événements sur les boutons des cartes chrono
 */
function ecouterActionsChrono() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id     = Number(btn.dataset.id);

    switch (action) {
      case 'toggle':    gererToggle(id);     break;
      case 'reset':     gererReset(id);      break;
      case 'lap':       gererLap(id);        break;
      case 'supprimer': gererSuppression(id); break;
    }
  });
}

// ============================================================
// GESTIONNAIRES D'ACTIONS
// ============================================================

/**
 * Démarre ou met en pause un chrono
 * @param {number} id
 */
function gererToggle(id) {
  toggleChrono(id);
  mettreAJourBoutonToggle(id);

  const c = getChronoById(id);
  if (c && c.enCours) {
    demarrerBoucle();
  } else {
    verifierEtArreterSiInactif();
  }
}

/**
 * Remet un chrono à zéro
 * @param {number} id
 */
function gererReset(id) {
  resetChrono(id);
  mettreAJourAffichageChrono(id);
  mettreAJourBoutonToggle(id);
  mettreAJourLaps(id);
  verifierEtArreterSiInactif();
}

/**
 * Enregistre un lap
 * @param {number} id
 */
function gererLap(id) {
  lapChrono(id);
  mettreAJourLaps(id);
}

/**
 * Supprime un chrono (minimum 1 conservé)
 * @param {number} id
 */
function gererSuppression(id) {
  if (getChronos().length <= 1) return;
  supprimerChrono(id);
  supprimerCarteChronoUI(id);
  verifierEtArreterSiInactif();
}
