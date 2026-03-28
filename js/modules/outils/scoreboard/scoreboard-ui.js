// 📄 Fichier : js/modules/scoreboard/scoreboard-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM — affichage du scoreboard

const ScoreboardUI = (function () {

  // ══════════════════════════════════════
  // RENDU PRINCIPAL
  // ══════════════════════════════════════

  /** Lance le rendu complet de la page de jeu */
  function rendrePage() {
    rendreBarrePeriode();
    rendreEquipes();
  }

  // ══════════════════════════════════════
  // BARRE DE PÉRIODE
  // ══════════════════════════════════════

  /** Affiche ou masque la barre de période selon l'état */
  function rendreBarrePeriode() {
    const periodes  = ScoreboardApp.getPeriodes();
    const barre     = document.getElementById('scoreboard-periode-bar');
    const label     = document.getElementById('scoreboard-periode-label');
    const btnSuiv   = document.getElementById('scoreboard-btn-periode-suivante');

    if (!periodes.actives) {
      barre.hidden = true;
      return;
    }

    barre.hidden = false;
    label.textContent = `${periodes.nom} ${periodes.courante} / ${periodes.total}`;

    // Désactive le bouton à la dernière période
    btnSuiv.disabled = periodes.courante >= periodes.total;
  }

  // ══════════════════════════════════════
  // RENDU DES ÉQUIPES
  // ══════════════════════════════════════

  /** Génère toutes les cartes d'équipes */
  function rendreEquipes() {
    const conteneur = document.getElementById('scoreboard-equipes');
    const equipes   = ScoreboardApp.getEquipes();
    const bonus     = ScoreboardApp.getBonus();

    conteneur.innerHTML = '';

    equipes.forEach(equipe => {
      const carte = creerCarteEquipe(equipe, bonus);
      conteneur.appendChild(carte);
    });
  }

  /** Crée la carte DOM d'une équipe */
  function creerCarteEquipe(equipe, bonus) {
    const periodes = ScoreboardApp.getPeriodes();

    const carte = document.createElement('div');
    carte.className = 'scoreboard-equipe-carte';
    carte.dataset.idEquipe = equipe.id;
    carte.style.borderTopColor = equipe.couleur;

    // — Nom éditable
    const inputNom = document.createElement('input');
    inputNom.type = 'text';
    inputNom.className = 'scoreboard-equipe-nom';
    inputNom.value = equipe.nom;
    inputNom.maxLength = 30;
    inputNom.setAttribute('aria-label', 'Nom de l\'équipe');

    // — Score total
    const scoreEl = document.createElement('div');
    scoreEl.className = 'scoreboard-equipe-score';
    scoreEl.textContent = equipe.scoreTotal;

    // — Scores par période (si actives)
    const scoresPeriodes = creerScoresPeriodes(equipe, periodes);

    // — Boutons de points
    const boutons = creerBoutonsPoints(equipe.id, bonus, equipe.couleur);

    carte.appendChild(inputNom);
    carte.appendChild(scoreEl);
    if (scoresPeriodes) carte.appendChild(scoresPeriodes);
    carte.appendChild(boutons);

    return carte;
  }

  /** Crée les badges de scores par période */
  function creerScoresPeriodes(equipe, periodes) {
    if (!periodes.actives || equipe.scoresPeriodes.length === 0) return null;

    const conteneur = document.createElement('div');
    conteneur.className = 'scoreboard-equipe-scores-periodes';

    equipe.scoresPeriodes.forEach((score, index) => {
      const badge = document.createElement('span');
      badge.className = 'scoreboard-periode-badge';
      badge.textContent = `${periodes.nom} ${index + 1} : ${score}`;
      conteneur.appendChild(badge);
    });

    return conteneur;
  }

  /** Crée le bloc de boutons de points pour une équipe */
  function creerBoutonsPoints(idEquipe, bonus, couleurEquipe) {
    const conteneur = document.createElement('div');
    conteneur.className = 'scoreboard-equipe-boutons';

    // Bouton +1 standard
    const btn1 = document.createElement('button');
    btn1.className = 'scoreboard-btn-point';
    btn1.textContent = '+1 point';
    btn1.style.background = couleurEquipe;
    btn1.dataset.idEquipe = idEquipe;
    btn1.dataset.points = '1';
    conteneur.appendChild(btn1);

    // Boutons bonus configurés
    bonus.forEach(b => {
      const btnBonus = document.createElement('button');
      btnBonus.className = 'scoreboard-btn-point bonus';
      btnBonus.textContent = `+${b.valeur} — ${b.libelle}`;
      btnBonus.dataset.idEquipe = idEquipe;
      btnBonus.dataset.points = b.valeur;
      conteneur.appendChild(btnBonus);
    });

    return conteneur;
  }

  // ══════════════════════════════════════
  // MISE À JOUR PARTIELLE — score seul
  // ══════════════════════════════════════

  /** Met à jour uniquement l'affichage du score d'une équipe */
  function mettreAJourScore(idEquipe) {
    const equipe   = ScoreboardApp.getEquipes().find(e => e.id === idEquipe);
    const periodes = ScoreboardApp.getPeriodes();

    if (!equipe) return;

    const carte = document.querySelector(
      `.scoreboard-equipe-carte[data-id-equipe="${idEquipe}"]`
    );
    if (!carte) return;

    // Mise à jour du score total
    const scoreEl = carte.querySelector('.scoreboard-equipe-score');
    if (scoreEl) scoreEl.textContent = equipe.scoreTotal;

    // Mise à jour des scores par période
    const ancienScoresPer = carte.querySelector('.scoreboard-equipe-scores-periodes');
    if (ancienScoresPer) ancienScoresPer.remove();

    const nouveauxScoresPer = creerScoresPeriodes(equipe, periodes);
    if (nouveauxScoresPer) {
      const boutons = carte.querySelector('.scoreboard-equipe-boutons');
      carte.insertBefore(nouveauxScoresPer, boutons);
    }
  }

  // ══════════════════════════════════════
  // EXPOSITION
  // ══════════════════════════════════════
  return {
    rendrePage,
    rendreBarrePeriode,
    rendreEquipes,
    mettreAJourScore,
  };

})();
