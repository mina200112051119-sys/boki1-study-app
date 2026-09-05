const CACHE='boki1-v27';
const ASSETS=['./','./index.html','./manifest.webmanifest','./app.html','./patch.js','./mistake-explanation.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method==='GET'&&new URL(e.request.url).pathname.endsWith('/app.html')){
  e.respondWith((async()=>{const r=await caches.match(e.request)||await fetch(e.request);const html=await r.text();const patched=html.replace('</body>','<script src="./mistake-explanation.js"></script><script src="./patch.js"></script></body>');return new Response(patched,{status:r.status,headers:{'Content-Type':'text/html; charset=utf-8'}})})());return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
