// 📄 Fichier : /js/modules/outils/chrono/chrono-ui.js
// 🎯 Rôle : Génération et mise à jour de l'interface du chronomètre

// ─── Afficher le chrono simple ────────────────────────────────────
function afficherChronoSimple() {
  const zone = document.getElementById('chrono-contenu');
  zone.innerHTML = `
    <div class="chrono-simple">
      <div class="chrono-affichage" id="chrono-temps">00:00:00</div>
      <div class="chrono-boutons">
        <button class="chrono-btn chrono-btn--principal" id="btn-start-stop">
          ▶ Démarrer
        </button>
        <button class="chrono-btn chrono-btn--secondaire" id="btn-reset">
          🔁 Reset
        </button>
      </div>
      <button class="chrono-btn chrono-btn--split" id="btn-split" disabled>
        📍 Split
      </button>
      <div class="chrono-splits" id="liste-splits">
        <p class="chrono-splits__vide">Aucun split enregistré</p>
      </div>
    </div>
  `;
}

// ─── Mettre à jour l'affichage du temps (simple) ─────────────────
function mettreAJourAffichageSimple(ms) {
  const el = document.getElementById('chrono-temps');
  if (el) el.textContent = formaterTemps(ms);
}

// ─── Mettre à jour les boutons (simple) ──────────────────────────
function mettreAJourBoutonsSimple(enCours) {
  const btnStart = document.getElementById('btn-start-stop');
  const btnSplit = document.getElementById('btn-split');
  if (btnStart) {
    btnStart.textContent = enCours ? '⏸ Pause' : '▶ Reprendre';
    btnStart.classList.toggle('chrono-btn--pause', enCours);
  }
  if (btnSplit) btnSplit.disabled = !enCours;
}

// ─── Ajouter un split dans la liste (simple) ─────────────────────
function ajouterSplitUI(index, ms) {
  const liste = document.getElementById('liste-splits');
  const vide = liste.querySelector('.chrono-splits__vide');
  if (vide) vide.remove();

  const item = document.createElement('div');
  item.className = 'chrono-split__item';
  item.textContent = `#${index} — ${formaterTemps(ms)}`;
  liste.appendChild(item);
  liste.scrollTop = liste.scrollHeight;
}

// ─── Afficher le mode multi ───────────────────────────────────────
function afficherChronoMulti(chronos) {
  const zone = document.getElementById('chrono-contenu');
  zone.innerHTML = `
    <div class="chrono-multi">
      <div class="chrono-multi__globaux">
        <button class="chrono-btn chrono-btn--global" id="btn-tous-start">
          ▶▶ Tous démarrer
        </button>
        <button class="chrono-btn chrono-btn--global" id="btn-tous-stop">
          ⏹ Tous stopper
        </button>
        <button class="chrono-btn chrono-btn--global" id="btn-tous-reset">
          🔁 Tous reset
        </button>
      </div>
      <div class="chrono-multi__grille" id="grille-multi"></div>
      <button class="chrono-btn chrono-btn--ajouter" id="btn-ajouter-chrono">
        ➕ Ajouter un chrono
      </button>
    </div>
  `;
  // Rendre chaque carte
  chronos.forEach(c => ajouterCarteChronoUI(c));
}

// ─── Ajouter une carte chrono individuelle ────────────────────────
function ajouterCarteChronoUI(chrono) {
  const grille = document.getElementById('grille-multi');
  if (!grille) return;

  const carte = document.createElement('div');
  carte.className = 'chrono-carte';
  carte.id = `carte-chrono-${chrono.id}`;
  carte.innerHTML = `
    <input class="chrono-carte__nom" 
           id="nom-chrono-${chrono.id}"
           value="${chrono.nom}" 
           maxlength="12" />
    <div class="chrono-carte__temps" id="temps-chrono-${chrono.id}">
      00:00:00
    </div>
    <div class="chrono-carte__boutons">
      <button class="chrono-btn chrono-btn--sm" 
              data-action="start" data-id="${chrono.id}">▶</button>
      <button class="chrono-btn chrono-btn--sm" 
              data-action="stop" data-id="${chrono.id}">⏹</button>
      <button class="chrono-btn chrono-btn--sm" 
              data-action="split" data-id="${chrono.id}">📍</button>
      <button class="chrono-btn chrono-btn--sm chrono-btn--danger" 
              data-action="reset" data-id="${chrono.id}">🔁</button>
    </div>
    <div class="chrono-carte__splits" id="splits-chrono-${chrono.id}">
      <p class="chrono-splits__vide">Aucun split</p>
    </div>
  `;
  grille.appendChild(carte);
}

// ─── Mettre à jour le temps d'un chrono individuel ───────────────
function mettreAJourTempsMulti(chrono) {
  const el = document.getElementById(`temps-chrono-${chrono.id}`);
  if (el) el.textContent = formaterTemps(obtenirTempsMs(chrono));
}

// ─── Ajouter un split dans une carte multi ────────────────────────
function ajouterSplitCarteUI(chrono) {
  const liste = document.getElementById(`splits-chrono-${chrono.id}`);
  if (!liste) return;
  const vide = liste.querySelector('.chrono-splits__vide');
  if (vide) vide.remove();

  const item = document.createElement('div');
  item.className = 'chrono-split__item';
  item.textContent = `#${chrono.splits.length} — ${formaterTemps(
    chrono.splits[chrono.splits.length - 1]
  )}`;
  liste.appendChild(item);
  liste.scrollTop = liste.scrollHeight;
}

// ─── Reset visuel d'une carte ─────────────────────────────────────
function resetCarteUI(chrono) {
  const temps = document.getElementById(`temps-chrono-${chrono.id}`);
  if (temps) temps.textContent = '00:00:00';
  const splits = document.getElementById(`splits-chrono-${chrono.id}`);
  if (splits) splits.innerHTML = '<p class="chrono-splits__vide">Aucun split</p>';
}

// ─── Reset visuel du chrono simple ───────────────────────────────
function resetSimpleUI() {
  const temps = document.getElementById('chrono-temps');
  if (temps) temps.textContent = '00:00:00';
  const splits = document.getElementById('liste-splits');
  if (splits) splits.innerHTML = '<p class="chrono-splits__vide">Aucun split enregistré</p>';
  const btnStart = document.getElementById('btn-start-stop');
  if (btnStart) {
    btnStart.textContent = '▶ Démarrer';
    btnStart.classList.remove('chrono-btn--pause');
  }
  const btnSplit = document.getElementById('btn-split');
  if (btnSplit) btnSplit.disabled = true;
}
