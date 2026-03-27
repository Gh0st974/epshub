// 📄 Fichier : /js/config.js
// 🎯 Rôle : Constantes et paramètres globaux de l'application

const CONFIG = {
  nom: 'EPSHub',
  version: '1.0.0',
  couleurPrincipale: '#2ecc71',
};

// Définition des Champs d'Apprentissage
const CHAMPS_APPRENTISSAGE = [
  { id: 'ca1', label: 'CA1', icone: '⏱️', couleur: '#97c342ff', actif: true  },
  { id: 'ca2', label: 'CA2', icone: '🧭', couleur: '#dd8502ff', actif: false },
  { id: 'ca3', label: 'CA3', icone: '🤸', couleur: '#0090cdff', actif: false },
  { id: 'ca4', label: 'CA4', icone: '🏀', couleur: '#b074b0ff', actif: false },
  { id: 'ca5', label: 'CA5', icone: '💃', couleur: '#fbbf00ff', actif: false },
];

// Définition des outils indispensables
const OUTILS = [
  { id: 'chrono', label: 'Chrono', icone: '⏱️', vue: 'vue-chrono' },
  { id: 'score',        label: 'Score',        icone: '🏆' },
  { id: 'calculatrice', label: 'Calculatrice', icone: '🧮' },
  { id: 'minuteur',     label: 'Minuteur',     icone: '🔔' },
];

// Tous les modules recherchables (pour la fonction recherche)
const MODULES_RECHERCHE = [
  ...CHAMPS_APPRENTISSAGE.map(ca => ({ ...ca, type: 'ca' })),
  ...OUTILS.map(o => ({ ...o, type: 'outil' })),
];
