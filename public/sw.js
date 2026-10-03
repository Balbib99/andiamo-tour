/* Service worker de Andiamo: guarda copias de lo que la web descarga para poder usarla sin conexión.
   El marcador de la versión (en la constante VERSION) lo sustituye scripts/generar-offline.mjs al construir la web; cada versión nueva de la web
   cambia este archivo y por eso el navegador la instala sola.

   Qué se guarda y cómo:
   - La app (código, tipografías, iconos): se baja al entrar por primera vez, es poco y va a la caché «shell».
   - Fotos, guías de voz y datos: «static». Se sirve lo guardado y se refresca por detrás si hay conexión.
     Lo pesado se baja a propósito desde la portada («Descargar»).
   - Podcasts: «podcasts». Solo se sirven si se descargaron a propósito; si no, pasan de largo a internet.
   - Mosaicos del mapa y rutas a pie: se guardan los que se van viendo, con un tope.
   Los nombres de las cachés tienen que coincidir con los de src/lib/offline.ts. */

const VERSION = "__VERSION__";
const SHELL = `andiamo-shell-${VERSION}`;
const STATIC = "andiamo-static";
const PODCASTS = "andiamo-podcasts";
const TILES = "andiamo-tiles";
const ROUTES = "andiamo-rutas";
const MAX_TILES = 1200;
const MAX_ROUTES = 120;
const ROUTE_TIMEOUT_MS = 6000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const res = await fetch("/offline-manifest.json", { cache: "no-cache" });
      const manifest = await res.json();
      const cache = await caches.open(SHELL);
      await cache.addAll(manifest.shell);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name.startsWith("andiamo-shell-") && name !== SHELL) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (req.mode === "navigate") return event.respondWith(navegacion());
    if (url.pathname.startsWith("/podcast/")) return event.respondWith(soloGuardado(req, PODCASTS));
    if (/^\/(img|audio|data|personajes)\//.test(url.pathname)) return event.respondWith(guardadoYRefresco(req, event));
    return event.respondWith(app(req));
  }
  if (url.hostname === "tile.openstreetmap.org") return event.respondWith(mosaico(req));
  if (url.hostname === "routing.openstreetmap.de") return event.respondWith(ruta(req));
  // Lo demás (por ejemplo las fotos de las fuentes, de Wikimedia) no se toca.
});

/** Responde a una petición con «Range» (los <audio> las usan) cortando la copia completa que hay guardada. */
async function conRango(req, resp) {
  const header = req.headers.get("range");
  if (!header || !resp || resp.status !== 200) return resp;
  const m = /bytes=(\d*)-(\d*)/.exec(header);
  if (!m) return resp;
  const blob = await resp.blob();
  const size = blob.size;
  const start = m[1] === "" ? Math.max(0, size - Number(m[2])) : Number(m[1]);
  const end = m[1] === "" || m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") || "application/octet-stream",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
    },
  });
}

/** Cualquier página de la web: siempre se sirve el index.html guardado, que arranca la app. */
async function navegacion() {
  const cache = await caches.open(SHELL);
  const hit = await cache.match("/");
  return hit || fetch("/");
}

/** Código, estilos, tipografías e iconos de la app: los guardados primero (sus nombres llevan una huella). */
async function app(req) {
  const cache = await caches.open(SHELL);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  const resp = await fetch(req);
  if (resp.ok && new URL(req.url).pathname.startsWith("/assets/")) cache.put(req.url, resp.clone());
  return resp;
}

/** Fotos, guías de voz y datos: lo guardado al momento, y por detrás se refresca (una vez por sesión y archivo). */
const refrescados = new Set();
async function guardadoYRefresco(req, event) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(req.url);
  if (hit) {
    if (!refrescados.has(req.url)) {
      refrescados.add(req.url);
      event.waitUntil(
        fetch(req.url, { cache: "no-cache" })
          .then((r) => (r.ok ? cache.put(req.url, r) : null))
          .catch(() => null),
      );
    }
    return conRango(req, hit);
  }
  const resp = await fetch(req);
  if (resp.status === 200 && !req.headers.has("range")) cache.put(req.url, resp.clone());
  return resp;
}

/** Podcasts: solo si se descargaron; si no, tal cual desde internet y sin guardar nada. */
async function soloGuardado(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req.url);
  return hit ? conRango(req, hit) : fetch(req);
}

/** Mosaicos del mapa: los guardados primero; los nuevos se guardan hasta un tope. */
async function mosaico(req) {
  const cache = await caches.open(TILES);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  const resp = await fetch(req);
  // Las respuestas «opacas» (sin CORS) cuentan muchísimo en la cuota: no se guardan.
  if (resp.ok && resp.type !== "opaque") {
    await cache.put(req.url, resp.clone());
    recortar(cache, MAX_TILES);
  }
  return resp;
}

/** Rutas a pie: primero internet (con límite de espera) y, si falla, la última copia o la descargada para cada día. */
async function ruta(req) {
  const cache = await caches.open(ROUTES);
  try {
    const resp = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error("tarde")), ROUTE_TIMEOUT_MS)),
    ]);
    if (resp.ok) {
      await cache.put(req.url, resp.clone());
      recortar(cache, MAX_ROUTES);
    }
    return resp;
  } catch (err) {
    const hit = await caches.match(req.url);
    if (hit) return hit;
    throw err;
  }
}

/** Borra las entradas más antiguas de una caché cuando pasa de `max`. */
async function recortar(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
