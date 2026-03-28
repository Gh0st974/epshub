// 📄 Fichier : js/modules/outils/chrono/chrono-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM pour les modes simple et multi

/**
 * Formate ms → affichage "MM:SS" + centièmes séparés
 * @param {number} ms
 * @returns {{ principal: string, cs: string }}
 */
function uiFormaterAffichage(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(ms / 1000);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);

  return {
    principal: `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`,
    cs: String(cs).padStart(2, '0'),
  };
}

/**
 * Met à jour l'affichage d'un chrono
 * @param {string} id - identifiant du chrono
 * @param {number} ms - temps en millisecondes
 * @param {boolean} enCours
 */
function uiMettreAJourAffichage(id, ms, enCours) {
  const el = document.querySelector(`[data-chrono-id="${id}"] .chrono-affichage`);
  if (!el) return;

  const { principal, cs } = uiFormaterAffichage(ms);
  el.innerHTML = `${principal}<span class="chrono-cs">.${cs}</span>`;
  el.classList.toggle('actif', enCours);
}

/**
 * Met à jour l'état des boutons d'un chrono
 * @param {string} id
 * @param {boolean} enCours
 * @param {number} ms - pour savoir si on peut faire lap/reset
 */
function uiMettreAJourBoutons(id, enCours, ms) {
  const carte = document.querySelector(`[data-chrono-id="${id}"]`);
  if (!carte) return;

  const btnStart = carte.querySelector('.chrono-btn-start');
  const btnPause = carte.querySelector('.chrono-btn-pause');
  const btnLap   = carte.querySelector('.chrono-btn-lap');
  const btnReset = carte.querySelector('.chrono-btn-reset');

  if (enCours) {
    btnStart && (btnStart.style.display = 'none');
    btnPause && (btnPause.style.display = 'flex');
  } else {
    btnStart && (btnStart.style.display = 'flex');
    btnPause && (btnPause.style.display = 'none');
  }

  // Lap actif seulement si le chrono tourne
  if (btnLap) btnLap.disabled = !enCours;
  // Reset actif si un temps est enregistré
  if (btnReset) btnReset.disabled = (ms === 0);
}

/**
 * Génère la carte HTML d'un chrono (simple ou multi)
 * @param {string} id
 * @param {string} titre - ex: "Chrono 1"
 * @param {boolean} avecSuppression - affiche le bouton ✕
 * @returns {string} HTML
 */
function uiGenererCarte(id, titre, avecSuppression) {
  const btnSuppr = avecSuppression
    ? `<button class="chrono-supprimer-btn" data-action="supprimer" data-id="${id}" title="Supprimer">✕</button>`
    : '';

  return `
    <div class="chrono-carte" data-chrono-id="${id}">
      ${btnSuppr}
      <div class="chrono-titre">${titre}</div>
      <div class="chrono-affichage">00:00<span class="chrono-cs">.00</span></div>
      <div class="chrono-controles">
        <button class="chrono-btn chrono-btn-reset" data-action="reset" data-id="${id}" disabled>↺ Reset</button>
        <button class="chrono-btn chrono-btn-start" data-action="start" data-id="${id}">▶ Start</button>
        <button class="chrono-btn chrono-btn-pause" data-action="pause" data-id="${id}" style="display:none">⏸ Pause</button>
        <button class="chrono-btn chrono-btn-lap" data-action="lap" data-id="${id}" disabled>🏁 Lap</button>
      </div>
      <div class="chrono-laps" id="laps-${id}"></div>
    </div>
  `;
}

/**
 * Génère la barre de contrôle globale pour le mode multi
 * @returns {string} HTML
 */
function uiGenererBarreGlobale() {
  return `
    <div class="chrono-global-bar">
      <div class="chrono-global-bar-titre">Contrôles globaux</div>
      <div class="chrono-global-controles">
        <button class="chrono-btn chrono-btn-start" id="global-start">▶ Tout démarrer</button>
        <button class="chrono-btn chrono-btn-pause" id="global-pause">⏸ Tout pauser</button>
        <button class="chrono-btn chrono-btn-reset" id="global-reset">↺ Tout reset</button>
      </div>
    </div>
  `;
}

/**
 * Génère le bouton "Ajouter un chrono"
 * @returns {string} HTML
 */
function uiGenererBoutonAjouter() {
  return `<button class="chrono-ajouter-btn" id="chrono-ajouter">＋ Ajouter un chrono</button>`;
}

/**
 * Construit la vue mode simple dans la zone
 * @param {HTMLElement} zone
 * @param {string} id
 */
function uiAfficherModeSimple(zone, id) {
  zone.classList.remove('multi-mode');
  zone.innerHTML = uiGenererCarte(id, '⏱️ Chronomètre', false);
}

/**
 * Construit la vue mode multi dans la zone
 * @param {HTMLElement} zone
 * @param {string[]} ids - liste des IDs de chronos
 * @param {number} compteur - numérotation
 */
function uiAfficherModeMulti(zone, ids, compteur) {
  zone.classList.add('multi-mode');

  const cartes = ids.map((id, i) =>
    uiGenererCarte(id, `⏱️ Chrono ${i + 1}`, true)
  ).join('');

  zone.innerHTML =
    uiGenererBarreGlobale() +
    cartes +
    uiGenererBoutonAjouter();
}

/**
 * Insère une nouvelle carte avant le bouton ajouter
 * @param {string} id
 * @param {number} numero
 */
function uiInsererCarte(id, numero) {
  const btnAjouter = document.getElementById('chrono-ajouter');
  if (!btnAjouter) return;

  const div = document.createElement('div');
  div.innerHTML = uiGenererCarte(id, `⏱️ Chrono ${numero}`, true);
  btnAjouter.parentNode.insertBefore(div.firstElementChild, btnAjouter);
}

/**
 * Supprime la carte d'un chrono du DOM
 * @param {string} id
 */
function uiSupprimerCarte(id) {
  const carte = document.querySelector(`[data-chrono-id="${id}"]`);
  if (carte) carte.remove();
}
