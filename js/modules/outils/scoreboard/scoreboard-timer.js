// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-timer.js
// 🎯 Rôle : Logique du timer MM:SS (démarrage, pause, reset, fin)

window.SBtimer = (function () {

  // ═══ DÉMARRER / PAUSE ═══
  function togglePlay() {
    if (window.SB.etat.timerEnCours) {
      pause();
    } else {
      demarrer();
    }
  }

  // ═══ DÉMARRER ═══
  function demarrer() {
    if (window.SB.etat.timerSecondes <= 0) return;
    window.SB.etat.timerEnCours = true;
    document.getElementById('sb-timer-play').textContent = '⏸';

    window.SB.etat.timerInterval = setInterval(() => {
      window.SB.etat.timerSecondes--;
      SBui.rendreTimerAffichage();

      if (window.SB.etat.timerSecondes <= 0) {
        arretFin();
      }
    }, 1000);
  }

  // ═══ PAUSE ═══
  function pause() {
    clearInterval(window.SB.etat.timerInterval);
    window.SB.etat.timerEnCours = false;
    document.getElementById('sb-timer-play').textContent = '▶';
  }

  // ═══ RESET ═══
  function reset() {
    pause();
    window.SB.etat.timerSecondes = window.SB.config.timerDuree;
    SBui.rendreTimerAffichage();
    // Enlever l'effet clignotant si présent
    document.getElementById('sb-timer-affichage').classList.remove('fini');
  }

  // ═══ ARRET FIN (à 0) ═══
  function arretFin() {
    clearInterval(window.SB.etat.timerInterval);
    window.SB.etat.timerEnCours = false;
    window.SB.etat.timerSecondes = 0;
    SBui.rendreTimerAffichage();
    document.getElementById('sb-timer-play').textContent = '▶';

    // Effet visuel clignotant
    document.getElementById('sb-timer-affichage').classList.add('fini');

    // Bip sonore via Web Audio API
    jouerBip();
  }

  // ═══ BIP SONORE ═══
  function jouerBip() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio non disponible, pas bloquant
    }
  }

  // ═══ APPLIQUER NOUVELLE DURÉE ═══
  function appliquerDuree(minutes, secondes) {
    const total = (parseInt(minutes) || 0) * 60 + (parseInt(secondes) || 0);
    if (total <= 0) return;
    window.SB.config.timerDuree = total;
    reset();
  }

  // ═══ API PUBLIQUE ═══
  return {
    togglePlay,
    reset,
    appliquerDuree
  };

})();
