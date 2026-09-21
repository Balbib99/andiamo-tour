/** Hasta este número de paradas se busca el recorrido más corto exacto; con más se usa una aproximación. */
const EXACT_MAX = 15;

/**
 * Orden más corto para pasar por todas las paradas empezando en el origen y sin volver a él.
 * `dist[i][j]` es la distancia del punto i al j; el punto 0 es el origen y los puntos 1..n son las paradas.
 * Devuelve los índices de las paradas (de 1 a n) en el orden de visita.
 */
export function shortestPath(dist: number[][]): number[] {
  const n = dist.length - 1;
  if (n <= 1) return n === 1 ? [1] : [];
  return n <= EXACT_MAX ? exactPath(dist, n) : approxPath(dist, n);
}

/** Programación dinámica de Held-Karp: da el mejor orden posible. */
function exactPath(dist: number[][], n: number): number[] {
  const full = (1 << n) - 1;
  const cost = new Float64Array((full + 1) * n).fill(Infinity);
  const prev = new Int8Array((full + 1) * n).fill(-1);
  for (let i = 0; i < n; i++) cost[(1 << i) * n + i] = dist[0][i + 1];

  for (let mask = 1; mask <= full; mask++) {
    for (let last = 0; last < n; last++) {
      const here = cost[mask * n + last];
      if (!(mask & (1 << last)) || here === Infinity) continue;
      for (let next = 0; next < n; next++) {
        if (mask & (1 << next)) continue;
        const nm = mask | (1 << next);
        const c = here + dist[last + 1][next + 1];
        if (c < cost[nm * n + next]) {
          cost[nm * n + next] = c;
          prev[nm * n + next] = last;
        }
      }
    }
  }

  let last = 0;
  for (let i = 1; i < n; i++) if (cost[full * n + i] < cost[full * n + last]) last = i;
  const order: number[] = [];
  let mask = full;
  while (last !== -1) {
    order.push(last + 1);
    const before = prev[mask * n + last];
    mask &= ~(1 << last);
    last = before;
  }
  return order.reverse();
}

/** Para muchas paradas: la más cercana cada vez, mejorada cambiando tramos mientras acorte el recorrido. */
function approxPath(dist: number[][], n: number): number[] {
  const order: number[] = [];
  const left = new Set(Array.from({ length: n }, (_, i) => i + 1));
  let at = 0;
  while (left.size) {
    let best = -1;
    for (const p of left) if (best === -1 || dist[at][p] < dist[at][best]) best = p;
    order.push(best);
    left.delete(best);
    at = best;
  }

  const length = (path: number[]) => path.reduce((sum, p, i) => sum + dist[i === 0 ? 0 : path[i - 1]][p], 0);
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const trial = [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1)];
        if (length(trial) < length(order) - 1e-6) {
          order.splice(0, n, ...trial);
          improved = true;
        }
      }
    }
  }
  return order;
}
