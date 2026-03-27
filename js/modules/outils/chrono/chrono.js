// 📄 Fichier : /js/modules/outils/chrono/chrono.js
// 🎯 Rôle : Logique métier du chronomètre (simple et multi)

// ─── État du chrono simple ───────────────────────────────────────
const chronoSimple = {
  debut: null,        // timestamp du démarrage
  accumule: 0,        // temps accumulé avant pause (ms)
  intervalle: null,   // référence setInterval
  enCours: false,
  splits: [],
};

// ─── État du mode multi ───────────────────────────────────────────
let chronoMulti = []; // tableau de chronos individuels

// ─── Fabrique un objet chrono individuel ─────────────────────────
function creerChrono(id, nom) {
  return {
    id,
    nom,
    debut: null,
    accumule: 0,
    intervalle: null,
    enCours: false,
    splits: [],
  };
}

// ─── Initialise le mode multi avec N chronos ─────────────────────
function initChronosMulti(nombre) {
  // Stopper tous les chronos existants
  chronoMulti.forEach(c => stopperChrono(c));
  chronoMulti = [];
  for (let i = 1; i <= nombre; i++) {
    chronoMulti.push(creerChrono(i, `Élève ${i}`));
  }
  return chronoMulti;
}

// ─── Ajouter un chrono en mode multi ─────────────────────────────
function ajouterChronoMulti() {
  if (chronoMulti.length >= 4) return false;
  const id = chronoMulti.length + 1;
  chronoMulti.push(creerChrono(id, `Élève ${id}`));
  return chronoMulti;
}

// ─── Démarrer un chrono ───────────────────────────────────────────
function demarrerChrono(chrono, callbackTick) {
  if (chrono.enCours) return;
  chrono.enCours = true;
  chrono.debut = Date.now();
  chrono.intervalle = setInterval(() => {
    callbackTick(chrono);
  }, 50); // rafraîchissement toutes les 50ms
}

// ─── Stopper un chrono ────────────────────────────────────────────
function stopperChrono(chrono) {
  if (!chrono.enCours) return;
  chrono.accumule += Date.now() - chrono.debut;
  chrono.enCours = false;
  clearInterval(chrono.intervalle);
  chrono.intervalle = null;
}

// ─── Réinitialiser un chrono ──────────────────────────────────────
function resetChrono(chrono) {
  stopperChrono(chrono);
  chrono.accumule = 0;
  chrono.debut = null;
  chrono.splits = [];
}

// ─── Enregistrer un split ─────────────────────────────────────────
function enregistrerSplit(chrono) {
  const temps = obtenirTempsMs(chrono);
  chrono.splits.push(temps);
  return temps;
}

// ─── Calculer le temps écoulé en ms ──────────────────────────────
function obtenirTempsMs(chrono) {
  if (chrono.enCours) {
    return chrono.accumule + (Date.now() - chrono.debut);
  }
  return chrono.accumule;
}

// ─── Formater les ms en MM:SS:centièmes ──────────────────────────
function formaterTemps(ms) {
  const minutes = Math.floor(ms / 60000);
  const secondes = Math.floor((ms % 60000) / 1000);
  const centiemes = Math.floor((ms % 1000) / 10);
  return `${pad(minutes)}:${pad(secondes)}:${pad(centiemes)}`;
}

// ─── Utilitaire : ajouter un zéro si nécessaire ──────────────────
function pad(n) {
  return String(n).padStart(2, '0');
}

// ─── Démarrer tous les chronos multi simultanément ───────────────
function demarrerTousMulti(callbackTick) {
  chronoMulti.forEach(c => demarrerChrono(c, callbackTick));
}

// ─── Stopper tous les chronos multi ──────────────────────────────
function stopperTousMulti() {
  chronoMulti.forEach(c => stopperChrono(c));
}

// ─── Réinitialiser tous les chronos multi ────────────────────────
function resetTousMulti() {
  chronoMulti.forEach(c => resetChrono(c));
}
