// 📄 Fichier : js/modules/scoreboard/scoreboard-config.js
// 🎯 Rôle : Logique de lecture et construction de la configuration

const ScoreboardConfig = (function () {

  // Couleurs proposées par défaut pour les équipes
  const COULEURS_DEFAUT = [
    '#2ecc71', '#3498db', '#e67e22',
    '#9b59b6', '#e74c3c', '#1abc9c',
  ];

  // ══════════════════════════════════════
  // LECTURE DE LA CONFIG DEPUIS LE DOM
  // ══════════════════════════════════════

  /** Lit toutes les lignes d'équipes dans le panneau de config */
  function lireEquipesConfig() {
    const lignes = document.querySelectorAll('.scoreboard-config-equipe-ligne');
    const equipes = [];

    lignes.forEach(ligne => {
      const inputNom    = ligne.querySelector('input[type="text"]');
      const inputColor  = ligne.querySelector('.scoreboard-color-picker');
      equipes.push({
        nom:    inputNom   ? inputNom.value.trim()   : 'Équipe',
        couleur: inputColor ? inputColor.value        : '#2ecc71',
      });
    });

    return equipes;
  }

  /** Lit toutes les lignes de bonus dans le panneau de config */
  function lireBonusConfig() {
    const lignes = document.querySelectorAll('.scoreboard-config-bonus-ligne');
    const bonus = [];

    lignes.forEach(ligne => {
      const inputValeur  = ligne.querySelector('input[type="number"]');
      const inputLibelle = ligne.querySelector('input[type="text"]');
      const valeur = parseInt(inputValeur ? inputValeur.value : '0', 10);
      const libelle = inputLibelle ? inputLibelle.value.trim() : '';

      if (valeur > 0 && libelle !== '') {
        bonus.push({ valeur, libelle });
      }
    });

    return bonus;
  }

  /** Lit la configuration des périodes */
  function lirePeriodesConfig() {
    const actives  = document.getElementById('scoreboard-config-periodes-actives').checked;
    const nbInput  = document.getElementById('scoreboard-config-nb-periodes');
    const nomInput = document.getElementById('scoreboard-config-nom-periode');

    return {
      actives,
      total: actives ? parseInt(nbInput.value, 10) || 2 : 2,
      nom:   actives ? (nomInput.value.trim() || 'Période') : 'Période',
    };
  }

  /** Construit l'objet de configuration complet depuis le DOM */
  function lireConfigurationComplete() {
    return {
      equipes:  lireEquipesConfig(),
      bonus:    lireBonusConfig(),
      periodes: lirePeriodesConfig(),
    };
  }

  // ══════════════════════════════════════
  // GÉNÉRATION DES LIGNES DANS LE DOM
  // ══════════════════════════════════════

  /** Génère une ligne HTML pour une équipe en config */
  function genererLigneEquipe(nom, couleur, index) {
    const ligne = document.createElement('div');
    ligne.className = 'scoreboard-config-equipe-ligne';

    // Color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'scoreboard-color-picker';
    colorPicker.value = couleur || COULEURS_DEFAUT[index % COULEURS_DEFAUT.length];

    // Input nom
    const inputNom = document.createElement('input');
    inputNom.type = 'text';
    inputNom.value = nom || `Équipe ${String.fromCharCode(65 + index)}`;
    inputNom.maxLength = 30;
    inputNom.placeholder = `Équipe ${String.fromCharCode(65 + index)}`;

    // Bouton supprimer (désactivé si 2 équipes restantes)
    const btnSupprimer = document.createElement('button');
    btnSupprimer.className = 'scoreboard-btn-supprimer';
    btnSupprimer.innerHTML = '✕';
    btnSupprimer.setAttribute('aria-label', 'Supprimer cette équipe');
    btnSupprimer.addEventListener('click', () => {
      const toutes = document.querySelectorAll('.scoreboard-config-equipe-ligne');
      if (toutes.length > 2) {
        ligne.remove();
      }
    });

    ligne.appendChild(colorPicker);
    ligne.appendChild(inputNom);
    ligne.appendChild(btnSupprimer);

    return ligne;
  }

  /** Génère une ligne HTML pour un bonus en config */
  function genererLigneBonus(valeur, libelle) {
    const ligne = document.createElement('div');
    ligne.className = 'scoreboard-config-bonus-ligne';

    // Input valeur
    const inputValeur = document.createElement('input');
    inputValeur.type = 'number';
    inputValeur.min = '1';
    inputValeur.max = '99';
    inputValeur.value = valeur || '';
    inputValeur.placeholder = 'Pts';
    inputValeur.className = 'scoreboard-input-number';

    // Input libellé
    const inputLibelle = document.createElement('input');
    inputLibelle.type = 'text';
    inputLibelle.value = libelle || '';
    inputLibelle.placeholder = 'Ex : Essai, Panier à 3pts...';
    inputLibelle.maxLength = 30;

    // Bouton supprimer
    const btnSupprimer = document.createElement('button');
    btnSupprimer.className = 'scoreboard-btn-supprimer';
    btnSupprimer.innerHTML = '✕';
    btnSupprimer.setAttribute('aria-label', 'Supprimer ce bonus');
    btnSupprimer.addEventListener('click', () => ligne.remove());

    ligne.appendChild(inputValeur);
    ligne.appendChild(inputLibelle);
    ligne.appendChild(btnSupprimer);

    return ligne;
  }

  // ══════════════════════════════════════
  // PRÉ-REMPLISSAGE DU PANNEAU DE CONFIG
  // ══════════════════════════════════════

  /** Remplit le panneau de config avec l'état actuel */
  function preRemplirConfig() {
    const { equipes, bonus, periodes } = ScoreboardApp.getEtat();

    // Équipes
    const listeEquipes = document.getElementById('scoreboard-config-equipes-liste');
    listeEquipes.innerHTML = '';
    equipes.forEach((equipe, index) => {
      listeEquipes.appendChild(genererLigneEquipe(equipe.nom, equipe.couleur, index));
    });

    // Bonus
    const listeBonus = document.getElementById('scoreboard-config-bonus-liste');
    listeBonus.innerHTML = '';
    bonus.forEach(b => {
      listeBonus.appendChild(genererLigneBonus(b.valeur, b.libelle));
    });

    // Périodes
    const checkPeriodes = document.getElementById('scoreboard-config-periodes-actives');
    checkPeriodes.checked = periodes.actives;
    document.getElementById('scoreboard-config-nb-periodes').value = periodes.total;
    document.getElementById('scoreboard-config-nom-periode').value = periodes.nom;

    const detail = document.getElementById('scoreboard-config-periodes-detail');
    detail.hidden = !periodes.actives;
  }

  // ══════════════════════════════════════
  // EXPOSITION
  // ══════════════════════════════════════
  return {
    lireConfigurationComplete,
    genererLigneEquipe,
    genererLigneBonus,
    preRemplirConfig,
  };

})();
