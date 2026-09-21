import { Link } from "react-router-dom";
import { days, romanNumerals, startPoint } from "../data/itinerario";
import type { Day } from "../data/types";
import { formatDistance, routePoints } from "../lib/geo";
import { useFootRoute } from "../lib/routing";

function Plaque({ day, index }: { day: Day; index: number }) {
  const foot = useFootRoute(day.stops.length ? routePoints(startPoint, day.stops) : null);
  const hasRoute = day.stops.length > 0;

  return (
    <li>
      <Link className="plaque" to={`/dia/${day.id}`}>
        <span className="rione" aria-hidden="true">
          {romanNumerals[index] ?? index + 1}
        </span>
        <span className="plaque-body">
          <span className="plaque-title">
            Día <span className="num">{day.id}</span>
          </span>
          <span className="plaque-sub">{day.title}</span>
          <span className="plaque-meta">
            {hasRoute ? (
              <>
                <span>{day.stops.length} paradas</span>
                {foot && <span>{foot.exact ? "" : "unos "}{formatDistance(foot.km * 1000)}</span>}
              </>
            ) : (
              <span className="todo">Ruta por añadir</span>
            )}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function Plaques() {
  return (
    <ul className="plaques">
      {days.map((d, i) => (
        <Plaque key={d.id} day={d} index={i} />
      ))}
    </ul>
  );
}
