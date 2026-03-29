// 📄 Fichier : js/modules/outils/scoreboard/scoreboard.js
// 🎯 Rôle : Point d'entrée et logique métier du scoreboard

(function () {

  /* ══════════════════════════════
     ÉTAT GLOBAL DU MODULE
  ══════════════════════════════ */
  const etat = {
    equipes: [
      { nom: 'Équipe A', couleur: '#e74c3c' },
      { nom: 'Équipe B', couleur: '#3498db' }
    ],
    nbSets: 3,
    setActif: 0,
    // scores[setIdx][equipeIdx] = score
    scores: [],
    bonus: [
      { nom: '+2', valeur: 2 },
      { nom: '+3', valeur: 3 }
    ],
    timer: {
      totalSecondes: 300,
      restantes: 300,
      intervalle: null,
      enCours: false
    }
  };

  /* ══════════════════════════════
     INITIALISATION DES SCORES
  ══════════════════════════════ */
  function initialiserScores() {
    etat.scores = [];
    for (let s = 0; s < etat.nbSets; s++) {
      etat.scores[s] = etat.equipes.map(() => 0);
    }
  }

  /* ══════════════════════════════
     ACCESSEURS MÉTIER
  ══════════════════════════════ */
  function getScore(setIdx, equipeIdx) {
    return etat.scores[setIdx]?.[equipeIdx] ?? 0;
  }

  function modifierScore(equipeIdx, delta) {
    const s = etat.setActif;
    etat.scores[s][equipeIdx] = Math.max(0, etat.scores[s][equipeIdx] + delta);
    sbUI.mettreAJourScore(equipeIdx, etat.scores[s][equipeIdx]);
    sbUI.mettreAJourSetScore(equipeIdx, etat.scores, etat.nbSets);
  }

  function changerSet(idx) {
    etat.setActif = idx;
    sbUI.mettreAJourPastilles(etat.nbSets, etat.setActif);
    sbUI.mettreAJourTousScores(etat.scores, etat.setActif, etat.equipes);
  }

  function resetGlobal() {
    initialiserScores();
    etat.setActif = 0;
    stopperTimer();
    etat.timer.restantes = etat.timer.totalSecondes;
    sbUI.mettreAJourTousScores(etat.scores, etat.setActif, etat.equipes);
    sbUI.mettreAJourPastilles(etat.nbSets, etat.setActif);
    sbUI.mettreAJourTimerAffichage(etat.timer.restantes);
  }

  /* ══════════════════════════════
     TIMER
  ══════════════════════════════ */
  function lancerTimer() {
    if (etat.timer.enCours) return;
    etat.timer.enCours = true;
    etat.timer.intervalle = setInterval(() => {
      if (etat.timer.restantes <= 0) {
        stopperTimer();
        sbUI.signalerFinTimer();
        return;
      }
      etat.timer.restantes--;
      sbUI.mettreAJourTimerAffichage(etat.timer.restantes);
    }, 1000);
  }

  function pauserTimer() {
    if (!etat.timer.enCours) return;
    clearInterval(etat.timer.intervalle);
    etat.timer.enCours = false;
  }

  function stopperTimer() {
    clearInterval(etat.timer.intervalle);
    etat.timer.enCours = false;
  }

  function resetTimer() {
    stopperTimer();
    etat.timer.restantes = etat.timer.totalSecondes;
    sbUI.mettreAJourTimerAffichage(etat.timer.restantes);
  }

  function configurerTimer(minutes, secondes) {
    const total = minutes * 60 + secondes;
    etat.timer.totalSecondes = total;
    etat.timer.restantes = total;
    stopperTimer();
    sbUI.mettreAJourTimerAffichage(total);
  }

  /* ══════════════════════════════
     APPLICATION CONFIG
  ══════════════════════════════ */
  function appliquerConfig(config) {
    // Reconstruire équipes
    etat.equipes = config.equipes.map(e => ({ nom: e.nom, couleur: e.couleur }));
    etat.nbSets = config.nbSets;
    etat.bonus = config.bonus;
    etat.setActif = 0;
    initialiserScores();

    // Regénérer toute la UI
    sbUI.genererGrille(etat.equipes, etat.bonus);
    sbUI.mettreAJourPastilles(etat.nbSets, etat.setActif);
    sbUI.mettreAJourTousScores(etat.scores, etat.setActif, etat.equipes);
    sbUI.mettreAJourTimerAffichage(etat.timer.restantes);
    sbEvents.rebrancher(etat, actions);
  }

  /* ══════════════════════════════
     OBJET ACTIONS (partagé avec events)
  ══════════════════════════════ */
  const actions = {
    modifierScore,
    changerSet,
    resetGlobal,
    lancerTimer,
    pauserTimer,
    resetTimer,
    configurerTimer,
    appliquerConfig,
    getEtat: () => etat
  };

  /* ══════════════════════════════
     BOOT
  ══════════════════════════════ */
  function init() {
    initialiserScores();
    sbUI.genererGrille(etat.equipes, etat.bonus);
    sbUI.mettreAJourPastilles(etat.nbSets, etat.setActif);
    sbUI.mettreAJourTousScores(etat.scores, etat.setActif, etat.equipes);
    sbUI.mettreAJourTimerAffichage(etat.timer.restantes);
    sbUI.genererConfigNoms(etat.equipes);
    sbUI.genererConfigBonus(etat.bonus);
    sbEvents.init(etat, actions);
  }

  // Charger les fichiers dépendants puis démarrer
  Promise.all([
    chargerScript('js/modules/outils/scoreboard/scoreboard-ui.js'),
    chargerScript('js/modules/outils/scoreboard/scoreboard-events.js')
  ]).then(init);

  function chargerScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

})();
