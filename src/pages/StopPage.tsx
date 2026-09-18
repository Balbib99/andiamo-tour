import { Link, Navigate, useParams } from "react-router-dom";
import { CheckIcon, ChevronLeft, MapIcon } from "../components/Icons";
import { StopViewer } from "../components/StopViewer";
import { findDay, findStop } from "../data/itinerario";
import { distanceM, formatDistance, mapsDirectionsUrl } from "../lib/geo";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

export function StopPage() {
  const { dayId, stopId } = useParams();
  const day = findDay(dayId);
  const stop = findStop(day, stopId);
  const { visited, toggleVisited } = useApp();
  const { position } = useTracking();

  if (!day || !stop) return <Navigate to={day ? `/dia/${day.id}` : "/"} replace />;

  const index = day.stops.findIndex((s) => s.id === stop.id);
  const next = day.stops[index + 1];
  const isSeen = visited.includes(stop.id);

  return (
    <>
      <Link className="back" to={`/dia/${day.id}`}>
        <ChevronLeft /> Volver a la ruta
      </Link>
      <h2>{stop.name}</h2>
      <div className="chips">
        <span className="chip era">{stop.era}</span>
        <span className="chip">
          Parada {index + 1} de {day.stops.length}
        </span>
        {position && <span className="chip">a {formatDistance(distanceM(position, stop))} de ti</span>}
      </div>

      <div className="actions">
        <a
          className="btn btn-primary"
          href={mapsDirectionsUrl({ destination: stop })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapIcon /> Abrir en Maps desde mi ubicación
        </a>
        <button
          type="button"
          className={`btn${isSeen ? " btn-done" : ""}`}
          aria-pressed={isSeen}
          onClick={() => toggleVisited(stop.id)}
        >
          {isSeen ? (
            <>
              <CheckIcon /> Vista
            </>
          ) : (
            "Marcar como vista"
          )}
        </button>
      </div>

      <StopViewer key={stop.id} stop={stop} />

      <div className="next">
        {next ? (
          <>
            <span>Después: {next.name}</span>
            <Link className="btn btn-primary" to={`/dia/${day.id}/parada/${next.id}`}>
              Siguiente parada
            </Link>
          </>
        ) : (
          <span>Última parada del día</span>
        )}
      </div>
    </>
  );
}
