import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { load, save } from "../lib/storage";

/** Qué fuentes de agua se dibujan en el mapa: ninguna, solo las que tienen foto real, o todas. */
export type FountainMode = "off" | "fotos" | "todas";

interface AppContextValue {
  /** Ids de las paradas ya vistas. Se guardan en el móvil. */
  visited: string[];
  markVisited: (id: string) => void;
  toggleVisited: (id: string) => void;
  resetVisited: () => void;
  fountainMode: FountainMode;
  setFountainMode: (mode: FountainMode) => void;
  /** Si el mapa dibuja los sitios para comer o tomar algo. */
  showEats: boolean;
  setShowEats: (show: boolean) => void;
  /** Sube cada vez que se pide encuadrar de nuevo la ruta en el mapa. */
  fitSignal: number;
  requestFit: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Versiones anteriores guardaban aquí una dirección escrita a mano: se borra de los móviles que la tuvieran. */
try {
  localStorage.removeItem("andiamo:lodging");
} catch {
  /* sin acceso al almacenamiento: no hay nada que borrar */
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [visited, setVisited] = useState<string[]>(() => load("visited", []));
  const [fountainMode, setFountainModeState] = useState<FountainMode>(() => {
    const saved = load<string>("fountainMode", "off");
    return saved === "fotos" || saved === "todas" ? saved : "off";
  });
  const [showEats, setShowEatsState] = useState<boolean>(() => load<boolean>("showEats", true) !== false);
  const [fitSignal, setFitSignal] = useState(0);

  const setFountainMode = useCallback((mode: FountainMode) => {
    setFountainModeState(mode);
    save("fountainMode", mode);
  }, []);

  const setShowEats = useCallback((show: boolean) => {
    setShowEatsState(show);
    save("showEats", show);
  }, []);

  const update = useCallback((next: (prev: string[]) => string[]) => {
    setVisited((prev) => {
      const value = next(prev);
      save("visited", value);
      return value;
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      visited,
      markVisited: (id) => update((prev) => (prev.includes(id) ? prev : [...prev, id])),
      toggleVisited: (id) =>
        update((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
      resetVisited: () => update(() => []),
      fountainMode,
      setFountainMode,
      showEats,
      setShowEats,
      fitSignal,
      requestFit: () => setFitSignal((n) => n + 1),
    }),
    [visited, update, fountainMode, setFountainMode, showEats, setShowEats, fitSignal],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
