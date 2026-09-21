import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { AudioIcon, ChevronLeft, CheckIcon, MapIcon, PhotoIcon } from "../components/Icons";
import { LodgingCard } from "../components/LodgingCard";
import { findDay } from "../data/itinerario";
import { stopAudioLabel, useAudioManifest } from "../lib/audio";
import { distanceM, formatDistance, mapsDirectionsUrl } from "../lib/geo";
import { useLiveRoute } from "../lib/useLiveRoute";
import { useApp, type FountainMode } from "../state/AppState";
import { useTracking } from "../state/Tracking";

const MAPS_STOPS = 10;

const FOUNTAIN_OPTIONS: { mode: FountainMode; label: string; help: string }[] = [
  { mode: "off", label: "Ninguna", help: "" },
  { mode: "fotos", label: "Con foto real", help: "Solo las fuentes de las que tenemos una foto real." },
  { mode: "todas", label: "Todas", help: "Todas las que constan en OpenStreetMap; alguna puede haber desaparecido." },
];

export function DayPage() {
  const { dayId } = useParams();
  const day = findDay(dayId);
  const { lodging, visited, resetVisited, fountainMode, setFountainMode, requestFit } = useApp();
  const { status, position, followingDay, start, stop, resetAlerts, simulate, simulating } = useTracking();
  const [params] = useSearchParams();
  const testMode = params.has("prueba");
  const { live, pending, foot } = useLiveRoute(day);
  const manifest = useAudioManifest();

  if (!day) return <Navigate to="/" replace />;

  const following = followingDay === day.id;
  const seen = day.stops.filter((s) => visited.includes(s.id)).length;
  const approx = foot && !foot.exact ? "unos " : "";
  // Con alojamiento, el primer tramo va del alojamiento a la parada 1; sin él, los tramos empiezan en la parada 1.
  const legOffset = lodging ? 1 : 0;
  // Tiempo entre una parada y la siguiente. Si la ruta sale de tu ubicación, solo hay tramos entre paradas pendientes.
  const legAfter = (stopIndex: number) => {
    if (!foot) return undefined;
    if (!live) return foot.legs[stopIndex + legOffset];
    const p = pending.findIndex((s) => s.id === day.stops[stopIndex].id);
    const nextIsPending = p >= 0 && pending[p + 1]?.id === day.stops[stopIndex + 1]?.id;
    return nextIsPending ? foot.legs[p + 1] : undefined;
  };
  const firstPending = live ? day.stops.findIndex((s) => s.id === pending[0].id) : -1;
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
                  {live ? "Faltan " : approx}
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

          {testMode && (
            <div className="sim">
              <button
                type="button"
                className="btn"
                onClick={() => (simulating ? stop() : simulate(day.id))}
              >
                {simulating ? "Parar simulación" : "Simular paseo por este día"}
              </button>
              <p className="hint">
                Modo prueba: la web finge que camináis la ruta desde el alojamiento y se detiene unos segundos en
                cada parada. Al empezar borra las paradas vistas.
              </p>
            </div>
          )}

          {!following && status === "off" && (
            <p className="hint">
              Al empezar, la web sigue vuestra posición y avisa al acercaros a cada parada. Mantened la pantalla
              encendida y aceptad el permiso de ubicación.
            </p>
          )}

          <fieldset className="fountains">
            <legend>Fuentes de agua en el mapa</legend>
            <div className="segmented">
              {FOUNTAIN_OPTIONS.map((o) => (
                <label key={o.mode} className={fountainMode === o.mode ? "on" : ""}>
                  <input
                    type="radio"
                    name="fountain-mode"
                    value={o.mode}
                    checked={fountainMode === o.mode}
                    onChange={() => setFountainMode(o.mode)}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            {fountainMode !== "off" && (
              <p className="hint hint-tight">
                {FOUNTAIN_OPTIONS.find((o) => o.mode === fountainMode)?.help} Toca un punto del mapa para verla.
              </p>
            )}
          </fieldset>

          <ol className="route">
            {live && foot ? (
              <li>
                <div className="step">
                  <span className="step-dot you" aria-hidden="true" />
                  <span className="step-name">Tu ubicación</span>
                  <span className="step-teaser">La ruta sale de donde estás y sigue por las paradas que faltan.</span>
                  <span className="leg">
                    {foot.legs[0].min} min andando hasta la parada {firstPending + 1}
                  </span>
                </div>
              </li>
            ) : (
              lodging && (
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
              )
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
                        <AudioIcon /> Audio {stopAudioLabel(s, manifest)}
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
