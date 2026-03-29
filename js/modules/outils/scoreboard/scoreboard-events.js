// 📄 Fichier : js/modules/outils/scoreboard/scoreboard-events.js
// 🎯 Rôle : Écoute des interactions utilisateur du scoreboard

const sbEvents = (() => {

  /* ── Références locales ── */
  let _etat = null;
  let _actions = null;

  /* ════════════════════════════════
     INIT PRINCIPAL
  ════════════════════════════════ */
  function init(etat, actions) {
    _etat = etat;
    _actions = actions;
    _brancher();
  }

  /* ════════════════════════════════
     REBRANCHEMENT (après config)
  ════════════════════════════════ */
  function rebrancher(etat, actions) {
    _etat = etat;
    _actions = actions;
    _brancher();
  }

  /* ════════════════════════════════
     BRANCHEMENT GLOBAL (délégation)
  ════════════════════════════════ */
  function _brancher() {
    const conteneur = document.querySelector('.sb-container');
    if (!conteneur) return;

    // Supprimer les anciens listeners via cloneNode
    const clone = conteneur.cloneNode(true);
    conteneur.parentNode.replaceChild(clone, conteneur);
    const root = document.querySelector('.sb-container');

    // Délégation unique sur le conteneur
    root.addEventListener('click', _gererClic);

    // Accordéon config
    _brancherAccordeon(root);

    // Timer affichage → modal
    const timerAff = root.querySelector('#sb-timer-affichage');
    if (timerAff) timerAff.addEventListener('click', () => _ouvrirModalTimer(root));

    // Modal timer
    _brancherModalTimer(root);

    // Modal confirm
    _brancherModalConfirm(root);
  }

  /* ════════════════════════════════
     GESTIONNAIRE CLIC DÉLÉGUÉ
  ════════════════════════════════ */
  function _gererClic(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    // ── Pastille set ──
    if (btn.classList.contains('sb-pastille')) {
      _cliquerPastille(btn);
      return;
    }

    // ── Timer ──
    if (btn.id === 'sb-timer-play')  { _actions.lancerTimer(); return; }
    if (btn.id === 'sb-timer-pause') { _actions.pauserTimer(); return; }
    if (btn.id === 'sb-timer-reset') { _actions.resetTimer(); return; }

    // ── Suivante ──
    if (btn.id === 'sb-btn-suivante') { _cliquerSuivante(); return; }

    // ── Reset global ──
    if (btn.id === 'sb-btn-reset-global') { _actions.resetGlobal(); return; }

    // ── Score − ──
    if (btn.classList.contains('sb-carte-btn-moins')) {
      _actions.modifierScore(+btn.dataset.equipe, -1);
      return;
    }

    // ── Score + ──
    if (btn.classList.contains('sb-carte-btn-plus')) {
      _actions.modifierScore(+btn.dataset.equipe, +1);
      return;
    }

    // ── Bonus ──
    if (btn.classList.contains('sb-carte-btn-bonus')) {
      const eIdx = +btn.dataset.equipe;
      const bIdx = +btn.dataset.bonus;
      const valeur = _etat.bonus[bIdx]?.valeur ?? 0;
      _actions.modifierScore(eIdx, valeur);
      return;
    }

    // ── Config : équipes − ──
    if (btn.id === 'sb-equipes-moins') { _changerNbEquipes(-1); return; }
    if (btn.id === 'sb-equipes-plus')  { _changerNbEquipes(+1); return; }

    // ── Config : sets − + ──
    if (btn.id === 'sb-sets-moins') { _changerNbSets(-1); return; }
    if (btn.id === 'sb-sets-plus')  { _changerNbSets(+1); return; }

    // ── Ajouter bonus ──
    if (btn.id === 'sb-btn-ajouter-bonus') { _ajouterBonus(); return; }

    // ── Supprimer bonus ──
    if (btn.classList.contains('sb-bonus-btn-suppr')) {
      _supprimerBonus(+btn.dataset.idx);
      return;
    }

    // ── Appliquer config ──
    if (btn.id === 'sb-btn-valider-config') { _appliquerConfig(); return; }
  }

  /* ════════════════════════════════
     PASTILLES / SETS
  ════════════════════════════════ */
  function _cliquerPastille(btn) {
    const idx = +btn.dataset.idx;
    if (idx === _etat.setActif) return;
    _actions.changerSet(idx);
  }

  function _cliquerSuivante() {
    const suivant = _etat.setActif + 1;
    if (suivant >= _etat.nbSets) {
      // Revenir au début
      _ouvrirModalConfirm('Revenir au set 1 ?', () => _actions.changerSet(0));
    } else {
      _actions.changerSet(suivant);
    }
  }

  /* ════════════════════════════════
     CONFIG
  ════════════════════════════════ */
  function _changerNbEquipes(delta) {
    const val = Math.max(2, Math.min(6, _etat.equipes.length + delta));
    const el = document.getElementById('sb-equipes-val');
    if (el) el.textContent = val;

    // Ajuster le tableau d'équipes temporaire
    const couleurs = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c'];
    while (_etat.equipes.length < val) {
      const idx = _etat.equipes.length;
      _etat.equipes.push({ nom: `Équipe ${String.fromCharCode(65 + idx)}`, couleur: couleurs[idx] });
    }
    while (_etat.equipes.length > val) _etat.equipes.pop();

    sbUI.genererConfigNoms(_etat.equipes);
  }

  function _changerNbSets(delta) {
    const val = Math.max(1, Math.min(5, _etat.nbSets + delta));
    _etat.nbSets = val;
    const el = document.getElementById('sb-sets-val');
    if (el) el.textContent = val;
  }

  function _ajouterBonus() {
    _etat.bonus.push({ nom: '+1', valeur: 1 });
    sbUI.ajouterLigneBonus(_etat.bonus);
  }

  function _supprimerBonus(idx) {
    _etat.bonus.splice(idx, 1);
    sbUI.genererConfigBonus(_etat.bonus);
  }

  function _appliquerConfig() {
    // Lire les noms et couleurs depuis les inputs
    const equipes = _etat.equipes.map((_, idx) => {
      const nomInput = document.getElementById(`sb-nom-${idx}`);
      const couleurInput = document.getElementById(`sb-couleur-${idx}`);
      return {
        nom: nomInput?.value || `Équipe ${idx + 1}`,
        couleur: couleurInput?.value || '#e74c3c'
      };
    });

    // Lire les bonus
    const bonus = [];
    document.querySelectorAll('.sb-bonus-ligne').forEach((ligne) => {
      const nom = ligne.querySelector('.sb-bonus-input-nom')?.value || '';
      const val = parseInt(ligne.querySelector('.sb-bonus-input-val')?.value) || 0;
      bonus.push({ nom, valeur: val });
    });

    const nbSets = parseInt(document.getElementById('sb-sets-val')?.textContent) || 3;

    _actions.appliquerConfig({ equipes, nbSets, bonus });

    // Fermer l'accordéon
    const corps = document.getElementById('sb-config-corps');
    if (corps) corps.hidden = true;
  }

  /* ════════════════════════════════
     ACCORDÉON
  ════════════════════════════════ */
  function _brancherAccordeon(root) {
    const header = root.querySelector('#sb-config-header');
    const corps = root.querySelector('#sb-config-corps');
    const chevron = root.querySelector('#sb-config-chevron');
    if (!header || !corps) return;

    header.addEventListener('click', () => {
      const ouvert = !corps.hidden;
      corps.hidden = ouvert;
      if (chevron) chevron.style.transform = ouvert ? '' : 'rotate(180deg)';
    });
  }

  /* ════════════════════════════════
     MODAL TIMER
  ════════════════════════════════ */
  function _ouvrirModalTimer(root) {
    const modal = root.querySelector('#sb-modal-timer');
    if (modal) modal.hidden = false;
  }

  function _brancherModalTimer(root) {
    const btnAnnuler = root.querySelector('#sb-timer-annuler');
    const btnValider = root.querySelector('#sb-timer-valider');
    const modal = root.querySelector('#sb-modal-timer');
    if (!modal) return;

    if (btnAnnuler) btnAnnuler.addEventListener('click', () => { modal.hidden = true; });
    if (btnValider) btnValider.addEventListener('click', () => {
      const min = parseInt(root.querySelector('#sb-input-min')?.value) || 0;
      const sec = parseInt(root.querySelector('#sb-input-sec')?.value) || 0;
      _actions.configurerTimer(min, sec);
      modal.hidden = true;
    });

    // Clic overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  /* ════════════════════════════════
     MODAL CONFIRM SET
  ════════════════════════════════ */
  let _callbackConfirm = null;

  function _ouvrirModalConfirm(texte, callback) {
    const modal = document.querySelector('#sb-modal-confirm');
    const texteEl = document.querySelector('#sb-confirm-texte');
    if (!modal) return;
    if (texteEl) texteEl.textContent = texte;
    _callbackConfirm = callback;
    modal.hidden = false;
  }

  function _brancherModalConfirm(root) {
    const modal = root.querySelector('#sb-modal-confirm');
    const btnOui = root.querySelector('#sb-confirm-oui');
    const btnNon = root.querySelector('#sb-confirm-non');
    if (!modal) return;

    if (btnNon) btnNon.addEventListener('click', () => { modal.hidden = true; });
    if (btnOui) btnOui.addEventListener('click', () => {
      modal.hidden = true;
      if (_callbackConfirm) _callbackConfirm();
      _callbackConfirm = null;
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  /* ── Export ── */
  return { init, rebrancher };

})();
