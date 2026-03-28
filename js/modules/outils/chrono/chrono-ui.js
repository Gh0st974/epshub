// 📄 Fichier : /js/modules/outils/chrono/chrono-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM du module Chrono

// ============================================================
// CONSTRUCTION DE LA VUE PRINCIPALE
// ============================================================

/**
 * Génère et injecte la vue complète du chrono dans #vue-chrono
 */
function construireVueChrono() {
  const vue = document.getElementById('vue-chrono');
  if (!vue) return;

  vue.innerHTML = `
    <div class="chrono-container">

      <div class="chrono-header">
        <button class="chrono-btn-retour" id="chrono-btn-retour">
          ← Retour
        </button>
        <div class="chrono-mode-switcher">
          <button class="chrono-mode-btn active" data-mode="simple">
            Simple
          </button>
          <button class="chrono-mode-btn" data-mode="multi">
            Multi
          </button>
        </div>
      </div>

      <div class="chrono-liste" id="chrono-liste"></div>

      <div class="chrono-actions-globales">
        <button class="chrono-btn-ajouter" id="chrono-btn-ajouter">
          + Ajouter un chrono
        </button>
      </div>

    </div>
  `;

  // Premier rendu — mettreAJourModeUI est définie plus bas
  rafraichirListeChronos();
  mettreAJourModeUI(getModeActif());
}

// ============================================================
// RENDU DE LA LISTE DES CHRONOS
// ============================================================

/**
 * Reconstruit la liste complète des cartes chrono
 */
function rafraichirListeChronos() {
  const liste = document.getElementById('chrono-liste');
  if (!liste) return;

  liste.innerHTML = '';
  getChronos().forEach(c => {
    liste.appendChild(creerCarteChronoUI(c));
  });
}

/**
 * Crée la carte DOM d'un chrono
 * @param {object} chrono
 * @returns {HTMLElement}
 */
function creerCarteChronoUI(chrono) {
  const carte = document.createElement('div');
  carte.classList.add('chrono-carte');
  carte.dataset.id = chrono.id;

  carte.innerHTML = `
    <div class="chrono-carte__header">
      <span class="chrono-carte__label">${chrono.label}</span>
      <button class="chrono-carte__btn-sup"
              data-action="supprimer" data-id="${chrono.id}">✕</button>
    </div>

    <div class="chrono-carte__affichage" id="chrono-temps-${chrono.id}">
      ${formaterTemps(chrono.tempsEcoule)}
    </div>

    <div class="chrono-carte__laps" id="chrono-laps-${chrono.id}">
      ${rendreLaps(chrono.laps)}
    </div>

    <div class="chrono-carte__controles">
      <button class="chrono-btn chrono-btn--reset"
              data-action="reset" data-id="${chrono.id}">↺ Reset</button>
      <button class="chrono-btn chrono-btn--lap"
              data-action="lap" data-id="${chrono.id}">⚑ Lap</button>
      <button class="chrono-btn chrono-btn--toggle"
              data-action="toggle" data-id="${chrono.id}">
        ${chrono.enCours ? '⏸ Pause' : '▶ Start'}
      </button>
    </div>
  `;

  return carte;
}

// ============================================================
// RENDU DES LAPS
// ============================================================

/**
 * Génère le HTML des laps d'un chrono
 * @param {number[]} laps - tableau de temps en ms
 * @returns {string} HTML
 */
function rendreLaps(laps) {
  if (!laps || laps.length === 0) return '';
  return laps.map((t, i) =>
    `<div class="chrono-lap">Lap ${i + 1} — ${formaterTemps(t)}</div>`
  ).join('');
}

// ============================================================
// MISES À JOUR PARTIELLES
// ============================================================

/**
 * Met à jour l'affichage du temps d'un chrono
 * @param {number} id
 */
function mettreAJourAffichageChrono(id) {
  const el = document.getElementById(`chrono-temps-${id}`);
  if (!el) return;
  const c = getChronoById(id);
  if (!c) return;
  el.textContent = formaterTemps(c.tempsEcoule);
}

/**
 * Met à jour le bouton Start/Pause d'un chrono
 * @param {number} id
 */
function mettreAJourBoutonToggle(id) {
  const btn = document.querySelector(
    `.chrono-btn--toggle[data-id="${id}"]`
  );
  if (!btn) return;
  const c = getChronoById(id);
  if (!c) return;
  btn.textContent = c.enCours ? '⏸ Pause' : '▶ Start';
}

/**
 * Met à jour la zone des laps d'un chrono
 * @param {number} id
 */
function mettreAJourLaps(id) {
  const el = document.getElementById(`chrono-laps-${id}`);
  if (!el) return;
  const c = getChronoById(id);
  if (!c) return;
  el.innerHTML = rendreLaps(c.laps);
}

/**
 * Supprime la carte DOM d'un chrono
 * @param {number} id
 */
function supprimerCarteChronoUI(id) {
  const carte = document.querySelector(`.chrono-carte[data-id="${id}"]`);
  if (carte) carte.remove();
}

// ============================================================
// MISE À JOUR DU MODE (simple / multi)
// ============================================================

/**
 * Met à jour l'UI selon le mode actif :
 * - Active le bon bouton du switcher
 * - Affiche/masque le bouton "Ajouter un chrono"
 * - Affiche/masque les boutons "Supprimer" des cartes
 * @param {'simple'|'multi'} mode
 */
function mettreAJourModeUI(mode) {
  // Switcher — bouton actif
  document.querySelectorAll('.chrono-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Bouton ajouter — visible seulement en multi
  const btnAjouter = document.getElementById('chrono-btn-ajouter');
  if (btnAjouter) {
    btnAjouter.style.display = mode === 'multi' ? 'block' : 'none';
  }

  // Boutons supprimer — visibles seulement en multi
  document.querySelectorAll('.chrono-carte__btn-sup').forEach(btn => {
    btn.style.display = mode === 'multi' ? 'inline-block' : 'none';
  });
}
