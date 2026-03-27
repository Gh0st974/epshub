// 📄 Fichier : /js/modules/outils/scoreboard/scoreboard-timer.js
// 🎯 Rôle : Chrono intégré au scoreboard (compte à rebours + signal)

// ═══════════════════════════════════════════
//  ÉTAT DU CHRONO
// ═══════════════════════════════════════════

/** État interne du chrono */
let etatChrono = {
  dureeInitiale: 0,   // en secondes
  tempsRestant: 0,    // en secondes
  enCours: false,
  intervalle: null,
};

// ═══════════════════════════════════════════
//  CONTRÔLES PRINCIPAUX
// ═══════════════════════════════════════════

/**
 * Démarre le compte à rebours
 * @param {number} minutes - Durée en minutes
 */
export function demarrerChrono(minutes) {
  if (etatChrono.enCours) return;

  // Si le chrono est à 0, on recharge depuis l'input
  if (etatChrono.tempsRestant <= 0) {
    const duree = Math.max(1, Math.min(60, minutes)) * 60;
    etatChrono.dureeInitiale = duree;
    etatChrono.tempsRestant = duree;
  }

  etatChrono.enCours = true;
  etatChrono.intervalle = setInterval(tickChrono, 1000);
  mettreAJourBoutons(true);
}

/** Met le chrono en pause */
export function pauseChrono() {
  if (!etatChrono.enCours) return;
  clearInterval(etatChrono.intervalle);
  etatChrono.enCours = false;
  mettreAJourBoutons(false);
}

/**
 * Remet le chrono à zéro
 * @param {number} minutes - Nouvelle durée en minutes
 */
export function resetChrono(minutes) {
  clearInterval(etatChrono.intervalle);
  etatChrono.enCours = false;

  const duree = Math.max(1, Math.min(60, minutes)) * 60;
  etatChrono.dureeInitiale = duree;
  etatChrono.tempsRestant = duree;

  afficherTemps(etatChrono.tempsRestant);
  mettreAJourBoutons(false);

  // Retirer la classe alerte
  const affichage = document.getElementById('chrono-affichage');
  if (affichage) affichage.classList.remove('alerte');
}

// ═══════════════════════════════════════════
//  LOGIQUE INTERNE
// ═══════════════════════════════════════════

/** Décrémente le temps et met à jour l'affichage */
function tickChrono() {
  if (etatChrono.tempsRestant <= 0) {
    terminerChrono();
    return;
  }

  etatChrono.tempsRestant -= 1;
  afficherTemps(etatChrono.tempsRestant);

  // Alerte visuelle dans les 10 dernières secondes
  if (etatChrono.tempsRestant <= 10) {
    const affichage = document.getElementById('chrono-affichage');
    if (affichage) affichage.classList.add('alerte');
  }
}

/** Arrête le chrono et déclenche le signal sonore */
function terminerChrono() {
  clearInterval(etatChrono.intervalle);
  etatChrono.enCours = false;
  etatChrono.tempsRestant = 0;

  afficherTemps(0);
  mettreAJourBoutons(false);
  jouerSonFin();
}

// ═══════════════════════════════════════════
//  SIGNAL SONORE
// ═══════════════════════════════════════════

/** Joue un bip de fin via Web Audio API */
function jouerSonFin() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // 3 bips courts
    [0, 0.4, 0.8].forEach(delai => {
      const oscillateur = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillateur.connect(gain);
      gain.connect(ctx.destination);

      oscillateur.frequency.value = 880;
      oscillateur.type = 'sine';
      gain.gain.setValueAtTime(0.5, ctx.currentTime + delai);
      gain.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + delai + 0.3
      );

      oscillateur.start(ctx.currentTime + delai);
      oscillateur.stop(ctx.currentTime + delai + 0.3);
    });

  } catch (e) {
    console.warn('⚠️ Signal sonore non disponible :', e);
  }
}

// ═══════════════════════════════════════════
//  AFFICHAGE
// ═══════════════════════════════════════════

/**
 * Formate et affiche le temps dans le DOM
 * @param {number} secondes
 */
function afficherTemps(secondes) {
  const minutes = Math.floor(secondes / 60);
  const secs = secondes % 60;
  const texte = `${pad(minutes)}:${pad(secs)}`;

  const el = document.getElementById('chrono-affichage');
  if (el) el.textContent = texte;
}

/**
 * Ajoute un zéro devant si nécessaire
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return n.toString().padStart(2, '0');
}

/** Met à jour l'apparence des boutons play/pause */
function mettreAJourBoutons(enCours) {
  const btnPlay  = document.getElementById('chrono-btn-play');
  const btnPause = document.getElementById('chrono-btn-pause');
  if (btnPlay)  btnPlay.style.opacity  = enCours ? '0.4' : '1';
  if (btnPause) btnPause.style.opacity = enCours ? '1'   : '0.4';
}
