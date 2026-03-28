// 📄 Fichier : /js/router.js
// 🎯 Rôle : Charge et injecte les modules HTML dans la zone <main>
// 🔧 Structure supportée :
//    - Modules principaux : modules/[nomModule].html
//    - Outils (ex: Chrono) : modules/outils/[nomOutil].html

/**
 * Charge un module HTML et l'injecte dans #app-main
 * @param {string} nomModule - Nom du module (ex: "hub", "chrono")
 */
async function chargerModule(nomModule) {
  const zoneContenu = document.getElementById('app-main');

  try {
    // =============================================
    // 🔹 CHEMINS DES MODULES
    // =============================================

    // 1️⃣ Modules principaux (ex: hub, accueil)
    const cheminsModules = {
      html: `modules/${nomModule}.html`,
      css:  `css/modules/${nomModule}.css`,
      js:   `js/modules/${nomModule}.js`
    };

    // 2️⃣ Outils — structure avec sous-dossier JS
    if (nomModule === 'chrono' || nomModule.startsWith('outil-')) {
      cheminsModules.html = `modules/outils/${nomModule}.html`;
      cheminsModules.css  = `css/modules/outils/${nomModule}.css`;
      // ✅ Point d'entrée dans le sous-dossier /chrono/chrono.js
      cheminsModules.js   = `js/modules/outils/${nomModule}/${nomModule}.js`;
    }
    // =============================================

    // Récupération du HTML du module
    const reponse = await fetch(cheminsModules.html);

    if (!reponse.ok) {
      zoneContenu.innerHTML = `
        <div class="module-vide">
          <p>🚧 Module "<strong>${nomModule}</strong>" bientôt disponible</p>
        </div>`;
      return;
    }

    const contenuHTML = await reponse.text();
    zoneContenu.innerHTML = contenuHTML;

    // Charge le CSS (protégé contre les doublons — styles statiques)
    chargerCSSModule(nomModule, cheminsModules.css);

    // Charge le JS (rechargé à chaque navigation — IIFE à réexécuter)
    chargerJSModule(nomModule, cheminsModules.js);

  } catch (erreur) {
    console.error(`Erreur chargement module ${nomModule} :`, erreur);
    zoneContenu.innerHTML = `
      <div class="module-vide">
        <p>❌ Erreur lors du chargement du module "${nomModule}".</p>
        <p>Vérifiez que les fichiers existent dans :</p>
        <code>modules/${nomModule === 'chrono' ? 'outils/' : ''}${nomModule}.html</code>
      </div>`;
  }
}

/**
 * Charge dynamiquement le CSS d'un module (évite les doublons)
 * @param {string} nomModule
 * @param {string} cheminCSS
 */
function chargerCSSModule(nomModule, cheminCSS) {
  const idCSS = `css-module-${nomModule}`;
  if (document.getElementById(idCSS)) return; // CSS statique = pas besoin de recharger

  fetch(cheminCSS)
    .then(reponse => {
      if (!reponse.ok) throw new Error('CSS introuvable');
      const lien = document.createElement('link');
      lien.id = idCSS;
      lien.rel = 'stylesheet';
      lien.href = cheminCSS;
      document.head.appendChild(lien);
    })
    .catch(() => {
      console.warn(`CSS manquant pour ${nomModule} (${cheminCSS})`);
    });
}

/**
 * Charge dynamiquement le JS d'un module
 * ⚠️ Toujours rechargé pour réexécuter l'IIFE d'initialisation
 * @param {string} nomModule
 * @param {string} cheminJS
 */
function chargerJSModule(nomModule, cheminJS) {
  const idJS = `js-module-${nomModule}`;

  // Supprime l'ancien script pour forcer la réexécution de l'IIFE
  const ancienScript = document.getElementById(idJS);
  if (ancienScript) ancienScript.remove();

  const script = document.createElement('script');
  script.id = idJS;
  script.src = cheminJS;
  script.onerror = () => {
    console.warn(`JS manquant pour ${nomModule} (${cheminJS})`);
  };
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
