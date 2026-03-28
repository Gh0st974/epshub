// 📄 Fichier : js/modules/scoreboard/scoreboard.js
// 🎯 Rôle : Point d'entrée du module — état global et initialisation

(function () {

  // ══════════════════════════════════════
  // ÉTAT GLOBAL
  // ══════════════════════════════════════

  const etat = {
    equipes: [],
    bonus: [],
    periodes: {
      actives: false,
      total: 2,
      courante: 1,
      nom: 'Période',
    },
  };

  // ══════════════════════════════════════
  // ÉQUIPES
  // ══════════════════════════════════════

  function creerEquipe(id, nom, couleur) {
    return { id, nom, couleur, scoreTotal: 0, scoresPeriodes: [] };
  }

  function initialiserEquipesDefaut() {
    etat.equipes = [
      creerEquipe(1, 'Équipe A', '#2ecc71'),
      creerEquipe(2, 'Équipe B', '#3498db'),
    ];
  }

  // ══════════════════════════════════════
  // ACTIONS SCORES
  // ══════════════════════════════════════

  function ajouterPoints(idEquipe, points) {
    const equipe = etat.equipes.find(e => e.id === idEquipe);
    if (!equipe) return;
    equipe.scoreTotal += points;
    if (etat.periodes.actives) {
      const idx = etat.periodes.courante - 1;
      if (!equipe.scoresPeriodes[idx]) equipe.scoresPeriodes[idx] = 0;
      equipe.scoresPeriodes[idx] += points;
    }
  }

  function reinitialiserScores() {
    etat.equipes.forEach(eq => {
      eq.scoreTotal = 0;
      eq.scoresPeriodes = [];
    });
    if (etat.periodes.actives) etat.periodes.courante = 1;
  }

  // ══════════════════════════════════════
  // PÉRIODES
  // ══════════════════════════════════════

  function periodeSuivante() {
    if (etat.periodes.courante < etat.periodes.total) {
      etat.periodes.courante++;
      return true;
    }
    return false;
  }

  // ══════════════════════════════════════
  // CONFIGURATION
  // ══════════════════════════════════════

  function appliquerConfiguration(config) {
    etat.equipes = config.equipes.map((e, i) => creerEquipe(i + 1, e.nom, e.couleur));
    etat.bonus   = config.bonus.filter(b => b.valeur > 0 && b.libelle.trim() !== '');
    etat.periodes.actives  = config.periodes.actives;
    etat.periodes.total    = config.periodes.total;
    etat.periodes.courante = 1;
    etat.periodes.nom      = config.periodes.nom || 'Période';
  }

  // ══════════════════════════════════════
  // GETTERS
  // ══════════════════════════════════════

  function getEtat()     { return etat; }
  function getEquipes()  { return etat.equipes; }
  function getBonus()    { return etat.bonus; }
  function getPeriodes() { return etat.periodes; }

  // ══════════════════════════════════════
  // CHARGEMENT EN CASCADE
  // ══════════════════════════════════════

  function chargerScript(chemin, callback) {
    // Supprime l'ancienne version pour forcer le rechargement
    const ancien = document.querySelector(`script[src="${chemin}"]`);
    if (ancien) ancien.remove();

    const script = document.createElement('script');
    script.src = chemin;
    script.onload = callback;
    script.onerror = () => console.error(`❌ Erreur chargement : ${chemin}`);
    document.body.appendChild(script);
  }

  // ══════════════════════════════════════
  // EXPOSITION GLOBALE
  // ══════════════════════════════════════

  window.ScoreboardApp = {
    getEtat, getEquipes, getBonus, getPeriodes,
    ajouterPoints, reinitialiserScores, periodeSuivante,
    appliquerConfiguration, creerEquipe,
  };

  // ══════════════════════════════════════
  // INITIALISATION
  // ══════════════════════════════════════

  initialiserEquipesDefaut();

  // Reset du flag events si module rechargé par le router
  if (window.ScoreboardEvents) window.ScoreboardEvents.reset();

  // ✅ CORRIGÉ : chemins relatifs corrects (même dossier)
  chargerScript('js/modules/outils/scoreboard/scoreboard-config.js', () => {
    chargerScript('js/modules/outils/scoreboard/scoreboard-ui.js', () => {
      chargerScript('js/modules/outils/scoreboard/scoreboard-events.js', () => {
        ScoreboardUI.rendrePage();
        ScoreboardEvents.init();
      });
    });
  });

})();
