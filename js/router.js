// 📄 Fichier : /js/router.js
// 🎯 Rôle : Charge et injecte les modules HTML dans la zone <main>

/**
 * Charge un module HTML et l'injecte dans #app-main
 * @param {string} nomModule - Nom du module (ex: "hub", "chrono")
 */
async function chargerModule(nomModule) {
  const zoneContenu = document.getElementById('app-main');

  try {
    // Récupération du fichier HTML du module
    const reponse = await fetch(`modules/${nomModule}.html`);

    // Si le fichier n'existe pas encore
    if (!reponse.ok) {
      zoneContenu.innerHTML = `
        <div class="module-vide">
          <p>🚧 Module "<strong>${nomModule}</strong>" bientôt disponible</p>
        </div>`;
      return;
    }

    const contenuHTML = await reponse.text();
    zoneContenu.innerHTML = contenuHTML;

    // Charge le CSS spécifique au module si disponible
    chargerCSSModule(nomModule);

    // Charge le JS spécifique au module si disponible
    chargerJSModule(nomModule);

  } catch (erreur) {
    console.error(`Erreur chargement module ${nomModule} :`, erreur);
    zoneContenu.innerHTML = `
      <div class="module-vide">
        <p>❌ Erreur lors du chargement du module.</p>
      </div>`;
  }
}

/**
 * Charge dynamiquement le CSS d'un module (évite les doublons)
 * @param {string} nomModule
 */
function chargerCSSModule(nomModule) {
  const idCSS = `css-module-${nomModule}`;
  if (document.getElementById(idCSS)) return; // Déjà chargé

  const lien = document.createElement('link');
  lien.id = idCSS;
  lien.rel = 'stylesheet';
  lien.href = `css/modules/${nomModule}.css`;
  document.head.appendChild(lien);
}

/**
 * Charge dynamiquement le JS d'un module (évite les doublons)
 * @param {string} nomModule
 */
function chargerJSModule(nomModule) {
  const idJS = `js-module-${nomModule}`;
  if (document.getElementById(idJS)) return; // Déjà chargé

  const script = document.createElement('script');
  script.id = idJS;
  script.src = `js/modules/${nomModule}.js`;
  script.onerror = () => {}; // Silencieux si pas de JS pour ce module
  document.body.appendChild(script);
}

/**
 * Met à jour l'état actif des boutons de navigation
 * @param {string} nomModule
 */
function mettreAJourNav(nomModule) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.module === nomModule) {
      btn.classList.add('active');
    }
  });
}
