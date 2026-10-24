import { days, startPoint } from "../data/itinerario";
import { routePoints } from "./geo";
import { footRouteUrl } from "./routing";
import { load, save } from "./storage";

/**
 * Uso de la web sin conexión. El service worker (public/sw.js) sirve lo que hay guardado; aquí está el lado de la
 * página: registrarlo y descargar a propósito lo pesado (fotos, guías de voz y podcasts) con una barra de progreso.
 * Los nombres de las cachés tienen que coincidir con los de public/sw.js.
 */
const STATIC = "andiamo-static";
const PODCASTS = "andiamo-podcasts";
const ROUTES_DAYS = "andiamo-rutas-dias";
const CACHES = [STATIC, PODCASTS, ROUTES_DAYS, "andiamo-tiles", "andiamo-rutas"];

export interface OfflineFile {
  url: string;
  size: number;
}

export interface OfflineManifest {
  version: string;
  shell: string[];
  basico: OfflineFile[];
  /** Huella de `basico` y de los podcasts de cada día: si cambia respecto a la guardada, hay contenido nuevo. */
  basicoHash?: string;
  dias: { id: string; title: string; archivos: OfflineFile[]; hash?: string }[];
}

export interface Progress {
  done: number;
  total: number;
  bytes: number;
  bytesTotal: number;
}

export const supportsOffline = () => typeof caches !== "undefined" && "serviceWorker" in navigator;

/** Avisa a la web cuando una versión nueva de la app ha tomado el control, para ofrecer recargar. */
const updateListeners = new Set<() => void>();
export function onAppUpdate(cb: () => void): () => void {
  updateListeners.add(cb);
  return () => {
    updateListeners.delete(cb);
  };
}

/** Registra el service worker. Solo en la web publicada: en desarrollo daría problemas de cachés. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  // Si ya había uno al abrir, un cambio de controlador significa que se ha instalado una versión nueva.
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController) updateListeners.forEach((cb) => cb());
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* sin service worker la web sigue funcionando con internet; la tarjeta de la portada avisa de que no hay modo sin conexión */
    });
  });
}

/** true si el service worker está registrado en este navegador. */
export async function offlineReady(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  return Boolean(await navigator.serviceWorker.getRegistration());
}

let manifest: Promise<OfflineManifest | null> | null = null;
/** Lista de lo que se puede descargar. null si no existe (por ejemplo, en desarrollo). */
export function loadOfflineManifest(): Promise<OfflineManifest | null> {
  manifest ??= fetch("/offline-manifest.json", { cache: "no-cache" })
    .then((r) => (r.ok ? (r.json() as Promise<OfflineManifest>) : null))
    .catch(() => null);
  return manifest;
}

const sum = (files: OfflineFile[]) => files.reduce((s, f) => s + f.size, 0);
export const totalBytes = sum;

/** Cuántos de esos archivos ya están guardados. */
async function countSaved(cacheName: string, files: OfflineFile[]): Promise<{ done: number; bytes: number }> {
  if (!supportsOffline()) return { done: 0, bytes: 0 };
  const cache = await caches.open(cacheName);
  const saved = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
  const have = files.filter((f) => saved.has(f.url));
  return { done: have.length, bytes: sum(have) };
}

/** Rutas a pie previstas de cada día (las que se guardan para ver la línea por las calles sin conexión). */
const dayRouteUrls = () => days.filter((d) => d.stops.length).map((d) => footRouteUrl(routePoints(startPoint, d.stops)));

async function countRoutes(): Promise<{ done: number; total: number }> {
  const urls = dayRouteUrls();
  const cache = await caches.open(ROUTES_DAYS);
  let done = 0;
  for (const u of urls) if (await cache.match(u)) done++;
  return { done, total: urls.length };
}

export interface SavedPart {
  done: number;
  total: number;
  /** true si está todo guardado pero la web tiene contenido nuevo desde la última descarga. */
  stale: boolean;
}

export interface SavedState {
  basico: SavedPart;
  dias: Record<string, SavedPart>;
}

/** Huella que había en la web cuando se descargó cada parte; se compara con la de ahora para saber si hay algo nuevo. */
const key = (id: string) => `offline:${id}`;

export async function getSavedState(m: OfflineManifest): Promise<SavedState> {
  const files = await countSaved(STATIC, m.basico);
  const routes = await countRoutes();
  const basico: SavedPart = { done: files.done + routes.done, total: m.basico.length + routes.total, stale: false };
  basico.stale = basico.done === basico.total && load<string | null>(key("basico"), null) !== (m.basicoHash ?? null);
  const dias: SavedState["dias"] = {};
  for (const d of m.dias) {
    const c = await countSaved(PODCASTS, d.archivos);
    const complete = c.done === d.archivos.length;
    dias[d.id] = { done: c.done, total: d.archivos.length, stale: complete && load<string | null>(key(`dia-${d.id}`), null) !== (d.hash ?? null) };
  }
  return { basico, dias };
}

/** Si lo guardado de ese archivo tiene el mismo tamaño que el que hay ahora en la web. */
async function isCurrent(cache: Cache, f: OfflineFile): Promise<boolean> {
  const hit = await cache.match(f.url);
  if (!hit) return false;
  const len = hit.headers.get("content-length");
  return (len !== null ? Number(len) : (await hit.blob()).size) === f.size;
}

/**
 * Descarga una lista de archivos a una caché, saltándose los que ya están. Con `verify` también vuelve a bajar los
 * guardados cuyo tamaño ya no coincide (al actualizar). Para si se pasa la señal de cancelar.
 */
async function download(
  files: OfflineFile[],
  cacheName: string,
  onProgress: (p: Progress) => void,
  signal: AbortSignal,
  concurrency: number,
  verify: boolean,
): Promise<void> {
  const cache = await caches.open(cacheName);
  const bytesTotal = sum(files);
  let done = 0;
  let bytes = 0;
  const tick = (size: number) => {
    done++;
    bytes += size;
    onProgress({ done, total: files.length, bytes, bytesTotal });
  };
  onProgress({ done, total: files.length, bytes, bytesTotal });

  const queue = [...files];
  const worker = async () => {
    for (let f = queue.shift(); f; f = queue.shift()) {
      if (signal.aborted) return;
      if (!(verify ? await isCurrent(cache, f) : await cache.match(f.url))) {
        const resp = await fetch(f.url, { signal, cache: "no-cache" });
        if (!resp.ok) throw new Error(`${resp.status} ${f.url}`);
        await cache.put(f.url, resp);
      }
      tick(f.size);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  if (signal.aborted) throw new DOMException("Cancelado", "AbortError");
}

/** Pide al navegador que no borre lo guardado cuando falte espacio (no siempre lo concede). */
const keepSaved = () => navigator.storage?.persist?.().catch(() => false);

/** Guarda las rutas a pie previstas de cada día, para ver la línea por las calles sin conexión. */
async function downloadDayRoutes(signal: AbortSignal): Promise<void> {
  const cache = await caches.open(ROUTES_DAYS);
  let missing = 0;
  for (const url of dayRouteUrls()) {
    if (signal.aborted) return;
    if (await cache.match(url)) continue;
    try {
      const resp = await fetch(url, { signal });
      if (resp.ok) await cache.put(url, resp);
      else missing++;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      missing++;
    }
  }
  // Sin esas rutas la línea del mapa saldría recta: se avisa para poder reintentarlo.
  if (missing > 0) throw new Error("rutas");
}

/** Fotos, guías de voz, datos y rutas de los días. */
export async function downloadBasic(m: OfflineManifest, onProgress: (p: Progress) => void, signal: AbortSignal, verify = false) {
  await keepSaved();
  await download(m.basico, STATIC, onProgress, signal, 4, verify);
  await downloadDayRoutes(signal);
  if (signal.aborted) throw new DOMException("Cancelado", "AbortError");
  save(key("basico"), m.basicoHash ?? null);
}

/** Los podcasts de un día. */
export async function downloadDay(m: OfflineManifest, dayId: string, onProgress: (p: Progress) => void, signal: AbortSignal, verify = false) {
  const day = m.dias.find((d) => d.id === dayId);
  if (!day) return;
  await keepSaved();
  await download(day.archivos, PODCASTS, onProgress, signal, 1, verify);
  save(key(`dia-${dayId}`), day.hash ?? null);
}

/** Borra todo lo descargado (la app básica se vuelve a guardar sola al entrar con internet). */
export async function removeDownloads(): Promise<void> {
  await Promise.all(CACHES.map((name) => caches.delete(name)));
  for (const id of ["basico", ...days.map((d) => `dia-${d.id}`)]) save(key(id), null);
}

/** Espacio que queda aproximadamente, en bytes (null si el navegador no lo dice). */
export async function freeSpace(): Promise<number | null> {
  const e = await navigator.storage?.estimate?.();
  return e?.quota !== undefined && e.usage !== undefined ? e.quota - e.usage : null;
}

export const formatMB = (bytes: number) => {
  const mb = bytes / 1048576;
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1).replace(".", ",")} MB`; // espacio fijo: que no se parta "19 / MB"
};
