// 📄 Fichier : js/modules/outils/chrono/chrono-events.js
// 🎯 Rôle : Écoute des interactions utilisateur (délégation d'événements)

/**
 * Initialise tous les écouteurs d'événements du module chrono
 * @param {object} handlers - fonctions de rappel fournies par chrono.js
 *   handlers.onStart(id)
 *   handlers.onPause(id)
 *   handlers.onReset(id)
 *   handlers.onLap(id)
 *   handlers.onGlobalStart()
 *   handlers.onGlobalPause()
 *   handlers.onGlobalReset()
 *   handlers.onAjouter()
 *   handlers.onSupprimer(id)
 *   handlers.onChangerMode(mode)
 */
function chronoInitEvents(handlers) {
  const zone = document.getElementById('chrono-zone');
  const moduleEl = document.querySelector('.chrono-module');

  // ── Délégation sur la zone des chronos ─────────────────
  if (zone) {
    zone.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const id     = btn.dataset.id || null;

      switch (action) {
        case 'start':        handlers.onStart(id);       break;
        case 'pause':        handlers.onPause(id);       break;
        case 'reset':        handlers.onReset(id);       break;
        case 'lap':          handlers.onLap(id);         break;
        case 'global-start': handlers.onGlobalStart();   break;
        case 'global-pause': handlers.onGlobalPause();   break;
        case 'global-reset': handlers.onGlobalReset();   break;
        case 'ajouter':      handlers.onAjouter();       break;
      }
    });

    // Bouton supprimer (croix) sur chaque carte multi
    zone.addEventListener('click', (e) => {
      const btn = e.target.closest('.chrono-btn-supprimer');
      if (!btn) return;
      handlers.onSupprimer(btn.dataset.id);
    });
  }

  // ── Sélecteur de mode (Simple / Multi) ─────────────────
  if (moduleEl) {
    moduleEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.chrono-mode-btn');
      if (!btn) return;
      handlers.onChangerMode(btn.dataset.mode);
    });
  }
}
