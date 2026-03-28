// 📄 Fichier : js/modules/scoreboard/scoreboard-events.js
// 🎯 Rôle : Écoute de toutes les interactions utilisateur

const ScoreboardEvents = (function () {

  // ══════════════════════════════════════
  // INITIALISATION DE TOUS LES EVENTS
  // ══════════════════════════════════════

  function init() {
    ecouterBtnConfig();
    ecouterFermerConfig();
    ecouterValiderConfig();
    ecouterAjouterEquipe();
    ecouterAjouterBonus();
    ecouterTogglePeriodes();
    ecouterPeriodeSuivante();
    ecouterReset();
    ecouterPointsParDelegation();
    ecouterNomEquipeParDelegation();
  }

  // ══════════════════════════════════════
  // PANNEAU DE CONFIGURATION
  // ══════════════════════════════════════

  /** Ouvre le panneau de configuration */
  function ecouterBtnConfig() {
    const btn = document.getElementById('scoreboard-btn-config');
    if (!btn) return;
    btn.addEventListener('click', () => {
      ScoreboardConfig.preRemplirConfig();
      const overlay = document.getElementById('scoreboard-config-overlay');
      overlay.hidden = false;
    });
  }

  /** Ferme le panneau de configuration */
  function ecouterFermerConfig() {
    const btn = document.getElementById('scoreboard-btn-fermer-config');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.getElementById('scoreboard-config-overlay').hidden = true;
    });

    // Ferme aussi en cliquant sur l'overlay (hors panneau)
    const overlay = document.getElementById('scoreboard-config-overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  }

  /** Valide la configuration et relance le rendu */
  function ecouterValiderConfig() {
    const btn = document.getElementById('scoreboard-btn-valider-config');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const config = ScoreboardConfig.lireConfigurationComplete();

      // Validation : au moins 2 équipes
      if (config.equipes.length < 2) {
        alert('Il faut au moins 2 équipes !');
        return;
      }

      ScoreboardApp.appliquerConfiguration(config);
      document.getElementById('scoreboard-config-overlay').hidden = true;
      ScoreboardUI.rendrePage();
    });
  }

  // ══════════════════════════════════════
  // AJOUT D'ÉQUIPES ET BONUS EN CONFIG
  // ══════════════════════════════════════

  /** Ajoute une ligne d'équipe dans le panneau de config */
  function ecouterAjouterEquipe() {
    const btn = document.getElementById('scoreboard-btn-ajouter-equipe');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const liste = document.getElementById('scoreboard-config-equipes-liste');
      const nbActuel = liste.querySelectorAll('.scoreboard-config-equipe-ligne').length;

      // Maximum 6 équipes
      if (nbActuel >= 6) {
        alert('Maximum 6 équipes !');
        return;
      }

      const nouvelleLigne = ScoreboardConfig.genererLigneEquipe('', null, nbActuel);
      liste.appendChild(nouvelleLigne);
    });
  }

  /** Ajoute une ligne de bonus dans le panneau de config */
  function ecouterAjouterBonus() {
    const btn = document.getElementById('scoreboard-btn-ajouter-bonus');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const liste = document.getElementById('scoreboard-config-bonus-liste');
      const nouvelleLigne = ScoreboardConfig.genererLigneBonus('', '');
      liste.appendChild(nouvelleLigne);
    });
  }

  // ══════════════════════════════════════
  // TOGGLE PÉRIODES
  // ══════════════════════════════════════

  /** Affiche/masque les options de périodes selon la checkbox */
  function ecouterTogglePeriodes() {
    const checkbox = document.getElementById('scoreboard-config-periodes-actives');
    if (!checkbox) return;
    checkbox.addEventListener('change', () => {
      const detail = document.getElementById('scoreboard-config-periodes-detail');
      detail.hidden = !checkbox.checked;
    });
  }

  // ══════════════════════════════════════
  // PÉRIODES EN JEU
  // ══════════════════════════════════════

  /** Passe à la période suivante */
  function ecouterPeriodeSuivante() {
    const btn = document.getElementById('scoreboard-btn-periode-suivante');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const ok = ScoreboardApp.periodesuivante();
      if (ok) {
        ScoreboardUI.rendreBarrePeriode();
      }
    });
  }

  // ══════════════════════════════════════
  // RESET
  // ══════════════════════════════════════

  /** Réinitialise tous les scores après confirmation */
  function ecouterReset() {
    const btn = document.getElementById('scoreboard-btn-reset');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (confirm('Remettre tous les scores à zéro ?')) {
        ScoreboardApp.reinitialiserScores();
        ScoreboardUI.rendrePage();
      }
    });
  }

  // ══════════════════════════════════════
  // POINTS — DÉLÉGATION D'ÉVÉNEMENTS
  // ══════════════════════════════════════

  /**
   * Délégation sur le conteneur des équipes pour capter
   * tous les clics sur les boutons de points (y compris bonus)
   */
  function ecouterPointsParDelegation() {
    const conteneur = document.getElementById('scoreboard-equipes');
    if (!conteneur) return;

    conteneur.addEventListener('click', (e) => {
      const btn = e.target.closest('.scoreboard-btn-point');
      if (!btn) return;

      const idEquipe = parseInt(btn.dataset.idEquipe, 10);
      const points   = parseInt(btn.dataset.points, 10);

      if (isNaN(idEquipe) || isNaN(points)) return;

      ScoreboardApp.ajouterPoints(idEquipe, points);
      ScoreboardUI.mettreAJourScore(idEquipe);
    });
  }

  // ══════════════════════════════════════
  // NOM D'ÉQUIPE EN JEU — DÉLÉGATION
  // ══════════════════════════════════════

  /**
   * Délégation sur le conteneur des équipes pour
   * détecter les modifications de nom en direct
   */
  function ecouterNomEquipeParDelegation() {
    const conteneur = document.getElementById('scoreboard-equipes');
    if (!conteneur) return;

    conteneur.addEventListener('change', (e) => {
      const input = e.target.closest('.scoreboard-equipe-nom');
      if (!input) return;

      const carte    = input.closest('.scoreboard-equipe-carte');
      const idEquipe = parseInt(carte.dataset.idEquipe, 10);
      const equipes  = ScoreboardApp.getEquipes();
      const equipe   = equipes.find(eq => eq.id === idEquipe);

      if (equipe) {
        equipe.nom = input.value.trim() || equipe.nom;
      }
    });
  }

  // ══════════════════════════════════════
  // EXPOSITION
  // ══════════════════════════════════════
  return { init };

})();
