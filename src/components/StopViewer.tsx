import { useState } from "react";
import type { Stop } from "../data/types";
import { audioFile, audioSrc, useAudioManifest } from "../lib/audio";
import { mapsDirectionsUrl } from "../lib/geo";
import { useSpeech, type Playable } from "../lib/useSpeech";
import { ExternalIcon, MapIcon, PlayIcon, StopIcon } from "./Icons";

const wave = Array.from({ length: 40 }, (_, i) => ({
  height: 30 + Math.round(Math.abs(Math.sin(i * 1.7)) * 70),
  delay: (i % 8) * 0.11,
}));

/** Contenido de una parada: foto con puntos (o texto), audio, lugares que ver y enlace externo. */
export function StopViewer({ stop }: { stop: Stop }) {
  const [active, setActive] = useState(0);
  const [playingAll, setPlayingAll] = useState(false);
  const manifest = useAudioManifest();
  const { supported, playing, speak, stop: stopSpeech } = useSpeech();

  const points = stop.points ?? [];
  const hasPhoto = Boolean(stop.photo && points.length > 0);
  const point = points[active];

  // Lo que se reproduce: un elemento por punto de la foto, o uno solo con toda la historia de la parada.
  const items: Playable[] = hasPhoto
    ? points.map((p, i) => ({
        text: `${p.title}. ${p.text}`,
        src: audioSrc(manifest, audioFile(stop.id, i + 1)),
      }))
    : [{ text: `${stop.name}. ${stop.text.join(" ")}`, src: audioSrc(manifest, audioFile(stop.id)) }];
  const canPlay = supported || items.some((i) => i.src);

  const choose = (i: number) => {
    stopSpeech();
    setPlayingAll(false);
    setActive(Math.max(0, Math.min(points.length - 1, i)));
  };

  const togglePlay = () => {
    if (playing) {
      stopSpeech();
      setPlayingAll(false);
    } else if (hasPhoto) {
      speak([items[active]]);
    } else {
      speak(items);
    }
  };

  const togglePlayAll = () => {
    if (playing) {
      stopSpeech();
      setPlayingAll(false);
      return;
    }
    const from = active === points.length - 1 ? 0 : active;
    setPlayingAll(true);
    speak(items.slice(from), (i) => setActive(from + i));
  };

  const allLabel = `Escuchar toda la guía, ${points.length} puntos`;

  return (
    <>
      {hasPhoto && stop.photo && (
        <>
          <figure className="viewer">
            <div className="viewer-frame" style={{ aspectRatio: stop.photo.ratio }}>
              <img src={stop.photo.src} alt={stop.photo.alt} />
              {points.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  className={`hot${i === active ? " active" : ""}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-label={`Punto ${i + 1}: ${p.title}`}
                  aria-pressed={i === active}
                  onClick={() => choose(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <figcaption>{stop.photo.credit}</figcaption>
          </figure>

          <div className="point" aria-live="polite">
            <h3>
              {active + 1}. {point.title}
            </h3>
            <p>{point.text}</p>
            <div className="point-nav">
              <button type="button" className="btn btn-small" disabled={active === 0} onClick={() => choose(active - 1)}>
                Anterior
              </button>
              <button
                type="button"
                className="btn btn-small"
                disabled={active === points.length - 1}
                onClick={() => choose(active + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {!hasPhoto && (
        <div className="story">
          {stop.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}

      {canPlay ? (
        <>
          <div className={`audio${playing ? " playing" : ""}`}>
            <button
              type="button"
              className="play"
              onClick={togglePlay}
              aria-label={playing ? "Parar el audio" : "Escuchar"}
            >
              {playing ? <StopIcon /> : <PlayIcon />}
            </button>
            <div>
              <p className="audio-title">{hasPhoto ? "Escuchar este punto" : "Escuchar la historia"}</p>
              <p className="audio-sub">
                {hasPhoto ? `Punto ${active + 1} de ${points.length}` : "Historia narrada"}
              </p>
              <div className="wave" aria-hidden="true">
                {wave.map((w, i) => (
                  <i key={i} style={{ height: `${w.height}%`, animationDelay: `${w.delay}s` }} />
                ))}
              </div>
            </div>
          </div>
          {hasPhoto && (
            <button type="button" className="btn audio-all" onClick={togglePlayAll}>
              {playing && playingAll ? "Parar la guía" : allLabel}
            </button>
          )}
        </>
      ) : (
        <p className="empty">Este navegador no puede leer los textos en voz alta. Los podéis leer en pantalla.</p>
      )}

      {stop.highlights && stop.highlights.length > 0 && (
        <section className="highlights" aria-label="Qué ver aquí">
          <h3>Qué ver aquí</h3>
          <ol>
            {stop.highlights.map((h) => (
              <li key={h.name}>
                <span className="hl-name">{h.name}</span>
                <span className="hl-note">{h.note}</span>
                {h.lat !== undefined && h.lng !== undefined && (
                  <a
                    className="hl-maps"
                    href={mapsDirectionsUrl({ destination: { lat: h.lat, lng: h.lng } })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir en Google Maps la ruta a ${h.name} desde mi ubicación`}
                  >
                    <MapIcon /> Cómo llegar
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {stop.viator && (
        <a className="viator" href={stop.viator.url} target="_blank" rel="noopener noreferrer">
          <span>
            <strong>Completar en AudioViator</strong>
            {stop.viator.note ?? "Audioguía completa de este lugar."} Se abre en otra web.
          </span>
          <ExternalIcon />
        </a>
      )}
    </>
  );
}
