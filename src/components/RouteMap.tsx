import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { allStops, findDay } from "../data/itinerario";
import type { LatLng } from "../data/types";
import { routePoints } from "../lib/geo";
import { fetchFountains } from "../lib/places";
import { useLiveRoute } from "../lib/useLiveRoute";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

const ROME: L.LatLngTuple = [41.8962, 12.482];

const pinIcon = (label: string, cls = "") =>
  L.divIcon({
    className: "",
    html: `<div class="pin ${cls}">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const HOME_ICON = "&#8962;";

const dropIcon = L.divIcon({
  className: "",
  html: `<div class="drop" title="Fuente de agua potable"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1.5C5 4.5 3.2 6.3 3.2 8.6a3.8 3.8 0 0 0 7.6 0C10.8 6.3 9 4.5 7 1.5Z" fill="#fff"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Props {
  dayId?: string;
  stopId?: string;
}

export function RouteMap({ dayId, stopId }: Props) {
  const { lodging, visited, fountainsOn, fitSignal } = useApp();
  const { position } = useTracking();
  const navigate = useNavigate();

  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.LayerGroup | null>(null);
  const youLayer = useRef<L.LayerGroup | null>(null);
  const fountainLayer = useRef<L.LayerGroup | null>(null);
  const applyView = useRef<() => void>(() => {});
  const [fountainError, setFountainError] = useState(false);

  const day = findDay(dayId);
  const stops = day?.stops ?? [];
  // Antes de empezar la ruta sale del alojamiento; al empezar, de tu posición y hacia las paradas que faltan.
  const { live, points, foot } = useLiveRoute(day);

  /* Crear el mapa una sola vez */
  useEffect(() => {
    if (!box.current) return;
    const m = L.map(box.current, { zoomControl: false }).setView(ROME, 15);
    L.control.zoom({ position: "topright" }).addTo(m);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    routeLayer.current = L.layerGroup().addTo(m);
    fountainLayer.current = L.layerGroup().addTo(m);
    youLayer.current = L.layerGroup().addTo(m);
    map.current = m;

    // El mapa está oculto en la portada en móvil: al mostrarse hay que recalcular su tamaño.
    let wasHidden = false;
    const observer = new ResizeObserver(() => {
      const hidden = !box.current || box.current.clientWidth === 0;
      if (hidden) {
        wasHidden = true;
        return;
      }
      m.invalidateSize();
      if (wasHidden) {
        wasHidden = false;
        applyView.current();
      }
    });
    observer.observe(box.current);

    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
    };
  }, []);

  /* Dibujar la ruta del día, o todas las paradas en la portada */
  useEffect(() => {
    const layer = routeLayer.current;
    if (!layer) return;
    layer.clearLayers();

    if (lodging) {
      L.marker([lodging.lat, lodging.lng], { icon: pinIcon(HOME_ICON, "origin"), title: "Alojamiento" }).addTo(layer);
    }

    if (!day) {
      allStops.forEach(({ stop, dayId: d }) => {
        L.marker([stop.lat, stop.lng], { icon: pinIcon("", "small"), title: stop.name })
          .on("click", () => navigate(`/dia/${d}/parada/${stop.id}`))
          .addTo(layer);
      });
      return;
    }

    if (foot) {
      L.polyline(foot.coords, { color: "#fff", weight: 9, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(layer);
      L.polyline(foot.coords, {
        color: "#7A2E6E",
        weight: 5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        dashArray: foot.exact ? undefined : "2 10",
      }).addTo(layer);
    }
    stops.forEach((s, i) => {
      L.marker([s.lat, s.lng], { icon: pinIcon(String(i + 1), s.id === stopId ? "active" : visited.includes(s.id) ? "done" : ""), title: s.name })
        .on("click", () => navigate(`/dia/${day.id}/parada/${s.id}`))
        .addTo(layer);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, lodging, visited, foot?.coords, foot?.exact, stopId]);

  /* Encuadrar: la ruta entera, o la parada abierta */
  useEffect(() => {
    const view = () => {
      const m = map.current;
      if (!m || !box.current || box.current.clientWidth === 0) return;
      const narrow = box.current.clientWidth < 600;
      const padding: L.PointTuple = narrow ? [30, 30] : [60, 60];
      const active = stops.find((s) => s.id === stopId);
      if (active) {
        m.flyTo([active.lat, active.lng], 17, { duration: 0.8 });
      } else if (day && points) {
        m.fitBounds(points.map((p) => [p.lat, p.lng] as L.LatLngTuple), { padding });
      } else {
        const all = routePoints(lodging, allStops.map((s) => s.stop));
        m.fitBounds(all.map((p) => [p.lat, p.lng] as L.LatLngTuple), { padding });
      }
    };
    applyView.current = view;
    view();
    // `live` vuelve a encuadrar una sola vez al empezar o parar la ruta, no en cada recálculo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId, stopId, fitSignal, live]);

  /* Tu posición */
  useEffect(() => {
    const layer = youLayer.current;
    if (!layer) return;
    layer.clearLayers();
    if (!position) return;
    L.circle([position.lat, position.lng], {
      radius: position.accuracy,
      color: "#2b6cb0",
      weight: 1,
      fillColor: "#2b6cb0",
      fillOpacity: 0.12,
    }).addTo(layer);
    L.circleMarker([position.lat, position.lng], {
      radius: 8,
      color: "#fff",
      weight: 3,
      fillColor: "#2b6cb0",
      fillOpacity: 1,
    }).addTo(layer);
  }, [position]);

  /* Fuentes de agua potable */
  useEffect(() => {
    const layer = fountainLayer.current;
    if (!layer) return;
    layer.clearLayers();
    setFountainError(false);
    if (!fountainsOn) return;

    const focus: LatLng[] = points ?? routePoints(lodging, allStops.map((s) => s.stop));
    const pad = 0.004;
    const bounds = {
      s: Math.min(...focus.map((p) => p.lat)) - pad,
      n: Math.max(...focus.map((p) => p.lat)) + pad,
      w: Math.min(...focus.map((p) => p.lng)) - pad,
      e: Math.max(...focus.map((p) => p.lng)) + pad,
    };
    let alive = true;
    fetchFountains(bounds)
      .then((list) => {
        if (!alive) return;
        list.forEach((f) => L.marker([f.lat, f.lng], { icon: dropIcon, keyboard: false }).addTo(layer));
      })
      .catch(() => alive && setFountainError(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fountainsOn, dayId, lodging]);

  return (
    <div className="map" aria-label="Mapa de la ruta">
      <div ref={box} className="map-canvas" />
      {position && (
        <button
          type="button"
          className="map-locate"
          onClick={() => map.current?.flyTo([position.lat, position.lng], 17, { duration: 0.6 })}
        >
          Centrar en mí
        </button>
      )}
      {fountainError && <p className="map-note">No se pudieron cargar las fuentes ahora mismo.</p>}
    </div>
  );
}
