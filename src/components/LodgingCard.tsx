import { useState, type FormEvent } from "react";
import { searchPlace, type PlaceResult } from "../lib/places";
import { useApp } from "../state/AppState";
import { useTracking } from "../state/Tracking";

/** Punto de partida: se busca por dirección o se usa la ubicación del móvil. Se guarda en este móvil. */
export function LodgingCard() {
  const { lodging, setLodging } = useApp();
  const { locateOnce } = useTracking();
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const missing = lodging === null;
  const open = missing || editing;

  const close = () => {
    setEditing(false);
    setResults([]);
    setMessage("");
    setQuery("");
  };

  const choose = (name: string, lat: number, lng: number) => {
    setLodging({ name, lat, lng });
    close();
  };

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 3) return;
    setBusy(true);
    setMessage("");
    try {
      const found = await searchPlace(query.trim().toLowerCase().includes("roma") ? query : `${query}, Roma`);
      setResults(found);
      if (found.length === 0) {
        setMessage("No encuentro esa dirección. Prueba con la calle y el número, por ejemplo «Via del Corso 10».");
      }
    } catch {
      setMessage("No se pudo buscar ahora mismo. Prueba otra vez en un momento.");
    } finally {
      setBusy(false);
    }
  };

  const onLocate = async () => {
    setBusy(true);
    setMessage("");
    try {
      const p = await locateOnce();
      choose("Mi ubicación actual", p.lat, p.lng);
    } catch {
      setMessage("No pude obtener tu ubicación. Revisa que el navegador tenga permiso de ubicación para esta web.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`start${missing ? " start-missing" : ""}`} aria-label="Punto de partida">
      {lodging ? (
        <>
          <p className="start-label">Salís desde</p>
          <p className="start-name">{lodging.name}</p>
        </>
      ) : (
        <>
          <p className="start-title">¿Dónde os alojáis?</p>
          <p className="start-hint">
            Escribid la dirección una vez y las rutas saldrán de ahí. Se guarda solo en este móvil.
          </p>
        </>
      )}

      {!open ? (
        <div className="start-actions">
          <button type="button" className="btn" onClick={() => setEditing(true)}>
            Cambiar alojamiento
          </button>
        </div>
      ) : (
        <div className="start-edit">
          <form onSubmit={onSearch} className="start-form">
            <label htmlFor="lodging-query" className="start-label">
              Dirección del alojamiento
            </label>
            <div className="start-row">
              <input
                id="lodging-query"
                className="input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Calle y número"
                autoComplete="off"
              />
              <button className="btn btn-primary" type="submit" disabled={busy}>
                Buscar
              </button>
            </div>
          </form>
          {results.length > 0 && (
            <ul className="results">
              {results.map((r) => (
                <li key={`${r.lat},${r.lng}`}>
                  <button type="button" onClick={() => choose(r.name, r.lat, r.lng)}>
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {message && <p className="start-message">{message}</p>}
          <div className="start-actions">
            <button type="button" className="btn" onClick={onLocate} disabled={busy}>
              Usar mi ubicación actual
            </button>
            {!missing && (
              <button type="button" className="btn btn-quiet" onClick={close}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
