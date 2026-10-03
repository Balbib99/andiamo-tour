import { days, startPoint } from "../data/itinerario";
import { routePoints } from "./geo";
import { footRouteUrl } from "./routing";

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
  dias: { id: string; title: string; archivos: OfflineFile[] }[];
}

export interface Progress {
  done: number;
  total: number;
  bytes: number;
  bytesTotal: number;
}

export const supportsOffline = () => typeof caches !== "undefined" && "serviceWorker" in navigator;

/** Registra el service worker. Solo en la web publicada: en desarrollo daría problemas de cachés. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* sin service worker la web sigue funcionando con internet */
    });
  });
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

export interface SavedState {
  basico: { done: number; total: number };
  dias: Record<string, { done: number; total: number }>;
}

export async function getSavedState(m: OfflineManifest): Promise<SavedState> {
  const basico = await countSaved(STATIC, m.basico);
  const dias: SavedState["dias"] = {};
  for (const d of m.dias) dias[d.id] = { done: (await countSaved(PODCASTS, d.archivos)).done, total: d.archivos.length };
  return { basico: { done: basico.done, total: m.basico.length }, dias };
}

/** Descarga una lista de archivos a una caché, saltándose los que ya están. Para si se pasa la señal de cancelar. */
async function download(
  files: OfflineFile[],
  cacheName: string,
  onProgress: (p: Progress) => void,
  signal: AbortSignal,
  concurrency: number,
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
      if (!(await cache.match(f.url))) {
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
  for (const day of days) {
    if (!day.stops.length || signal.aborted) continue;
    const url = footRouteUrl(routePoints(startPoint, day.stops));
    if (await cache.match(url)) continue;
    try {
      const resp = await fetch(url, { signal });
      if (resp.ok) await cache.put(url, resp);
    } catch {
      /* si falla, la ruta se dibujará en línea recta sin conexión */
    }
  }
}

/** Fotos, guías de voz, datos y rutas de los días. */
export async function downloadBasic(m: OfflineManifest, onProgress: (p: Progress) => void, signal: AbortSignal) {
  await keepSaved();
  await download(m.basico, STATIC, onProgress, signal, 4);
  await downloadDayRoutes(signal);
}

/** Los podcasts de un día. */
export async function downloadDay(m: OfflineManifest, dayId: string, onProgress: (p: Progress) => void, signal: AbortSignal) {
  const day = m.dias.find((d) => d.id === dayId);
  if (!day) return;
  await keepSaved();
  await download(day.archivos, PODCASTS, onProgress, signal, 1);
}

/** Borra todo lo descargado (la app básica se vuelve a guardar sola al entrar con internet). */
export async function removeDownloads(): Promise<void> {
  await Promise.all(CACHES.map((name) => caches.delete(name)));
}

/** Espacio que queda aproximadamente, en bytes (null si el navegador no lo dice). */
export async function freeSpace(): Promise<number | null> {
  const e = await navigator.storage?.estimate?.();
  return e?.quota !== undefined && e.usage !== undefined ? e.quota - e.usage : null;
}

export const formatMB = (bytes: number) => {
  const mb = bytes / 1048576;
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1).replace(".", ",")} MB`; // espacio fijo: que no se parta "19 / MB"
};
