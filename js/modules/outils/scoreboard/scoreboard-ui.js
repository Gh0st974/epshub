// 📄 Fichier : js/modules/scoreboard/scoreboard-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM

const ScoreboardUI = (function () {

  // ══════════════════════════════════════
  // RENDU PRINCIPAL
  // ══════════════════════════════════════

  function rendrePage() {
    rendreBarrePeriode();
    rendreEquipes();
  }

  // ══════════════════════════════════════
  // BARRE DE PÉRIODE
  // ══════════════════════════════════════

  function rendreBarrePeriode() {
    const periodes = ScoreboardApp.getPeriodes();
    const barre    = document.getElementById('scoreboard-periode-bar');
    const label    = document.getElementById('scoreboard-periode-label');
    const btnSuiv  = document.getElementById('scoreboard-btn-periode-suivante');

    if (!periodes.actives) {
      barre.hidden = true;
      return;
    }

    barre.hidden = false;
    label.textContent = `${periodes.nom} ${periodes.courante} / ${periodes.total}`;
    btnSuiv.disabled  = periodes.courante >= periodes.total;
  }

  // ══════════════════════════════════════
  // RENDU DES ÉQUIPES
  // ══════════════════════════════════════

  function rendreEquipes() {
    const conteneur = document.getElementById('scoreboard-equipes');
    const equipes   = ScoreboardApp.getEquipes();
    const bonus     = ScoreboardApp.getBonus();
    conteneur.innerHTML = '';
    equipes.forEach(equipe => conteneur.appendChild(creerCarteEquipe(equipe, bonus)));
  }

  function creerCarteEquipe(equipe, bonus) {
    const periodes = ScoreboardApp.getPeriodes();

    const carte = document.createElement('div');
    carte.className = 'scoreboard-equipe-carte';
    carte.dataset.idEquipe = String(equipe.id);
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

    carte.appendChild(inputNom);
    carte.appendChild(scoreEl);

    // — Scores par période (si actives)
    const scoresPer = creerScoresPeriodes(equipe, periodes);
    if (scoresPer) carte.appendChild(scoresPer);

    // — Boutons de points
    carte.appendChild(creerBoutonsPoints(equipe.id, bonus, equipe.couleur));

    return carte;
  }

  // ══════════════════════════════════════
  // SCORES PAR PÉRIODE
  // ══════════════════════════════════════

  function creerScoresPeriodes(equipe, periodes) {
    if (!periodes.actives || equipe.scoresPeriodes.length === 0) return null;

    const conteneur = document.createElement('div');
    conteneur.className = 'scoreboard-equipe-scores-periodes';

    equipe.scoresPeriodes.forEach((score, idx) => {
      const span = document.createElement('span');
      span.className = 'scoreboard-score-periode';
      span.textContent = `${periodes.nom} ${idx + 1} : ${score}`;
      conteneur.appendChild(span);
    });

    return conteneur;
  }

  // ══════════════════════════════════════
  // BOUTONS DE POINTS
  // ══════════════════════════════════════

  function creerBoutonsPoints(idEquipe, bonus, couleurEquipe) {
    const conteneur = document.createElement('div');
    conteneur.className = 'scoreboard-equipe-boutons';

    // Bouton +1 standard
    const btn1 = document.createElement('button');
    btn1.className = 'scoreboard-btn-point';
    btn1.textContent = '+1 point';
    btn1.style.background = couleurEquipe;
    btn1.dataset.idEquipe = String(idEquipe);
    btn1.dataset.points   = '1';
    conteneur.appendChild(btn1);

    // Boutons bonus configurés
    bonus.forEach(b => {
      const btnB = document.createElement('button');
      btnB.className = 'scoreboard-btn-point bonus';
      btnB.textContent = `+${b.valeur} — ${b.libelle}`;
      btnB.dataset.idEquipe = String(idEquipe);
      btnB.dataset.points   = String(b.valeur);
      conteneur.appendChild(btnB);
    });

    return conteneur;
  }

  // ══════════════════════════════════════
  // MISE À JOUR PARTIELLE
  // ══════════════════════════════════════

  function mettreAJourScore(idEquipe) {
    const equipe   = ScoreboardApp.getEquipes().find(e => e.id === idEquipe);
    const periodes = ScoreboardApp.getPeriodes();
    if (!equipe) return;

    const carte = document.querySelector(
      `.scoreboard-equipe-carte[data-id-equipe="${String(idEquipe)}"]`
    );
    if (!carte) return;

    // Mise à jour score total
    const scoreEl = carte.querySelector('.scoreboard-equipe-score');
    if (scoreEl) scoreEl.textContent = equipe.scoreTotal;

    // Mise à jour scores par période
    const ancien = carte.querySelector('.scoreboard-equipe-scores-periodes');
    if (ancien) ancien.remove();

    const nouveaux = creerScoresPeriodes(equipe, periodes);
    if (nouveaux) {
      const boutons = carte.querySelector('.scoreboard-equipe-boutons');
      carte.insertBefore(nouveaux, boutons);
    }
  }

  // ══════════════════════════════════════
  // EXPOSITION
  // ══════════════════════════════════════

  return { rendrePage, rendreBarrePeriode, rendreEquipes, mettreAJourScore };

})();
