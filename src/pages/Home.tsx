import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { OfflineCard } from "../components/OfflineCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { days, romanNumerals } from "../data/itinerario";
import { podcasts } from "../data/podcasts";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

const HERO_IMG = "/img/monumentos/coliseo.webp";

const totalStops = days.reduce((n, d) => n + d.stops.length, 0);
// Varias paradas comparten podcast: se cuentan los archivos distintos.
const totalPodcasts = new Set(Object.values(podcasts).map((p) => p.file)).size;

/**
 * Portada: una foto a sangre con el título (con un zoom lento de alejamiento), y debajo un
 * selector de día con una tira de fotos de sus paradas, que llevan a la ficha real de cada una.
 */
export function Home() {
  const { visited, resetVisited } = useApp();
  const { resetAlerts } = useTracking();

  // Para retomar el paseo: la siguiente parada sin ver del día de la última que se marcó como vista.
  const resume = (() => {
    const lastId = visited[visited.length - 1];
    const day = days.find((d) => d.stops.some((s) => s.id === lastId));
    const next = day?.stops.find((s) => !visited.includes(s.id));
    if (!day || !next) return null;
    return {
      day,
      stop: next,
      seen: day.stops.filter((s) => visited.includes(s.id)).length,
    };
  })();

  const [active, setActive] = useState(() => (resume ? days.indexOf(resume.day) : 0));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const day = days[active];
  const photos = day.stops.filter((s) => s.photo);

  // Flechas, inicio y fin para moverse entre los días, como en cualquier selector de pestañas.
  const onTabKey = (e: KeyboardEvent) => {
    const to =
      e.key === "ArrowRight" ? (active + 1) % days.length
      : e.key === "ArrowLeft" ? (active + days.length - 1) % days.length
      : e.key === "Home" ? 0
      : e.key === "End" ? days.length - 1
      : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    tabs.current[to]?.focus();
  };

  return (
    <div className="home">
      <header className="home-hero">
        <div className="home-hero-bg" style={{ backgroundImage: `url(${HERO_IMG})` }} aria-hidden="true" />
        <div className="home-hero-scrim" aria-hidden="true" />
        <ThemeToggle />
        <div className="home-hero-copy">
          <p className="home-kicker">Bienvenidos a</p>
          <h1>Andiamo</h1>
          <ul className="home-facts">
            <li>{days.length} días</li>
            <li>{totalStops} paradas</li>
            <li>{totalPodcasts} podcasts</li>
          </ul>
        </div>
      </header>

      <section className="home-days">
        {resume && (
          <Link className="resume" to={`/dia/${resume.day.id}/parada/${resume.stop.id}`}>
            {resume.stop.photo && <img src={resume.stop.photo.src} alt="" />}
            <span className="resume-body">
              <small>
                Día {romanNumerals[days.indexOf(resume.day)] ?? resume.day.id} · {resume.seen} de {resume.day.stops.length} vistas
              </small>
              <strong>Continuar en {resume.stop.name}</strong>
              <span className="resume-go">Retomar la ruta</span>
              <span className="resume-bar" aria-hidden="true">
                <i style={{ width: `${(resume.seen / resume.day.stops.length) * 100}%` }} />
              </span>
            </span>
          </Link>
        )}

        <div className="home-tabs" role="tablist" aria-label="Elegir día" onKeyDown={onTabKey}>
          <span className="home-tabs-pill" style={{ transform: `translateX(${active * 100}%)` }} aria-hidden="true" />
          {days.map((d, i) => (
            <button
              key={d.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${d.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="home-day-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
            >
              Día {romanNumerals[i] ?? i + 1}
            </button>
          ))}
        </div>

        {/* Con key, al cambiar de día el contenido se vuelve a montar y entra con un fundido corto. */}
        <div key={day.id} className="home-day-body" id="home-day-panel" role="tabpanel" aria-labelledby={`tab-${day.id}`}>
          <h2 className="home-day-title">{day.title}</h2>
          <p className="home-day-meta">{day.stops.length === 1 ? "1 parada" : `${day.stops.length} paradas`}</p>

          <div className="home-strip">
            {photos.map((s) => (
              <Link key={s.id} to={`/dia/${day.id}/parada/${s.id}`} className="home-thumb">
                <img src={s.photo?.src} alt="" loading="lazy" />
                <span>{s.name}</span>
              </Link>
            ))}
          </div>

          <Link className="btn btn-primary btn-wide" to={`/dia/${day.id}`}>
            Ver la ruta del día {romanNumerals[active] ?? active + 1}
          </Link>
        </div>

        <OfflineCard />

        {visited.length > 0 && (
          <p className="note">
            Lleváis {visited.length} {visited.length === 1 ? "parada vista" : "paradas vistas"}.{" "}
            <button
              type="button"
              className="link"
              onClick={() => {
                resetVisited();
                resetAlerts();
              }}
            >
              Empezar de cero
            </button>
          </p>
        )}
        <p className="note">
          Los textos de las paradas son un borrador que seguimos contrastando con fuentes fiables.
        </p>
      </section>
    </div>
  );
}
