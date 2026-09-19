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

- El alojamiento no está en el código: cada persona lo escribe la primera vez que entra en la web (por dirección o con su
  ubicación) y queda guardado solo en su móvil.
- `days`: los días y sus paradas, en el orden en que se recorren.
- Cada parada lleva coordenadas (clic derecho en Google Maps y se copian los dos números), historia y, si se quiere,
  una foto con puntos numerados y un enlace a una audioguía externa.

Lo que lleva «(ejemplo)» es de prueba.

## Imagen de la portada

La portada muestra la primera que exista en `public/personajes/`: `bienvenida.mp4` (animación), `bienvenida.png` (imagen
fija con fondo transparente) o, si no hay ninguna, la foto de una estatua romana. Para cambiarla basta guardar el archivo
con ese nombre. Más detalles en `public/personajes/LEEME.txt`.

## Publicar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel: Add New, Project, y elige el repositorio. Detecta Vite solo.
3. Deploy. El archivo `vercel.json` ya redirige todas las rutas a la web.

La ubicación del móvil solo funciona con HTTPS, y Vercel lo da por defecto.

## Cómo funciona el seguimiento

- «Empezar ruta» activa el GPS y mantiene la pantalla encendida.
- A 150 m de una parada avisa; a 50 m marca la parada como vista.
- Las lecturas de GPS con más de 100 m de error se ignoran.
- Solo funciona con la web abierta y la pantalla encendida: un navegador no puede vigilar la ubicación en segundo plano.

## Servicios externos (gratuitos)

- Mapa: teselas de OpenStreetMap.
- Rutas a pie: `routing.openstreetmap.de` (FOSSGIS). Si falla, se dibuja una línea recta como estimación.
- Búsqueda de direcciones: Nominatim.
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
