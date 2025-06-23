const CACHE_NAME = "story-app-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // "/style.css",
  // "/main.js",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache assets:", error);
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
          ),
        ),
      clients.claim(),
    ]).then(() => {
      console.log("Service Worker: Activated and old caches cleared");
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin === "https://story-api.dicoding.dev") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            error: true,
            message: "Gagal memuat data: Anda sedang offline.",
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }),
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/index.html")
        .then((response) => response || fetch(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }),
  );
});

self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event received");
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "Ada update terbaru!",
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Notifikasi Story App",
      options,
    ),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.notification.data);
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const urlToOpen =
          event.notification.data && event.notification.data.url
            ? event.notification.data.url
            : "/";

        let notificationOrigin = "";
        try {
          notificationOrigin = new URL(urlToOpen, self.location.origin).origin;
        } catch (e) {
          console.error(
            "Service Worker: Invalid URL in notification data, falling back to root.",
            e,
          );
          notificationOrigin = self.location.origin;
        }

        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.startsWith(notificationOrigin) && "focus" in client) {
            matchingClient = client;
            break;
          }
        }

        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
