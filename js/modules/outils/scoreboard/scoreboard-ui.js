// 📄 Fichier : /js/modules/outils/scoreboard/scoreboard-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM du scoreboard


// ═══════════════════════════════════════════
//  POINT D'ENTRÉE — RENDU COMPLET
// ═══════════════════════════════════════════

/**
 * Génère et injecte tout le HTML du scoreboard dans le conteneur
 * @param {HTMLElement} conteneur - Élément DOM cible
 */
function rendreScoreboard(conteneur) {
  conteneur.innerHTML = '';
  conteneur.appendChild(creerWrapper());
}

/**
 * Met à jour uniquement les parties dynamiques (scores, sets, chrono)
 * sans reconstruire tout le DOM
 */
function mettreAJourAffichage() {
  const etat = getEtat();
  mettreAJourScores(etat);
  mettreAJourSets(etat);
  mettreAJourSetsBarre(etat);
  mettreAJourEtatPartie(etat);
}

// ═══════════════════════════════════════════
//  CONSTRUCTION DU DOM INITIAL
// ═══════════════════════════════════════════

/** Crée le wrapper principal avec toutes les sections */
function creerWrapper() {
  const wrapper = document.createElement('div');
  wrapper.className = 'scoreboard-wrapper';
  wrapper.id = 'scoreboard-wrapper';

  wrapper.appendChild(creerSectionConfig());
  wrapper.appendChild(creerSectionChrono());
  wrapper.appendChild(creerSectionGrille());
  wrapper.appendChild(creerSectionSetsBarre());
  wrapper.appendChild(creerSectionReset());

  return wrapper;
}

// ═══════════════════════════════════════════
//  SECTION CONFIG (mode + sets)
// ═══════════════════════════════════════════

/** Crée la barre de configuration */
function creerSectionConfig() {
  const etat = getEtat();
  const section = document.createElement('div');
  section.className = 'scoreboard-config';

  section.appendChild(creerGroupeMode(etat));
  section.appendChild(creerGroupeSets(etat));
  section.appendChild(creerGroupeNbEquipes(etat));

  return section;
}

/** Groupe boutons mode 2 équipes / multi */
function creerGroupeMode(etat) {
  const groupe = document.createElement('div');
  groupe.className = 'config-groupe';

  const label = document.createElement('span');
  label.className = 'config-label';
  label.textContent = 'Mode';

  const boutons = document.createElement('div');
  boutons.className = 'config-boutons';

  const modes = [
    { val: 2,  label: '⚔️ 2 équipes' },
    { val: -1, label: '👥 Multi'     },
  ];

  modes.forEach(mode => {
    const btn = document.createElement('button');
    btn.className = 'btn-config' + (
      mode.val === 2
        ? (etat.nbEquipes === 2 ? ' actif' : '')
        : (etat.nbEquipes > 2  ? ' actif' : '')
    );
    btn.textContent = mode.label;
    btn.dataset.action = 'mode';
    btn.dataset.valeur = mode.val;
    boutons.appendChild(btn);
  });

  groupe.appendChild(label);
  groupe.appendChild(boutons);
  return groupe;
}

/** Groupe boutons nombre de sets */
function creerGroupeSets(etat) {
  const groupe = document.createElement('div');
  groupe.className = 'config-groupe';

  const label = document.createElement('span');
  label.className = 'config-label';
  label.textContent = 'Sets';

  const boutons = document.createElement('div');
  boutons.className = 'config-boutons';

  [1, 3, 5].forEach(nb => {
    const btn = document.createElement('button');
    btn.className = 'btn-config' + (etat.nbSets === nb ? ' actif' : '');
    btn.textContent = nb;
    btn.dataset.action = 'sets';
    btn.dataset.valeur = nb;
    boutons.appendChild(btn);
  });

  groupe.appendChild(label);
  groupe.appendChild(boutons);
  return groupe;
}

/** Groupe boutons nombre d'équipes (visible en mode multi) */
function creerGroupeNbEquipes(etat) {
  const groupe = document.createElement('div');
  groupe.className = 'config-groupe';
  groupe.id = 'config-nb-equipes';
  groupe.style.display = etat.nbEquipes > 2 ? 'flex' : 'none';

  const label = document.createElement('span');
  label.className = 'config-label';
  label.textContent = 'Nb équipes';

  const boutons = document.createElement('div');
  boutons.className = 'config-boutons';

  [3, 4, 5, 6].forEach(nb => {
    const btn = document.createElement('button');
    btn.className = 'btn-config' + (etat.nbEquipes === nb ? ' actif' : '');
    btn.textContent = nb;
    btn.dataset.action = 'nbEquipes';
    btn.dataset.valeur = nb;
    boutons.appendChild(btn);
  });

  groupe.appendChild(label);
  groupe.appendChild(boutons);
  return groupe;
}

// ═══════════════════════════════════════════
//  SECTION CHRONO
// ═══════════════════════════════════════════

/** Crée la section chrono intégré */
function creerSectionChrono() {
  const section = document.createElement('div');
  section.className = 'scoreboard-chrono';

  // Affichage du temps
  const affichage = document.createElement('span');
  affichage.className = 'chrono-affichage';
  affichage.id = 'chrono-affichage';
  affichage.textContent = '00:00';

  // Input durée (minutes)
  const inputLabel = document.createElement('span');
  inputLabel.className = 'config-label';
  inputLabel.textContent = 'min';

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'chrono-input';
  input.id = 'chrono-input-duree';
  input.min = 1;
  input.max = 60;
  input.value = 5;
  input.placeholder = 'min';

  // Boutons contrôle
  const btnPlay = document.createElement('button');
  btnPlay.className = 'btn-chrono play';
  btnPlay.id = 'chrono-btn-play';
  btnPlay.title = 'Démarrer';
  btnPlay.textContent = '▶';
  btnPlay.dataset.action = 'chronoPlay'; // ✅ AJOUTER

  const btnPause = document.createElement('button');
  btnPause.className = 'btn-chrono pause';
  btnPause.id = 'chrono-btn-pause';
  btnPause.title = 'Pause';
  btnPause.textContent = '⏸';
  btnPause.dataset.action = 'chronoPause'; // ✅ AJOUTER

  const btnReset = document.createElement('button');
  btnReset.className = 'btn-chrono reset';
  btnReset.id = 'chrono-btn-reset';
  btnReset.title = 'Reset';
  btnReset.textContent = '↺';
  btnReset.dataset.action = 'chronoReset'; // ✅ AJOUTER

  section.appendChild(affichage);
  section.appendChild(input);
  section.appendChild(inputLabel);
  section.appendChild(btnPlay);
  section.appendChild(btnPause);
  section.appendChild(btnReset);

  return section;
}

// ═══════════════════════════════════════════
//  SECTION GRILLE DES ÉQUIPES
// ═══════════════════════════════════════════

/** Crée la grille des cartes équipes */
function creerSectionGrille() {
  const etat = getEtat();
  const grille = document.createElement('div');
  grille.className = `scoreboard-grille equipes-${etat.nbEquipes}`;
  grille.id = 'scoreboard-grille';

  etat.equipes.forEach(equipe => {
    grille.appendChild(creerCarteEquipe(equipe, etat.nbSets));
  });

  return grille;
}

/** Crée une carte équipe complète */
function creerCarteEquipe(equipe, nbSets) {
  const carte = document.createElement('div');
  carte.className = `equipe-carte ${equipe.classe}`;
  carte.dataset.equipeId = equipe.id;

  carte.appendChild(creerNomEquipe(equipe));
  carte.appendChild(creerScoreEquipe(equipe));
  carte.appendChild(creerSetsEquipe(equipe, nbSets));
  carte.appendChild(creerActionsEquipe(equipe));

  return carte;
}

/** Nom de l'équipe */
function creerNomEquipe(equipe) {
  const nom = document.createElement('div');
  nom.className = 'equipe-nom';
  nom.textContent = equipe.nom;
  return nom;
}

/** Affichage du score */
function creerScoreEquipe(equipe) {
  const score = document.createElement('div');
  score.className = 'equipe-score';
  score.id = `score-${equipe.id}`;
  score.textContent = equipe.score;
  return score;
}

/** Indicateurs de sets gagnés */
function creerSetsEquipe(equipe, nbSets) {
  const container = document.createElement('div');
  container.className = 'equipe-sets';
  container.id = `sets-${equipe.id}`;
  container.appendChild(genererPointsSets(equipe.setsGagnes, nbSets));
  return container;
}

/**
 * Génère les pastilles visuelles de sets
 * @param {number} setsGagnes
 * @param {number} nbSets
 * @returns {DocumentFragment}
 */
function genererPointsSets(setsGagnes, nbSets) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < nbSets; i++) {
    const pastille = document.createElement('span');
    pastille.className = 'set-point' + (i < setsGagnes ? ' gagne' : '');
    fragment.appendChild(pastille);
  }
  return fragment;
}

/** Boutons d'action de l'équipe */
function creerActionsEquipe(equipe) {
  const container = document.createElement('div');
  container.className = 'equipe-actions';

  // Ligne 1 : -1 et +1
  const ligne1 = document.createElement('div');
  ligne1.className = 'actions-ligne';
  ligne1.appendChild(creerBtnPoint(equipe.id, -1, 'moins', '-1'));
  ligne1.appendChild(creerBtnPoint(equipe.id,  1, 'plus1', '+1'));

  // Ligne 2 : +2 et +3
  const ligne2 = document.createElement('div');
  ligne2.className = 'actions-ligne';
  ligne2.appendChild(creerBtnPoint(equipe.id, 2, 'plus2', '+2'));
  ligne2.appendChild(creerBtnPoint(equipe.id, 3, 'plus3', '+3'));

  container.appendChild(ligne1);
  container.appendChild(ligne2);

  return container;
}

/**
 * Crée un bouton de points
 * @param {string} equipeId
 * @param {number} valeur
 * @param {string} style - Classe CSS
 * @param {string} label - Texte affiché
 */
function creerBtnPoint(equipeId, valeur, style, label) {
  const btn = document.createElement('button');
  btn.className = `btn-point ${style}`;
  btn.textContent = label;
  btn.dataset.action = 'point';
  btn.dataset.equipe = equipeId;
  btn.dataset.valeur = valeur;
  return btn;
}

// ═══════════════════════════════════════════
//  SECTION BARRE DES SETS
// ═══════════════════════════════════════════

/** Crée la barre récapitulatif des sets */
function creerSectionSetsBarre() {
  const barre = document.createElement('div');
  barre.className = 'scoreboard-sets-barre';
  barre.id = 'sets-barre';
  rafraichirSetsBarre(barre);
  return barre;
}

// ═══════════════════════════════════════════
//  SECTION RESET
// ═══════════════════════════════════════════

/** Crée les boutons de reset */
function creerSectionReset() {
  const section = document.createElement('div');
  section.className = 'scoreboard-reset';

  const btnScore = document.createElement('button');
  btnScore.className = 'btn-reset score';
  btnScore.dataset.action = 'resetScore';
  btnScore.textContent = '🔄 Reset score';

  const btnValiderSet = document.createElement('button');
  btnValiderSet.className = 'btn-reset score';
  btnValiderSet.dataset.action = 'validerSet';
  btnValiderSet.textContent = '✅ Valider le set';

  const btnTout = document.createElement('button');
  btnTout.className = 'btn-reset tout';
  btnTout.dataset.action = 'resetTout';
  btnTout.textContent = '🔄 Reset tout';

  section.appendChild(btnScore);
  section.appendChild(btnValiderSet);
  section.appendChild(btnTout);

  return section;
}

// ═══════════════════════════════════════════
//  MISES À JOUR PARTIELLES DU DOM
// ═══════════════════════════════════════════

/** Met à jour tous les scores affichés */
function mettreAJourScores(etat) {
  etat.equipes.forEach(equipe => {
    const el = document.getElementById(`score-${equipe.id}`);
    if (el) el.textContent = equipe.score;
  });
}

/** Met à jour les pastilles de sets de chaque équipe */
function mettreAJourSets(etat) {
  etat.equipes.forEach(equipe => {
    const el = document.getElementById(`sets-${equipe.id}`);
    if (!el) return;
    el.innerHTML = '';
    el.appendChild(genererPointsSets(equipe.setsGagnes, etat.nbSets));
  });
}

/** Met à jour la barre récap des sets */
function mettreAJourSetsBarre(etat) {
  const barre = document.getElementById('sets-barre');
  if (!barre) return;
  rafraichirSetsBarre(barre, etat);
}

/**
 * Remplit la barre des sets avec les données actuelles
 * @param {HTMLElement} barre
 * @param {object} [etat] - Si absent, récupère l'état courant
 */
function rafraichirSetsBarre(barre, etat) {
  const e = etat || getEtat();
  barre.innerHTML = '';

  const titre = document.createElement('span');
  titre.className = 'config-label';
  titre.textContent = `SET ${e.setActuel} / ${e.nbSets}`;
  barre.appendChild(titre);

  e.equipes.forEach(equipe => {
    const info = document.createElement('div');
    info.className = 'set-info';

    const badge = document.createElement('span');
    badge.className = `set-badge ${equipe.classe}`;
    badge.style.background = obtenirCouleurEquipe(equipe.classe);
    badge.textContent = equipe.setsGagnes;

    const nom = document.createElement('span');
    nom.textContent = equipe.nom;

    info.appendChild(badge);
    info.appendChild(nom);
    barre.appendChild(info);
  });
}

/** Affiche/masque le message de fin de partie */
function mettreAJourEtatPartie(etat) {
  const wrapper = document.getElementById('scoreboard-wrapper');
  if (!wrapper) return;

  // Supprimer l'ancien message si présent
  const ancien = document.getElementById('message-victoire');
  if (ancien) ancien.remove();

  if (!etat.partieTerminee) return;

  // Trouver le gagnant
  const gagnant = etat.equipes.reduce((a, b) =>
    a.setsGagnes > b.setsGagnes ? a : b
  );

  const message = document.createElement('div');
  message.id = 'message-victoire';
  message.style.cssText = `
    background:#22c55e; color:#000; font-size:1.4rem;
    font-weight:900; text-align:center; padding:16px;
    border-radius:12px; letter-spacing:2px;
  `;
  message.textContent = `🏆 Victoire ${gagnant.nom} !`;
  wrapper.insertBefore(message, wrapper.firstChild);
}

// ═══════════════════════════════════════════
//  UTILITAIRES
// ═══════════════════════════════════════════

/**
 * Retourne la couleur CSS selon la classe équipe
 * @param {string} classe
 * @returns {string}
 */
function obtenirCouleurEquipe(classe) {
  const couleurs = {
    bleu:   '#4a9eff',
    rouge:  '#ff4444',
    vert:   '#22c55e',
    jaune:  '#f59e0b',
    violet: '#a855f7',
    orange: '#f97316',
  };
  return couleurs[classe] || '#888';
}

