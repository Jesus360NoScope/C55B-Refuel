const V='c55b-v7',F=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
const O={ignoreSearch:true,ignoreVary:true};
// Strip redirect flag (browsers refuse redirected responses for page loads); keep only the content type.
const clean=async r=>r.redirected?new Response(await r.blob(),{status:200,statusText:'OK',headers:{'Content-Type':r.headers.get('content-type')||'text/html'}}):r;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>fetch(u,{cache:'reload'}).then(clean).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Cache-first: always serve the saved copy; new versions arrive when this file's version (V) changes.
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith((async()=>{
  const c=await caches.open(V);
  let m=await c.match(e.request,O);
  if(!m&&e.request.mode==='navigate')m=await c.match('./',O)||await c.match('index.html',O);
  if(m)return m;
  try{return await fetch(e.request)}catch(err){return Response.error()}
 })())});
