import { useMemo } from "react";
import { startPoint } from "../data/itinerario";
import type { Day, LatLng, Stop } from "../data/types";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";
import { routePoints } from "./geo";
import { useFootRoute, type FootRouteState } from "./routing";

export interface DayOrder {
  /** Paradas del día en el orden en que se muestran y se numeran. */
  stops: Stop[];
  /** Las que aún no se han visto, en ese mismo orden. */
  pending: Stop[];
  /** true si el orden es el recalculado desde tu posición, y no el previsto para el día. */
  replanned: boolean;
}

/**
 * Orden de las paradas de un día. Antes de empezar la ruta es el previsto. Al empezar, las paradas ya vistas
 * quedan al principio y las que faltan se reordenan para hacer el menor camino desde donde estás.
 */
export function useDayOrder(day: Day | undefined): DayOrder {
  const { visited } = useApp();
  const { followingDay, plan } = useTracking();

  return useMemo(() => {
    const all = day?.stops ?? [];
    const notSeen = all.filter((s) => !visited.includes(s.id));
    if (!day || followingDay !== day.id || plan?.dayId !== day.id) {
      return { stops: all, pending: notSeen, replanned: false };
    }
    const byId = new Map(notSeen.map((s) => [s.id, s]));
    const planned = plan.ids.flatMap((id) => byId.get(id) ?? []);
    // Por si alguna parada se desmarcó como vista después de calcular el orden: va al final hasta el siguiente cálculo.
    const rest = notSeen.filter((s) => !plan.ids.includes(s.id));
    const pending = [...planned, ...rest];
    return { stops: [...all.filter((s) => visited.includes(s.id)), ...pending], pending, replanned: true };
  }, [day, followingDay, plan, visited]);
}

export interface LiveRoute extends DayOrder {
  /** true si la ruta sale de tu ubicación; false si es la ruta prevista desde el punto de inicio. */
  live: boolean;
  /** Puntos de la ruta actual: origen y paradas. null si el día no tiene paradas. */
  points: LatLng[] | null;
  foot: FootRouteState | null;
}

/**
 * Ruta de un día. Antes de empezar, sale del punto de inicio y pasa por todas las paradas.
 * Al empezar la ruta y recibir tu posición, sale de donde estás y va solo a las paradas que faltan,
 * en el orden más corto.
 */
export function useLiveRoute(day: Day | undefined): LiveRoute {
  const { followingDay, routeOrigin } = useTracking();
  const order = useDayOrder(day);

  const live = Boolean(day && followingDay === day.id && routeOrigin && order.pending.length > 0);

  let points: LatLng[] | null = null;
  if (order.stops.length > 0) {
    points = live && routeOrigin ? [routeOrigin, ...order.pending] : routePoints(startPoint, order.stops);
  }

  const foot = useFootRoute(points);
  return { ...order, live, points, foot };
}
