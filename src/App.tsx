import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useMatch } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LiveStack } from "./components/LiveStack";
import { DayPage } from "./pages/DayPage";
import { Home } from "./pages/Home";
import { StopPage } from "./pages/StopPage";
import { onAppUpdate } from "./lib/offline";
import { AppProvider } from "./state/AppState";
import { TrackingProvider } from "./state/Tracking";

// El mapa (con Leaflet) es lo más pesado de la web: se descarga aparte, para que la portada y los textos salgan antes.
const RouteMap = lazy(() => import("./components/RouteMap").then((m) => ({ default: m.RouteMap })));

/** Marco de la web: el mapa siempre presente y el panel de contenido que cambia según la ruta. */
function Layout() {
  const { pathname } = useLocation();
  const stopMatch = useMatch("/dia/:dayId/parada/:stopId");
  const dayMatch = useMatch("/dia/:dayId/*");
  const panel = useRef<HTMLElement>(null);
  const [updated, setUpdated] = useState(false);

  const view = stopMatch ? "stop" : dayMatch ? "day" : "home";

  // Una versión nueva de la web se instala sola, pero la página abierta sigue con la vieja hasta recargar.
  useEffect(() => onAppUpdate(() => setUpdated(true)), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    panel.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app" data-view={view}>
      {/* Si el mapa falla, los textos y las guías siguen funcionando. */}
      <ErrorBoundary fallback={<div className="map" aria-hidden="true" />}>
        <Suspense fallback={<div className="map" aria-hidden="true" />}>
          <RouteMap dayId={dayMatch?.params.dayId} stopId={stopMatch?.params.stopId} />
        </Suspense>
      </ErrorBoundary>
      <main className="panel" ref={panel}>
        <div className="panel-inner">
          {updated && (
            <div className="update-bar" role="status">
              <span>Hay una versión nueva de la web.</span>
              <button type="button" className="btn btn-small btn-primary" onClick={() => window.location.reload()}>
                Actualizar
              </button>
            </div>
          )}
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </div>
        <LiveStack />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TrackingProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dia/:dayId" element={<DayPage />} />
              <Route path="dia/:dayId/parada/:stopId" element={<StopPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TrackingProvider>
    </AppProvider>
  );
}
