// 📄 Fichier : /service-worker.js
// 🎯 Rôle : Cache les fichiers pour un usage offline

const CACHE_NOM = 'epshub-v1';

// Fichiers à mettre en cache dès l'installation
const FICHIERS_A_CACHER = [
  '/epshub/index.html',
  '/epshub/manifest.json',
  '/epshub/css/main.css',
  '/epshub/js/app.js',
  '/epshub/js/router.js',
  '/epshub/modules/hub.html',
  '/epshub/css/modules/hub.css'
];

// Installation : on met tout en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NOM).then((cache) => {
      return cache.addAll(FICHIERS_A_CACHER);
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

// Interception des requêtes : cache en priorité
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((reponseCache) => {
      // Si trouvé en cache → on retourne le cache
      if (reponseCache) return reponseCache;
      // Sinon → on va chercher sur le réseau
      return fetch(event.request);
    })
  );
});
