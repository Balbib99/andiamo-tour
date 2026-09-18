import { Link } from "react-router-dom";
import { allStops, findDay } from "../data/itinerario";
import { distanceM, formatDistance, mapsDirectionsUrl } from "../lib/geo";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";
import { MapIcon } from "./Icons";

/** Barra fija al pie del panel: seguimiento en directo y avisos de cercanía. */
export function LiveStack() {
  const { visited } = useApp();
  const { status, position, followingDay, stop, alert, dismissAlert } = useTracking();

  if (status === "off" && !alert) return null;

  const day = findDay(followingDay ?? undefined);
  const pending = day?.stops.filter((s) => !visited.includes(s.id)) ?? [];
  const target =
    position && pending.length
      ? pending.reduce((a, b) => (distanceM(position, a) <= distanceM(position, b) ? a : b))
      : pending[0];

  const alertStop = alert ? allStops.find((s) => s.stop.id === alert.stopId)?.stop : undefined;

  return (
    <div className="live" role="region" aria-label="Seguimiento de la ruta">
      {alert && alertStop && (
        <div className={`alert alert-${alert.kind}`} role="alert">
          <p className="alert-title">
            {alert.kind === "arrived"
              ? `Has llegado a ${alert.stopName}`
              : `Estás a ${formatDistance(alert.distance)} de ${alert.stopName}`}
          </p>
          {alert.extra && <p className="alert-sub">No está en la ruta de hoy, pero te pilla de paso.</p>}
          <div className="alert-actions">
            <Link className="btn btn-primary btn-small" to={`/dia/${alert.dayId}/parada/${alert.stopId}`} onClick={dismissAlert}>
              {alert.kind === "arrived" ? "Ver ficha y escuchar" : "Ver ficha"}
            </Link>
            <button type="button" className="btn btn-small" onClick={dismissAlert}>
              {alert.kind === "arrived" ? "Cerrar" : "Seguir"}
            </button>
          </div>
        </div>
      )}

      {status !== "off" && (
        <div className="track">
          {status === "denied" && (
            <p className="track-text">
              No tengo permiso para ver tu ubicación. Actívalo en los ajustes del navegador para esta web y vuelve a empezar.
            </p>
          )}
          {status === "unsupported" && <p className="track-text">Este navegador no permite usar la ubicación.</p>}
          {status === "searching" && <p className="track-text">Buscando tu ubicación…</p>}
          {status === "on" && !target && day && (
            <p className="track-text">
              <strong>Ruta completada.</strong> Habéis visto todas las paradas del día.
            </p>
          )}
          {status === "on" && target && (
            <p className="track-text">
              <strong>Siguiente: {target.name}</strong>
              {position && <span> a {formatDistance(distanceM(position, target))}</span>}
            </p>
          )}
          <div className="track-actions">
            {status === "on" && target && (
              <a
                className="btn btn-small btn-primary"
                href={mapsDirectionsUrl({ destination: target })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapIcon /> Abrir en Maps
              </a>
            )}
            <button type="button" className="btn btn-small" onClick={stop}>
              {status === "on" || status === "searching" ? "Parar ruta" : "Cerrar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
