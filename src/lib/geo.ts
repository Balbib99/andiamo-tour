import type { LatLng } from "../data/types";

/** Distancia en metros entre dos puntos (fórmula de haversine). */
export function distanceM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** "320 m" por debajo del kilómetro y "1,4 km" por encima. */
export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.max(10, Math.round(m / 10) * 10)} m`;
  return `${(m / 1000).toFixed(1).replace(".", ",")} km`;
}

/** Minutos a pie a ritmo de turista (4,5 km/h). */
export function walkMinutes(km: number): number {
  return Math.max(1, Math.round((km / 4.5) * 60));
}

/** Puntos de una ruta: el de salida seguido de las paradas. */
export function routePoints(origin: LatLng, stops: LatLng[]): LatLng[] {
  return [origin, ...stops];
}

const pair = (p: LatLng) => `${p.lat},${p.lng}`;

/**
 * Enlace que abre la app de Google Maps con la ruta a pie.
 * Sin `origin`, Maps sale desde la ubicación actual del móvil.
 */
export function mapsDirectionsUrl(opts: {
  destination: LatLng;
  origin?: LatLng;
  waypoints?: LatLng[];
}): string {
  const params = new URLSearchParams({
    api: "1",
    destination: pair(opts.destination),
    travelmode: "walking",
  });
  if (opts.origin) params.set("origin", pair(opts.origin));
  if (opts.waypoints?.length) params.set("waypoints", opts.waypoints.map(pair).join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** Enlace que abre Google Street View en un punto, para ver cómo es el lugar antes de llegar. */
export function streetViewUrl(p: LatLng): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${pair(p)}`;
}
