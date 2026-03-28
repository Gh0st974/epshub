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