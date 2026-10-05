import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckIcon, ChevronLeft, MapIcon } from "../components/Icons";
import { StopViewer } from "../components/StopViewer";
import { findDay, findStop } from "../data/itinerario";
import { distanceM, formatDistance, mapsDirectionsUrl } from "../lib/geo";
import { useLiveRoute } from "../lib/useLiveRoute";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

export function StopPage() {
  const { dayId, stopId } = useParams();
  const day = findDay(dayId);
  const stop = findStop(day, stopId);
  const { visited, toggleVisited } = useApp();
  const { position, status, alert } = useTracking();
  // El orden y la numeración de las paradas cambian cuando se empieza la ruta y se recalcula desde tu posición.
  const { stops, live, foot } = useLiveRoute(day);

  if (!day || !stop) return <Navigate to={day ? `/dia/${day.id}` : "/"} replace />;

  const index = stops.findIndex((s) => s.id === stop.id);
  const next = stops[index + 1];
  const isSeen = visited.includes(stop.id);
  // Minutos andando hasta la siguiente: solo se conocen con la ruta prevista (con la ruta en marcha sale de tu ubicación).
  const legMin = !live && next ? foot?.legs[index + 1]?.min : undefined;
  // Con el seguimiento en marcha, la barra de abajo la ocupa el aviso de la ruta: «Siguiente parada» se queda en su sitio.
  const tracking = status !== "off" || alert !== null;

  return (
    <>
      <Link className="back" to={`/dia/${day.id}`}>
        <ChevronLeft /> Volver a la ruta
      </Link>
      <h2>{stop.name}</h2>
      <div className="chips">
        <span className="chip era">{stop.era}</span>
        <span className="chip">
          Parada {index + 1} de {stops.length}
        </span>
        {position && <span className="chip">a {formatDistance(distanceM(position, stop))} de ti</span>}
      </div>

      <div className="quick">
        <a
          className="btn btn-primary"
          href={mapsDirectionsUrl({ destination: stop })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapIcon /> Cómo llegar desde aquí
        </a>
        <button
          type="button"
          className={`btn quick-seen${isSeen ? " btn-done" : ""}`}
          aria-pressed={isSeen}
          aria-label={isSeen ? "Vista. Quitar la marca de vista" : "Marcar como vista"}
          title={isSeen ? "Vista" : "Marcar como vista"}
          onClick={() => toggleVisited(stop.id)}
        >
          <CheckIcon />
        </button>
      </div>

      <StopViewer key={stop.id} stop={stop} />

      <div className={`next-bar${tracking ? " is-static" : ""}`}>
        {next ? (
          <>
            <span className="next-info">
              <small>Después{legMin ? ` · ${legMin} min andando` : ""}</small>
              <strong>{next.name}</strong>
            </span>
            <Link className="btn btn-primary" to={`/dia/${day.id}/parada/${next.id}`}>
              Siguiente <ArrowRight />
            </Link>
          </>
        ) : (
          <span className="next-info">
            <strong>Última parada del día</strong>
          </span>
        )}
      </div>
    </>
  );
}
