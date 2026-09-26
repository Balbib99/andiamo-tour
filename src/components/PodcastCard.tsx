import { useEffect, useState, type RefObject } from "react";
import type { Podcast } from "../data/podcasts";
import { podcastSrc } from "../data/podcasts";
import { load, save } from "../lib/storage";
import { MicIcon } from "./Icons";

interface Props {
  podcast: Podcast;
  name: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  /** Se avisa al empezar a sonar, para parar la guía de los puntos y que no suenen las dos a la vez. */
  onPlay: () => void;
}

/** Velocidades a elegir. La preferencia se guarda en el móvil y se aplica también a los siguientes podcasts. */
const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

/** Tarjeta con el podcast de una parada: una conversación larga, para escuchar sin mirar la pantalla. */
export function PodcastCard({ podcast, name, audioRef, onPlay }: Props) {
  const [speed, setSpeed] = useState(() => load("podcastSpeed", 1));

  // Cada parada crea su propio <audio>: al montarlo hay que aplicarle la velocidad ya elegida.
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [audioRef, speed]);

  const chooseSpeed = (s: number) => {
    setSpeed(s);
    save("podcastSpeed", s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  return (
    <section className="podcast" aria-label={`Podcast: ${name}`}>
      <div className="podcast-head">
        <span className="podcast-icon">
          <MicIcon />
        </span>
        <div>
          <h3>Podcast: {name}</h3>
          <p className="podcast-sub">Conversación de unos {podcast.min} minutos</p>
        </div>
      </div>
      {/* preload="none": el archivo no se descarga hasta que se pulsa reproducir, para no gastar datos. */}
      <audio ref={audioRef} controls preload="none" src={podcastSrc(podcast)} onPlay={onPlay}>
        Este navegador no puede reproducir el podcast.
      </audio>
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
    </section>
  );
}
