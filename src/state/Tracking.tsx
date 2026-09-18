import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { allStops } from "../data/itinerario";
import { distanceM } from "../lib/geo";
import { load, save } from "../lib/storage";
import { useApp } from "./AppState";

/** A menos de esta distancia (m) se avisa de que hay una parada cerca. */
export const NEAR_M = 150;
/** A menos de esta distancia (m) se considera que has llegado. */
export const ARRIVE_M = 50;
/** Las lecturas de GPS con más error que esto (m) no disparan avisos. */
const MAX_ACCURACY_M = 100;

export type TrackingStatus = "off" | "searching" | "on" | "denied" | "unsupported";

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface ProximityAlert {
  key: string;
  kind: "near" | "arrived";
  stopId: string;
  dayId: string;
  stopName: string;
  distance: number;
  /** true si la parada no es del día que se está siguiendo. */
  extra: boolean;
}

interface TrackingContextValue {
  status: TrackingStatus;
  position: UserPosition | null;
  /** Día que se está recorriendo. */
  followingDay: string | null;
  start: (dayId: string) => void;
  stop: () => void;
  alert: ProximityAlert | null;
  dismissAlert: () => void;
  /** Una sola lectura de la posición, por ejemplo para fijar el alojamiento. */
  locateOnce: () => Promise<UserPosition>;
  /** Olvida los avisos ya dados, para poder recorrer la ruta otra vez. */
  resetAlerts: () => void;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

const hasGeo = () => typeof navigator !== "undefined" && "geolocation" in navigator;

export function TrackingProvider({ children }: { children: ReactNode }) {
  const { markVisited } = useApp();
  const [status, setStatus] = useState<TrackingStatus>("off");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [followingDay, setFollowingDay] = useState<string | null>(null);
  const [alert, setAlert] = useState<ProximityAlert | null>(null);

  const watchId = useRef<number | null>(null);
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const followingRef = useRef<string | null>(null);
  const announced = useRef<Set<string>>(new Set(load<string[]>("announced", [])));

  const requestWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator && !wakeLock.current) {
        wakeLock.current = await navigator.wakeLock.request("screen");
        wakeLock.current.addEventListener("release", () => {
          wakeLock.current = null;
        });
      }
    } catch {
      /* el navegador puede negarlo (ahorro de batería): la ruta sigue funcionando */
    }
  }, []);

  const handlePosition = useCallback(
    (p: GeolocationPosition) => {
      const pos: UserPosition = {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracy: p.coords.accuracy,
      };
      setPosition(pos);
      setStatus("on");
      if (pos.accuracy > MAX_ACCURACY_M) return;

      let best: ProximityAlert | null = null;
      for (const { stop, dayId } of allStops) {
        const d = distanceM(pos, stop);
        const kind = d <= ARRIVE_M ? "arrived" : d <= NEAR_M ? "near" : null;
        if (!kind) continue;
        if (announced.current.has(`${stop.id}:arrived`)) continue;
        if (kind === "near" && announced.current.has(`${stop.id}:near`)) continue;
        const candidate: ProximityAlert = {
          key: `${stop.id}:${kind}`,
          kind,
          stopId: stop.id,
          dayId,
          stopName: stop.name,
          distance: d,
          extra: followingRef.current !== null && dayId !== followingRef.current,
        };
        if (!best || (candidate.kind === "arrived" && best.kind !== "arrived") || (candidate.kind === best.kind && d < best.distance)) {
          best = candidate;
        }
      }
      if (!best) return;

      announced.current.add(best.key);
      save("announced", [...announced.current]);
      if (best.kind === "arrived") markVisited(best.stopId);
      setAlert(best);
      navigator.vibrate?.([150, 80, 150]); // solo Android; en iPhone se ignora
    },
    [markVisited],
  );

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      setStatus("denied");
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    // TIMEOUT y POSITION_UNAVAILABLE son habituales en calles estrechas: se sigue intentando.
  }, []);

  const start = useCallback(
    (dayId: string) => {
      followingRef.current = dayId;
      setFollowingDay(dayId);
      if (!hasGeo()) {
        setStatus("unsupported");
        return;
      }
      if (watchId.current !== null) return;
      setStatus("searching");
      watchId.current = navigator.geolocation.watchPosition(handlePosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000,
      });
      void requestWakeLock();
    },
    [handlePosition, handleError, requestWakeLock],
  );

  const stop = useCallback(() => {
    if (watchId.current !== null && hasGeo()) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    void wakeLock.current?.release();
    wakeLock.current = null;
    followingRef.current = null;
    setFollowingDay(null);
    setStatus("off");
    setPosition(null);
    setAlert(null);
  }, []);

  // El navegador suelta el bloqueo de pantalla al cambiar de app: se pide otra vez al volver.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && watchId.current !== null) void requestWakeLock();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [requestWakeLock]);

  useEffect(() => stop, [stop]);

  const locateOnce = useCallback(
    () =>
      new Promise<UserPosition>((resolve, reject) => {
        if (!hasGeo()) return reject(new Error("unsupported"));
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 20000 },
        );
      }),
    [],
  );

  const value = useMemo<TrackingContextValue>(
    () => ({
      status,
      position,
      followingDay,
      start,
      stop,
      alert,
      dismissAlert: () => setAlert(null),
      locateOnce,
      resetAlerts: () => {
        announced.current = new Set();
        save("announced", []);
        setAlert(null);
      },
    }),
    [status, position, followingDay, start, stop, alert, locateOnce],
  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking(): TrackingContextValue {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error("useTracking debe usarse dentro de TrackingProvider");
  return ctx;
}
