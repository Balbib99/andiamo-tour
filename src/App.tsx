import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useMatch } from "react-router-dom";
import { LiveStack } from "./components/LiveStack";
import { DayPage } from "./pages/DayPage";
import { Home } from "./pages/Home";
import { StopPage } from "./pages/StopPage";
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

  const view = stopMatch ? "stop" : dayMatch ? "day" : "home";

  useEffect(() => {
    window.scrollTo(0, 0);
    panel.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app" data-view={view}>
      <Suspense fallback={<div className="map" aria-hidden="true" />}>
        <RouteMap dayId={dayMatch?.params.dayId} stopId={stopMatch?.params.stopId} />
      </Suspense>
      <main className="panel" ref={panel}>
        <div className="panel-inner">
          <Outlet />
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
