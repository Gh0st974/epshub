// 📄 Fichier : js/modules/outils/chrono/chrono-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM uniquement

/**
 * Formate un temps ms → MM:SS.cc pour l'affichage principal
 * @param {number} ms
 * @returns {string}
 */
function uiFormaterTemps(ms) {
  const centièmes = Math.floor((ms % 1000) / 10);
  const secondes  = Math.floor(ms / 1000) % 60;
  const minutes   = Math.floor(ms / 60000);

  return `${String(minutes).padStart(2,'0')}:${String(secondes).padStart(2,'0')}.${String(centièmes).padStart(2,'0')}`;
}

/**
 * Génère le HTML d'une carte chrono
 * @param {string} id - identifiant unique du chrono
 * @param {number} numero - numéro affiché (1, 2, 3...)
 * @param {boolean} afficherTitre - affiche "Chrono N" si true (mode multi)
 * @returns {string} HTML de la carte
 */
function uiGenererCarte(id, numero, afficherTitre) {
  const titrePart = afficherTitre ? `
    <div class="chrono-carte-header">
      <span class="chrono-titre">Chrono ${numero}</span>
      <button class="chrono-btn-supprimer" data-id="${id}" title="Supprimer ce chrono">✕</button>
    </div>` : '';

  return `
    <div class="chrono-carte" id="carte-${id}">
      ${titrePart}
      <div class="chrono-affichage" id="affichage-${id}">00:00.00</div>
      <div class="chrono-boutons-principaux">
        <button class="chrono-btn chrono-btn-reset" data-id="${id}" data-action="reset">↺ Reset</button>
        <button class="chrono-btn chrono-btn-start" data-id="${id}" data-action="start">▶ Start</button>
        <button class="chrono-btn chrono-btn-lap" data-id="${id}" data-action="lap" disabled>⚑ Lap</button>
      </div>
      <div class="chrono-laps" id="laps-${id}"></div>
    </div>`;
}

/**
 * Génère le HTML complet du mode simple
 * @param {string} id
 * @returns {string}
 */
function uiGenererModeSimple(id) {
  return uiGenererCarte(id, 1, false);
}

/**
 * Génère le HTML complet du mode multi
 * @param {string[]} ids
 * @returns {string}
 */
function uiGenererModeMulti(ids) {
  const cartes = ids.map((id, i) => uiGenererCarte(id, i + 1, true)).join('');

  return `
    <div class="chrono-multi-global">
      <div class="chrono-boutons-globaux">
        <button class="chrono-btn chrono-btn-global chrono-btn-start" data-action="global-start">▶ Tout démarrer</button>
        <button class="chrono-btn chrono-btn-global chrono-btn-pause" data-action="global-pause">⏸ Tout pauser</button>
        <button class="chrono-btn chrono-btn-global chrono-btn-reset" data-action="global-reset">↺ Tout reset</button>
      </div>
    </div>
    <div class="chrono-multi-grille" id="chrono-multi-grille">
      ${cartes}
    </div>
    <button class="chrono-btn-ajouter" data-action="ajouter">＋ Ajouter un chrono</button>`;
}

/**
 * Met à jour l'affichage du temps d'un chrono
 * @param {string} id
 * @param {number} ms
 */
function uiMettreAJourAffichage(id, ms) {
  const el = document.getElementById(`affichage-${id}`);
  if (el) el.textContent = uiFormaterTemps(ms);
}

/**
 * Met à jour l'état des boutons d'un chrono
 * @param {string} id
 * @param {boolean} enCours
 * @param {number} ms
 */
function uiMettreAJourBoutons(id, enCours, ms) {
  const carte = document.getElementById(`carte-${id}`);
  if (!carte) return;

  const btnStart = carte.querySelector(`[data-action="start"]`);
  const btnLap   = carte.querySelector(`[data-action="lap"]`);

  if (btnStart) {
    btnStart.textContent = enCours ? '⏸ Pause' : '▶ Start';
    btnStart.dataset.action = enCours ? 'pause' : 'start';
  }

  // Lap disponible seulement si le chrono tourne
  if (btnLap) btnLap.disabled = !enCours;
}

/**
 * Insère une nouvelle carte chrono dans la grille multi
 * @param {string} id
 * @param {number} numero
 */
function uiInsererCarte(id, numero) {
  const grille = document.getElementById('chrono-multi-grille');
  if (!grille) return;

  const div = document.createElement('div');
  div.innerHTML = uiGenererCarte(id, numero, true);
  grille.appendChild(div.firstElementChild);
}

/**
 * Supprime une carte chrono du DOM
 * @param {string} id
 */
function uiSupprimerCarte(id) {
  const carte = document.getElementById(`carte-${id}`);
  if (carte) carte.remove();
}
