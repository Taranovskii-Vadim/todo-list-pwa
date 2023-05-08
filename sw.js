const CACHE_VERSION = "app-v1";
const DATA_VERSION = "api-v1";

const assets = ["index.html", "index.js", "index.css", "offline.html"];

async function cacheFirst(req) {
  const result = await caches.match(req);

  return result ?? (await fetch(req));
}

async function networkFirst(req) {
  const cache = await caches.open(DATA_VERSION);
  try {
    const response = await fetch(req);
    await cache.put(req, response.clone());

    return response;
  } catch (e) {
    const cached = await cache.match(req);

    return cached ?? (await caches.match("offline.html"));
  }
}

self.addEventListener("install", async (e) => {
  const cache = await caches.open(CACHE_VERSION);

  cache.addAll(assets);
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(request));
  } else {
    e.respondWith(networkFirst(request));
  }
});

self.addEventListener("activate", async (e) => {
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((item) => item !== CACHE_VERSION)
      .filter((item) => item !== DATA_VERSION)
      .map((name) => caches.delete(name))
  );
});
