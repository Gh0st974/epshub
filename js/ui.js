// 📄 Fichier : /js/ui.js
// 🎯 Rôle : Génération et manipulation du DOM

/**
 * Génère une carte icône (CA ou outil)
 * @param {Object} item - { id, label, icone, actif }
 * @returns {HTMLElement}
 */
function creerCarte(item) {
  const carte = document.createElement('div');
  carte.classList.add('hub-carte');
  carte.dataset.id = item.id;

  if (item.actif) carte.classList.add('hub-carte--actif');

  carte.innerHTML = `
    <div class="hub-carte__icone">${item.icone}</div>
    <span class="hub-carte__label">${item.label}</span>
  `;

  return carte;
}

/**
 * Remplit une grille avec une liste d'items
 * @param {string} idGrille - ID de l'élément DOM
 * @param {Array}  items    - tableau d'objets { id, label, icone, actif }
 * @param {string} classeExtra - classe CSS supplémentaire pour la grille
 */
function remplirGrille(idGrille, items, classeExtra = '') {
  const grille = document.getElementById(idGrille);
  if (!grille) return;

  if (classeExtra) grille.classList.add(classeExtra);

  grille.innerHTML = '';
  items.forEach(item => {
    const carte = creerCarte(item);
    grille.appendChild(carte);
  });
}

/**
 * Affiche les résultats de recherche
 * @param {Array} resultats - modules filtrés
 */
function afficherResultatsRecherche(resultats) {
  const conteneur = document.getElementById('resultats-recherche');
  if (!conteneur) return;

  if (resultats.length === 0) {
    conteneur.innerHTML = '<p style="color:#aaa;text-align:center">Aucun module trouvé</p>';
    return;
  }

  conteneur.innerHTML = '';
  resultats.forEach(item => {
    const carte = creerCarte(item);
    conteneur.appendChild(carte);
  });
}

/**
 * Initialise la vue Hub (remplit les grilles)
 */
function initHub() {
  remplirGrille('grille-ca', CHAMPS_APPRENTISSAGE);
  remplirGrille('grille-outils', OUTILS, 'hub-grille--outils');
  remplirGrille('grille-outils-vue', OUTILS, 'hub-grille--outils'); 
}
