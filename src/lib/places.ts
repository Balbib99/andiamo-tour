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

/** Foto real de una fuente, de Wikimedia Commons, con los datos que hay que citar. */
export interface FountainPhoto {
  url: string;
  pagina: string;
  autor: string;
  licencia: string;
  /** Calle o lugar que consta en el nombre del archivo, si lo trae. */
  lugar?: string;
}

export interface Fountain extends LatLng {
  photo?: FountainPhoto;
}

interface FountainFile {
  fotos: FountainPhoto[];
  /** [lat, lng] o [lat, lng, índice de la foto]. */
  puntos: ([number, number] | [number, number, number])[];
}

let fountains: Promise<Fountain[]> | null = null;

/** Todas las fuentes de agua potable de Roma, del archivo incluido en la web (public/data/fuentes-roma.json). */
function loadFountains(): Promise<Fountain[]> {
  fountains ??= fetch("/data/fuentes-roma.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json: FountainFile) =>
      json.puntos.map((p) => ({ lat: p[0], lng: p[1], photo: p.length === 3 ? json.fotos[p[2]] : undefined })),
    )
    .catch((err) => {
      fountains = null; // permite reintentar
      throw err;
    });
  return fountains;
}

/**
 * Fuentes de agua potable (los "nasoni" de Roma) dentro de una zona.
 * Los datos son de OpenStreetMap y las fotos de Wikimedia Commons; se descargaron una vez y no dependen
 * de ningún servicio externo para mostrar los puntos.
 */
export async function fetchFountains(b: { s: number; w: number; n: number; e: number }): Promise<Fountain[]> {
  const all = await loadFountains();
  return all.filter((f) => f.lat >= b.s && f.lat <= b.n && f.lng >= b.w && f.lng <= b.e);
}
