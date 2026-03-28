// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM du scoreboard

window.SBui = (function () {

  // ═══ RENDU COMPLET ═══
  function rendreTout() {
    rendrePastilles();
    rendreGrille();
    rendreScores();
    rendreTimerAffichage();
    rendreConfigNoms();
    rendreConfigBonus();
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
    grille.dataset.nbEquipes = nbEquipes;

    for (let e = 0; e < nbEquipes; e++) {
      const couleur = couleurs[e] || 'var(--couleur-principale)';

      const carte = document.createElement('div');
      carte.className = 'sb-carte-equipe';
      carte.dataset.indexEquipe = e;

      // Barre colorée
      const barre = document.createElement('div');
      barre.className = 'sb-carte-barre';
      barre.style.background = couleur;

      // Nom équipe
      const nom = document.createElement('div');
      nom.className = 'sb-carte-nom';
      nom.textContent = nomsEquipes[e] || `Équipe ${e + 1}`;

      // Score
      const score = document.createElement('div');
      score.className = 'sb-carte-score';
      score.id = `sb-score-${e}`;
      score.textContent = '0';

      // Bouton -1
      const btnMoins = document.createElement('button');
      btnMoins.className = 'sb-btn-score sb-btn-moins';
      btnMoins.textContent = '−1';
      btnMoins.dataset.indexEquipe = e;
      btnMoins.dataset.delta = '-1';

      // Conteneur boutons bonus
      const bonusConteneur = document.createElement('div');
      bonusConteneur.className = 'sb-bonus-conteneur';

      boutonsBonus.forEach(b => {
        const btnBonus = document.createElement('button');
        btnBonus.className = 'sb-btn-score sb-btn-bonus';
        btnBonus.textContent = b.label;
        btnBonus.dataset.indexEquipe = e;
        btnBonus.dataset.delta = b.valeur;
        bonusConteneur.appendChild(btnBonus);
      });

      carte.appendChild(barre);
      carte.appendChild(nom);
      carte.appendChild(score);
      carte.appendChild(btnMoins);
      carte.appendChild(bonusConteneur);
      grille.appendChild(carte);
    }
  }

  // ═══ MISE À JOUR SCORE D'UNE ÉQUIPE ═══
  function mettreAJourScore(indexEquipe) {
    const el = document.getElementById(`sb-score-${indexEquipe}`);
    if (!el) return;
    el.textContent = window.SB.etat.scores[window.SB.etat.setActif][indexEquipe];
  }

  // ═══ RENDU TOUS LES SCORES DU SET ACTIF ═══
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

  // ═══ CONFIG : NOMS + COULEURS ÉQUIPES ═══
  function rendreConfigNoms() {
    const conteneur = document.getElementById('sb-noms-equipes');
    if (!conteneur) return;
    conteneur.innerHTML = '<label class="sb-config-label">Noms et couleurs des équipes</label>';

    const { nbEquipes, nomsEquipes, couleurs } = window.SB.config;

    for (let e = 0; e < nbEquipes; e++) {
      // Ligne : color picker + input nom
      const ligne = document.createElement('div');
      ligne.className = 'sb-config-equipe-ligne';

      // Color picker
      const inputCouleur = document.createElement('input');
      inputCouleur.type = 'color';
      inputCouleur.className = 'sb-input-couleur';
      inputCouleur.value = couleurs[e] || '#2ecc71';
      inputCouleur.id = `sb-couleur-equipe-${e}`;
      inputCouleur.dataset.indexEquipe = e;

      // Input nom
      const inputNom = document.createElement('input');
      inputNom.type = 'text';
      inputNom.className = 'sb-input-nom';
      inputNom.value = nomsEquipes[e] || `Équipe ${e + 1}`;
      inputNom.id = `sb-nom-equipe-${e}`;
      inputNom.dataset.indexEquipe = e;

      ligne.appendChild(inputCouleur);
      ligne.appendChild(inputNom);
      conteneur.appendChild(ligne);
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
