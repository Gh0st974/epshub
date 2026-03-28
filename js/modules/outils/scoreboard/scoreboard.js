// 📄 Fichier : js/modules/scoreboard/scoreboard.js
// 🎯 Rôle : Point d'entrée du module — état global et initialisation

(function () {

  // ══════════════════════════════════════
  // ÉTAT GLOBAL DU MODULE
  // ══════════════════════════════════════

  /** @type {Object} État complet du scoreboard */
  const etat = {
    equipes: [],        // tableau d'objets équipe
    bonus: [],          // tableau d'objets bonus { valeur, libelle }
    periodes: {
      actives: false,
      total: 2,
      courante: 1,
      nom: 'Période',
    },
  };

  // ══════════════════════════════════════
  // ÉQUIPES PAR DÉFAUT
  // ══════════════════════════════════════

  /** Crée un objet équipe avec des valeurs par défaut */
  function creerEquipe(id, nom, couleur) {
    return {
      id,
      nom,
      couleur,
      scoreTotal: 0,
      scoresPeriodes: [], // score par période
    };
  }

  /** Initialise les équipes de départ */
  function initialiserEquipesDefaut() {
    etat.equipes = [
      creerEquipe(1, 'Équipe A', '#2ecc71'),
      creerEquipe(2, 'Équipe B', '#3498db'),
    ];
  }

  // ══════════════════════════════════════
  // ACTIONS SUR LES SCORES
  // ══════════════════════════════════════

  /** Ajoute des points à une équipe */
  function ajouterPoints(idEquipe, points) {
    const equipe = etat.equipes.find(e => e.id === idEquipe);
    if (!equipe) return;

    equipe.scoreTotal += points;

    // Si les périodes sont actives, on note le score de la période courante
    if (etat.periodes.actives) {
      const indexPeriode = etat.periodes.courante - 1;
      if (!equipe.scoresPeriodes[indexPeriode]) {
        equipe.scoresPeriodes[indexPeriode] = 0;
      }
      equipe.scoresPeriodes[indexPeriode] += points;
    }
  }

  /** Remet tous les scores à zéro */
  function reinitialiserScores() {
    etat.equipes.forEach(equipe => {
      equipe.scoreTotal = 0;
      equipe.scoresPeriodes = [];
    });
    if (etat.periodes.actives) {
      etat.periodes.courante = 1;
    }
  }

  // ══════════════════════════════════════
  // GESTION DES PÉRIODES
  // ══════════════════════════════════════

  /** Passe à la période suivante si possible */
  function periodesuivante() {
    if (etat.periodes.courante < etat.periodes.total) {
      etat.periodes.courante++;
      return true;
    }
    return false; // dernière période atteinte
  }

  // ══════════════════════════════════════
  // GESTION DE LA CONFIGURATION
  // ══════════════════════════════════════

  /** Applique la configuration depuis le panneau de setup */
  function appliquerConfiguration(config) {
    // Mise à jour des équipes
    etat.equipes = config.equipes.map((e, index) =>
      creerEquipe(index + 1, e.nom, e.couleur)
    );

    // Mise à jour des bonus
    etat.bonus = config.bonus.filter(b => b.valeur > 0 && b.libelle.trim() !== '');

    // Mise à jour des périodes
    etat.periodes.actives  = config.periodes.actives;
    etat.periodes.total    = config.periodes.total;
    etat.periodes.courante = 1;
    etat.periodes.nom      = config.periodes.nom || 'Période';
  }

  // ══════════════════════════════════════
  // GETTERS — accès à l'état pour les autres fichiers
  // ══════════════════════════════════════

  function getEtat()    { return etat; }
  function getEquipes() { return etat.equipes; }
  function getBonus()   { return etat.bonus; }
  function getPeriodes(){ return etat.periodes; }

  // ══════════════════════════════════════
  // CHARGEMENT DES SOUS-MODULES
  // ══════════════════════════════════════

  /** Charge un fichier JS dynamiquement */
  function chargerScript(chemin, callback) {
    const script = document.createElement('script');
    script.src = chemin;
    script.onload = callback;
    script.onerror = () => console.error(`Erreur chargement : ${chemin}`);
    document.body.appendChild(script);
  }

  // ══════════════════════════════════════
  // EXPOSITION GLOBALE
  // Nécessaire pour la communication entre fichiers
  // ══════════════════════════════════════
  window.ScoreboardApp = {
    getEtat,
    getEquipes,
    getBonus,
    getPeriodes,
    ajouterPoints,
    reinitialiserScores,
    periodesuivante,
    appliquerConfiguration,
    creerEquipe,
  };

  // ══════════════════════════════════════
  // INITIALISATION — chargement en cascade
  // ══════════════════════════════════════
  initialiserEquipesDefaut();

  chargerScript('js/modules/scoreboard/scoreboard-config.js', () => {
    chargerScript('js/modules/scoreboard/scoreboard-ui.js', () => {
      chargerScript('js/modules/scoreboard/scoreboard-events.js', () => {
        // Tout est chargé : on lance le rendu initial
        ScoreboardUI.rendrePage();
        ScoreboardEvents.init();
      });
    });
  });

})();
