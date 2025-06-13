const CACHE_NAME = "story-app-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/src/style.css",
  "/src/main.js",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  // Tambahkan file static lain jika perlu
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Tambahkan ini
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      ),
      clients.claim() // Tambahkan ini
    ])
  );
});


// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        // Misalnya fallback ke halaman offline atau kosong
        return caches.match("/index.html");
      });
    })
  );
});

self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "Ada update terbaru!",
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png"
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notifikasi", options)
  );
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
	clients.openWindow(event.notification.data.url || "/")
  );
});

