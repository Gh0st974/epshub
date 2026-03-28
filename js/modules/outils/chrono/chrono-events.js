// 📄 Fichier : js/modules/outils/chrono/chrono-events.js
// 🎯 Rôle : Écoute et dispatch de toutes les interactions utilisateur

/**
 * Branche les événements pour le mode simple
 * @param {string} id
 * @param {function} onStart
 * @param {function} onPause
 * @param {function} onReset
 * @param {function} onLap
 */
function eventsBinderSimple(id, onStart, onPause, onReset, onLap) {
  const zone = document.getElementById('chrono-zone');
  if (!zone) return;

  // Délégation d'événements sur la zone
  zone.addEventListener('click', function handlerSimple(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.dataset.id !== id) return;

    const action = btn.dataset.action;

    if (action === 'start') onStart(id);
    else if (action === 'pause') onPause(id);
    else if (action === 'reset') onReset(id);
    else if (action === 'lap') onLap(id);
  });
}

/**
 * Branche les événements pour le mode multi
 * @param {object} callbacks - { onStart, onPause, onReset, onLap, onAjouter, onSupprimer, onGlobalStart, onGlobalPause, onGlobalReset }
 */
function eventsBinderMulti(callbacks) {
  const zone = document.getElementById('chrono-zone');
  if (!zone) return;

  zone.addEventListener('click', function handlerMulti(e) {
    // Bouton ajouter
    if (e.target.closest('#chrono-ajouter')) {
      callbacks.onAjouter();
      return;
    }

    // Contrôles globaux
    if (e.target.closest('#global-start')) { callbacks.onGlobalStart(); return; }
    if (e.target.closest('#global-pause')) { callbacks.onGlobalPause(); return; }
    if (e.target.closest('#global-reset')) { callbacks.onGlobalReset(); return; }

    // Contrôles individuels
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (!id) return;

    if (action === 'start') callbacks.onStart(id);
    else if (action === 'pause') callbacks.onPause(id);
    else if (action === 'reset') callbacks.onReset(id);
    else if (action === 'lap') callbacks.onLap(id);
    else if (action === 'supprimer') callbacks.onSupprimer(id);
  });
}

/**
 * Branche le sélecteur de mode
 * @param {function} onChange - appelé avec "simple" ou "multi"
 */
function eventsBinderModeSelector(onChange) {
  const selector = document.querySelector('.chrono-mode-selector');
  if (!selector) return;

  selector.addEventListener('click', (e) => {
    const btn = e.target.closest('.chrono-mode-btn');
    if (!btn) return;

    // Mise à jour visuelle de l'onglet actif
    selector.querySelectorAll('.chrono-mode-btn').forEach(b => b.classList.remove('actif'));
    btn.classList.add('actif');

    onChange(btn.dataset.mode);
  });
}
