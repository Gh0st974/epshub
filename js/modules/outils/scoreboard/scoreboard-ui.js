// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM du scoreboard

const sbUI = (() => {

  /* ── Formater secondes → MM:SS ── */
  function formaterTemps(secondes) {
    const m = Math.floor(secondes / 60).toString().padStart(2, '0');
    const s = (secondes % 60).toString().padStart(2, '0');
    return `${m} : ${s}`;
  }

  /* ════════════════════════════════
     PASTILLES SETS
  ════════════════════════════════ */
  function mettreAJourPastilles(nbSets, setActif) {
    const conteneur = document.getElementById('sb-pastilles');
    if (!conteneur) return;
    conteneur.innerHTML = '';
    for (let i = 0; i < nbSets; i++) {
      const btn = document.createElement('button');
      btn.className = 'sb-pastille';
      btn.textContent = i + 1;
      btn.dataset.idx = i;
      if (i === setActif) btn.classList.add('active');
      else if (i < setActif) btn.classList.add('passee');
      conteneur.appendChild(btn);
    }
  }

  /* ════════════════════════════════
     TIMER
  ════════════════════════════════ */
  function mettreAJourTimerAffichage(secondes) {
    const el = document.getElementById('sb-timer-texte');
    if (el) el.textContent = formaterTemps(secondes);
  }

  function signalerFinTimer() {
    const el = document.getElementById('sb-timer-affichage');
    if (!el) return;
    el.style.background = '#e74c3c';
    setTimeout(() => { el.style.background = '#1a2332'; }, 2000);
  }

  /* ════════════════════════════════
     GRILLE — GÉNÉRATION CARTES
  ════════════════════════════════ */
  function genererGrille(equipes, bonus) {
    const grille = document.getElementById('sb-grille');
    if (!grille) return;
    grille.innerHTML = '';

    equipes.forEach((equipe, idx) => {
      const carte = document.createElement('div');
      carte.className = 'sb-carte';
      carte.dataset.idx = idx;

      // Bandeau coloré
      const bandeau = document.createElement('div');
      bandeau.className = 'sb-carte-bandeau';
      bandeau.style.backgroundColor = equipe.couleur;

      // Corps
      const corps = document.createElement('div');
      corps.className = 'sb-carte-corps';

      // Nom
      const nom = document.createElement('div');
      nom.className = 'sb-carte-nom';
      nom.textContent = equipe.nom;

      // Ligne score
      const lignScore = document.createElement('div');
      lignScore.className = 'sb-carte-score-ligne';

      const btnMoins = document.createElement('button');
      btnMoins.className = 'sb-carte-btn-moins';
      btnMoins.textContent = '−';
      btnMoins.style.color = equipe.couleur;
      btnMoins.dataset.equipe = idx;

      const scoreEl = document.createElement('div');
      scoreEl.className = 'sb-carte-score';
      scoreEl.id = `sb-score-${idx}`;
      scoreEl.textContent = '0';
      scoreEl.style.color = equipe.couleur;

      const btnPlus = document.createElement('button');
      btnPlus.className = 'sb-carte-btn-plus';
      btnPlus.textContent = '+';
      btnPlus.style.color = equipe.couleur;
      btnPlus.dataset.equipe = idx;

      lignScore.appendChild(btnMoins);
      lignScore.appendChild(scoreEl);
      lignScore.appendChild(btnPlus);

      // Label bonus
      const bonusLabel = document.createElement('div');
      bonusLabel.className = 'sb-carte-bonus-label';
      bonusLabel.textContent = 'SCORE BONUS';

      // Boutons bonus
      const bonusListe = document.createElement('div');
      bonusListe.className = 'sb-carte-bonus-liste';
      bonusListe.id = `sb-bonus-liste-${idx}`;
      genererBoutonsBonusCarte(bonusListe, bonus, equipe.couleur, idx);

      // Badge sets
      const setScore = document.createElement('div');
      setScore.className = 'sb-carte-set-score';
      setScore.id = `sb-set-score-${idx}`;
      setScore.textContent = 'Set 1 : 0';

      corps.appendChild(nom);
      corps.appendChild(lignScore);
      corps.appendChild(bonusLabel);
      corps.appendChild(bonusListe);
      corps.appendChild(setScore);

      carte.appendChild(bandeau);
      carte.appendChild(corps);
      grille.appendChild(carte);
    });
  }

  function genererBoutonsBonusCarte(conteneur, bonus, couleur, equipeIdx) {
    conteneur.innerHTML = '';
    bonus.forEach((b, bIdx) => {
      const btn = document.createElement('button');
      btn.className = 'sb-carte-btn-bonus';
      btn.textContent = b.nom;
      btn.style.backgroundColor = couleur;
      btn.dataset.equipe = equipeIdx;
      btn.dataset.bonus = bIdx;
      conteneur.appendChild(btn);
    });
  }

  /* ════════════════════════════════
     MISE À JOUR SCORES
  ════════════════════════════════ */
  function mettreAJourScore(equipeIdx, valeur) {
    const el = document.getElementById(`sb-score-${equipeIdx}`);
    if (!el) return;
    el.textContent = valeur;
    // Animation bump
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  }

  function mettreAJourTousScores(scores, setActif, equipes) {
    equipes.forEach((_, idx) => {
      const val = scores[setActif]?.[idx] ?? 0;
      const el = document.getElementById(`sb-score-${idx}`);
      if (el) el.textContent = val;
    });
  }

  function mettreAJourSetScore(equipeIdx, scores, nbSets) {
    const el = document.getElementById(`sb-set-score-${equipeIdx}`);
    if (!el) return;
    // Résumé rapide : "Set 1:3 | Set 2:1"
    const parties = [];
    for (let s = 0; s < nbSets; s++) {
      if (scores[s]?.[equipeIdx] !== undefined) {
        parties.push(`Set ${s + 1} : ${scores[s][equipeIdx]}`);
      }
    }
    el.textContent = parties.join(' | ');
  }

  /* ════════════════════════════════
     CONFIG — NOMS ÉQUIPES
  ════════════════════════════════ */
  function genererConfigNoms(equipes) {
    const conteneur = document.getElementById('sb-noms-equipes');
    if (!conteneur) return;
    conteneur.innerHTML = '';
    equipes.forEach((equipe, idx) => {
      const ligne = document.createElement('div');
      ligne.className = 'sb-nom-equipe-ligne';

      const couleurInput = document.createElement('input');
      couleurInput.type = 'color';
      couleurInput.className = 'sb-nom-equipe-couleur';
      couleurInput.value = equipe.couleur;
      couleurInput.dataset.idx = idx;
      couleurInput.id = `sb-couleur-${idx}`;

      const nomInput = document.createElement('input');
      nomInput.type = 'text';
      nomInput.className = 'sb-nom-equipe-input';
      nomInput.value = equipe.nom;
      nomInput.dataset.idx = idx;
      nomInput.id = `sb-nom-${idx}`;
      nomInput.placeholder = `Équipe ${idx + 1}`;

      ligne.appendChild(couleurInput);
      ligne.appendChild(nomInput);
      conteneur.appendChild(ligne);
    });
  }

  /* ════════════════════════════════
     CONFIG — BONUS
  ════════════════════════════════ */
  function genererConfigBonus(bonus) {
    const conteneur = document.getElementById('sb-bonus-liste');
    if (!conteneur) return;
    conteneur.innerHTML = '';
    bonus.forEach((b, idx) => {
      const ligne = creerLigneBonus(b, idx);
      conteneur.appendChild(ligne);
    });
  }

  function creerLigneBonus(b, idx) {
    const ligne = document.createElement('div');
    ligne.className = 'sb-bonus-ligne';
    ligne.dataset.idx = idx;

    const inputNom = document.createElement('input');
    inputNom.type = 'text';
    inputNom.className = 'sb-bonus-input-nom';
    inputNom.value = b.nom;
    inputNom.placeholder = 'Nom';
    inputNom.dataset.idx = idx;

    const inputVal = document.createElement('input');
    inputVal.type = 'number';
    inputVal.className = 'sb-bonus-input-val';
    inputVal.value = b.valeur;
    inputVal.placeholder = 'Val';
    inputVal.dataset.idx = idx;

    const btnSuppr = document.createElement('button');
    btnSuppr.className = 'sb-bonus-btn-suppr';
    btnSuppr.textContent = '✕';
    btnSuppr.dataset.idx = idx;

    ligne.appendChild(inputNom);
    ligne.appendChild(inputVal);
    ligne.appendChild(btnSuppr);
    return ligne;
  }

  function ajouterLigneBonus(bonus) {
    const conteneur = document.getElementById('sb-bonus-liste');
    if (!conteneur) return;
    const idx = bonus.length - 1;
    const ligne = creerLigneBonus(bonus[idx], idx);
    conteneur.appendChild(ligne);
  }

  /* ════════════════════════════════
     EXPORT
  ════════════════════════════════ */
  return {
    mettreAJourPastilles,
    mettreAJourTimerAffichage,
    signalerFinTimer,
    genererGrille,
    mettreAJourScore,
    mettreAJourTousScores,
    mettreAJourSetScore,
    genererConfigNoms,
    genererConfigBonus,
    ajouterLigneBonus
  };

})();
