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
import { allStops, findDay } from "../data/itinerario";
import type { LatLng } from "../data/types";
import { distanceM, routePoints } from "../lib/geo";
import { fetchFootRoute } from "../lib/routing";
import { load, save } from "../lib/storage";
import { useApp } from "./AppState";

/** A menos de esta distancia (m) se avisa de que hay una parada cerca. */
export const NEAR_M = 150;
/** A menos de esta distancia (m) se considera que has llegado. */
export const ARRIVE_M = 50;
/** Las lecturas de GPS con más error que esto (m) no disparan avisos. */
const MAX_ACCURACY_M = 100;
/** Las lecturas con más error que esto (m) tampoco se usan como punto de partida de la ruta. */
const MAX_ORIGIN_ACCURACY_M = 150;
/** La ruta se recalcula cuando te has movido más de esta distancia (m) desde su último punto de partida... */
const REROUTE_M = 80;
/** ...y han pasado al menos estos milisegundos, para no saturar el servicio de rutas. */
const REROUTE_MIN_MS = 15000;
/** Filtro de suavizado del GPS: velocidad máxima esperada a pie (m/s) y salto (m) a partir del cual se reinicia. */
const WALK_SPEED_MS = 6;
const JUMP_M = 200;
/** Modo de prueba: metros que avanza el punto simulado cada 250 ms (unos 50 m/s) y pausa al llegar a una parada. */
const SIM_STEP_M = 12.5;
const SIM_TICK_MS = 250;
const SIM_PAUSE_MS = 6000;

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
  /**
   * Punto desde el que sale la ruta mientras se sigue un día: tu posición, que solo se actualiza cuando
   * te has movido lo bastante para que merezca recalcular. null hasta la primera lectura fiable.
   */
  routeOrigin: LatLng | null;
  start: (dayId: string) => void;
  stop: () => void;
  alert: ProximityAlert | null;
  dismissAlert: () => void;
  /** Una sola lectura de la posición, por ejemplo para fijar el alojamiento. */
  locateOnce: () => Promise<UserPosition>;
  /** Olvida los avisos ya dados, para poder recorrer la ruta otra vez. */
  resetAlerts: () => void;
  /** Modo de prueba: recorre la ruta del día con una posición simulada, sin GPS. Borra las paradas vistas. */
  simulate: (dayId: string) => void;
  simulating: boolean;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

const hasGeo = () => typeof navigator !== "undefined" && "geolocation" in navigator;

export function TrackingProvider({ children }: { children: ReactNode }) {
  const { markVisited, resetVisited, lodging } = useApp();
  const [status, setStatus] = useState<TrackingStatus>("off");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [followingDay, setFollowingDay] = useState<string | null>(null);
  const [routeOrigin, setRouteOrigin] = useState<LatLng | null>(null);
  const [alert, setAlert] = useState<ProximityAlert | null>(null);
  const [simulating, setSimulating] = useState(false);

  const filter = useRef<{ lat: number; lng: number; variance: number; ts: number } | null>(null);
  const originRef = useRef<LatLng | null>(null);
  const originAt = useRef(0);
  const simTimer = useRef<number | null>(null);
  const simToken = useRef(0);
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

  /** Fija el punto de partida de la ruta actual. */
  const refreshOrigin = useCallback((pos: LatLng) => {
    originRef.current = { lat: pos.lat, lng: pos.lng };
    originAt.current = Date.now();
    setRouteOrigin(originRef.current);
  }, []);

  /**
   * Suaviza las lecturas del GPS con un filtro de Kalman sencillo: da más peso a las lecturas precisas
   * y menos a las que traen mucho error, y elimina los saltos de unos metros cuando estás quieto.
   */
  const smooth = useCallback((lat: number, lng: number, accuracy: number, ts: number): UserPosition => {
    const acc = Math.max(accuracy, 1);
    const f = filter.current;
    if (!f || distanceM(f, { lat, lng }) > Math.max(JUMP_M, acc * 5)) {
      filter.current = { lat, lng, variance: acc * acc, ts };
      return { lat, lng, accuracy: acc };
    }
    const dt = Math.min(Math.max((ts - f.ts) / 1000, 0), 10);
    const variance = f.variance + dt * WALK_SPEED_MS * WALK_SPEED_MS;
    const k = variance / (variance + acc * acc);
    const next = { lat: f.lat + k * (lat - f.lat), lng: f.lng + k * (lng - f.lng), variance: (1 - k) * variance, ts };
    filter.current = next;
    return { lat: next.lat, lng: next.lng, accuracy: Math.max(5, Math.sqrt(next.variance)) };
  }, []);

  const handlePosition = useCallback(
    (p: GeolocationPosition, raw = false) => {
      const c = p.coords;
      // `raw` (modo de prueba) usa la posición tal cual, sin suavizar.
      const pos: UserPosition = raw
        ? { lat: c.latitude, lng: c.longitude, accuracy: c.accuracy }
        : smooth(c.latitude, c.longitude, c.accuracy, p.timestamp);
      setPosition(pos);
      setStatus("on");
      if (c.accuracy <= MAX_ORIGIN_ACCURACY_M) {
        const o = originRef.current;
        if (!o || (distanceM(o, pos) > REROUTE_M && (raw || Date.now() - originAt.current >= REROUTE_MIN_MS))) {
          refreshOrigin(pos);
        }
      }
      if (c.accuracy > MAX_ACCURACY_M) return;

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
      if (best.kind === "arrived") {
        markVisited(best.stopId);
        refreshOrigin(pos); // desde esta parada sale ahora la ruta
      }
      setAlert(best);
      navigator.vibrate?.([150, 80, 150]); // solo Android; en iPhone se ignora
    },
    [markVisited, smooth, refreshOrigin],
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
        maximumAge: 0, // nunca una lectura guardada: siempre la posición de ahora
        timeout: 20000,
      });
      void requestWakeLock();
    },
    [handlePosition, handleError, requestWakeLock],
  );

  const stop = useCallback(() => {
    simToken.current++;
    if (simTimer.current !== null) window.clearInterval(simTimer.current);
    simTimer.current = null;
    setSimulating(false);
    if (watchId.current !== null && hasGeo()) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    void wakeLock.current?.release();
    wakeLock.current = null;
    followingRef.current = null;
    filter.current = null;
    originRef.current = null;
    setFollowingDay(null);
    setRouteOrigin(null);
    setStatus("off");
    setPosition(null);
    setAlert(null);
  }, []);

  const simulate = useCallback(
    async (dayId: string) => {
      const day = findDay(dayId);
      if (!day || day.stops.length === 0) return;
      stop();
      resetVisited();
      announced.current = new Set();
      save("announced", []);

      const token = simToken.current;
      followingRef.current = dayId;
      setFollowingDay(dayId);
      setStatus("searching");
      setSimulating(true);

      // Camino que se recorre: la ruta a pie prevista, del alojamiento a la última parada.
      const points = routePoints(lodging, day.stops);
      const route = await fetchFootRoute(points);
      if (token !== simToken.current) return; // se paró la simulación mientras se calculaba
      const coords: [number, number][] = route?.coords ?? points.map((p) => [p.lat, p.lng]);

      const cum = [0];
      for (let i = 1; i < coords.length; i++) {
        cum.push(cum[i - 1] + distanceM({ lat: coords[i - 1][0], lng: coords[i - 1][1] }, { lat: coords[i][0], lng: coords[i][1] }));
      }
      const total = cum[cum.length - 1];

      let travelled = 0;
      let seg = 0;
      let pauseUntil = 0;
      simTimer.current = window.setInterval(() => {
        if (Date.now() < pauseUntil) return;
        travelled = Math.min(travelled + SIM_STEP_M, total);
        while (seg < cum.length - 2 && cum[seg + 1] < travelled) seg++;
        const span = cum[seg + 1] - cum[seg] || 1;
        const t = Math.max(0, Math.min(1, (travelled - cum[seg]) / span));
        const lat = coords[seg][0] + (coords[seg + 1][0] - coords[seg][0]) * t;
        const lng = coords[seg][1] + (coords[seg + 1][1] - coords[seg][1]) * t;

        const before = announced.current.size;
        handlePosition({ coords: { latitude: lat, longitude: lng, accuracy: 8 }, timestamp: Date.now() } as GeolocationPosition, true);
        if (announced.current.size > before) pauseUntil = Date.now() + SIM_PAUSE_MS;

        if (travelled >= total && simTimer.current !== null) {
          window.clearInterval(simTimer.current);
          simTimer.current = null;
          setSimulating(false);
        }
      }, SIM_TICK_MS);
    },
    [handlePosition, lodging, resetVisited, stop],
  );

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
      routeOrigin,
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
      simulate: (dayId: string) => void simulate(dayId),
      simulating,
    }),
    [status, position, followingDay, routeOrigin, start, stop, alert, locateOnce, simulate, simulating],
  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking(): TrackingContextValue {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error("useTracking debe usarse dentro de TrackingProvider");
  return ctx;
}
