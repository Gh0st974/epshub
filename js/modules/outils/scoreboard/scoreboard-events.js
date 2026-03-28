// 📄 Fichier : js/modules/scoreboard/scoreboard-events.js
// 🎯 Rôle : Écoute de toutes les interactions utilisateur (délégation sur document)

const ScoreboardEvents = (function () {

  // Flag pour éviter les doublons d'écouteurs
  let _initialise = false;

  // ══════════════════════════════════════
  // INITIALISATION
  // ══════════════════════════════════════

  function init() {
    if (_initialise) return;
    _initialise = true;
    ecouterClics();
    ecouterChangements();
  }

  // ✅ AJOUTÉ : reset du flag si le module est rechargé par le router
  function reset() {
    _initialise = false;
  }

  // ══════════════════════════════════════
  // DÉLÉGATION UNIQUE — CLICS
  // ══════════════════════════════════════

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
        const liste    = document.getElementById('scoreboard-config-equipes-liste');
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
        liste.appendChild(ScoreboardConfig.genererLigneBonus('', ''));
        return;
      }

      // ── Période suivante ──
      if (e.target.closest('#scoreboard-btn-periode-suivante')) {
        // ✅ CORRIGÉ : appel periodeSuivante() — camelCase unifié
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

      // ── Boutons de points ──
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

  function ecouterChangements() {
    document.addEventListener('change', (e) => {

      // ── Toggle périodes ──
      if (e.target.closest('#scoreboard-config-periodes-actives')) {
        const detail = document.getElementById('scoreboard-config-periodes-detail');
        if (detail) detail.hidden = !e.target.checked;
        return;
      }

      // ── Modification du nom d'équipe en jeu ──
      const inputNom = e.target.closest('.scoreboard-equipe-nom');
      if (inputNom) {
        const carte = inputNom.closest('.scoreboard-equipe-carte');
        if (!carte) return;
        const idEquipe = parseInt(carte.dataset.idEquipe, 10);
        const equipe   = ScoreboardApp.getEquipes().find(eq => eq.id === idEquipe);
        if (equipe) equipe.nom = inputNom.value.trim() || equipe.nom;
        return;
      }

    });
  }

  // ══════════════════════════════════════
  // EXPOSITION
  // ══════════════════════════════════════
  return { init, reset };

})();
