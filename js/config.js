// 📄 Fichier : /js/config.js
// 🎯 Rôle : Constantes et paramètres globaux de l'application

// ============================================================
// CONFIGURATION GÉNÉRALE
// ============================================================

const CONFIG = {
  nom: 'EPSHub',
  version: '1.0.0',
  couleurPrincipale: '#2ecc71',
};

// ============================================================
// CHAMPS D'APPRENTISSAGE
// ============================================================

const CHAMPS_APPRENTISSAGE = [
  { id: 'ca1', label: 'CA1', icone: '⏱️', couleur: '#97c342ff', actif: true  },
  { id: 'ca2', label: 'CA2', icone: '🧭', couleur: '#dd8502ff', actif: false },
  { id: 'ca3', label: 'CA3', icone: '🤸', couleur: '#0090cdff', actif: false },
  { id: 'ca4', label: 'CA4', icone: '🏀', couleur: '#b074b0ff', actif: false },
  { id: 'ca5', label: 'CA5', icone: '💃', couleur: '#fbbf00ff', actif: false },
];

// ============================================================
// OUTILS — Ajouter ici chaque nouvel outil
// ============================================================
// 📌 FORMAT : { id: 'mon-outil', label: 'Mon Outil', icone: '🔧' }
// 📌 L'id doit correspondre à la route déclarée dans router.js
// ============================================================

const OUTILS = [
  // --- Outils disponibles ---
  { id: 'chrono',       label: 'Chrono',       icone: '⏱️' },

  // --- Outils à venir ---
  { id: 'score',        label: 'Score',        icone: '🏆' },
  { id: 'calculatrice', label: 'Calculatrice', icone: '🧮' },
  { id: 'minuteur',     label: 'Minuteur',     icone: '🔔' },
];

// ============================================================
// INDEX DE RECHERCHE — Se met à jour automatiquement
// ============================================================

const MODULES_RECHERCHE = [
  ...CHAMPS_APPRENTISSAGE.map(ca => ({ ...ca, type: 'ca' })),
  ...OUTILS.map(o => ({ ...o, type: 'outil' })),
];
