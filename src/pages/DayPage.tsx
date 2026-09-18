import { Link, Navigate, useParams } from "react-router-dom";
import { AudioIcon, ChevronLeft, CheckIcon, MapIcon, PhotoIcon } from "../components/Icons";
import { LodgingCard } from "../components/LodgingCard";
import { findDay } from "../data/itinerario";
import { distanceM, formatDistance, mapsDirectionsUrl, routePoints } from "../lib/geo";
import { useFootRoute } from "../lib/routing";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

const MAPS_STOPS = 10;

export function DayPage() {
  const { dayId } = useParams();
  const day = findDay(dayId);
  const { lodging, visited, resetVisited, fountainsOn, setFountainsOn, requestFit } = useApp();
  const { status, position, followingDay, start, stop, resetAlerts } = useTracking();
  const foot = useFootRoute(day && day.stops.length ? routePoints(lodging, day.stops) : null);

  if (!day) return <Navigate to="/" replace />;

  const following = followingDay === day.id;
  const seen = day.stops.filter((s) => visited.includes(s.id)).length;
  const approx = foot && !foot.exact ? "unos " : "";
  // Con alojamiento, el primer tramo va del alojamiento a la parada 1; sin él, los tramos empiezan en la parada 1.
  const legOffset = lodging ? 1 : 0;
  const legAfter = (stopIndex: number) => foot?.legs[stopIndex + legOffset];
  // Google Maps admite como máximo 9 paradas intermedias por enlace: los días largos se parten en tramos de 10 paradas.
  const chunks = Array.from({ length: Math.ceil(day.stops.length / MAPS_STOPS) }, (_, k) =>
    day.stops.slice(k * MAPS_STOPS, (k + 1) * MAPS_STOPS),
  );

  return (
    <>
      <Link className="back" to="/">
        <ChevronLeft /> Todos los días
      </Link>
      <h2>
        Día <span className="num">{day.id}</span>: {day.title}
      </h2>

      {day.stops.length === 0 ? (
        <div className="empty">
          <strong>Aún no hay ruta para este día.</strong>
          Añadid los lugares que queréis visitar y aquí aparecerán el mapa, las paradas y sus historias.
        </div>
      ) : (
        <>
          {!lodging && <LodgingCard />}

          <div className="chips">
            {foot && (
              <>
                <span className="chip">
                  {approx}
                  {formatDistance(foot.km * 1000)}
                </span>
                <span className="chip">
                  {approx}
                  {foot.min} min a pie
                </span>
              </>
            )}
            <span className="chip">{day.stops.length} paradas</span>
            {seen > 0 && (
              <span className="chip chip-done">
                {seen} de {day.stops.length} vistas
              </span>
            )}
          </div>

          <div className="actions">
            {following ? (
              <button type="button" className="btn btn-primary" onClick={stop}>
                Parar ruta
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => start(day.id)}>
                Empezar ruta
              </button>
            )}
            {chunks.map((chunk, k) => {
              const origin = k === 0 ? (lodging ?? undefined) : chunks[k - 1][chunks[k - 1].length - 1];
              const from = k * MAPS_STOPS + 1;
              const to = k * MAPS_STOPS + chunk.length;
              return (
                <a
                  key={from}
                  className="btn"
                  href={mapsDirectionsUrl({
                    origin,
                    destination: chunk[chunk.length - 1],
                    waypoints: chunk.slice(0, -1),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapIcon /> {chunks.length === 1 ? "Ruta del día en Maps" : from === to ? `Maps: parada ${from}` : `Maps: paradas ${from} a ${to}`}
                </a>
              );
            })}
            <button type="button" className="btn" onClick={requestFit}>
              Ver todo el recorrido
            </button>
          </div>

          {!following && status === "off" && (
            <p className="hint">
              Al empezar, la web sigue vuestra posición y avisa al acercaros a cada parada. Mantened la pantalla
              encendida y aceptad el permiso de ubicación.
            </p>
          )}

          <label className="toggle">
            <input type="checkbox" checked={fountainsOn} onChange={(e) => setFountainsOn(e.target.checked)} />
            <span>Mostrar fuentes de agua potable en el mapa</span>
          </label>

          <ol className="route">
            {lodging && (
              <li>
                <div className="step">
                  <span className="step-dot origin" aria-hidden="true">
                    &#8962;
                  </span>
                  <span className="step-name">Alojamiento</span>
                  <span className="step-teaser">{lodging.name}</span>
                  {foot && <span className="leg">{foot.legs[0].min} min andando hasta la parada 1</span>}
                </div>
              </li>
            )}
            {day.stops.map((s, i) => {
              const isSeen = visited.includes(s.id);
              const next = i < day.stops.length - 1 ? legAfter(i) : undefined;
              return (
                <li key={s.id}>
                  <Link className="step" to={`/dia/${day.id}/parada/${s.id}`}>
                    <span className={`step-dot${isSeen ? " done" : ""}`} aria-hidden="true">
                      {isSeen ? <CheckIcon /> : i + 1}
                    </span>
                    <span className="step-name">{s.name}</span>
                    <span className="step-teaser">{s.teaser}</span>
                    <span className="step-tags">
                      <span>
                        <AudioIcon /> Audio {s.audio}
                      </span>
                      {s.photo && (
                        <span>
                          <PhotoIcon /> Fotos
                        </span>
                      )}
                      {isSeen && <span className="seen">Vista</span>}
                      {position && !isSeen && <span className="near-now">a {formatDistance(distanceM(position, s))}</span>}
                    </span>
                  </Link>
                  <a
                    className="step-maps"
                    href={mapsDirectionsUrl({ destination: s })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir en Google Maps la ruta a ${s.name} desde mi ubicación`}
                  >
                    <MapIcon /> Abrir en Maps
                  </a>
                  {next && (
                    <span className="leg">
                      {next.min} min andando hasta la parada {i + 2}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          {seen > 0 && (
            <p className="note">
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
        </>
      )}
    </>
  );
}
