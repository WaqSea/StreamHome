const CACHE_NAME = "streamhome-app-cache-v1";
const MEDIA_CACHE_NAME = "stream-media-cache";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.svg"
];

// Helper to process range requests from cached blobs
async function handleRangeRequest(request, cacheResponse) {
  const rangeHeader = request.headers.get("Range");
  if (!rangeHeader) {
    return cacheResponse;
  }
  
  try {
    const blob = await cacheResponse.blob();
    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : blob.size - 1;
    
    if (start >= blob.size || end >= blob.size || start > end) {
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable",
        headers: { "Content-Range": `bytes */${blob.size}` }
      });
    }

    const slicedBlob = blob.slice(start, end + 1);
    return new Response(slicedBlob, {
      status: 206,
      statusText: "Partial Content",
      headers: {
        "Content-Type": cacheResponse.headers.get("Content-Type") || "video/mp4",
        "Content-Range": `bytes ${start}-${end}/${blob.size}`,
        "Content-Length": String(slicedBlob.size),
        "Accept-Ranges": "bytes"
      }
    });
  } catch (err) {
    console.error("[SW] Range request error:", err);
    return new Response("", { status: 500, statusText: "SW Range Internal Error" });
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== MEDIA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept media files from the media cache
  if (url.pathname.includes("/media/") || url.pathname.includes("/api/stream/")) {
    event.respondWith(
      caches.open(MEDIA_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request.url);
        if (cachedResponse) {
          console.log(`[SW] Serving cached media resource: ${url.pathname}`);
          return handleRangeRequest(event.request, cachedResponse);
        }
        return fetch(event.request);
      })
    );
    return;
  }

  // 2. Serve static pages/assets with network-first or cache-first fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache dynamic UI assets on the fly
        if (
          event.request.method === "GET" &&
          response.status === 200 &&
          !url.pathname.startsWith("/api/") &&
          !url.pathname.startsWith("/media/")
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
