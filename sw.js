const staticCacheName = "site-static";
const assets = [
  "/",
  "/manifest.json",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];
// Service worker installation
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("cashing assets");
      cache.addAll(assets);
    })
  );
});

// Service worker activation
self.addEventListener("activate", (evt) => {
  console.log("Activated");
});

// Fetch event
self.addEventListener("fetch", (evt) => {
  // console.log("Fetch event", evt);
  evt.respondWith(
    caches.match(evt.request).then((cacheResponse) => {
      return cacheResponse || fetch(evt.request);
    })
  );
});
