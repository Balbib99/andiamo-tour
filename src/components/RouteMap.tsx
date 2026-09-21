import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { allStops, findDay } from "../data/itinerario";
import type { LatLng, Stop } from "../data/types";
import { distanceM, formatDistance, mapsDirectionsUrl, routePoints, streetViewUrl } from "../lib/geo";
import { fetchFountains, type Fountain } from "../lib/places";
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

/** Opciones de la tarjeta de una parada: se abre un poco por encima del pin para no taparlo. */
const STOP_POPUP: L.PopupOptions = { className: "stop-popup", minWidth: 320, maxWidth: 320, offset: [0, -10], autoPanPaddingTopLeft: [16, 16], autoPanPaddingBottomRight: [64, 16] };

const HOME_ICON = "&#8962;";

/** Recorta la ruta para que empiece donde estás: la línea se va "consumiendo" a medida que avanzas. */
function trimFrom(coords: [number, number][], pos: LatLng): [number, number][] {
  const cosLat = Math.cos((pos.lat * Math.PI) / 180);
  let best = 0;
  let bestD = Infinity;
  coords.forEach(([lat, lng], i) => {
    const dy = lat - pos.lat;
    const dx = (lng - pos.lng) * cosLat;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return [[pos.lat, pos.lng], ...coords.slice(best)];
}

const esc = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * Tarjeta que se abre al tocar una fuente, como un sitio en Google Maps: foto, nombre y cómo llegar.
 * Si hay una foto real de esa fuente se usa (con su autoría); si no, una foto de ejemplo, avisándolo.
 */
function fountainCard(f: Fountain, from: LatLng | null): string {
  const away = from ? ` (${formatDistance(distanceM(from, f))})` : "";
  const photo = f.photo;
  const alt = photo
    ? "Foto de esta fuente, un nasone de Roma"
    : "Un nasone, la fuente de hierro típica de Roma, con su caño curvo";
  // Si la foto de Wikimedia no carga, se cambia por la de ejemplo y se avisa de que lo es.
  const fallback = "this.onerror=null;this.src='/img/nasone.jpg';this.nextElementSibling.hidden=false;this.parentElement.classList.remove('real')";
  return `<article class="fountain-card">
    <figure class="fountain-photo${photo ? " real" : ""}">
      <img src="${photo ? esc(photo.url) : "/img/nasone.jpg"}" width="96" height="170" loading="lazy" alt="${alt}"${photo ? ` onerror="${fallback}"` : ""}>
      <figcaption${photo ? " hidden" : ""}>Foto de ejemplo</figcaption>
    </figure>
    <div class="fountain-body">
      <h3>Nasone</h3>
      <p class="fountain-kind">Fuente de agua potable</p>
      ${photo?.lugar ? `<p class="fountain-place">En ${esc(photo.lugar)}</p>` : ""}
      <p>Así llaman los romanos a estas fuentes, por su caño curvo. El agua es gratis y potable. Tapa el caño con un dedo y beberás del agujero de arriba.</p>
      <div class="fountain-actions">
        <a class="btn btn-small btn-primary" href="${mapsDirectionsUrl({ destination: f })}" target="_blank" rel="noopener noreferrer">Cómo llegar${away}</a>
        <a class="btn btn-small" href="${streetViewUrl(f)}" target="_blank" rel="noopener noreferrer">Ver la calle</a>
      </div>
      ${photo ? `<p class="fountain-credit">Foto: <a href="${esc(photo.pagina)}" target="_blank" rel="noopener noreferrer">${esc(photo.autor)}</a>, ${esc(photo.licencia)}</p>` : ""}
    </div>
  </article>`;
}

/**
 * Tarjeta que se abre al tocar una parada en el mapa, como un sitio en Google Maps: foto, nombre,
 * una explicación corta y los botones para escuchar la guía o ir hasta allí.
 */
function stopCard(stop: Stop, meta: string, from: LatLng | null, onGuide: () => void): HTMLElement {
  const away = from ? ` (${formatDistance(distanceM(from, stop))})` : "";
  const el = document.createElement("article");
  el.className = "stop-card";
  el.innerHTML = `${
    stop.photo
      ? `<figure class="stop-photo"><img src="${esc(stop.photo.src)}" alt="${esc(stop.photo.alt)}" loading="lazy"><figcaption>${esc(
          stop.photo.credit.replace(/^Foto: /, "").replace(", Wikimedia Commons", ""),
        )}</figcaption></figure>`
      : ""
  }
    <div class="stop-body">
      <p class="stop-meta">${esc(meta)}</p>
      <h3>${esc(stop.name)}</h3>
      <p class="stop-teaser">${esc(stop.teaser)}</p>
      <div class="stop-actions">
        <button type="button" class="btn btn-small btn-primary" data-guide>Escuchar la guía</button>
        <a class="btn btn-small" href="${mapsDirectionsUrl({ destination: stop })}" target="_blank" rel="noopener noreferrer">Cómo llegar${away}</a>
      </div>
    </div>`;
  el.querySelector("[data-guide]")?.addEventListener("click", onGuide);
  return el;
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Props {
  dayId?: string;
  stopId?: string;
}

export function RouteMap({ dayId, stopId }: Props) {
  const { lodging, visited, fountainMode, fitSignal } = useApp();
  const { position } = useTracking();
  const navigate = useNavigate();

  // La posición actual, para que la tarjeta de una fuente pueda decir a qué distancia estás.
  const positionRef = useRef<LatLng | null>(null);
  positionRef.current = position;
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const lineLayer = useRef<L.LayerGroup | null>(null);
  const routeLayer = useRef<L.LayerGroup | null>(null);
  const youLayer = useRef<L.LayerGroup | null>(null);
  const fountainLayer = useRef<L.LayerGroup | null>(null);
  const applyView = useRef<() => void>(() => {});
  const you = useRef<{ dot: L.CircleMarker; halo: L.Circle } | null>(null);
  const anim = useRef<number | null>(null);
  const wasFollowing = useRef(false);
  const [follow, setFollow] = useState(false);
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
    // Orden de abajo arriba: fuentes, línea de la ruta, paradas y tu posición.
    fountainLayer.current = L.layerGroup().addTo(m);
    lineLayer.current = L.layerGroup().addTo(m);
    routeLayer.current = L.layerGroup().addTo(m);
    youLayer.current = L.layerGroup().addTo(m);
    map.current = m;
    m.on("dragstart", () => setFollow(false)); // si mueves el mapa con el dedo, deja de seguirte

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
          .bindPopup(() => stopCard(stop, `Día ${d}`, positionRef.current, () => navigate(`/dia/${d}/parada/${stop.id}`)), STOP_POPUP)
          .addTo(layer);
      });
      return;
    }

    stops.forEach((s, i) => {
      L.marker([s.lat, s.lng], { icon: pinIcon(String(i + 1), s.id === stopId ? "active" : visited.includes(s.id) ? "done" : ""), title: s.name })
        .bindPopup(() => stopCard(s, `Parada ${i + 1} de ${stops.length}`, positionRef.current, () => navigate(`/dia/${day.id}/parada/${s.id}`)), STOP_POPUP)
        .addTo(layer);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, lodging, visited, stopId]);

  /* Línea de la ruta. Al recorrer el día se recorta para que empiece donde estás. */
  const linePos = live ? position : null;
  useEffect(() => {
    const layer = lineLayer.current;
    if (!layer) return;
    layer.clearLayers();
    if (!day || !foot) return;
    const coords = linePos ? trimFrom(foot.coords, linePos) : foot.coords;
    L.polyline(coords, { color: "#fff", weight: 9, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(layer);
    L.polyline(coords, {
      color: "#7A2E6E",
      weight: 5,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
      dashArray: foot.exact ? undefined : "2 10",
    }).addTo(layer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, foot?.coords, foot?.exact, linePos]);

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

  /* Tu posición: el punto se desliza hasta cada nueva lectura en vez de saltar */
  useEffect(() => {
    const layer = youLayer.current;
    if (!layer) return;
    if (anim.current !== null) cancelAnimationFrame(anim.current);
    if (!position) {
      layer.clearLayers();
      you.current = null;
      return;
    }
    const target = L.latLng(position.lat, position.lng);
    if (!you.current) {
      const halo = L.circle(target, {
        radius: position.accuracy,
        color: "#2b6cb0",
        weight: 1,
        fillColor: "#2b6cb0",
        fillOpacity: 0.12,
      }).addTo(layer);
      const dot = L.circleMarker(target, { radius: 8, color: "#fff", weight: 3, fillColor: "#2b6cb0", fillOpacity: 1 }).addTo(layer);
      you.current = { dot, halo };
      return;
    }
    const { dot, halo } = you.current;
    halo.setRadius(position.accuracy);
    if (reducedMotion()) {
      dot.setLatLng(target);
      halo.setLatLng(target);
      return;
    }
    const from = dot.getLatLng();
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 900);
      const ll = L.latLng(from.lat + (target.lat - from.lat) * k, from.lng + (target.lng - from.lng) * k);
      dot.setLatLng(ll);
      halo.setLatLng(ll);
      anim.current = k < 1 ? requestAnimationFrame(step) : null;
    };
    anim.current = requestAnimationFrame(step);
    return () => {
      if (anim.current !== null) cancelAnimationFrame(anim.current);
    };
  }, [position]);

  /* Modo "seguirme": el mapa acompaña tu posición */
  useEffect(() => {
    if (!position) setFollow(false);
  }, [position]);
  useEffect(() => {
    const m = map.current;
    if (!m || !follow || !position) {
      wasFollowing.current = false;
      return;
    }
    const ll: L.LatLngTuple = [position.lat, position.lng];
    if (!wasFollowing.current) m.flyTo(ll, Math.max(m.getZoom(), 17), { duration: 0.6 });
    else m.panTo(ll, { animate: true, duration: 0.8 });
    wasFollowing.current = true;
  }, [follow, position]);

  /* Fuentes de agua potable */
  useEffect(() => {
    const layer = fountainLayer.current;
    if (!layer) return;
    layer.clearLayers();
    setFountainError(false);
    if (fountainMode === "off" || stopId) return;

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
        // En pantallas táctiles el punto es más grande para poder tocarlo bien con el dedo.
        const radius = window.matchMedia("(pointer: coarse)").matches ? 8 : 5;
        const shown = fountainMode === "fotos" ? list.filter((f) => f.photo) : list;
        shown.forEach((f) =>
          L.circleMarker([f.lat, f.lng], { radius, color: "#fff", weight: 2, fillColor: "#0891b2", fillOpacity: 1 })
            .bindPopup(() => fountainCard(f, positionRef.current), {
              className: "fountain-popup",
              minWidth: 320,
              maxWidth: 320,
              autoPanPadding: [16, 16],
            })
            .addTo(layer),
        );
      })
      .catch(() => alive && setFountainError(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fountainMode, dayId, lodging, stopId]);

  return (
    <div className="map" aria-label="Mapa de la ruta">
      <div ref={box} className="map-canvas" />
      {position && (
        <button
          type="button"
          className="map-locate"
          aria-pressed={follow}
          onClick={() => setFollow((f) => !f)}
        >
          {follow ? "Siguiéndote" : "Seguirme"}
        </button>
      )}
      {fountainError && <p className="map-note">No se pudieron cargar las fuentes ahora mismo.</p>}
    </div>
  );
}
