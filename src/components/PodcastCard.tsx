import type { Ref } from "react";
import type { Podcast } from "../data/podcasts";
import { podcastSrc } from "../data/podcasts";
import { MicIcon } from "./Icons";

interface Props {
  podcast: Podcast;
  name: string;
  audioRef: Ref<HTMLAudioElement>;
  /** Se avisa al empezar a sonar, para parar la guía de los puntos y que no suenen las dos a la vez. */
  onPlay: () => void;
}

/** Tarjeta con el podcast de una parada: una conversación larga, para escuchar sin mirar la pantalla. */
export function PodcastCard({ podcast, name, audioRef, onPlay }: Props) {
  return (
    <section className="podcast" aria-label={`Podcast: ${name}`}>
      <div className="podcast-head">
        <span className="podcast-icon">
          <MicIcon />
        </span>
        <div>
          <h3>Podcast: {name}</h3>
          <p className="podcast-sub">
            Conversación de unos {podcast.min} minutos
          </p>
        </div>
      </div>
      {/* preload="none": el archivo no se descarga hasta que se pulsa reproducir, para no gastar datos. */}
      <audio
        ref={audioRef}
        controls
        preload="none"
        src={podcastSrc(podcast)}
        onPlay={onPlay}
      >
        Este navegador no puede reproducir el podcast.
      </audio>
      <p className="podcast-note">
        Generado con inteligencia artificial a partir de nuestros dosieres de
        investigación. Puede contener errores.
      </p>
    </section>
  );
}
