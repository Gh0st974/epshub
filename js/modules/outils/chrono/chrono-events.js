// 📄 Fichier : /js/modules/outils/chrono/chrono-events.js
// 🎯 Rôle : Gestion des événements du chronomètre

// ─── Initialisation globale du chrono ────────────────────────────
function initChrono() {
  afficherOngletChrono('simple'); // onglet par défaut
  initEvenementsOnglets();
}

// ─── Gestion des onglets Simple / Multi ──────────────────────────
function initEvenementsOnglets() {
  document.getElementById('onglet-simple')
    ?.addEventListener('click', () => afficherOngletChrono('simple'));
  document.getElementById('onglet-multi')
    ?.addEventListener('click', () => afficherOngletChrono('multi'));
}

// ─── Charger l'onglet demandé ─────────────────────────────────────
function afficherOngletChrono(mode) {
  // Mettre à jour les onglets actifs
  document.querySelectorAll('.chrono-onglet').forEach(o => {
    o.classList.toggle('active', o.dataset.mode === mode);
  });

  if (mode === 'simple') {
    resetChrono(chronoSimple);
    afficherChronoSimple();
    initEvenementsSimple();
  } else {
    stopperTousMulti();
    const chronos = initChronosMulti(2);
    afficherChronoMulti(chronos);
    initEvenementsMulti();
  }
}

// ─── Événements du mode simple ────────────────────────────────────
function initEvenementsSimple() {
  document.getElementById('btn-start-stop')
    ?.addEventListener('click', () => {
      if (chronoSimple.enCours) {
        stopperChrono(chronoSimple);
        mettreAJourBoutonsSimple(false);
      } else {
        demarrerChrono(chronoSimple, (c) => {
          mettreAJourAffichageSimple(obtenirTempsMs(c));
        });
        mettreAJourBoutonsSimple(true);
      }
    });

  document.getElementById('btn-reset')
    ?.addEventListener('click', () => {
      resetChrono(chronoSimple);
      resetSimpleUI();
    });

  document.getElementById('btn-split')
    ?.addEventListener('click', () => {
      const ms = enregistrerSplit(chronoSimple);
      ajouterSplitUI(chronoSimple.splits.length, ms);
    });
}

// ─── Événements du mode multi ─────────────────────────────────────
function initEvenementsMulti() {
  // Boutons globaux
  document.getElementById('btn-tous-start')
    ?.addEventListener('click', () => {
      demarrerTousMulti((c) => mettreAJourTempsMulti(c));
    });

  document.getElementById('btn-tous-stop')
    ?.addEventListener('click', () => stopperTousMulti());

  document.getElementById('btn-tous-reset')
    ?.addEventListener('click', () => {
      resetTousMulti();
      chronoMulti.forEach(c => resetCarteUI(c));
    });

  // Bouton ajouter un chrono
  document.getElementById('btn-ajouter-chrono')
    ?.addEventListener('click', () => {
      const resultat = ajouterChronoMulti();
      if (!resultat) return; // déjà 4
      const nouveauChrono = chronoMulti[chronoMulti.length - 1];
      ajouterCarteChronoUI(nouveauChrono);
      // Cacher le bouton si on atteint 4
      if (chronoMulti.length >= 4) {
        document.getElementById('btn-ajouter-chrono').style.display = 'none';
      }
      // Re-écouter les cartes
      initEvenementsCartes();
    });

  initEvenementsCartes();
}

// ─── Événements sur les boutons des cartes individuelles ─────────
function initEvenementsCartes() {
  // Délégation sur la grille
  const grille = document.getElementById('grille-multi');
  if (!grille) return;

  // Supprimer l'ancien listener pour éviter les doublons
  grille.replaceWith(grille.cloneNode(true));
  const grilleNeuve = document.getElementById('grille-multi');

  grilleNeuve.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id);
    const chrono = chronoMulti.find(c => c.id === id);
    if (!chrono) return;

    switch (action) {
      case 'start':
        demarrerChrono(chrono, (c) => mettreAJourTempsMulti(c));
        break;
      case 'stop':
        stopperChrono(chrono);
        break;
      case 'split':
        if (chrono.enCours) {
          enregistrerSplit(chrono);
          ajouterSplitCarteUI(chrono);
        }
        break;
      case 'reset':
        resetChrono(chrono);
        resetCarteUI(chrono);
        break;
    }
  });

  // Mise à jour des noms en temps réel
  grilleNeuve.addEventListener('input', (e) => {
    if (e.target.classList.contains('chrono-carte__nom')) {
      const id = parseInt(e.target.id.replace('nom-chrono-', ''));
      const chrono = chronoMulti.find(c => c.id === id);
      if (chrono) chrono.nom = e.target.value;
    }
  });
}
