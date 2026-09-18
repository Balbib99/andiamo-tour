import type { LatLng } from "../data/types";

export interface PlaceResult extends LatLng {
  name: string;
}

/** Busca una dirección en Roma con Nominatim (OpenStreetMap). Uso ligero: una búsqueda por clic. */
export async function searchPlace(query: string): Promise<PlaceResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "5",
    countrycodes: "it",
    "accept-language": "es",
    viewbox: "12.30,42.00,12.70,41.75",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!res.ok) throw new Error(String(res.status));
  const json = (await res.json()) as { display_name: string; lat: string; lon: string }[];
  return json.map((r) => ({
    name: r.display_name.split(",").slice(0, 3).join(",").trim(),
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}

const fountainCache = new Map<string, Promise<LatLng[]>>();

/** Fuentes de agua potable (los "nasoni" de Roma) dentro de una zona, desde OpenStreetMap. */
export function fetchFountains(b: { s: number; w: number; n: number; e: number }): Promise<LatLng[]> {
  const bbox = `${b.s.toFixed(3)},${b.w.toFixed(3)},${b.n.toFixed(3)},${b.e.toFixed(3)}`;
  const hit = fountainCache.get(bbox);
  if (hit) return hit;

  const query = `[out:json][timeout:20];node[amenity=drinking_water](${bbox});out;`;
  const promise = fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: new URLSearchParams({ data: query }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json) => (json.elements as { lat: number; lon: number }[]).map((e) => ({ lat: e.lat, lng: e.lon })))
    .catch((err) => {
      fountainCache.delete(bbox);
      throw err;
    });
  fountainCache.set(bbox, promise);
  return promise;
}
