import { useCallback, useEffect, useRef, useState } from "react";

const supported = typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === "es-es") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("es"))
  );
}

/**
 * Lee textos en voz alta con la voz del navegador.
 * `speak` recibe una lista de textos y los lee en orden; `onItem` avisa de cuál empieza.
 */
export function useSpeech() {
  const token = useRef(0);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    token.current++;
    if (supported) speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  const speak = useCallback((items: string[], onItem?: (index: number) => void) => {
    if (!supported || items.length === 0) return;
    const mine = ++token.current;
    speechSynthesis.cancel();
    setPlaying(true);

    const run = (i: number) => {
      if (mine !== token.current) return;
      onItem?.(i);
      const u = new SpeechSynthesisUtterance(items[i]);
      u.lang = "es-ES";
      const voice = pickVoice();
      if (voice) u.voice = voice;
      u.onend = () => {
        if (mine !== token.current) return;
        if (i + 1 < items.length) run(i + 1);
        else setPlaying(false);
      };
      u.onerror = () => {
        if (mine === token.current) setPlaying(false);
      };
      speechSynthesis.speak(u);
    };
    // Un instante tras cancel(): Chrome descarta a veces lo que se encola en el mismo momento.
    window.setTimeout(() => run(0), 60);
  }, []);

  useEffect(() => stop, [stop]);

  return { supported, playing, speak, stop };
}
