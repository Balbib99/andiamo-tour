import { useEffect, useState, type RefObject } from "react";
import type { Podcast } from "../data/podcasts";
import { podcastSrc } from "../data/podcasts";
import { load, save } from "../lib/storage";
import { ChevronDown, PauseIcon, PlayIcon } from "./Icons";

interface Props {
  podcast: Podcast;
  name: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  /** Foto de la parada, para la pantalla de bloqueo del móvil. */
  artwork?: string;
  /** Se avisa al empezar a sonar, para parar la guía de los puntos y que no suenen las dos a la vez. */
  onPlay: () => void;
}

/** Velocidades a elegir. La preferencia se guarda en el móvil y se aplica también a los siguientes podcasts. */
const SPEEDS = [1, 1.25, 1.5, 1.75, 2];
const BACK_S = 15;
const FORWARD_S = 30;

const clock = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/**
 * Tarjeta con el podcast de una parada: una conversación larga, para escuchar sin mirar la pantalla.
 * El <audio> es invisible y los controles son propios, para que se vean igual en todos los móviles. Mientras suena,
 * el sistema muestra también los controles en la pantalla de bloqueo (Media Session).
 */
export function PodcastCard({ podcast, name, audioRef, artwork, onPlay }: Props) {
  const [speed, setSpeed] = useState(() => load("podcastSpeed", 1));
  const [missing, setMissing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);

  // Hasta que el audio cargue (no se descarga hasta pulsar play) se usan los minutos redondeados del catálogo.
  const total = duration || podcast.min * 60;

  const applySpeed = (s: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.defaultPlaybackRate = s;
    a.playbackRate = s;
  };

  // Cada parada crea su propio <audio>: al montarlo hay que aplicarle la velocidad ya elegida.
  useEffect(() => applySpeed(speed));

  const chooseSpeed = (s: number) => {
    setSpeed(s);
    save("podcastSpeed", s);
    applySpeed(s);
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => undefined);
    else a.pause();
  };

  const skip = (seconds: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(a.duration || Infinity, Math.max(0, a.currentTime + seconds));
  };

  const seekTo = (seconds: number) => {
    const a = audioRef.current;
    if (a) a.currentTime = seconds;
  };

  // Controles de la pantalla de bloqueo y de los auriculares.
  useEffect(() => {
    if (!playing || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.metadata = new MediaMetadata({
      title: name,
      artist: "Andiamo · Podcast",
      artwork: artwork ? [{ src: artwork, sizes: "512x512", type: artwork.endsWith(".webp") ? "image/webp" : "image/jpeg" }] : [],
    });
    const a = audioRef.current;
    const set = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        /* acción no disponible en este navegador */
      }
    };
    set("play", () => void a?.play());
    set("pause", () => a?.pause());
    set("seekbackward", () => skip(-BACK_S));
    set("seekforward", () => skip(FORWARD_S));
    set("seekto", (d) => {
      if (d.seekTime !== undefined) seekTo(d.seekTime);
    });
    return () => {
      (["play", "pause", "seekbackward", "seekforward", "seekto"] as MediaSessionAction[]).forEach((x) => set(x, null));
    };
    // skip y seekTo solo leen el <audio> a través de la referencia, por eso no son dependencias.
  }, [playing, name, artwork]);

  const syncPosition = () => {
    const a = audioRef.current;
    if (!a || !("mediaSession" in navigator) || !Number.isFinite(a.duration)) return;
    try {
      navigator.mediaSession.setPositionState({ duration: a.duration, playbackRate: a.playbackRate, position: a.currentTime });
    } catch {
      /* valores fuera de rango mientras carga */
    }
  };

  return (
    <section className="podcast" id="podcast" aria-label={`Podcast: ${name}`}>
      {/* preload="none": el archivo no se descarga hasta que se pulsa reproducir, para no gastar datos. */}
      <audio
        ref={audioRef}
        preload="none"
        src={podcastSrc(podcast)}
        onPlay={() => {
          setMissing(false);
          setPlaying(true);
          onPlay();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          applySpeed(speed); // Safari restablece la velocidad al cargar
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onSeeked={syncPosition}
        onRateChange={syncPosition}
        onError={() => setMissing(!navigator.onLine)}
      />

      {/* Compacto: reproducir y título en una línea; saltos, barra y velocidad se despliegan aparte. */}
      <div className="podcast-head">
        <button
          type="button"
          className={`podcast-play${playing ? " playing" : ""}`}
          onClick={toggle}
          aria-label={playing ? "Pausar el podcast" : "Reproducir el podcast"}
        >
          <PlayIcon />
          <PauseIcon />
        </button>
        <div className="podcast-title">
          <h3>Podcast · {podcast.min} min</h3>
          <p className="podcast-sub">{playing || time > 0 ? `${clock(time)} de ${clock(total)}` : name}</p>
        </div>
        <button
          type="button"
          className={`podcast-toggle${open ? " open" : ""}`}
          aria-expanded={open}
          aria-controls="podcast-more"
          aria-label={open ? "Ocultar los controles del podcast" : "Mostrar los controles del podcast"}
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown />
        </button>
      </div>

      <div className={`podcast-more${open ? " open" : ""}`} id="podcast-more" inert={!open}>
        <div className="podcast-more-inner">
          <div className="podcast-main">
            <button type="button" className="podcast-skip" onClick={() => skip(-BACK_S)} aria-label={`Retroceder ${BACK_S} segundos`}>
              −{BACK_S}
              <br />s
            </button>
            <button type="button" className="podcast-skip" onClick={() => skip(FORWARD_S)} aria-label={`Avanzar ${FORWARD_S} segundos`}>
              +{FORWARD_S}
              <br />s
            </button>
          </div>

          <div className="podcast-seek">
            <input
              type="range"
              min={0}
              max={Math.floor(total)}
              step={1}
              value={Math.min(time, total)}
              onChange={(e) => seekTo(Number(e.target.value))}
              aria-label="Posición del podcast"
              aria-valuetext={`${clock(time)} de ${clock(total)}`}
            />
            <div className="podcast-times" aria-hidden="true">
              <span>{clock(time)}</span>
              <span>{clock(total)}</span>
            </div>
          </div>

          <div className="podcast-speed" role="group" aria-label="Velocidad de reproducción">
            {SPEEDS.map((s) => (
              <button key={s} type="button" className={s === speed ? "on" : ""} aria-pressed={s === speed} onClick={() => chooseSpeed(s)}>
                {Number.isInteger(s) ? `${s}x` : `${s}x`.replace(".", ",")}
              </button>
            ))}
          </div>
          <p className="podcast-note">
            Generado con inteligencia artificial a partir de nuestros dosieres de investigación. Puede contener errores.
          </p>
        </div>
      </div>

      {missing && (
        <p className="offline-error" role="alert">
          Este podcast no está descargado y ahora no hay conexión. Puedes descargarlo desde la portada, con wifi.
        </p>
      )}

    </section>
  );
}
