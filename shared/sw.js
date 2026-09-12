/* Service Worker — آفلاین کامل اندروید/ویندوز */
const C='smh-tabrik-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['index.html','styles.css','app.js','about.html','about.css','about.js','manifest.webmanifest'])).then(()=>self.skipWaiting()))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('index.html'))))});
