// 📄 Fichier : /js/modules/outils/scoreboard/scoreboard-events.js
// 🎯 Rôle : Gestion des interactions utilisateur du scoreboard


// ═══════════════════════════════════════════
//  INITIALISATION
// ═══════════════════════════════════════════

/**
 * Initialise le scoreboard dans un conteneur donné
 * @param {HTMLElement} conteneur - Élément DOM cible
 */
function initialiserScoreboard(conteneur) {
  rendreScoreboard(conteneur);
  attacherEvenements(conteneur);
}

// ═══════════════════════════════════════════
//  DÉLÉGATION D'ÉVÉNEMENTS
// ═══════════════════════════════════════════

/**
 * Attache un seul listener sur le conteneur (délégation)
 * @param {HTMLElement} conteneur
 */
function attacherEvenements(conteneur) {
  conteneur.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    traiterAction(action, btn.dataset);
  });
}

// ═══════════════════════════════════════════
//  TRAITEMENT DES ACTIONS
// ═══════════════════════════════════════════

/**
 * Dispatche l'action vers la bonne fonction
 * @param {string} action - Identifiant de l'action
 * @param {DOMStringMap} data - Dataset du bouton cliqué
 */
function traiterAction(action, data) {
  switch (action) {

    // ── Points ──────────────────────────────
    case 'point':
      ajouterPoints(data.equipe, parseInt(data.valeur, 10));
      mettreAJourAffichage();
      break;

    // ── Reset score du set ──────────────────
    case 'resetScore':
      if (confirmerAction('Remettre les scores à zéro ?')) {
        resetScores();
        mettreAJourAffichage();
      }
      break;

    // ── Valider le set ──────────────────────
    case 'validerSet': {
      const gagnant = validerSet();
      if (gagnant === null) {
        afficherNotification('Égalité — set non validé');
      } else {
        afficherNotification(`✅ Set remporté par ${gagnant.nom} !`);
      }
      mettreAJourAffichage();
      break;
    }

    // ── Reset complet ───────────────────────
    case 'resetTout':
      if (confirmerAction('Tout remettre à zéro ?')) {
        resetComplet();
        rechargerInterface();
      }
      break;

    // ── Mode 2 équipes ──────────────────────
    case 'mode': {
      const val = parseInt(data.valeur, 10);
      if (val === 2) {
        changerNbEquipes(2);
      } else {
        changerNbEquipes(3); // par défaut 3 en multi
      }
      rechargerInterface();
      break;
    }

    // ── Nombre de sets ──────────────────────
    case 'sets':
      changerNbSets(parseInt(data.valeur, 10));
      rechargerInterface();
      break;

    // ── Nombre d'équipes (multi) ────────────
    case 'nbEquipes':
      changerNbEquipes(parseInt(data.valeur, 10));
      rechargerInterface();
      break;

    // ── Chrono : démarrer ───────────────────
    case 'chronoPlay': {
      const input = document.getElementById('chrono-input-duree');
      const minutes = input ? parseInt(input.value, 10) : 5;
      demarrerChrono(minutes);
      break;
    }

    // ── Chrono : pause ──────────────────────
    case 'chronoPause':
      pauseChrono();
      break;

    // ── Chrono : reset ──────────────────────
    case 'chronoReset': {
      const input = document.getElementById('chrono-input-duree');
      const minutes = input ? parseInt(input.value, 10) : 5;
      resetChrono(minutes);
      break;
    }

    default:
      console.warn(`⚠️ Action inconnue : ${action}`);
  }
}

// ═══════════════════════════════════════════
//  UTILITAIRES UI
// ═══════════════════════════════════════════

/**
 * Recharge l'interface complète dans le même conteneur
 */
function rechargerInterface() {
  const conteneur = document.getElementById('scoreboard-wrapper')?.parentElement;
  if (!conteneur) return;
  initialiserScoreboard(conteneur);
}

/**
 * Demande confirmation à l'utilisateur
 * @param {string} message
 * @returns {boolean}
 */
function confirmerAction(message) {
  return window.confirm(message);
}

/**
 * Affiche une notification temporaire
 * @param {string} texte
 */
function afficherNotification(texte) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position:fixed; top:20px; left:50%; transform:translateX(-50%);
    background:#1e1e2e; color:#fff; padding:12px 24px;
    border-radius:10px; font-weight:700; font-size:1rem;
    z-index:9999; border:2px solid #4a9eff;
    animation: fadeIn 0.3s ease;
  `;
  notif.textContent = texte;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
}

