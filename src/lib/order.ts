import type { LatLng, Stop } from "../data/types";
import { distanceM } from "./geo";
import { fetchFootMatrix } from "./routing";
import { shortestPath } from "./tsp";

/**
 * Ordena las paradas para recorrerlas en el menor camino posible a pie, saliendo del origen y sin volver a él.
 * Usa las distancias reales por las calles; si el servicio falla, la línea recta x 1,25.
 */
export async function planOrder(origin: LatLng, stops: Stop[]): Promise<Stop[]> {
  if (stops.length < 2) return stops;
  const points = [origin, ...stops];
  const real = await fetchFootMatrix(points);
  const dist = points.map((a, i) =>
    points.map((b, j) => {
      if (i === j) return 0;
      const m = real?.[i]?.[j];
      return typeof m === "number" ? m : distanceM(a, b) * 1.25;
    }),
  );
  return shortestPath(dist).map((i) => stops[i - 1]);
}
