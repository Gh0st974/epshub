// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-events.js
// 🎯 Rôle : Écouteurs d'événements du module scoreboard

window.SBevents = (function () {

  function init() {
    ecouterTimer();
    ecouterSets();
    ecouterScores();
    ecouterConfig();
    ecouterModals();
  }

  // ═══ TIMER ═══
  function ecouterTimer() {
    // Affichage cliquable → ouvre la modal
    document.getElementById('sb-timer-affichage')
      .addEventListener('click', () => {
        // Pré-remplir les inputs avec la durée actuelle
        const duree = window.SB.config.timerDuree;
        document.getElementById('sb-input-min').value = Math.floor(duree / 60);
        document.getElementById('sb-input-sec').value = duree % 60;
        document.getElementById('sb-modal-timer').removeAttribute('hidden');
      });

    // Play/Pause
    document.getElementById('sb-timer-play')
      .addEventListener('click', () => SBtimer.togglePlay());

    // Reset
    document.getElementById('sb-timer-reset')
      .addEventListener('click', () => SBtimer.reset());
  }

  // ═══ SETS / PASTILLES ═══
  function ecouterSets() {
    // Bouton suivante
    document.getElementById('sb-btn-suivante')
      .addEventListener('click', () => window.SB.setSuivant());
  }

  // ═══ SCORES (délégation sur la grille) ═══
  function ecouterScores() {
    const grille = document.getElementById('sb-grille');
    grille.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-delta]');
      if (!btn) return;
      const indexEquipe = parseInt(btn.dataset.indexEquipe);
      const delta = parseInt(btn.dataset.delta);
      window.SB.modifierScore(indexEquipe, delta);
    });
  }

  // ═══ CONFIGURATION ═══
  function ecouterConfig() {
    // Ouvrir/fermer le panneau
    document.getElementById('sb-btn-configurer')
      .addEventListener('click', () => {
        const panel = document.getElementById('sb-config-panel');
        if (panel.hasAttribute('hidden')) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

    // Reset global
    document.getElementById('sb-btn-reset-global')
      .addEventListener('click', () => {
        if (confirm('Réinitialiser tous les scores ?')) {
          window.SB.resetGlobal();
        }
      });

    // Stepper équipes
    document.getElementById('sb-equipes-moins')
      .addEventListener('click', () => {
        if (window.SB.config.nbEquipes > 2) {
          window.SB.config.nbEquipes--;
          document.getElementById('sb-equipes-val').textContent = window.SB.config.nbEquipes;
          SBui.rendreConfigNoms();
        }
      });

    document.getElementById('sb-equipes-plus')
      .addEventListener('click', () => {
        if (window.SB.config.nbEquipes < 4) {
          window.SB.config.nbEquipes++;
          document.getElementById('sb-equipes-val').textContent = window.SB.config.nbEquipes;
          SBui.rendreConfigNoms();
        }
      });

    // Stepper sets
    document.getElementById('sb-sets-moins')
      .addEventListener('click', () => {
        if (window.SB.config.nbSets > 1) {
          window.SB.config.nbSets--;
          document.getElementById('sb-sets-val').textContent = window.SB.config.nbSets;
        }
      });

    document.getElementById('sb-sets-plus')
      .addEventListener('click', () => {
        if (window.SB.config.nbSets < 5) {
          window.SB.config.nbSets++;
          document.getElementById('sb-sets-val').textContent = window.SB.config.nbSets;
        }
      });

    // Ajouter un bouton bonus
    document.getElementById('sb-btn-ajouter-bonus')
      .addEventListener('click', () => {
        if (window.SB.config.boutonsBonus.length >= 4) return;
        window.SB.config.boutonsBonus.push({ label: '+2', valeur: 2 });
        SBui.rendreConfigBonus();
      });

    // Délégation sur la liste bonus (modifier label/valeur + supprimer)
    document.getElementById('sb-bonus-liste')
      .addEventListener('input', (e) => {
        const input = e.target.closest('[data-index-bonus]');
        if (!input) return;
        const i = parseInt(input.dataset.indexBonus);
        const champ = input.dataset.champ;
        if (champ === 'label') {
          window.SB.config.boutonsBonus[i].label = input.value;
        } else if (champ === 'valeur') {
          window.SB.config.boutonsBonus[i].valeur = parseInt(input.value) || 1;
        }
      });

    document.getElementById('sb-bonus-liste')
      .addEventListener('click', (e) => {
        const btn = e.target.closest('.sb-bonus-suppr');
        if (!btn) return;
        const i = parseInt(btn.dataset.indexBonus);
        window.SB.config.boutonsBonus.splice(i, 1);
        SBui.rendreConfigBonus();
      });

    // Valider config → réinitialise le match
    document.getElementById('sb-btn-valider-config')
      .addEventListener('click', () => {
        // Lire les noms depuis les inputs
        const { nbEquipes } = window.SB.config;
        for (let e = 0; e < nbEquipes; e++) {
          const input = document.getElementById(`sb-nom-equipe-${e}`);
          if (input) {
            window.SB.config.nomsEquipes[e] = input.value || `Équipe ${e + 1}`;
          }
        }
        window.SB.appliquerConfig();
        document.getElementById('sb-config-panel').setAttribute('hidden', '');
      });
  }

  // ═══ MODALS ═══
  function ecouterModals() {

    // Modal timer : annuler
    document.getElementById('sb-timer-annuler')
      .addEventListener('click', () => {
        document.getElementById('sb-modal-timer').setAttribute('hidden', '');
      });

    // Modal timer : valider
    document.getElementById('sb-timer-valider')
      .addEventListener('click', () => {
        const min = document.getElementById('sb-input-min').value;
        const sec = document.getElementById('sb-input-sec').value;
        SBtimer.appliquerDuree(min, sec);
        document.getElementById('sb-modal-timer').setAttribute('hidden', '');
      });

    // Modal confirm set : non
    document.getElementById('sb-confirm-non')
      .addEventListener('click', () => {
        window.SB.setEnAttente = null;
        document.getElementById('sb-modal-confirm').setAttribute('hidden', '');
      });

    // Modal confirm set : oui
    document.getElementById('sb-confirm-oui')
      .addEventListener('click', () => {
        if (window.SB.setEnAttente !== null) {
          window.SB.allerAuSet(window.SB.setEnAttente);
          window.SB.setEnAttente = null;
        }
        document.getElementById('sb-modal-confirm').setAttribute('hidden', '');
      });

    // Fermer les modals en cliquant sur l'overlay
    document.querySelectorAll('.sb-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.setAttribute('hidden', '');
          window.SB.setEnAttente = null;
        }
      });
    });
  }

  // ═══ API PUBLIQUE ═══
  return { init };

})();
