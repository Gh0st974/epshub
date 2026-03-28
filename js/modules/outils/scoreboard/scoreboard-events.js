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
    document.getElementById('sb-timer-affichage')
      .addEventListener('click', () => {
        const duree = window.SB.config.timerDuree;
        document.getElementById('sb-input-min').value = Math.floor(duree / 60);
        document.getElementById('sb-input-sec').value = duree % 60;
        document.getElementById('sb-modal-timer').removeAttribute('hidden');
      });

    document.getElementById('sb-timer-play')
      .addEventListener('click', () => SBtimer.togglePlay());

    document.getElementById('sb-timer-reset')
      .addEventListener('click', () => SBtimer.reset());
  }

  // ═══ SETS / PASTILLES ═══
  function ecouterSets() {
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

    // ── Accordéon : ouvrir / fermer ──
    document.getElementById('sb-config-header')
      .addEventListener('click', () => {
        const header = document.getElementById('sb-config-header');
        const corps  = document.getElementById('sb-config-corps');
        const estOuvert = corps.classList.contains('ouvert');

        if (estOuvert) {
          corps.classList.remove('ouvert');
          header.classList.remove('ouvert');
          header.setAttribute('aria-expanded', 'false');
        } else {
          corps.classList.add('ouvert');
          header.classList.add('ouvert');
          header.setAttribute('aria-expanded', 'true');
        }
      });

    // ── Reset global ──
    document.getElementById('sb-btn-reset-global')
      .addEventListener('click', () => {
        if (confirm('Réinitialiser tous les scores ?')) {
          window.SB.resetGlobal();
        }
      });

    // ── Stepper équipes ──
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

    // ── Stepper sets ──
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

    // ── Bouton bonus : ajouter ──
    document.getElementById('sb-btn-ajouter-bonus')
      .addEventListener('click', () => {
        if (window.SB.config.boutonsBonus.length >= 4) return;
        window.SB.config.boutonsBonus.push({ label: '+2', valeur: 2 });
        SBui.rendreConfigBonus();
      });

    // ── Boutons bonus : modifier label / valeur ──
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

    // ── Boutons bonus : supprimer ──
    document.getElementById('sb-bonus-liste')
      .addEventListener('click', (e) => {
        const btn = e.target.closest('.sb-bonus-suppr');
        if (!btn) return;
        const i = parseInt(btn.dataset.indexBonus);
        window.SB.config.boutonsBonus.splice(i, 1);
        SBui.rendreConfigBonus();
      });

    // ── Valider config → ferme l'accordéon ──
    document.getElementById('sb-btn-valider-config')
      .addEventListener('click', () => {
        const { nbEquipes } = window.SB.config;
        for (let i = 0; i < nbEquipes; i++) {
          // Lire le nom
          const inputNom = document.getElementById(`sb-nom-equipe-${i}`);
          if (inputNom) {
            window.SB.config.nomsEquipes[i] = inputNom.value || `Équipe ${i + 1}`;
          }
          // ← AJOUT : lire la couleur
          const inputCouleur = document.getElementById(`sb-couleur-equipe-${i}`);
          if (inputCouleur) {
            window.SB.config.couleurs[i] = inputCouleur.value;
          }
        }
        window.SB.appliquerConfig();

        // Fermer l'accordéon
        document.getElementById('sb-config-corps').classList.remove('ouvert');
        document.getElementById('sb-config-header').classList.remove('ouvert');
        document.getElementById('sb-config-header').setAttribute('aria-expanded', 'false');
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

    // Fermer en cliquant sur l'overlay
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
