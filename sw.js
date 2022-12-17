const staticCacheName = 'site-static-v1.0';
const dynamicCacheName = 'site-dynamic-v1.0';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html',
];

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Service worker installation
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      // console.log("cashing assets");
      cache.addAll(assets);
    }),
  );
});

// Service worker activation
self.addEventListener('activate', (evt) => {
  // console.log("Activated");
  evt.waitUntil(
    caches.keys().then((keys) =>
      // console.log(keys);
      Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key)),
      )),
  );
});

// Fetch event
self.addEventListener('fetch', (evt) => {
  // console.log("Fetch event", evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheResponse) => (
        cacheResponse
          || fetch(evt.request).then((fetchResponse) => caches.open(dynamicCacheName).then((cache) => {
            cache.put(evt.request.url, fetchResponse.clone());
            limitCacheSize(dynamicCacheName, 20);
            return fetchResponse;
          }))
      ))
      .catch(() => {
        if (evt.request.url.indexOf('.html') > -1) {
          return caches.match('/pages/fallback.html');
        }
      }),
  );
});
