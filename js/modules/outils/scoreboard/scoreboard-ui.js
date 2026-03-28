// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM du scoreboard

window.SBui = (function () {

  // ═══ RENDU COMPLET ═══
  function rendreTout() {
    rendrePastilles();
    rendreGrille();
    rendreTimerAffichage();
    rendreConfigNoms();
    rendreConfigBonus();
    // Mettre à jour les steppeurs
    document.getElementById('sb-equipes-val').textContent = window.SB.config.nbEquipes;
    document.getElementById('sb-sets-val').textContent = window.SB.config.nbSets;
  }

  // ═══ PASTILLES SETS ═══
  function rendrePastilles() {
    const conteneur = document.getElementById('sb-pastilles');
    if (!conteneur) return;
    conteneur.innerHTML = '';

    const { nbSets } = window.SB.config;
    const { setActif } = window.SB.etat;

    for (let i = 0; i < nbSets; i++) {
      const btn = document.createElement('button');
      btn.className = 'sb-pastille';
      btn.dataset.indexSet = i;

      if (i === setActif) {
        btn.classList.add('active');
        btn.textContent = i + 1;
      } else if (i < setActif) {
        btn.classList.add('passee');
        btn.textContent = '✓';
        // Cliquable pour revenir
        btn.addEventListener('click', () => demanderRetourSet(i));
      } else {
        btn.classList.add('future');
        btn.textContent = i + 1;
        btn.disabled = true;
      }

      conteneur.appendChild(btn);
    }
  }

  // ═══ DEMANDER CONFIRMATION RETOUR SET ═══
  function demanderRetourSet(indexSet) {
    window.SB.setEnAttente = indexSet;
    const texte = document.getElementById('sb-confirm-texte');
    texte.textContent = `Revenir au set ${indexSet + 1} ? Les scores seront conservés.`;
    document.getElementById('sb-modal-confirm').removeAttribute('hidden');
  }

  // ═══ GRILLE ÉQUIPES ═══
  function rendreGrille() {
    const grille = document.getElementById('sb-grille');
    if (!grille) return;
    grille.innerHTML = '';

    const { nbEquipes, nomsEquipes, couleurs, boutonsBonus } = window.SB.config;

    for (let e = 0; e < nbEquipes; e++) {
      const carte = document.createElement('div');
      carte.className = 'sb-carte-equipe';
      carte.dataset.indexEquipe = e;
      carte.style.borderTopColor = couleurs[e] || 'var(--couleur-principale)';

      // Nom
      const nom = document.createElement('div');
      nom.className = 'sb-equipe-nom';
      nom.textContent = nomsEquipes[e] || `Équipe ${e + 1}`;

      // Score
      const score = document.createElement('div');
      score.className = 'sb-equipe-score';
      score.id = `sb-score-${e}`;
      score.textContent = window.SB.etat.scores[window.SB.etat.setActif][e] || 0;

      // Boutons score
      const btns = document.createElement('div');
      btns.className = 'sb-score-btns';

      // Bouton +1 toujours présent
      const btnPlus = creerBtnScore('+1', 1, e, couleurs[e]);
      btns.appendChild(btnPlus);

      // Boutons bonus configurés
      boutonsBonus.forEach(b => {
        const btn = creerBtnScore(b.label, b.valeur, e, couleurs[e]);
        btns.appendChild(btn);
      });

      // Bouton -1 discret
      const btnMoins = document.createElement('button');
      btnMoins.className = 'sb-btn-moins';
      btnMoins.textContent = '−1';
      btnMoins.dataset.indexEquipe = e;
      btnMoins.dataset.delta = -1;
      btns.appendChild(btnMoins);

      // Historique mini
      const histo = creerHistorique(e);

      carte.appendChild(nom);
      carte.appendChild(score);
      carte.appendChild(btns);
      carte.appendChild(histo);

      grille.appendChild(carte);
    }
  }

  // ═══ CRÉER UN BOUTON DE SCORE ═══
  function creerBtnScore(label, valeur, indexEquipe, couleur) {
    const btn = document.createElement('button');
    btn.className = 'sb-btn-score';
    btn.textContent = label;
    btn.dataset.indexEquipe = indexEquipe;
    btn.dataset.delta = valeur;
    btn.style.background = couleur || 'var(--couleur-principale)';
    return btn;
  }

  // ═══ HISTORIQUE SETS ═══
  function creerHistorique(indexEquipe) {
    const histo = document.createElement('div');
    histo.className = 'sb-historique';
    histo.id = `sb-histo-${indexEquipe}`;
    mettreAJourHistorique(indexEquipe, histo);
    return histo;
  }

  function mettreAJourHistorique(indexEquipe, conteneur) {
    const el = conteneur || document.getElementById(`sb-histo-${indexEquipe}`);
    if (!el) return;
    el.innerHTML = '';
    const { scores } = window.SB.etat;
    const { setActif } = window.SB.etat;
    scores.forEach((setScores, i) => {
      if (i < setActif) {
        const span = document.createElement('span');
        span.className = 'sb-historique-set';
        span.textContent = `S${i + 1}:${setScores[indexEquipe]}`;
        el.appendChild(span);
      }
    });
  }

  // ═══ METTRE À JOUR UN SCORE ═══
  function mettreAJourScore(indexEquipe) {
    const el = document.getElementById(`sb-score-${indexEquipe}`);
    if (!el) return;
    el.textContent = window.SB.etat.scores[window.SB.etat.setActif][indexEquipe];
    mettreAJourHistorique(indexEquipe);
  }

  // ═══ METTRE À JOUR TOUS LES SCORES ═══
  function rendreScores() {
    const { nbEquipes } = window.SB.config;
    for (let e = 0; e < nbEquipes; e++) {
      mettreAJourScore(e);
    }
  }

  // ═══ TIMER AFFICHAGE ═══
  function rendreTimerAffichage() {
    const el = document.getElementById('sb-timer-texte');
    if (!el) return;
    const s = window.SB.etat.timerSecondes;
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    el.textContent = `${mm}:${ss}`;
  }

  // ═══ CONFIG : NOMS ÉQUIPES ═══
  function rendreConfigNoms() {
    const conteneur = document.getElementById('sb-noms-equipes');
    if (!conteneur) return;
    conteneur.innerHTML = '<label class="sb-config-label">Noms des équipes</label>';
    const { nbEquipes, nomsEquipes } = window.SB.config;
    for (let e = 0; e < nbEquipes; e++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'sb-input-nom';
      input.value = nomsEquipes[e] || `Équipe ${e + 1}`;
      input.dataset.indexEquipe = e;
      input.id = `sb-nom-equipe-${e}`;
      conteneur.appendChild(input);
    }
  }

  // ═══ CONFIG : BOUTONS BONUS ═══
  function rendreConfigBonus() {
    const liste = document.getElementById('sb-bonus-liste');
    if (!liste) return;
    liste.innerHTML = '';
    window.SB.config.boutonsBonus.forEach((b, i) => {
      liste.appendChild(creerLigneBonus(b, i));
    });
  }

  function creerLigneBonus(bonus, index) {
    const ligne = document.createElement('div');
    ligne.className = 'sb-bonus-item';
    ligne.dataset.indexBonus = index;

    const inputLabel = document.createElement('input');
    inputLabel.type = 'text';
    inputLabel.className = 'sb-bonus-input-label';
    inputLabel.value = bonus.label;
    inputLabel.placeholder = 'Label ex: Smash';
    inputLabel.dataset.indexBonus = index;
    inputLabel.dataset.champ = 'label';

    const inputVal = document.createElement('input');
    inputVal.type = 'number';
    inputVal.className = 'sb-bonus-input-val';
    inputVal.value = bonus.valeur;
    inputVal.min = 1;
    inputVal.max = 99;
    inputVal.dataset.indexBonus = index;
    inputVal.dataset.champ = 'valeur';

    const btnSuppr = document.createElement('button');
    btnSuppr.className = 'sb-bonus-suppr';
    btnSuppr.textContent = '✕';
    btnSuppr.dataset.indexBonus = index;

    ligne.appendChild(inputLabel);
    ligne.appendChild(inputVal);
    ligne.appendChild(btnSuppr);
    return ligne;
  }

  // ═══ API PUBLIQUE ═══
  return {
    rendreTout,
    rendrePastilles,
    rendreGrille,
    rendreScores,
    rendreTimerAffichage,
    rendreConfigNoms,
    rendreConfigBonus,
    mettreAJourScore
  };

})();
