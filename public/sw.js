/* global SHAKARBAKAR_STATIC_ASSETS */
const CACHE_VERSION = "shakarbakar-pwa-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const OFFLINE_FALLBACK = "/index.html";

importScripts("/pwa-assets.js");

const STATIC_ASSETS = Array.from(
  new Set([
    "/",
    OFFLINE_FALLBACK,
    "/manifest.json",
    "/images/icons/icon-192.png",
    "/images/icons/icon-512.png",
    "/images/icons/icon-maskable-512.png",
    ...(self.SHAKARBAKAR_STATIC_ASSETS || []),
  ]),
);

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(STATIC_ASSETS.map((asset) => new Request(asset, { cache: "reload" }))),
      ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, PAGE_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response && response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);

    if (response && response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return caches.match(OFFLINE_FALLBACK);
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin || request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (
    ["style", "script", "image", "font"].includes(request.destination) ||
    /\.(?:css|js|png|jpg|jpeg|webp|svg|ico|json)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
  }
});
