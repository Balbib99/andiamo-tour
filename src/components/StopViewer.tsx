import { useEffect, useRef, useState } from "react";
import { podcasts } from "../data/podcasts";
import type { Stop } from "../data/types";
import { audioFile, audioSrc, useAudioManifest } from "../lib/audio";
import { mapsDirectionsUrl } from "../lib/geo";
import { useSpeech, type Playable } from "../lib/useSpeech";
import { ChevronDown, EatIcon, ExternalIcon, MapIcon, PlayIcon, StopIcon } from "./Icons";
import { PodcastCard } from "./PodcastCard";

const wave = Array.from({ length: 40 }, (_, i) => ({
  height: 30 + Math.round(Math.abs(Math.sin(i * 1.7)) * 70),
  delay: (i % 8) * 0.11,
}));

interface Section {
  id: string;
  label: string;
}

/** Barra fija de enlaces a las secciones de la parada: con ella se llega a cualquiera sin recorrer toda la página. */
function SectionNav({ sections }: { sections: Section[] }) {
  const [current, setCurrent] = useState(sections[0]?.id);
  const key = sections.map((s) => s.id).join();

  // La sección activa es la última cuyo comienzo ya ha pasado de la barra, o la última de todas si se llega al final.
  // Se escucha el desplazamiento de cualquier contenedor (en el móvil, la página; en el ordenador, el panel).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let active = sections[0]?.id;
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) active = s.id;
      });
      setCurrent(atEnd ? sections[sections.length - 1]?.id : active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el instanceof HTMLDetailsElement) el.open = true;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    setCurrent(id);
  };

  if (sections.length < 2) return null;
  return (
    <nav className="section-nav" aria-label="Secciones de la parada">
      {sections.map((s) => (
        <button key={s.id} type="button" className={s.id === current ? "on" : ""} aria-current={s.id === current} onClick={() => go(s.id)}>
          {s.label}
        </button>
      ))}
    </nav>
  );
}

/** Contenido de una parada: foto con puntos (o texto), audio, lugares que ver y enlace externo. */
export function StopViewer({ stop }: { stop: Stop }) {
  const [active, setActive] = useState(0);
  const [playingAll, setPlayingAll] = useState(false);
  const manifest = useAudioManifest();
  const { supported, playing, speak, stop: stopSpeech } = useSpeech();

  const podcast = podcasts[stop.id];
  const podcastRef = useRef<HTMLAudioElement>(null);

  const points = stop.points ?? [];
  const hasPhoto = Boolean(stop.photo && points.length > 0);
  const point = points[active];

  // Las fotos panorámicas serían muy bajas en el móvil y los puntos se amontonarían: se dejan más anchas y se desliza.
  const [pw, ph] = (stop.photo?.ratio ?? "1 / 1").split("/").map(Number);
  const wide = pw / ph > 2;
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = scroller.current;
    const dot = box?.querySelector<HTMLElement>(".hot.active");
    if (box && dot && wide)
      box.scrollTo({
        left: dot.offsetLeft - box.clientWidth / 2,
        behavior: "smooth",
      });
  }, [active, wide]);

  // Lo que se reproduce: un elemento por punto de la foto, o uno solo con toda la historia de la parada.
  const items: Playable[] = hasPhoto
    ? points.map((p, i) => ({
        text: `${p.title}. ${p.text}`,
        src: audioSrc(manifest, audioFile(stop.id, i + 1)),
      }))
    : [
        {
          text: `${stop.name}. ${stop.text.join(" ")}`,
          src: audioSrc(manifest, audioFile(stop.id)),
        },
      ];
  const canPlay = supported || items.some((i) => i.src);

  const choose = (i: number) => {
    stopSpeech();
    setPlayingAll(false);
    setActive(Math.max(0, Math.min(points.length - 1, i)));
  };

  // La guía y el podcast no suenan a la vez: al empezar una se para la otra.
  const pausePodcast = () => podcastRef.current?.pause();

  const togglePlay = () => {
    if (playing) {
      stopSpeech();
      setPlayingAll(false);
    } else if (hasPhoto) {
      pausePodcast();
      speak([items[active]]);
    } else {
      pausePodcast();
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
    pausePodcast();
    setPlayingAll(true);
    speak(items.slice(from), (i) => setActive(from + i));
  };

  const [allEats, setAllEats] = useState(false);
  const eats = stop.eat ?? [];
  const shownEats = allEats ? eats : eats.slice(0, 1);

  const sections: Section[] = [
    { id: "fotos", label: hasPhoto ? "Fotos" : "Historia" },
    ...(podcast ? [{ id: "podcast", label: "Podcast" }] : []),
    ...(stop.highlights?.length ? [{ id: "que-ver", label: "Qué ver" }] : []),
    ...(eats.length ? [{ id: "comer", label: "Comer" }] : []),
  ];

  const allLabel = `Escuchar toda la guía, ${points.length} puntos`;

  return (
    <>
      <SectionNav sections={sections} />
      <div id="fotos" className="anchor" />
      {hasPhoto && stop.photo && (
        <>
          <figure className="viewer">
            <div
              ref={scroller}
              className={`viewer-scroll${wide ? " wide" : ""}`}
            >
              <div
                className="viewer-frame"
                style={{ aspectRatio: stop.photo.ratio }}
              >
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
            </div>
            <figcaption>{stop.photo.credit}</figcaption>
          </figure>

          <div className="point" aria-live="polite">
            <h3>
              {active + 1}. {point.title}
            </h3>
            <p>{point.text}</p>
            <div className="point-nav">
              <button
                type="button"
                className="btn btn-small"
                disabled={active === 0}
                onClick={() => choose(active - 1)}
              >
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
              <p className="audio-title">
                {hasPhoto ? "Escuchar este punto" : "Escuchar la historia"}
              </p>
              <p className="audio-sub">
                {hasPhoto
                  ? `Punto ${active + 1} de ${points.length}`
                  : "Historia narrada"}
              </p>
              <div className="wave" aria-hidden="true">
                {wave.map((w, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${w.height}%`,
                      animationDelay: `${w.delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {hasPhoto && (
            <button
              type="button"
              className="btn audio-all"
              onClick={togglePlayAll}
            >
              {playing && playingAll ? "Parar la guía" : allLabel}
            </button>
          )}
        </>
      ) : (
        <p className="empty">
          Este navegador no puede leer los textos en voz alta. Los podéis leer
          en pantalla.
        </p>
      )}

      {podcast && (
        <PodcastCard
          podcast={podcast}
          name={stop.name}
          audioRef={podcastRef}
          artwork={stop.photo?.src}
          onPlay={() => {
            stopSpeech();
            setPlayingAll(false);
          }}
        />
      )}

      {stop.highlights && stop.highlights.length > 0 && (
        <details className="highlights" id="que-ver">
          <summary>
            <h3>Qué ver aquí</h3>
            <span className="fold-count">{stop.highlights.length} lugares</span>
            <span className="fold-chev" aria-hidden="true">
              <ChevronDown />
            </span>
          </summary>
          <ol>
            {stop.highlights.map((h) => (
              <li key={h.name}>
                <span className="hl-name">{h.name}</span>
                <span className="hl-note">{h.note}</span>
                {h.lat !== undefined && h.lng !== undefined && (
                  <a
                    className="hl-maps"
                    href={mapsDirectionsUrl({
                      destination: { lat: h.lat, lng: h.lng },
                    })}
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
        </details>
      )}

      {stop.eat && stop.eat.length > 0 && (
        <section className="eat" id="comer" aria-label="Para comer o tomar algo">
          <header className="eat-head">
            <span className="eat-badge">
              <EatIcon />
            </span>
            <div>
              <h3>Para comer o tomar algo</h3>
              <p>Sitios cerca de esta parada. En el mapa los marca este símbolo.</p>
            </div>
          </header>
          <ul className="eat-list">
            {shownEats.map((e) => (
              <li className="eat-item" key={e.name}>
                <figure className="eat-photo">
                  <img src={e.photo.src} alt={e.photo.alt} loading="lazy" />
                </figure>
                <div className="eat-body">
                  <p className="eat-kind">{e.kind}</p>
                  <h4 className="eat-name">{e.name}</h4>
                  <p className="eat-note">{e.note}</p>
                  <a
                    className="eat-go"
                    href={mapsDirectionsUrl({ destination: e })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir en Google Maps la ruta a ${e.name} desde mi ubicación`}
                  >
                    <MapIcon /> Cómo llegar
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {eats.length > 1 && (
            <button type="button" className="btn btn-small eat-more" aria-expanded={allEats} onClick={() => setAllEats((v) => !v)}>
              {allEats ? "Ver menos" : `Ver ${eats.length - 1} más`}
            </button>
          )}
          <p className="eat-foot">Sitios del itinerario de la familia. Los detalles salen de las webs de los locales, guías y reseñas; comprobad el horario antes de ir.</p>
          <details className="eat-credits">
            <summary>Créditos de las fotos</summary>
            <ul>
              {stop.eat.map((e) => (
                <li key={e.name}>
                  {e.name}:{" "}
                  <a href={e.photo.page} target="_blank" rel="noopener noreferrer">
                    foto de {e.photo.author}, {e.photo.license}
                  </a>
                  {e.photo.illustrative ? " (ilustrativa: enseña el tipo de plato, no el local)" : ""}
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}

      {stop.viator && (
        <a
          className="viator"
          href={stop.viator.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <strong>Completar en AudioViator</strong>
            {stop.viator.note ?? "Audioguía completa de este lugar."} Se abre en
            otra web.
          </span>
          <ExternalIcon />
        </a>
      )}
    </>
  );
}
