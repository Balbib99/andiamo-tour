import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lodging } from "../data/types";
import { load, save } from "../lib/storage";

/** Qué fuentes de agua se dibujan en el mapa: ninguna, solo las que tienen foto real, o todas. */
export type FountainMode = "off" | "fotos" | "todas";

interface AppContextValue {
  /** Alojamiento. null hasta que se indica; se guarda solo en este móvil. */
  lodging: Lodging | null;
  setLodging: (l: Lodging) => void;
  /** Ids de las paradas ya vistas. Se guardan en el móvil. */
  visited: string[];
  markVisited: (id: string) => void;
  toggleVisited: (id: string) => void;
  resetVisited: () => void;
  fountainMode: FountainMode;
  setFountainMode: (mode: FountainMode) => void;
  /** Sube cada vez que se pide encuadrar de nuevo la ruta en el mapa. */
  fitSignal: number;
  requestFit: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lodging, setLodgingState] = useState<Lodging | null>(() => load<Lodging | null>("lodging", null));
  const [visited, setVisited] = useState<string[]>(() => load("visited", []));
  const [fountainMode, setFountainModeState] = useState<FountainMode>(() => {
    const saved = load<string>("fountainMode", "off");
    return saved === "fotos" || saved === "todas" ? saved : "off";
  });
  const [fitSignal, setFitSignal] = useState(0);

  const setFountainMode = useCallback((mode: FountainMode) => {
    setFountainModeState(mode);
    save("fountainMode", mode);
  }, []);

  const setLodging = useCallback((l: Lodging) => {
    setLodgingState(l);
    save("lodging", l);
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
      lodging,
      setLodging,
      visited,
      markVisited: (id) => update((prev) => (prev.includes(id) ? prev : [...prev, id])),
      toggleVisited: (id) =>
        update((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
      resetVisited: () => update(() => []),
      fountainMode,
      setFountainMode,
      fitSignal,
      requestFit: () => setFitSignal((n) => n + 1),
    }),
    [lodging, setLodging, visited, update, fountainMode, setFountainMode, fitSignal],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
