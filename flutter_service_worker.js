'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"splash/img/dark-1x.png": "af5ab671d6f3d0df916fc34d9d7a8bef",
"splash/img/light-2x.png": "c209435123ef6245a6c5f72b57ad755a",
"splash/img/light-4x.png": "fb2b5b3b568ea4a34b81b5b0e917313c",
"splash/img/light-1x.png": "af5ab671d6f3d0df916fc34d9d7a8bef",
"splash/img/dark-4x.png": "fb2b5b3b568ea4a34b81b5b0e917313c",
"splash/img/light-3x.png": "8252990d7229d3965b2ab0ae85bc4f02",
"splash/img/dark-2x.png": "c209435123ef6245a6c5f72b57ad755a",
"splash/img/dark-3x.png": "8252990d7229d3965b2ab0ae85bc4f02",
"manifest.json": "16796f2cec421f5e50f48fb01663bad3",
"main.dart.js": "9c87c459a31111e68e5054edad70f5bf",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"index.html": "4066279985502d729b34001401b8fe19",
"/": "4066279985502d729b34001401b8fe19",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "4c547ada6c164a77a3cfce8b7feee86d",
"assets/AssetManifest.bin.json": "99046cd20ab95c65a7af53f1431e7d6e",
"assets/AssetManifest.bin": "0a73f9ac139c7c926a56ae48f37722a8",
"assets/NOTICES": "2bb7f57c9dd8629b9ee6ab30a9a9e838",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/assets/splash_logo.png": "446f36f614d86084d41038227385b2c3",
"assets/assets/RedBullGamingHub_Logo.png": "b9a3b6c48006c51f8799c3a7d8785aab",
"assets/assets/splash_logo_dark.png": "446f36f614d86084d41038227385b2c3",
"assets/assets/rickroll.mp3": "d670dc869380c729ec1bc6015ca0cc5f",
"assets/AssetManifest.json": "e058ab28e3d70ff5f4339b6f13891957",
"assets/fonts/MaterialIcons-Regular.otf": "6096f02a58e30ea1c9e30c2b04fbd617",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"favicon.png": "7f75a2244b29632fd384b215579c878a",
"icons/Icon-512.png": "72f0ddf85c0feb650daf4a58422fd399",
"icons/Icon-144.png": "77650e54f9fbdde69dde7fe7ffb934e9",
"icons/Icon-maskable-192.png": "da3a393e1c3c8ace9202e53822af578d",
"icons/Icon-96.png": "7b678632e098a409e3ef73cc0fb2b04e",
"icons/Icon-72.png": "b01f313c0225573dc40498e4ec262d8b",
"icons/Icon-192.png": "da3a393e1c3c8ace9202e53822af578d",
"icons/Icon-maskable-512.png": "72f0ddf85c0feb650daf4a58422fd399",
"flutter_bootstrap.js": "8bc8b810e5057c6c5c7a48dd69bb49fa",
"firebase-messaging-sw.js": "ccd54d7c103493747f266f47f6eed9ed",
"version.json": "d105f96638f1d658175cc48ef4a27daa",
"service-worker.js": "7c2434e70de19d591241e61528951351"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
