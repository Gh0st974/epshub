// 📄 Fichier : js/modules/outils/scoreboard/scoreboard.js
// 🎯 Rôle : Point d'entrée + état global du module scoreboard

(function () {

  // ═══ ÉTAT GLOBAL ═══
  // Partagé entre tous les fichiers du module via window.SB
  window.SB = {

    // Configuration
    config: {
      nbEquipes: 2,
      nbSets: 3,
      nomsEquipes: ['Équipe A', 'Équipe B', 'Équipe C', 'Équipe D'],
      boutonsBonus: [
        { label: '+2', valeur: 2 },
        { label: '+3', valeur: 3 }
      ],
      couleurs: ['#e74c3c', '#3498db', '#f39c12', '#9b59b6'],
      timerDuree: 5 * 60 // secondes
    },

    // État du match
    etat: {
      setActif: 0, // index 0-based
      // scores[setIndex][equipeIndex] = score
      scores: [],
      timerSecondes: 5 * 60,
      timerEnCours: false,
      timerInterval: null
    },

    // Callback confirmé pour changer de set (stocké en attente)
    setEnAttente: null
  };

  // ═══ INITIALISATION DES SCORES ═══
  function initialiserScores() {
    const { nbEquipes, nbSets } = window.SB.config;
    window.SB.etat.scores = [];
    for (let s = 0; s < nbSets; s++) {
      const ligne = [];
      for (let e = 0; e < nbEquipes; e++) {
        ligne.push(0);
      }
      window.SB.etat.scores.push(ligne);
    }
  }

  // ═══ APPLIQUER LA CONFIGURATION ═══
  // Appelé depuis scoreboard-events.js quand l'utilisateur valide
  window.SB.appliquerConfig = function () {
    // Sauvegarder les scores existants avant recréation
    initialiserScores();
    window.SB.etat.setActif = 0;
    window.SB.etat.timerSecondes = window.SB.config.timerDuree;
    window.SB.etat.timerEnCours = false;
    clearInterval(window.SB.etat.timerInterval);
    SBui.rendreTout();
  };

  // ═══ MODIFIER UN SCORE ═══
  window.SB.modifierScore = function (indexEquipe, delta) {
    const set = window.SB.etat.setActif;
    let nouveau = window.SB.etat.scores[set][indexEquipe] + delta;
    // Bloquer à 0 minimum
    if (nouveau < 0) nouveau = 0;
    window.SB.etat.scores[set][indexEquipe] = nouveau;
    SBui.mettreAJourScore(indexEquipe);
  };

  // ═══ CHANGER DE SET ═══
  window.SB.allerAuSet = function (indexSet) {
    if (indexSet < 0 || indexSet >= window.SB.config.nbSets) return;
    window.SB.etat.setActif = indexSet;
    SBui.rendrePastilles();
    SBui.rendreScores();
  };

  // ═══ SET SUIVANT ═══
  window.SB.setSuivant = function () {
    const suivant = window.SB.etat.setActif + 1;
    if (suivant < window.SB.config.nbSets) {
      window.SB.allerAuSet(suivant);
    }
  };

  // ═══ RESET GLOBAL ═══
  window.SB.resetGlobal = function () {
    clearInterval(window.SB.etat.timerInterval);
    window.SB.etat.timerEnCours = false;
    window.SB.etat.timerSecondes = window.SB.config.timerDuree;
    initialiserScores();
    window.SB.etat.setActif = 0;
    SBui.rendreTout();
  };

  // ═══ LANCEMENT ═══
  initialiserScores();

  // Charger les fichiers dépendants puis initialiser
  const base = 'js/modules/outils/scoreboard/';
  const fichiers = [
    base + 'scoreboard-ui.js',
    base + 'scoreboard-timer.js',
    base + 'scoreboard-events.js'
  ];

  let chargés = 0;
  fichiers.forEach((src, i) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function () {
      chargés++;
      // Initialiser uniquement quand tous les scripts sont chargés
      if (chargés === fichiers.length) {
        SBui.rendreTout();
        SBevents.init();
      }
    };
    document.body.appendChild(script);
  });

})();
