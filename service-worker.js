// 📄 Fichier : /service-worker.js
// 🎯 Rôle : Cache les fichiers pour un accès hors-ligne (PWA)

const CACHE_NOM = 'epshub-v1';

// Fichiers à mettre en cache dès l'installation
const FICHIERS_CACHE = [
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
  '/js/app.js'
];

// Installation : on met tout en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NOM).then((cache) => {
      return cache.addAll(FICHIERS_CACHE);
    })
  );
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(
        cles
          .filter((cle) => cle !== CACHE_NOM)
          .map((cle) => caches.delete(cle))
      )
    )
  );
});

// Fetch : on sert depuis le cache si disponible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((reponse) => {
      return reponse || fetch(event.request);
    })
  );
});
