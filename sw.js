/* ============================================================================
   Service Worker — Sproochentest A2 Coach
   - Rend l'app installable et utilisable hors-ligne (PWA)
   - Détecte les mises à jour et prévient l'app via postMessage('update-ready')
   ============================================================================
   IMPORTANT : incrémente CACHE_VERSION à chaque déploiement pour que les
   utilisateurs reçoivent la nouvelle version (sinon le cache sert l'ancienne).
*/
const CACHE_VERSION = 'v1';
const CACHE_NAME = 'sproochentest-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-64.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/favicon-64.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => {}) // ne bloque pas l'installation si une ressource optionnelle manque
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldKeys = keys.filter((k) => k.startsWith('sproochentest-') && k !== CACHE_NAME);
    const isUpdate = oldKeys.length > 0;

    await Promise.all(oldKeys.map((k) => caches.delete(k)));
    await self.clients.claim();

    if (isUpdate) {
      // laisse un marqueur que la page peut relire même si elle n'écoutait pas encore
      const cache = await caches.open(CACHE_NAME);
      const markerUrl = new URL('__update_ready__', self.location.href).href;
      await cache.put(markerUrl, new Response('1'));

      const clientsList = await self.clients.matchAll({ includeUncontrolled: true });
      clientsList.forEach((client) => client.postMessage({ type: 'update-ready' }));
    }
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // laisse passer les requêtes externes (ex. polices)

  // Navigation (chargement de page) : réseau d'abord, cache en secours (offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets statiques : cache d'abord, réseau en secours + mise à jour silencieuse
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting' || (event.data && event.data.type === 'skipWaiting')) {
    self.skipWaiting();
  }
});
