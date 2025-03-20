'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"splash/img/light-4x.png": "fb2b5b3b568ea4a34b81b5b0e917313c",
"splash/img/dark-3x.png": "8252990d7229d3965b2ab0ae85bc4f02",
"splash/img/light-3x.png": "8252990d7229d3965b2ab0ae85bc4f02",
"splash/img/light-1x.png": "af5ab671d6f3d0df916fc34d9d7a8bef",
"splash/img/dark-1x.png": "af5ab671d6f3d0df916fc34d9d7a8bef",
"splash/img/light-2x.png": "c209435123ef6245a6c5f72b57ad755a",
"splash/img/dark-2x.png": "c209435123ef6245a6c5f72b57ad755a",
"splash/img/dark-4x.png": "fb2b5b3b568ea4a34b81b5b0e917313c",
"service-worker.js": "2d6b8617c11a6fda5e69a42169af9ff4",
"index.html": "4066279985502d729b34001401b8fe19",
"/": "4066279985502d729b34001401b8fe19",
"assets/NOTICES": "868027fa89fb8be29094ac5b8880eec0",
"assets/assets/splash_logo_dark.png": "446f36f614d86084d41038227385b2c3",
"assets/assets/RedBullGamingHub_Logo.png": "b9a3b6c48006c51f8799c3a7d8785aab",
"assets/assets/splash_logo.png": "446f36f614d86084d41038227385b2c3",
"assets/assets/credentials.json": "66fd9277f5a274ab4ed53750834f32bd",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "dc3a697c2795eabba851ac05bb900305",
"assets/fonts/MaterialIcons-Regular.otf": "02594b1f023b856fb3c5f020851cd6d6",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "4e3b814f647fcd78d79f85f5e63aebe8",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b89682a9e4402af142ce2b40cd2c98b0",
"assets/AssetManifest.json": "6fa9336d041ca5770da6e1cfb97d87cc",
"version.json": "6d8d3d44eede82a5d480e56ee3f626de",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"main.dart.js": "1b305a1ef4582079f9ced1667a6587ae",
"firebase-messaging-sw.js": "d11bd10961c5a6fffe968d8533fd90c1",
"icons/Icon-96.png": "7b678632e098a409e3ef73cc0fb2b04e",
"icons/Icon-maskable-512.png": "72f0ddf85c0feb650daf4a58422fd399",
"icons/Icon-144.png": "77650e54f9fbdde69dde7fe7ffb934e9",
"icons/Icon-192.png": "da3a393e1c3c8ace9202e53822af578d",
"icons/Icon-512.png": "72f0ddf85c0feb650daf4a58422fd399",
"icons/Icon-72.png": "b01f313c0225573dc40498e4ec262d8b",
"icons/Icon-maskable-192.png": "da3a393e1c3c8ace9202e53822af578d",
"manifest.json": "16796f2cec421f5e50f48fb01663bad3",
"favicon.png": "7f75a2244b29632fd384b215579c878a",
"flutter_bootstrap.js": "e2f454dcffe49c7ad6ea4e1981a12633"};
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
