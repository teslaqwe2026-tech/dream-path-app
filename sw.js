// Cache එකේ නම සහ අලුත් version එක
const CACHE_NAME = 'dream-path-v2'; // v1 සිට v2 ට වෙනස් කළා

// Offline cache කළ යුතු files
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install Event: Service worker එක install කරන විට cache එක සාදයි
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Event: App එකෙන් කරන request අල්ලා ගනී
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache එකේ තිබ්බොත්, ඒක return කරනවා
        if (response) {
          return response;
        }
        // Cache එකේ නැත්නම්, internet එකෙන් අලුතින් fetch කරනවා
        return fetch(event.request);
      }
    )
  );
});

// 3. Activate Event: අලුත් version එක activate වූ විට, පරණ cache (v1) මකා දමයි
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // v2 විතරක් තියාගන්න
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // cacheWhitelist එකේ නැති (v1 වැනි) පරණ cache මකා දමන්න
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});