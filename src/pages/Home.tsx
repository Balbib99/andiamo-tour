import { useState } from "react";
import { Link } from "react-router-dom";
import { days, romanNumerals } from "../data/itinerario";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

const HERO_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg";

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6.5" y="2" width="5" height="9" rx="2.5" />
      <path d="M3.5 8.5a5.5 5.5 0 0 0 11 0M9 14v2.5M6.5 16.5h5" />
    </svg>
  );
}
function GpsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="9" r="6" />
      <path d="M9 1.2v2.4M9 14.4v2.4M1.2 9h2.4M14.4 9h2.4" />
    </svg>
  );
}
function DropIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2.3S3.6 8.4 3.6 11.7a5.4 5.4 0 0 0 10.8 0C14.4 8.4 9 2.3 9 2.3Z" />
    </svg>
  );
}

const FEATURES = [
  { Icon: MicIcon, label: ["Audioguía", "en cada parada"] },
  { Icon: GpsIcon, label: ["Mapa con", "GPS en vivo"] },
  { Icon: DropIcon, label: ["Fuentes de", "agua potable"] },
];

/**
 * Portada: una foto a sangre con el título (con un zoom lento de alejamiento), y debajo un
 * selector de día con una tira de fotos de sus paradas, que llevan a la ficha real de cada una.
 */
export function Home() {
  const { visited, resetVisited } = useApp();
  const { resetAlerts } = useTracking();
  const [active, setActive] = useState(0);

  const day = days[active];
  const photos = day.stops.filter((s) => s.photo);

  return (
    <div className="home">
      <header className="home-hero">
        <div className="home-hero-bg" style={{ backgroundImage: `url(${HERO_IMG})` }} aria-hidden="true" />
        <div className="home-hero-scrim" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="home-kicker">Bienvenidos a</p>
          <h1>Andiamo!!</h1>
          <p className="home-sub">3 días &middot; todo a pie &middot; noviembre 2026</p>
        </div>
        <ul className="home-features">
          {FEATURES.map(({ Icon, label }) => (
            <li key={label[0]}>
              <span className="home-feature-icon">
                <Icon />
              </span>
              <span>
                {label[0]}
                <br />
                {label[1]}
              </span>
            </li>
          ))}
        </ul>
      </header>

      <section className="home-days">
        <div className="home-tabs" role="tablist" aria-label="Elegir día">
          {days.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={i === active ? "on" : ""}
              onClick={() => setActive(i)}
            >
              Día {romanNumerals[i] ?? i + 1}
            </button>
          ))}
        </div>

        <h2 className="home-day-title">{day.title}</h2>
        <p className="home-day-meta">
          {photos.length} paradas con foto de {day.stops.length} en total
        </p>

        <div className="home-strip">
          {photos.map((s) => (
            <Link key={s.id} to={`/dia/${day.id}/parada/${s.id}`} className="home-thumb">
              <img src={s.photo?.src} alt="" loading="lazy" />
              <span>{s.name}</span>
            </Link>
          ))}
        </div>

        <Link className="btn btn-primary home-cta" to={`/dia/${day.id}`}>
          Ver la ruta del día {romanNumerals[active] ?? active + 1}
        </Link>

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
