const PREFIX = "andiamo:";

/** Lee de localStorage sin romper la web si el navegador lo bloquea. */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* modo privado o almacenamiento lleno: la web sigue funcionando sin guardar */
  }
}
