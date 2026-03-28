// 📄 Fichier : /js/modules/outils/chrono/chrono-ui.js
// 🎯 Rôle : Génération et mise à jour du DOM pour le module chrono

import { getChronos, getModeActif, formaterTemps } from './chrono.js';

// ============================================================
// SÉLECTEURS
// ============================================================

/** Retourne le conteneur principal du module */
const getConteneur = () => document.getElementById('chrono-app');

// ============================================================
// RENDU PRINCIPAL
// ============================================================

/**
 * Génère le squelette HTML complet du module chrono
 * Appelée une seule fois à l'initialisation
 */
export function rendreVuePrincipale() {
  const conteneur = getConteneur();
  if (!conteneur) return;

  conteneur.innerHTML = `
    <div class="chrono-wrapper">

      <!-- Sélecteur de mode -->
      <div class="chrono-mode-selector">
        <button class="chrono-mode-btn active" data-mode="simple">
          ⏱ Chrono Simple
        </button>
        <button class="chrono-mode-btn" data-mode="multi">
          ⏱⏱ MultiChrono
        </button>
      </div>

      <!-- Zone des chronos -->
      <div class="chrono-zone" id="chrono-zone"></div>

      <!-- Contrôles globaux (mode multi uniquement) -->
      <div class="chrono-globaux" id="chrono-globaux" style="display:none;">
        <button class="btn-global btn-demarrer-tous" id="btn-demarrer-tous">
          ▶ Démarrer tout
        </button>
        <button class="btn-global btn-pauser-tous" id="btn-pauser-tous">
          ⏸ Pause tout
        </button>
        <button class="btn-global btn-reset-tous" id="btn-reset-tous">
          ↺ Reset tout
        </button>
        <button class="btn-global btn-ajouter" id="btn-ajouter-chrono">
          + Ajouter un chrono
        </button>
      </div>

    </div>
  `;
}

// ============================================================
// RENDU DE LA ZONE CHRONOS
// ============================================================

/**
 * Met à jour la zone des chronos selon le mode actif
 * Appelée à chaque changement de mode
 */
export function rendreZoneChronos() {
  const zone = document.getElementById('chrono-zone');
  const globaux = document.getElementById('chrono-globaux');
  if (!zone) return;

  const mode = getModeActif();

  // Affichage des contrôles globaux en mode multi
  if (globaux) {
    globaux.style.display = mode === 'multi' ? 'flex' : 'none';
  }

  // Rendu de chaque chrono
  const chronos = getChronos();
  zone.innerHTML = '';
  chronos.forEach(chrono => {
    zone.appendChild(creerCarteChrono(chrono));
  });

  // Mise à jour du sélecteur de mode
  document.querySelectorAll('.chrono-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

// ============================================================
// CRÉATION D'UNE CARTE CHRONO
// ============================================================

/**
 * Crée l'élément DOM d'un chrono individuel
 * @param {object} chrono - Objet chrono depuis chrono.js
 * @returns {HTMLElement}
 */
export function creerCarteChrono(chrono) {
  const carte = document.createElement('div');
  carte.className = 'chrono-carte';
  carte.dataset.id = chrono.id;

  carte.innerHTML = `
    <div class="chrono-label">${chrono.label}</div>
    <div class="chrono-affichage" id="chrono-temps-${chrono.id}">
      00:00.00
    </div>
    <div class="chrono-boutons">
      <button class="btn-chrono btn-demarrer" data-id="${chrono.id}">
        ▶
      </button>
      <button class="btn-chrono btn-lap" data-id="${chrono.id}">
        ◎ Lap
      </button>
      <button class="btn-chrono btn-reset" data-id="${chrono.id}">
        ↺
      </button>
      ${getModeActif() === 'multi' ? `
      <button class="btn-chrono btn-supprimer" data-id="${chrono.id}">
        ✕
      </button>` : ''}
    </div>
    <ul class="chrono-laps" id="chrono-laps-${chrono.id}"></ul>
  `;

  return carte;
}

// ============================================================
// MISES À JOUR EN TEMPS RÉEL
// ============================================================

/**
 * Met à jour l'affichage du temps pour tous les chronos actifs
 * Appelée à chaque tick du timer
 */
export function mettreAJourAffichages() {
  const chronos = getChronos();
  chronos.forEach(chrono => {
    const el = document.getElementById(`chrono-temps-${chrono.id}`);
    if (el) {
      el.textContent = formaterTemps(chrono.tempsEcoule);
    }
  });
}

/**
 * Met à jour l'état visuel d'un bouton démarrer/pause
 * @param {number} id - ID du chrono
 * @param {boolean} enCours
 */
export function mettreAJourBoutonEtat(id, enCours) {
  const carte = document.querySelector(`.chrono-carte[data-id="${id}"]`);
  if (!carte) return;

  const btn = carte.querySelector('.btn-demarrer');
  if (btn) {
    btn.textContent = enCours ? '⏸' : '▶';
    btn.classList.toggle('en-cours', enCours);
  }

  carte.classList.toggle('chrono-actif', enCours);
}

/**
 * Ajoute un lap dans la liste d'un chrono
 * @param {number} id - ID du chrono
 * @param {number} temps - Temps en ms
 * @param {number} numero - Numéro du lap
 */
export function ajouterLapUI(id, temps, numero) {
  const liste = document.getElementById(`chrono-laps-${id}`);
  if (!liste) return;

  const item = document.createElement('li');
  item.className = 'chrono-lap-item';
  item.textContent = `Lap ${numero} — ${formaterTemps(temps)}`;
  liste.appendChild(item);
}

/**
 * Vide la liste des laps d'un chrono (après reset)
 * @param {number} id
 */
export function viderLapsUI(id) {
  const liste = document.getElementById(`chrono-laps-${id}`);
  if (liste) liste.innerHTML = '';
}

/**
 * Ajoute une carte chrono dans la zone (mode multi, ajout dynamique)
 * @param {object} chrono
 */
export function ajouterCarteChronoUI(chrono) {
  const zone = document.getElementById('chrono-zone');
  if (zone) {
    zone.appendChild(creerCarteChrono(chrono));
  }
}

/**
 * Supprime une carte chrono du DOM
 * @param {number} id
 */
export function supprimerCarteChronoUI(id) {
  const carte = document.querySelector(`.chrono-carte[data-id="${id}"]`);
  if (carte) carte.remove();
}
