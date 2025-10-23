const CACHE_NAME = 'site-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/index.html',
    '/sandeep/app.js',
    '/sandeep/icons/android/android-launchericon-144-144.png',
    '/sandeep/icons/android/android-launchericon-192-192.png',
    '/sandeep/icons/android/android-launchericon-48-48.png',
    '/sandeep/icons/android/android-launchericon-512-512.png',
    '/sandeep/icons/android/android-launchericon-72-72.png',
    '/sandeep/icons/android/android-launchericon-96-96.png',
    '/sandeep/icons/ios/100.png',
    '/sandeep/icons/ios/1024.png',
    '/sandeep/icons/ios/114.png',
    '/sandeep/icons/ios/120.png',
    '/sandeep/icons/ios/128.png',
    '/sandeep/icons/ios/144.png',
    '/sandeep/icons/ios/152.png',
    '/sandeep/icons/ios/16.png',
    '/sandeep/icons/ios/167.png',
    '/sandeep/icons/ios/180.png',
    '/sandeep/icons/ios/192.png',
    '/sandeep/icons/ios/20.png',
    '/sandeep/icons/ios/256.png',
    '/sandeep/icons/ios/29.png',
    '/sandeep/icons/ios/32.png',
    '/sandeep/icons/ios/40.png',
    '/sandeep/icons/ios/50.png',
    '/sandeep/icons/ios/512.png',
    '/sandeep/icons/ios/57.png',
    '/sandeep/icons/ios/58.png',
    '/sandeep/icons/ios/60.png',
    '/sandeep/icons/ios/64.png',
    '/sandeep/icons/ios/72.png',
    '/sandeep/icons/ios/76.png',
    '/sandeep/icons/ios/80.png',
    '/sandeep/icons/ios/87.png',
    '/sandeep/icons/windows11/LargeTile.scale-100.png',
    '/sandeep/icons/windows11/LargeTile.scale-125.png',
    '/sandeep/icons/windows11/LargeTile.scale-150.png',
    '/sandeep/icons/windows11/LargeTile.scale-200.png',
    '/sandeep/icons/windows11/LargeTile.scale-400.png',
    '/sandeep/icons/windows11/SmallTile.scale-100.png',
    '/sandeep/icons/windows11/SmallTile.scale-125.png',
    '/sandeep/icons/windows11/SmallTile.scale-150.png',
    '/sandeep/icons/windows11/SmallTile.scale-200.png',
    '/sandeep/icons/windows11/SmallTile.scale-400.png',
    '/sandeep/icons/windows11/SplashScreen.scale-100.png',
    '/sandeep/icons/windows11/SplashScreen.scale-125.png',
    '/sandeep/icons/windows11/SplashScreen.scale-150.png',
    '/sandeep/icons/windows11/SplashScreen.scale-200.png',
    '/sandeep/icons/windows11/SplashScreen.scale-400.png',
    '/sandeep/icons/windows11/Square150x150Logo.scale-100.png',
    '/sandeep/icons/windows11/Square150x150Logo.scale-125.png',
    '/sandeep/icons/windows11/Square150x150Logo.scale-150.png',
    '/sandeep/icons/windows11/Square150x150Logo.scale-200.png',
    '/sandeep/icons/windows11/Square150x150Logo.scale-400.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-16.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-20.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-24.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-256.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-30.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-32.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-36.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-40.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-44.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-48.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-60.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-64.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-72.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-80.png',
    '/sandeep/icons/windows11/Square44x44Logo.altform-unplated_targetsize-96.png',
    '/sandeep/icons/windows11/Square44x44Logo.scale-100.png',
    '/sandeep/icons/windows11/Square44x44Logo.scale-125.png',
    '/sandeep/icons/windows11/Square44x44Logo.scale-150.png',
    '/sandeep/icons/windows11/Square44x44Logo.scale-200.png',
    '/sandeep/icons/windows11/Square44x44Logo.scale-400.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-16.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-20.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-24.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-256.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-30.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-32.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-36.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-40.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-44.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-48.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-60.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-64.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-72.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-80.png',
    '/sandeep/icons/windows11/Square44x44Logo.targetsize-96.png',
    '/sandeep/icons/windows11/StoreLogo.scale-100.png',
    '/sandeep/icons/windows11/StoreLogo.scale-125.png',
    '/sandeep/icons/windows11/StoreLogo.scale-150.png',
    '/sandeep/icons/windows11/StoreLogo.scale-200.png',
    '/sandeep/icons/windows11/StoreLogo.scale-400.png',
    '/sandeep/icons/windows11/Wide310x150Logo.scale-100.png',
    '/sandeep/icons/windows11/Wide310x150Logo.scale-125.png',
    '/sandeep/icons/windows11/Wide310x150Logo.scale-150.png',
    '/sandeep/icons/windows11/Wide310x150Logo.scale-200.png',
    '/sandeep/icons/windows11/Wide310x150Logo.scale-400.png',
    '/sandeep/index.html',
    '/sandeep/offline.html',
    '/sandeep/service-worker.js',
    '/service-worker.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(resp => {
                return resp;
            }).catch(() => {
                return caches.match('/index.html');
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).then(resp => {
                if (event.request.method === 'GET' && resp && resp.type === 'basic') {
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
                }
                return resp;
            }).catch(() => {
                return cached;
            });
        })
    );
});