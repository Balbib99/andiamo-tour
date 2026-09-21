import { useCallback, useEffect, useRef, useState } from "react";

const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

/** Algo que se puede reproducir: un archivo de audio si existe y, si no, el texto para leerlo en voz alta. */
export interface Playable {
  text: string;
  src?: string;
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === "es-es") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("es"))
  );
}

/** Lee un texto con la voz del navegador y avisa al terminar (o si no puede). */
function speakText(text: string, done: () => void): void {
  if (!speechSupported) return done();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.onend = done;
  u.onerror = done;
  speechSynthesis.speak(u);
}

/**
 * Reproduce una lista de elementos en orden. Cada uno usa su archivo de audio si lo tiene y, si el archivo falta
 * o no se puede reproducir, lee el texto con la voz del navegador. `onItem` avisa de cuál empieza.
 * Usa un único elemento de audio para todos, que es lo que permite encadenarlos también en iPhone.
 */
export function useSpeech() {
  const token = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    token.current++;
    if (audio.current) {
      audio.current.onended = null;
      audio.current.onerror = null;
      audio.current.pause();
    }
    if (speechSupported) speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  const speak = useCallback((items: Playable[], onItem?: (index: number) => void) => {
    if (items.length === 0) return;
    const mine = ++token.current;
    if (speechSupported) speechSynthesis.cancel();
    audio.current ??= new Audio();
    const el = audio.current;
    setPlaying(true);

    const run = (i: number) => {
      if (mine !== token.current) return;
      onItem?.(i);
      const next = () => {
        if (mine !== token.current) return;
        if (i + 1 < items.length) run(i + 1);
        else setPlaying(false);
      };
      const item = items[i];
      const fallback = () => {
        if (mine === token.current) speakText(item.text, next);
      };
      if (!item.src) return fallback();
      el.onended = next;
      el.onerror = fallback;
      el.src = item.src;
      el.play().catch(fallback);
    };
    // Un instante tras cancel(): Chrome descarta a veces lo que se encola en el mismo momento.
    window.setTimeout(() => run(0), 60);
  }, []);

  useEffect(() => stop, [stop]);

  return { supported: speechSupported, playing, speak, stop };
}
