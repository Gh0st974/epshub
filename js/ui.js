// 📄 Fichier : /js/ui.js
// 🎯 Rôle : Génération et manipulation du DOM global (hub, recherche)

// ============================================================
// FABRIQUE DE CARTES
// ============================================================

/**
 * Génère une carte cliquable (CA ou outil)
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

// ============================================================
// GRILLES DU HUB
// ============================================================

/**
 * Remplit une grille avec une liste d'items
 * @param {string} idGrille    - ID de l'élément DOM cible
 * @param {Array}  items       - tableau d'objets { id, label, icone, actif }
 * @param {string} classeExtra - classe CSS supplémentaire (optionnel)
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

// ============================================================
// RECHERCHE
// ============================================================

/**
 * Affiche les résultats de recherche sous forme de cartes
 * @param {Array} resultats - modules filtrés depuis MODULES_RECHERCHE
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

// ============================================================
// INITIALISATION DU HUB
// ============================================================

/**
 * Remplit les grilles CA et outils au démarrage
 */
function initHub() {
  remplirGrille('grille-ca', CHAMPS_APPRENTISSAGE);
  remplirGrille('grille-outils', OUTILS, 'hub-grille--outils');
}
