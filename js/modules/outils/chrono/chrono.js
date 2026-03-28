// 📄 Fichier : js/modules/outils/chrono/chrono.js
// 🎯 Rôle : Point d'entrée du module — charge les sous-fichiers et orchestre

(function () {

  // ── Chargement des sous-fichiers dans l'ordre ──────────
  const BASE = 'js/modules/outils/chrono/';
  const fichiers = [
    'chrono-timer.js',
    'chrono-laps.js',
    'chrono-ui.js',
    'chrono-events.js'
  ];

  let nbCharges = 0;

  fichiers.forEach((fichier) => {
    // Evite les doublons si le module est rechargé
    const idScript = `js-sub-${fichier}`;
    const existant = document.getElementById(idScript);
    if (existant) existant.remove();

    const script = document.createElement('script');
    script.id  = idScript;
    script.src = BASE + fichier;
    script.onload = () => {
      nbCharges++;
      // Une fois tous les sous-fichiers chargés, on initialise
      if (nbCharges === fichiers.length) initialiserModule();
    };
    script.onerror = () => console.error(`Impossible de charger ${fichier}`);
    document.body.appendChild(script);
  });

  // ── État du module ──────────────────────────────────────
  let modeActuel       = 'simple'; // 'simple' ou 'multi'
  let compteurChronos  = 0;

  /** Génère un identifiant unique pour un chrono */
  function genererIdChrono() {
    compteurChronos++;
    return `chrono-${compteurChronos}`;
  }

  // ── Initialisation ──────────────────────────────────────
  function initialiserModule() {
    chargerModeSimple();
    chronoInitEvents(handlers);
    mettreAJourBoutonsModeSelector('simple');
  }

  // ── Chargement des modes ────────────────────────────────

  function chargerModeSimple() {
    // Nettoie les chronos existants
    chronoGetTousIds().forEach(id => chronoSupprimer(id));
    compteurChronos = 0;
    modeActuel = 'simple';

    const id = genererIdChrono();
    chronoCreer(id);

    const zone = document.getElementById('chrono-zone');
    if (zone) zone.innerHTML = uiGenererModeSimple(id);
  }

  function chargerModeMulti() {
    // Nettoie les chronos existants
    chronoGetTousIds().forEach(id => chronoSupprimer(id));
    compteurChronos = 0;
    modeActuel = 'multi';

    // 2 chronos par défaut
    const id1 = genererIdChrono();
    const id2 = genererIdChrono();
    chronoCreer(id1);
    chronoCreer(id2);

    const zone = document.getElementById('chrono-zone');
    if (zone) zone.innerHTML = uiGenererModeMulti([id1, id2]);
  }

  // ── Handlers d'événements ───────────────────────────────

  const handlers = {

    onChangerMode(mode) {
      if (mode === modeActuel) return;
      if (mode === 'simple') chargerModeSimple();
      else chargerModeMulti();
      mettreAJourBoutonsModeSelector(mode);
    },

    onStart(id) {
      chronoDemarrer(id, (id, ms) => {
        uiMettreAJourAffichage(id, ms);
      });
      uiMettreAJourBoutons(id, true, chronoGetMs(id));
    },

    onPause(id) {
      chronoPauser(id);
      const ms = chronoGetMs(id);
      uiMettreAJourAffichage(id, ms);
      uiMettreAJourBoutons(id, false, ms);
    },

    onReset(id) {
      resetterChrono(id);
    },

    onLap(id) {
      lapChrono(id);
    },

    onGlobalStart() {
      chronoGetTousIds().forEach(id => {
        const etat = chronoGetEtat(id);
        if (etat && !etat.enCours) {
          chronoDemarrer(id, (id, ms) => uiMettreAJourAffichage(id, ms));
          uiMettreAJourBoutons(id, true, chronoGetMs(id));
        }
      });
    },

    onGlobalPause() {
      chronoGetTousIds().forEach(id => {
        const etat = chronoGetEtat(id);
        if (etat && etat.enCours) {
          chronoPauser(id);
          const ms = chronoGetMs(id);
          uiMettreAJourAffichage(id, ms);
          uiMettreAJourBoutons(id, false, ms);
        }
      });
    },

    onGlobalReset() {
      chronoGetTousIds().forEach(id => resetterChrono(id));
    },

    onAjouter() {
      ajouterChrono();
    },

    onSupprimer(id) {
      supprimerChrono(id);
    }
  };

  // ── Fonctions utilitaires ───────────────────────────────

  function resetterChrono(id) {
    chronoReset(id);
    uiMettreAJourAffichage(id, 0);
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
  }

  function supprimerChrono(id) {
    // Minimum 1 chrono en mode multi
    if (chronoGetTousIds().length <= 1) return;
    chronoSupprimer(id);
    uiSupprimerCarte(id);
  }

  function mettreAJourBoutonsModeSelector(modeActif) {
    document.querySelectorAll('.chrono-mode-btn').forEach(btn => {
      btn.classList.toggle('actif', btn.dataset.mode === modeActif);
    });
  }

})();
