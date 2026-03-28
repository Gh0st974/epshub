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

  // ← AJOUT : attribut pour le CSS 2×2
  grille.dataset.nbEquipes = nbEquipes;

  for (let e = 0; e < nbEquipes; e++) {
    const couleur = couleurs[e] || 'var(--couleur-principale)';

    // ── Carte ──
    const carte = document.createElement('div');
    carte.className = 'sb-carte-equipe';
    carte.dataset.indexEquipe = e;

    // ── Barre colorée en haut ──
    const barre = document.createElement('div');
    barre.className = 'sb-carte-barre';
    barre.style.background = couleur;

    // ── Corps ──
    const corps = document.createElement('div');
    corps.className = 'sb-carte-corps';

    // Nom
    const nom = document.createElement('div');
    nom.className = 'sb-equipe-nom';
    nom.textContent = nomsEquipes[e] || `Équipe ${e + 1}`;

    // Ligne : − SCORE +
    const ligneScore = document.createElement('div');
    ligneScore.className = 'sb-equipe-ligne-score';

    const btnMoins = document.createElement('button');
    btnMoins.className = 'sb-equipe-btn-moins';
    btnMoins.textContent = '−';
    btnMoins.dataset.indexEquipe = e;
    btnMoins.dataset.delta = -1;
    btnMoins.style.color = couleur;

    const scoreEl = document.createElement('div');
    scoreEl.className = 'sb-equipe-score';
    scoreEl.id = `sb-score-${e}`;
    scoreEl.textContent = window.SB.etat.scores[window.SB.etat.setActif][e] || 0;
    scoreEl.style.color = couleur;

    const btnPlus = document.createElement('button');
    btnPlus.className = 'sb-equipe-btn-plus';
    btnPlus.textContent = '+';
    btnPlus.dataset.indexEquipe = e;
    btnPlus.dataset.delta = 1;
    btnPlus.style.color = couleur;

    ligneScore.appendChild(btnMoins);
    ligneScore.appendChild(scoreEl);
    ligneScore.appendChild(btnPlus);

    // Label bonus
    const labelBonus = document.createElement('div');
    labelBonus.className = 'sb-equipe-label-bonus';
    labelBonus.textContent = 'Score bonus';

    // Boutons bonus
    const bonusListe = document.createElement('div');
    bonusListe.className = 'sb-equipe-bonus-liste';

    boutonsBonus.forEach(b => {
      const btn = creerBtnScore(b.label, b.valeur, e, couleur);
      bonusListe.appendChild(btn);
    });

    // Historique sets passés
    const histo = creerHistorique(e);

    // Assemblage corps
    corps.appendChild(nom);
    corps.appendChild(ligneScore);
    corps.appendChild(labelBonus);
    corps.appendChild(bonusListe);
    corps.appendChild(histo);

    // Assemblage carte
    carte.appendChild(barre);
    carte.appendChild(corps);

    grille.appendChild(carte);
  }
}

function rendreConfigNoms() {
  const conteneur = document.getElementById('sb-noms-equipes');
  if (!conteneur) return;
  conteneur.innerHTML = '<label class="sb-config-label">Noms des équipes</label>';

  const { nbEquipes, nomsEquipes, couleurs } = window.SB.config;

  for (let e = 0; e < nbEquipes; e++) {
    // ── Ligne : color picker + input nom ──
    const ligne = document.createElement('div');
    ligne.className = 'sb-nom-ligne';

    // Color picker
    const picker = document.createElement('input');
    picker.type = 'color';
    picker.className = 'sb-input-couleur';
    picker.value = couleurs[e] || '#2ecc71';
    picker.dataset.indexEquipe = e;
    picker.id = `sb-couleur-equipe-${e}`;

    // Input nom
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'sb-input-nom';
    input.value = nomsEquipes[e] || `Équipe ${e + 1}`;
    input.dataset.indexEquipe = e;
    input.id = `sb-nom-equipe-${e}`;

    ligne.appendChild(picker);
    ligne.appendChild(input);
    conteneur.appendChild(ligne);
  }
}

// ═══ CRÉER UN BOUTON BONUS ═══
function creerBtnScore(label, valeur, indexEquipe, couleur) {
  const btn = document.createElement('button');
  btn.className = 'sb-bonus-btn';
  btn.textContent = `+${valeur}`;
  btn.title = label;
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
