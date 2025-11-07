// Cache එකේ නම සහ version එක
const CACHE_NAME = 'dream-path-v1';

// Offline cache කළ යුතු files
// අපේ JS සහ CSS සියල්ල index.html එකේම ඇති නිසා වෙනම cache කිරීම අනවශ්‍යයි
const urlsToCache = [
  './',               // Root (folder එක)
  './index.html',     // ප්‍රධාන HTML file එක
  './manifest.json'   // App manifest file එක
];

// 1. Install Event: Service worker එක install කරන විට cache එක සාදයි
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache', err);
      })
  );
});

// 2. Fetch Event: App එකෙන් කරන ඕනෑම request එකක් (උදා: page refresh) අල්ලා ගනී
self.addEventListener('fetch', event => {
  event.respondWith(
    // මුලින්ම cache එකේ බලනවා
    caches.match(event.request)
      .then(response => {
        // Cache එකේ තිබ්බොත්, ඒක return කරනවා (offline වැඩ කරයි)
        if (response) {
          return response;
        }
        
        // Cache එකේ නැත්නම්, internet එකෙන් අලුතින් fetch කරනවා
        return fetch(event.request);
      }
    )
  );
});

// 3. Activate Event: (Optional - පරණ cache අයින් කිරීමට)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});