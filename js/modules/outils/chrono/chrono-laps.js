// 📄 Fichier : js/modules/outils/chrono/chrono-laps.js
// 🎯 Rôle : Formatage et rendu de la liste des laps

/**
 * Formate un temps en millisecondes → "MM:SS.cs"
 * @param {number} ms
 * @returns {string}
 */
function lapsFormaterTemps(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(ms / 1000);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

/**
 * Génère le HTML d'un lap unique
 * @param {object} lap - { numero, totalMs, splitMs }
 * @returns {string} HTML
 */
function lapsGenererItem(lap) {
  return `
    <div class="chrono-lap-item">
      <span class="chrono-lap-num">Lap ${lap.numero}</span>
      <span class="chrono-lap-split">${lapsFormaterTemps(lap.splitMs)}</span>
      <span class="chrono-lap-total">${lapsFormaterTemps(lap.totalMs)}</span>
    </div>
  `;
}

/**
 * Met à jour l'affichage de la liste des laps dans un conteneur
 * @param {HTMLElement} conteneur
 * @param {Array} laps - tableau de laps (plus récent en premier)
 */
function lapsAfficher(conteneur, laps) {
  if (!conteneur) return;

  if (laps.length === 0) {
    conteneur.innerHTML = '';
    return;
  }

  conteneur.innerHTML = laps.map(lapsGenererItem).join('');
}
