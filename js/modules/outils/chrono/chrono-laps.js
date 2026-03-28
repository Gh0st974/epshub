// 📄 Fichier : js/modules/outils/chrono/chrono-laps.js
// 🎯 Rôle : Formatage et rendu de la liste des laps dans le DOM

/**
 * Formate un temps en ms → MM:SS.cc
 * @param {number} ms
 * @returns {string}
 */
function lapsFormaterTemps(ms) {
  const centièmes = Math.floor((ms % 1000) / 10);
  const secondes  = Math.floor(ms / 1000) % 60;
  const minutes   = Math.floor(ms / 60000);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(secondes).padStart(2, '0');
  const cc = String(centièmes).padStart(2, '0');

  return `${mm}:${ss}.${cc}`;
}

/**
 * Affiche la liste des laps dans un conteneur DOM
 * @param {HTMLElement} conteneur - l'élément #laps-[id]
 * @param {Array} laps - tableau de { numero, total, delta }
 */
function lapsAfficher(conteneur, laps) {
  if (!conteneur) return;

  if (laps.length === 0) {
    conteneur.innerHTML = '';
    return;
  }

  // On reconstruit la liste complète
  const lignes = laps.map((lap, index) => {
    // Le dernier lap est mis en évidence
    const estDernier = index === laps.length - 1;
    return `
      <div class="chrono-lap-ligne ${estDernier ? 'dernier' : ''}">
        <span class="chrono-lap-numero">Lap ${lap.numero}</span>
        <span class="chrono-lap-delta">+${lapsFormaterTemps(lap.delta)}</span>
        <span class="chrono-lap-total">${lapsFormaterTemps(lap.total)}</span>
      </div>`;
  }).reverse().join(''); // Plus récent en premier

  conteneur.innerHTML = lignes;
}
