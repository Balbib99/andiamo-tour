import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { OfflineCard } from "../components/OfflineCard";
import { days, romanNumerals } from "../data/itinerario";
import { podcasts } from "../data/podcasts";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

const HERO_IMG = "/img/monumentos/coliseo.jpg";

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
  const [active, setActive] = useState(0);
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
        <div className="home-hero-copy">
          <p className="home-kicker">Bienvenidos a</p>
          <h1>Andiamo</h1>
          <ul className="home-facts">
            <li>{days.length} días</li>
            <li>{totalStops} paradas</li>
            <li>{totalPodcasts} podcasts</li>
          </ul>
          <p className="home-line">Roma a pie, en noviembre de 2026.</p>
        </div>
      </header>

      <section className="home-days">
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
          Los textos de las paradas son un borrador que iremos afinando. Lo que lleva «(ejemplo)» es de prueba.
        </p>
      </section>
    </div>
  );
}
