import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { romanNumerals } from "../data/itinerario";
import {
  downloadBasic,
  downloadDay,
  formatMB,
  freeSpace,
  getSavedState,
  loadOfflineManifest,
  removeDownloads,
  supportsOffline,
  totalBytes,
  type OfflineManifest,
  type Progress,
  type SavedState,
} from "../lib/offline";
import { CheckIcon } from "./Icons";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const subscribe = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};
const useOnline = () => useSyncExternalStore(subscribe, () => navigator.onLine, () => true);

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * Tarjeta de la portada para usar la web sin conexión: descargar a propósito las fotos y guías de voz (lo básico)
 * y los podcasts de cada día, con wifi. Lo pequeño (la propia app) se guarda solo al entrar.
 */
export function OfflineCard() {
  const [manifest, setManifest] = useState<OfflineManifest | null>(null);
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [install, setInstall] = useState<InstallPromptEvent | null>(null);
  const abort = useRef<AbortController | null>(null);
  const online = useOnline();

  const refresh = useCallback(async (m: OfflineManifest) => setSaved(await getSavedState(m)), []);

  useEffect(() => {
    if (!supportsOffline()) return;
    let alive = true;
    loadOfflineManifest().then((m) => {
      if (!alive || !m) return;
      setManifest(m);
      void refresh(m);
    });
    return () => {
      alive = false;
    };
  }, [refresh]);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!manifest || !saved) return null;

  const run = async (id: string, needed: number, job: (onProgress: (p: Progress) => void, signal: AbortSignal) => Promise<void>) => {
    setError(null);
    const free = await freeSpace();
    if (free !== null && free < needed * 1.1) {
      setError("Parece que no queda espacio suficiente en el móvil para esta descarga.");
      return;
    }
    const ctrl = new AbortController();
    abort.current = ctrl;
    setBusy(id);
    setProgress(null);
    try {
      await job(setProgress, ctrl.signal);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setError(
          navigator.onLine
            ? "No se pudo completar la descarga. Vuelve a intentarlo: lo que ya se bajó no se repite."
            : "Te has quedado sin conexión. Vuelve a intentarlo con wifi: lo que ya se bajó no se repite.",
        );
      }
    } finally {
      setBusy(null);
      setProgress(null);
      abort.current = null;
      void refresh(manifest);
    }
  };

  const clear = async () => {
    await removeDownloads();
    void refresh(manifest);
  };

  const row = (id: string, label: string, detail: string, done: boolean, bytes: number, start: () => void) => {
    const active = busy === id;
    const pct = progress && progress.bytesTotal ? Math.round((progress.bytes / progress.bytesTotal) * 100) : 0;
    return (
      <li className="offline-row" key={id}>
        <div className="offline-info">
          <p className="offline-label">{label}</p>
          <p className="offline-detail">
            {active && progress
              ? `${progress.done} de ${progress.total} archivos · ${formatMB(progress.bytes)} de ${formatMB(progress.bytesTotal)}`
              : `${detail} · ${formatMB(bytes)}`}
          </p>
          {active && (
            <div className="offline-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
              <i style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        {active ? (
          <button type="button" className="btn btn-small" onClick={() => abort.current?.abort()}>
            Cancelar
          </button>
        ) : done ? (
          <span className="offline-done">
            <CheckIcon /> Guardado
          </span>
        ) : (
          <button type="button" className="btn btn-small btn-primary" disabled={busy !== null || !online} onClick={start}>
            Descargar
          </button>
        )}
      </li>
    );
  };

  const basicBytes = totalBytes(manifest.basico);
  const anySaved = saved.basico.done > 0 || Object.values(saved.dias).some((d) => d.done > 0);

  return (
    <section className="offline" aria-label="Usar sin conexión">
      <h3>Usar sin conexión</h3>
      <p className="offline-intro">
        Descárgalo con wifi para no gastar datos ni depender de la cobertura. El GPS y los avisos de cercanía
        funcionan igual sin internet.
      </p>
      {!online && <p className="offline-note">Ahora mismo no tienes conexión: solo se puede usar lo que ya está guardado.</p>}

      <ul className="offline-list">
        {row(
          "basico",
          "Lo básico",
          "Fotos, guías de voz y rutas",
          saved.basico.done === saved.basico.total,
          basicBytes,
          () =>
            run("basico", basicBytes, (p, s) => downloadBasic(manifest, p, s)),
        )}
        {manifest.dias.map((d, i) => {
          const bytes = totalBytes(d.archivos);
          return row(
            `dia-${d.id}`,
            `Podcasts del día ${romanNumerals[i] ?? d.id}`,
            `${d.archivos.length} podcasts`,
            saved.dias[d.id]?.done === d.archivos.length,
            bytes,
            () => run(`dia-${d.id}`, bytes, (p, s) => downloadDay(manifest, d.id, p, s)),
          );
        })}
      </ul>

      {error && (
        <p className="offline-error" role="alert">
          {error}
        </p>
      )}

      <div className="offline-foot">
        {install && !isStandalone() && (
          <button
            type="button"
            className="btn btn-small"
            onClick={() => {
              void install.prompt();
              setInstall(null);
            }}
          >
            Instalar la app
          </button>
        )}
        {anySaved && busy === null && (
          <button type="button" className="link" onClick={clear}>
            Borrar descargas
          </button>
        )}
      </div>
      {isIOS() && !isStandalone() && (
        <p className="offline-note">En iPhone, para instalarla: pulsa Compartir en Safari y elige «Añadir a pantalla de inicio».</p>
      )}
    </section>
  );
}
