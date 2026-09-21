import { useEffect, useMemo, useState } from "react";
import type { LatLng } from "../data/types";
import { distanceM, walkMinutes } from "./geo";

export interface FootRoute {
  /** Trazado por las calles, como pares [lat, lng]. */
  coords: [number, number][];
  km: number;
  min: number;
  /** Un tramo por cada par de puntos consecutivos. */
  legs: { km: number; min: number }[];
}

const cache = new Map<string, Promise<FootRoute | null>>();

const keyOf = (points: LatLng[]) => points.map((p) => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(";");

/** Ruta a pie por las calles, con el servicio gratuito de OpenStreetMap (FOSSGIS). */
export function fetchFootRoute(points: LatLng[]): Promise<FootRoute | null> {
  const key = keyOf(points);
  const hit = cache.get(key);
  if (hit) return hit;

  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${key}?overview=full&geometries=geojson&steps=false`;
  const promise = fetch(url)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json): FootRoute | null => {
      const route = json?.routes?.[0];
      if (json?.code !== "Ok" || !route) return null;
      const legs = (route.legs as { distance: number }[]).map((l) => {
        const km = l.distance / 1000;
        return { km, min: walkMinutes(km) };
      });
      const km = route.distance / 1000;
      return {
        coords: (route.geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng]),
        km,
        min: walkMinutes(km),
        legs,
      };
    })
    .catch(() => {
      cache.delete(key); // permite reintentar más tarde
      return null;
    });
  cache.set(key, promise);
  return promise;
}

export interface FootRouteState {
  loading: boolean;
  /** true si la ruta viene de las calles; false si es una estimación en línea recta. */
  exact: boolean;
  coords: [number, number][];
  km: number;
  min: number;
  legs: { km: number; min: number }[];
}

/** Ruta a pie entre los puntos dados. Si el servicio falla, cae a línea recta x 1,25. */
export function useFootRoute(points: LatLng[] | null): FootRouteState | null {
  const key = points && points.length > 1 ? keyOf(points) : "";
  const [result, setResult] = useState<{ key: string; route: FootRoute | null } | null>(null);

  useEffect(() => {
    if (!key || !points) return;
    let alive = true;
    fetchFootRoute(points).then((route) => alive && setResult({ key, route }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return useMemo(() => {
    if (!points || points.length < 2) return null;
    const done = result?.key === key;
    if (done && result.route) return { loading: false, exact: true, ...result.route };
    const legs = points.slice(1).map((p, i) => {
      const km = (distanceM(points[i], p) * 1.25) / 1000;
      return { km, min: walkMinutes(km) };
    });
    const km = legs.reduce((sum, l) => sum + l.km, 0);
    return {
      loading: !done,
      exact: false,
      coords: points.map((p) => [p.lat, p.lng] as [number, number]),
      km,
      min: walkMinutes(km),
      legs,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, result]);
}

const matrixCache = new Map<string, Promise<number[][] | null>>();

/** Distancias a pie (m) entre todos los pares de puntos, con el mismo servicio. Null si falla. */
export function fetchFootMatrix(points: LatLng[]): Promise<number[][] | null> {
  const key = keyOf(points);
  const hit = matrixCache.get(key);
  if (hit) return hit;

  const url = `https://routing.openstreetmap.de/routed-foot/table/v1/foot/${key}?annotations=distance`;
  const promise = fetch(url)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json): number[][] | null => (json?.code === "Ok" ? (json.distances as number[][]) : null))
    .catch(() => {
      matrixCache.delete(key);
      return null;
    });
  matrixCache.set(key, promise);
  return promise;
}
