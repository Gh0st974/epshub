// 📄 Fichier : /service-worker.js
// 🎯 Rôle : Cache les fichiers pour un accès hors-ligne (PWA)

// ============================================================
// VERSION DU CACHE
// ============================================================
// 📌 Incrémenter la version à chaque déploiement majeur
//    pour forcer la mise à jour du cache sur les appareils
// ============================================================

const CACHE_NOM = 'epshub-v2';

// ============================================================
// FICHIERS CORE — Toujours en cache
// ============================================================

const FICHIERS_CORE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/reset.css',
  '/css/layout.css',
  '/css/components/hub.css',
  '/css/responsive.css',
  '/js/config.js',
  '/js/ui.js',
  '/js/router.js',
  '/js/app.js',
];

// ============================================================
// FICHIERS MODULES — Ajouter ici les fichiers de chaque module
// ============================================================
// 📌 FORMAT : '/js/modules/[categorie]/[module]/[fichier].js'
// 📌 Ajouter aussi le CSS : '/css/components/[module].css'
// ============================================================

const FICHIERS_MODULES = [
  // --- Outil : Chrono ---
  '/css/components/chrono.css',
  '/js/modules/outils/chrono/chrono.js',
  '/js/modules/outils/chrono/chrono-timer.js',
  '/js/modules/outils/chrono/chrono-ui.js',
  '/js/modules/outils/chrono/chrono-events.js',

  // --- Outil : Score (à venir) ---
  // '/css/components/score.css',
  // '/js/modules/outils/score/score.js',

  // --- CA1 (à venir) ---
  // '/css/components/ca1.css',
  // '/js/modules/ca1/ca1.js',
];

// ============================================================
// LISTE COMPLÈTE DES FICHIERS À METTRE EN CACHE
// ============================================================

const FICHIERS_CACHE = [
  ...FICHIERS_CORE,
  ...FICHIERS_MODULES,
];

// ============================================================
// INSTALLATION — Mise en cache initiale
// ============================================================

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NOM).then((cache) => {
      console.log('📦 Mise en cache des fichiers EPSHub...');
      return cache.addAll(FICHIERS_CACHE);
    })
  );
});

// ============================================================
// ACTIVATION — Nettoyage des anciens caches
// ============================================================

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(
        cles
          .filter((cle) => cle !== CACHE_NOM)
          .map((cle) => {
            console.log(`🗑️ Suppression ancien cache : ${cle}`);
            return caches.delete(cle);
          })
      )
    )
  );
});

// ============================================================
// FETCH — Stratégie Cache First
// ============================================================

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((reponse) => {
      return reponse || fetch(event.request);
    })
  );
});
