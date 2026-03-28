// 📄 Fichier : js/modules/outils/chrono/chrono.js
// 🎯 Rôle : Point d'entrée du module — initialisation et orchestration

(function () {

  // ─── Chargement des dépendances dans l'ordre ────────────────────────────────
  const scripts = [
    '/js/modules/outils/chrono/chrono-timer.js',
    '/js/modules/outils/chrono/chrono-laps.js',
    '/js/modules/outils/chrono/chrono-ui.js',
    '/js/modules/outils/chrono/chrono-events.js',
  ];

  let compteurChargement = 0;

  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      compteurChargement++;
      if (compteurChargement === scripts.length) {
        initialiserModule();
      }
    };
    document.head.appendChild(script);
  });

  // ─── État local du module ────────────────────────────────────────────────────
  let modeActuel = 'simple';
  let compteurChronos = 0;  // Pour numéroter les chronos multi

  /**
   * Génère un ID unique pour un chrono
   * @returns {string}
   */
  function genererIdChrono() {
    compteurChronos++;
    return `chrono-${Date.now()}-${compteurChronos}`;
  }

  // ─── INITIALISATION ──────────────────────────────────────────────────────────
  function initialiserModule() {
    const zone = document.getElementById('chrono-zone');
    if (!zone) return;

    // Démarrage en mode simple
    lancerModeSimple();

    // Écoute du sélecteur de mode
    eventsBinderModeSelector((mode) => {
      if (mode === modeActuel) return;
      modeActuel = mode;

      // Nettoyer tous les chronos existants
      chronoGetTousIds().forEach(id => chronoSupprimer(id));

      if (mode === 'simple') lancerModeSimple();
      else lancerModeMulti();
    });
  }

  // ─── MODE SIMPLE ─────────────────────────────────────────────────────────────
  function lancerModeSimple() {
    const zone = document.getElementById('chrono-zone');
    const id = genererIdChrono();

    chronoCreer(id);
    uiAfficherModeSimple(zone, id);

    // Callback tick → met à jour l'affichage
    const onTick = (ms) => {
      uiMettreAJourAffichage(id, ms, true);
    };

    eventsBinderSimple(
      id,
      // Start
      (id) => {
        chronoDemarrer(id, onTick);
        uiMettreAJourBoutons(id, true, chronoGetMs(id));
      },
      // Pause
      (id) => {
        chronoPauser(id);
        const ms = chronoGetMs(id);
        uiMettreAJourAffichage(id, ms, false);
        uiMettreAJourBoutons(id, false, ms);
      },
      // Reset
      (id) => {
        chronoReset(id);
        uiMettreAJourAffichage(id, 0, false);
        uiMettreAJourBoutons(id, false, 0);
        const conteneurLaps = document.getElementById(`laps-${id}`);
        lapsAfficher(conteneurLaps, []);
      },
      // Lap
      (id) => {
        const lap = chronoAjouterLap(id);
        const etat = chronoGetEtat(id);
        const conteneurLaps = document.getElementById(`laps-${id}`);
        if (etat) lapsAfficher(conteneurLaps, etat.laps);
      }
    );
  }

  // ─── MODE MULTI ──────────────────────────────────────────────────────────────
  function lancerModeMulti() {
    const zone = document.getElementById('chrono-zone');

    // Créer 2 chronos par défaut
    const ids = [genererIdChrono(), genererIdChrono()];
    ids.forEach(id => chronoCreer(id));

    uiAfficherModeMulti(zone, ids, compteurChronos);

    // Brancher les événements multi
    eventsBinderMulti({
      onStart: (id) => demarrerChrono(id),
      onPause: (id) => pauserChrono(id),
      onReset: (id) => resetterChrono(id),
      onLap:   (id) => lapChrono(id),
      onAjouter: () => ajouterChrono(),
      onSupprimer: (id) => supprimerChrono(id),
      onGlobalStart: () => chronoGetTousIds().forEach(id => demarrerChrono(id)),
      onGlobalPause: () => chronoGetTousIds().forEach(id => pauserChrono(id)),
      onGlobalReset: () => chronoGetTousIds().forEach(id => resetterChrono(id)),
    });
  }

  // ─── ACTIONS INDIVIDUELLES (multi) ──────────────────────────────────────────

  function demarrerChrono(id) {
    const etat = chronoGetEtat(id);
    if (!etat || etat.enCours) return;

    const onTick = (ms) => uiMettreAJourAffichage(id, ms, true);
    chronoDemarrer(id, onTick);
    uiMettreAJourBoutons(id, true, chronoGetMs(id));
  }

  function pauserChrono(id) {
    const etat = chronoGetEtat(id);
    if (!etat || !etat.enCours) return;

    chronoPauser(id);
    const ms = chronoGetMs(id);
    uiMettreAJourAffichage(id, ms, false);
    uiMettreAJourBoutons(id, false, ms);
  }

  function resetterChrono(id) {
    chronoReset(id);
    uiMettreAJourAffichage(id, 0, false);
    uiMettreAJourBoutons(id, false, 0);
    const conteneurLaps = document.getElementById(`laps-${id}`);
    lapsAfficher(conteneurLaps, []);
  }

  function lapChrono(id) {
    chronoAjouterLap(id);
    const etat = chronoGetEtat(id);
    const conteneurLaps = document.getElementById(`laps-${id}`);
    if (etat) lapsAfficher(conteneurLaps, etat.laps);
  }

  function ajouterChrono() {
    const id = genererIdChrono();
    chronoCreer(id);
    uiInsererCarte(id, compteurChronos);

    // Les événements sont déjà délégués sur la zone, pas besoin de rebinder
  }

  function supprimerChrono(id) {
    // Garder au moins 1 chrono en mode multi
    if (chronoGetTousIds().length <= 1) return;

    chronoSupprimer(id);
    uiSupprimerCarte(id);
  }

})();
