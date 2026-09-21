import { Hero } from "../components/Hero";
import { Plaques } from "../components/Plaques";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

export function Home() {
  const { visited, resetVisited } = useApp();
  const { resetAlerts } = useTracking();

  return (
    <>
      <Hero />
      <Plaques />
      {visited.length > 0 && (
        <p className="note">
          Lleváis {visited.length} {visited.length === 1 ? "parada vista" : "paradas vistas"}.{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              resetVisited();
              resetAlerts();
            }}
          >
            Empezar de cero
          </button>
        </p>
      )}
      <p className="note">
        Los textos de las paradas son un borrador que iremos afinando. Lo que lleva «(ejemplo)» es de prueba.
      </p>
    </>
  );
}
