# Andiamo

Guía interactiva para recorrer Roma a pie: mapa con la ruta de cada día, paradas con historia, fotos, audio y
avisos de cercanía. Hecha con Vite, React, TypeScript y Leaflet (OpenStreetMap). No necesita claves de API.

## Arrancar en local

```bash
npm install
npm run dev
```

Se abre en http://localhost:5173.

## Editar el viaje

Todo el contenido está en [src/data/itinerario.ts](src/data/itinerario.ts):

- `startPoint`: el punto de inicio de las rutas, con coordenadas aproximadas. En la web solo aparece como «Punto de
  inicio»; no hay dirección ni se pide a nadie.
- `days`: los días y sus paradas, en el orden en que se recorren.
- Cada parada lleva coordenadas (clic derecho en Google Maps y se copian los dos números), una explicación corta
  (`teaser`, la que sale en la tarjeta del mapa), la historia y, si se quiere, un enlace a una audioguía externa.
- La foto de cada parada con sus puntos para tocar y escuchar está en [src/data/guias.ts](src/data/guias.ts), unida a la
  parada por su `id`. Las imágenes están en `public/img/monumentos/` (de Wikimedia Commons, con licencia libre y su
  autoría mostrada). Los puntos se dan en píxeles de la foto y el código los pasa a porcentaje. Toda parada nueva debería
  llevar su foto y sus puntos, como el Coliseo.
- En el mapa, al tocar una parada se abre una tarjeta con su foto, el `teaser` y los botones «Escuchar la guía» y
  «Cómo llegar».

Lo que lleva «(ejemplo)» es de prueba.

## Imagen de la portada

La portada muestra la primera que exista en `public/personajes/`: `bienvenida.mp4` (animación), `bienvenida.png` (imagen
fija con fondo transparente) o, si no hay ninguna, la foto de una estatua romana. Para cambiarla basta guardar el archivo
con ese nombre. Más detalles en `public/personajes/LEEME.txt`.

## Audios

Cada punto de la foto de cada parada tiene su audio, hecho con la voz de Ximena de Microsoft
Edge y guardado en `public/audio/`. La web reproduce esos archivos y, si falta alguno o no se puede reproducir, lee el
texto con la voz del móvil. `public/audio/manifest.json` lista los audios y lo que dura cada uno.

Cuando cambies un texto de `src/data/itinerario.ts` o de `src/data/guias.ts`, regenera los audios (solo rehace los que han cambiado). Hace falta
Python y Node, y instalar una vez `pip install edge-tts num2words`:

```bash
python scripts/generar-audios.py
```

El script adapta el texto para la voz: entre frases del mismo párrafo pone punto y coma, porque un punto deja casi un
segundo de silencio, y escribe con letras los números y «a. C.». Con `--todo` rehace todos.

## Podcasts (NotebookLM)

Los podcasts descargados pesan decenas de MB, así que se comprimen antes de publicarlos:

1. Guarda el original en `audios-originales/` (carpeta fuera de Git y de Vercel) con el nombre del dosier: `coliseo.m4a`,
   `foro-romano.m4a`...
2. Ejecuta `python scripts/comprimir_audios.py` (hace falta ffmpeg). Cada audio se comprime una sola vez, a AAC mono
   de 48 kbps, y sale en `public/podcast/`.
3. Registra el podcast en `src/data/podcasts.ts` (id de la parada, nombre del archivo y minutos) y aparecerá en su ficha,
   con un reproductor, y en la lista del día.
4. Solo `public/podcast/` se sube. No metas podcasts en `public/audio/`: ahí `generar-audios.py` borra los `.mp3` que no
   correspondan a una parada.

## Publicar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel: Add New, Project, y elige el repositorio. Detecta Vite solo.
3. Deploy. El archivo `vercel.json` ya redirige todas las rutas a la web.

La ubicación del móvil solo funciona con HTTPS, y Vercel lo da por defecto.

## Cómo funciona el seguimiento

- «Empezar ruta» activa el GPS y mantiene la pantalla encendida.
- Al empezar, las paradas que faltan se reordenan para hacer el menor camino a pie desde donde estéis (el orden más
  corto, calculado con las distancias reales por las calles) y la numeración del mapa y de la lista cambia a ese orden.
  El cálculo se repite al llegar a cada parada, y también con «Recalcular desde aquí». Al parar la ruta vuelve el orden
  previsto del día, que sale del punto de inicio. La reordenación no depende del día, sirve con las paradas que tenga cada uno.
- A 150 m de una parada avisa; a 50 m marca la parada como vista.
- Las lecturas de GPS con más de 100 m de error se ignoran.
- Solo funciona con la web abierta y la pantalla encendida: un navegador no puede vigilar la ubicación en segundo plano.

## Servicios externos (gratuitos)

- Mapa: teselas de OpenStreetMap.
- Rutas a pie: `routing.openstreetmap.de` (FOSSGIS). Si falla, se dibuja una línea recta como estimación.
- Fuentes de agua potable: no se piden a ningún servicio al usar la web. Están en `public/data/fuentes-roma.json`
  (1.834 puntos de OpenStreetMap descargados el 19/9/2026, © colaboradores de OpenStreetMap, licencia ODbL). Se cargó
  así porque Overpass, el servicio público de OpenStreetMap, se satura y falla a ratos.
- Fotos de las fuentes: 182 fuentes llevan su foto real de Wikimedia Commons (categoría «Nasoni (Rome)»), emparejada
  por cercanía (a menos de 25 m). Casi todas son CC BY-SA 4.0 y algunas CC0: la tarjeta muestra el autor y la
  licencia, y hay que mantenerlos. Se cargan desde Wikimedia y, si una falla, la tarjeta usa la foto de ejemplo
  (`public/img/nasone.jpg`, de Guretto, CC0). El nombre de la calle sale del nombre del archivo de cada foto.
- El botón «Ver la calle» de cada fuente abre Google Street View en ese punto.
- En la vista de cada día se elige qué fuentes ver: ninguna, solo las que tienen foto real, o todas. La elección se guarda
  en el móvil.
- Para un uso intenso conviene cambiar las teselas por un proveedor propio (MapTiler, Stadia) con clave gratuita.
