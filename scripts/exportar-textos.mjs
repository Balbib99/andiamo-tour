// Saca de src/data/itinerario.ts los textos que hay que convertir en audio y los imprime como JSON.
import { allStops } from "../src/data/itinerario.ts";

const vistos = new Set();
const paradas = [];
for (const { stop } of allStops) {
  if (vistos.has(stop.id)) continue;
  vistos.add(stop.id);
  paradas.push({
    id: stop.id,
    name: stop.name,
    text: stop.text,
    points: (stop.points ?? []).map((p) => ({ title: p.title, text: p.text })),
    tienePhoto: Boolean(stop.photo && stop.points?.length),
  });
}
console.log(JSON.stringify(paradas));
