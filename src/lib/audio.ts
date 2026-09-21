import { useEffect, useState } from "react";
import type { Stop } from "../data/types";

/** Lista de los audios generados (public/audio/manifest.json), con lo que dura cada uno en segundos. */
export interface AudioManifest {
  voz: string;
  files: Record<string, { seg: number }>;
}

let manifest: Promise<AudioManifest | null> | null = null;

function loadManifest(): Promise<AudioManifest | null> {
  manifest ??= fetch("/audio/manifest.json")
    .then((r) => (r.ok ? (r.json() as Promise<AudioManifest>) : null))
    .catch(() => null);
  return manifest;
}

/** El manifiesto de audios, o null mientras carga o si no hay ninguno. */
export function useAudioManifest(): AudioManifest | null {
  const [value, setValue] = useState<AudioManifest | null>(null);
  useEffect(() => {
    let alive = true;
    loadManifest().then((m) => alive && setValue(m));
    return () => {
      alive = false;
    };
  }, []);
  return value;
}

/** Nombre del archivo de audio de una parada, o de uno de los puntos de su foto (empiezan en 1). */
export const audioFile = (stopId: string, point?: number) =>
  point === undefined ? `${stopId}.mp3` : `${stopId}-${point}.mp3`;

/** Ruta del archivo si existe en el manifiesto; si no, undefined y se usará la voz del móvil. */
export function audioSrc(m: AudioManifest | null, file: string): string | undefined {
  return m?.files[file] ? `/audio/${file}` : undefined;
}

/** Cuánto dura el audio de una parada, contando todos sus puntos, con el texto que se muestra en pantalla. */
export function stopAudioLabel(stop: Stop, m: AudioManifest | null): string {
  if (!m) return stop.audio;
  const names = stop.points?.length ? stop.points.map((_, i) => audioFile(stop.id, i + 1)) : [audioFile(stop.id)];
  const seconds = names.reduce((sum, n) => sum + (m.files[n]?.seg ?? 0), 0);
  if (seconds === 0) return stop.audio;
  const r = Math.max(10, Math.round(seconds / 5) * 5);
  if (r < 60) return `${r} s`;
  return r % 60 === 0 ? `${r / 60} min` : `${Math.floor(r / 60)} min ${r % 60} s`;
}
