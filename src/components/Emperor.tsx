import { useEffect, useRef, useState } from "react";

/**
 * Imagen de bienvenida. Se usa la primera que exista en public/personajes:
 *  1. bienvenida.mp4  (animación de los protagonistas saludando)
 *  2. bienvenida.png  (imagen fija, mejor con fondo transparente)
 *  3. emperador.jpg   (foto de la estatua de Augusto, con su crédito)
 */
const VIDEO = "/personajes/bienvenida.mp4";
const PNG = "/personajes/bienvenida.png";
const STATUE = "/personajes/emperador.jpg";

type Source = "video" | "png" | "statue";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function WelcomeVideo({ onMissing }: { onMissing: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  const reduced = prefersReducedMotion();

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    void v.play();
  };

  return (
    <div className="emperor">
      <div className="emperor-frame">
        <video
          ref={ref}
          src={VIDEO}
          muted
          playsInline
          autoPlay={!reduced}
          preload="auto"
          aria-label="Un emperador romano saluda desde un balcón con Roma al fondo"
          onError={onMissing}
          onEnded={() => setEnded(true)}
          onLoadedMetadata={(e) => {
            // Con movimiento reducido se muestra un fotograma con el saludo, sin reproducir.
            if (reduced) e.currentTarget.currentTime = 1.3;
          }}
          onClick={replay}
        />
        {(ended || reduced) && (
          <button type="button" className="emperor-replay" aria-label="Volver a ver el saludo" onClick={replay}>
            Otra vez
          </button>
        )}
      </div>
    </div>
  );
}

/** Personaje de la portada. */
export function Emperor() {
  const [source, setSource] = useState<Source>("video");

  useEffect(() => {
    if (source !== "png") return;
    const img = new Image();
    img.onerror = () => setSource("statue");
    img.src = PNG;
  }, [source]);

  if (source === "video") return <WelcomeVideo onMissing={() => setSource("png")} />;

  if (source === "png") {
    return (
      <div className="emperor">
        <img
          className="emperor-custom"
          src={PNG}
          alt="Los protagonistas de Andiamo saludando"
          onError={() => setSource("statue")}
        />
      </div>
    );
  }

  return (
    <figure className="emperor">
      <div className="emperor-frame">
        <img
          src={STATUE}
          width={500}
          height={800}
          alt="Estatua del emperador Augusto de Prima Porta, con el brazo alzado en gesto de saludo"
        />
      </div>
      <figcaption>
        Augusto de Prima Porta, Museos Vaticanos. Foto: Joel Bellviure,{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0" target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>
        .
      </figcaption>
    </figure>
  );
}
