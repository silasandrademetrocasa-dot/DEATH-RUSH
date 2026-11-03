const CACHE_NAME = 'deathrush-v1-20261103';
const CORE = ['./', './index.html', './style.css', './game.js', './manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('deathrush-')&&n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const req=event.request;event.respondWith(caches.match(req).then(match=>match||fetch(req).then(response=>{if(response.ok&&new URL(req.url).origin===self.location.origin){let copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy))}return response}).catch(()=>match||Response.error())))});
