import type { Day, LatLng, Stop } from "../data/types";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";
import { routePoints } from "./geo";
import { useFootRoute, type FootRouteState } from "./routing";

export interface LiveRoute {
  /** true si la ruta sale de tu ubicación; false si es la ruta prevista desde el alojamiento. */
  live: boolean;
  /** Puntos de la ruta actual: origen y paradas. null si el día no tiene paradas. */
  points: LatLng[] | null;
  /** Paradas del día que aún no se han visto, en orden. */
  pending: Stop[];
  foot: FootRouteState | null;
}

/**
 * Ruta de un día. Antes de empezar, sale del alojamiento y pasa por todas las paradas.
 * Al empezar la ruta y recibir tu posición, sale de donde estás y va solo a las paradas que faltan.
 */
export function useLiveRoute(day: Day | undefined): LiveRoute {
  const { lodging, visited } = useApp();
  const { followingDay, routeOrigin } = useTracking();

  const stops = day?.stops ?? [];
  const pending = stops.filter((s) => !visited.includes(s.id));
  const live = Boolean(day && followingDay === day.id && routeOrigin && pending.length > 0);

  let points: LatLng[] | null = null;
  if (stops.length > 0) points = live && routeOrigin ? [routeOrigin, ...pending] : routePoints(lodging, stops);

  const foot = useFootRoute(points);
  return { live, points, pending, foot };
}
