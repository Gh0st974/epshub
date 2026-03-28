// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-events.js
// 🎯 Rôle : Écoute de toutes les interactions utilisateur (délégation sur document)

const ScoreboardEvents = (function () {

  // Flag pour éviter les doublons d'écouteurs
  let _initialise = false;

  // ══════════════════════════════════════
  // INITIALISATION DE TOUS LES EVENTS
  // ══════════════════════════════════════

  function init() {
    // Sécurité : on n'attache les écouteurs qu'une seule fois
    if (_initialise) return;
    _initialise = true;

    ecouterClics();
    ecouterChangements();
  }

  // ══════════════════════════════════════
  // DÉLÉGATION UNIQUE — CLICS
  // ══════════════════════════════════════

  /**
   * Un seul écouteur de clic sur le document.
   * Il gère tous les boutons par leur id ou leur classe.
   */
  function ecouterClics() {
    document.addEventListener('click', (e) => {

      // ── Ouvrir la configuration ──
      if (e.target.closest('#scoreboard-btn-config')) {
        ScoreboardConfig.preRemplirConfig();
        document.getElementById('scoreboard-config-overlay').hidden = false;
        return;
      }

      // ── Fermer la configuration (bouton ✕) ──
      if (e.target.closest('#scoreboard-btn-fermer-config')) {
        document.getElementById('scoreboard-config-overlay').hidden = true;
        return;
      }

      // ── Fermer en cliquant sur l'overlay (fond gris) ──
      const overlay = document.getElementById('scoreboard-config-overlay');
      if (overlay && e.target === overlay) {
        overlay.hidden = true;
        return;
      }

      // ── Valider la configuration ──
      if (e.target.closest('#scoreboard-btn-valider-config')) {
        const config = ScoreboardConfig.lireConfigurationComplete();
        if (config.equipes.length < 2) {
          alert('Il faut au moins 2 équipes !');
          return;
        }
        ScoreboardApp.appliquerConfiguration(config);
        document.getElementById('scoreboard-config-overlay').hidden = true;
        ScoreboardUI.rendrePage();
        return;
      }

      // ── Ajouter une équipe en config ──
      if (e.target.closest('#scoreboard-btn-ajouter-equipe')) {
        const liste   = document.getElementById('scoreboard-config-equipes-liste');
        const nbActuel = liste.querySelectorAll('.scoreboard-config-equipe-ligne').length;
        if (nbActuel >= 6) {
          alert('Maximum 6 équipes !');
          return;
        }
        const nouvelleLigne = ScoreboardConfig.genererLigneEquipe('', null, nbActuel);
        liste.appendChild(nouvelleLigne);
        return;
      }

      // ── Ajouter un bonus en config ──
      if (e.target.closest('#scoreboard-btn-ajouter-bonus')) {
        const liste = document.getElementById('scoreboard-config-bonus-liste');
        const nouvelleLigne = ScoreboardConfig.genererLigneBonus('', '');
        liste.appendChild(nouvelleLigne);
        return;
      }

      // ── Période suivante ──
      if (e.target.closest('#scoreboard-btn-periode-suivante')) {
        const ok = ScoreboardApp.periodeSuivante();
        if (ok) ScoreboardUI.rendreBarrePeriode();
        return;
      }

      // ── Reset des scores ──
      if (e.target.closest('#scoreboard-btn-reset')) {
        if (confirm('Remettre tous les scores à zéro ?')) {
          ScoreboardApp.reinitialiserScores();
          ScoreboardUI.rendrePage();
        }
        return;
      }

      // ── Boutons de points (délégation sur classe) ──
      const btnPoint = e.target.closest('.scoreboard-btn-point');
      if (btnPoint) {
        const idEquipe = parseInt(btnPoint.dataset.idEquipe, 10);
        const points   = parseInt(btnPoint.dataset.points, 10);
        if (isNaN(idEquipe) || isNaN(points)) return;
        ScoreboardApp.ajouterPoints(idEquipe, points);
        ScoreboardUI.mettreAJourScore(idEquipe);
        return;
      }

    });
  }

  // ══════════════════════════════════════
  // DÉLÉGATION UNIQUE — CHANGEMENTS
  // ══════════════════════════════════════

  /**
   * Un seul écouteur 'change' sur le document.
   * Gère la checkbox périodes et les noms d'équipes.
   */
  function ecouterChangements() {
    document.addEventListener('change', (e) => {

      // ── Toggle périodes ──
      if (e.target.closest('#scoreboard-config-periodes-actives')) {
        const checkbox = e.target;
        const detail   = document.getElementById('scoreboard-config-periodes-detail');
        if (detail) detail.hidden = !checkbox.checked;
        return;
      }

      // ── Modification du nom d'équipe en jeu ──
      const inputNom = e.target.closest('.scoreboard-equipe-nom');
      if (inputNom) {
        const carte    = inputNom.closest('.scoreboard-equipe-carte');
        if (!carte) return;
        const idEquipe = parseInt(carte.dataset.idEquipe, 10);
        const equipes  = ScoreboardApp.getEquipes();
        const equipe   = equipes.find(eq => eq.id === idEquipe);
        if (equipe) {
          equipe.nom = inputNom.value.trim() || equipe.nom;
        }
        return;
      }

    });
  }

  // ══════════════════════════════════════
  // EXPOSITION
  // ══════════════════════════════════════
  return { init };

})();
