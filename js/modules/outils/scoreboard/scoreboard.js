// 📄 Fichier : /js/modules/outils/scoreboard/scoreboard.js
// 🎯 Rôle : Logique métier du scoreboard (scores, sets, modes)

// ═══════════════════════════════════════════
//  CONFIGURATION DES ÉQUIPES
// ═══════════════════════════════════════════

/** Liste des équipes disponibles avec leur couleur */
const EQUIPES_CONFIG = [
  { id: 'bleu',   nom: '🔵 Bleus',   classe: 'bleu'   },
  { id: 'rouge',  nom: '🔴 Rouges',  classe: 'rouge'  },
  { id: 'vert',   nom: '🟢 Verts',   classe: 'vert'   },
  { id: 'jaune',  nom: '🟡 Jaunes',  classe: 'jaune'  },
  { id: 'violet', nom: '🟣 Violets', classe: 'violet' },
  { id: 'orange', nom: '🟠 Oranges', classe: 'orange' },
];

// ═══════════════════════════════════════════
//  ÉTAT GLOBAL DU SCOREBOARD
// ═══════════════════════════════════════════

/** État courant de la partie */
let etatScoreboard = creerEtatInitial(2, 1);

/**
 * Crée un état initial propre
 * @param {number} nbEquipes - Nombre d'équipes (2 à 6)
 * @param {number} nbSets - Nombre de sets (1, 3 ou 5)
 * @returns {object} Etat initial
 */
function creerEtatInitial(nbEquipes, nbSets) {
  const equipes = EQUIPES_CONFIG.slice(0, nbEquipes).map(config => ({
    ...config,
    score: 0,
    setsGagnes: 0,
  }));

  return {
    nbEquipes,
    nbSets,
    equipes,
    setActuel: 1,
    partieTerminee: false,
  };
}

// ═══════════════════════════════════════════
//  LECTURE DE L'ÉTAT
// ═══════════════════════════════════════════

/** Retourne l'état courant (copie lecture seule) */
function getEtat() {
  return etatScoreboard;
}

/** Retourne la config des équipes disponibles */
function getEquipesConfig() {
  return EQUIPES_CONFIG;
}

// ═══════════════════════════════════════════
//  MODIFICATION DES SCORES
// ═══════════════════════════════════════════

/**
 * Ajoute des points à une équipe
 * @param {string} equipeId - Identifiant de l'équipe
 * @param {number} points - Nombre de points (positif ou négatif)
 */
function ajouterPoints(equipeId, points) {
  if (etatScoreboard.partieTerminee) return;

  const equipe = trouverEquipe(equipeId);
  if (!equipe) return;

  // Le score ne peut pas descendre en dessous de 0
  equipe.score = Math.max(0, equipe.score + points);
}

/**
 * Remet les scores du set actuel à zéro (sans toucher aux sets gagnés)
 */
function resetScores() {
  etatScoreboard.equipes.forEach(eq => { eq.score = 0; });
}

/**
 * Remet tout à zéro (scores + sets)
 */
function resetComplet() {
  etatScoreboard = creerEtatInitial(
    etatScoreboard.nbEquipes,
    etatScoreboard.nbSets
  );
}

// ═══════════════════════════════════════════
//  GESTION DES SETS
// ═══════════════════════════════════════════

/**
 * Valide le set actuel : attribue le set au meilleur score
 * @returns {object|null} Équipe gagnante du set ou null si égalité
 */
function validerSet() {
  if (etatScoreboard.partieTerminee) return null;

  const gagnant = trouverGagnantSet();
  if (!gagnant) return null; // égalité, pas de validation

  gagnant.setsGagnes += 1;

  // Vérifier si la partie est terminée
  const seuilVictoire = Math.ceil(etatScoreboard.nbSets / 2);
  if (gagnant.setsGagnes >= seuilVictoire) {
    etatScoreboard.partieTerminee = true;
  } else {
    etatScoreboard.setActuel += 1;
    resetScores();
  }

  return gagnant;
}

/**
 * Trouve l'équipe avec le score le plus élevé du set
 * Retourne null en cas d'égalité
 * @returns {object|null}
 */
function trouverGagnantSet() {
  const scores = etatScoreboard.equipes.map(eq => eq.score);
  const max = Math.max(...scores);
  const equipesMax = etatScoreboard.equipes.filter(eq => eq.score === max);

  // Égalité → pas de gagnant
  if (equipesMax.length > 1) return null;
  return equipesMax[0];
}

// ═══════════════════════════════════════════
//  CHANGEMENT DE CONFIGURATION
// ═══════════════════════════════════════════

/**
 * Change le nombre d'équipes et recrée un état propre
 * @param {number} nb - Nouveau nombre d'équipes
 */
function changerNbEquipes(nb) {
  const nbValide = Math.min(6, Math.max(2, nb));
  etatScoreboard = creerEtatInitial(nbValide, etatScoreboard.nbSets);
}

/**
 * Change le nombre de sets et recrée un état propre
 * @param {number} nb - Nouveau nombre de sets (1, 3 ou 5)
 */
function changerNbSets(nb) {
  etatScoreboard = creerEtatInitial(etatScoreboard.nbEquipes, nb);
}

// ═══════════════════════════════════════════
//  UTILITAIRES INTERNES
// ═══════════════════════════════════════════

/**
 * Trouve une équipe par son ID
 * @param {string} equipeId
 * @returns {object|null}
 */
function trouverEquipe(equipeId) {
  return etatScoreboard.equipes.find(eq => eq.id === equipeId) || null;
}


