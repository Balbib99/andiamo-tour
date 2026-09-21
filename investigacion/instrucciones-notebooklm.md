# Cómo crear los podcasts con NotebookLM

Esta guía acompaña a los documentos `foro-romano.md` y `monte-palatino.md`.

## 1. Preparar el cuaderno

1. Entra en NotebookLM con tu cuenta de Google y crea **un cuaderno por podcast**: uno para el Foro Romano y otro para el Palatino. Así cada episodio se centra en su lugar y no se mezclan los datos.
2. En cada cuaderno, pulsa **Añadir fuente** y sube el documento correspondiente (`foro-romano.md` o `monte-palatino.md`). Si NotebookLM no aceptara el formato `.md`, dímelo y lo convierto a PDF o a Word.
3. Opcional, pero recomendable: añade también como fuentes las direcciones web oficiales que aparecen al final de cada documento, sobre todo las del parque arqueológico (`colosseo.it`). Cuantas más fuentes buenas haya, menos se inventa.
4. Comprueba que el idioma de salida del cuaderno es **español**.

## 2. Generar el audio

En la sección de resumen de audio (*Audio Overview*), abre **Personalizar** y elige, si te lo ofrece, el formato de conversación tipo "inmersión" (*Deep Dive*) y la duración larga. Los nombres exactos de las opciones pueden variar según la versión, así que si no coinciden, elige la más parecida. Después pega en el cuadro de instrucciones el texto de abajo.

### Texto para el Foro Romano

> Crea un episodio en español de España para dos viajeros que visitarán el Foro Romano en noviembre y quieren entender lo que ven mientras caminan. Tono cercano, con humor suave y sin exagerar ni dramatizar de más. Cuenta las historias, no solo las fechas: las Vestales, el Lacus Curtius, el funeral de César, el Arco de Tito y la menorá, el Campo Vaccino. Distingue siempre lo que está documentado de lo que es tradición o leyenda, y di con claridad cuando los especialistas no están de acuerdo. Sigue el orden de un paseo de este a oeste, desde el Templo de Venus y Roma hasta el mirador del Capitolio. Usa únicamente lo que dicen las fuentes: si un dato no está en ellas, no lo añadas. Evita repetir lo mismo y cierra con una idea sobre cómo el Foro pasó de centro del mundo a pasto de vacas y volvió a ser lo que es hoy.

### Texto para el Monte Palatino

> Crea un episodio en español de España para dos viajeros que visitarán el Monte Palatino en noviembre justo después del Foro Romano. Tono cercano, con humor suave y sin exagerar. Empieza por la palabra "palacio" y por la leyenda de Rómulo, Remo y la loba, y separa siempre la leyenda de lo que se ha demostrado. Cuenta con detalle la casa de Augusto y lo modesta que la describe Suetonio frente a lo que se ve hoy, la Casa de Livia y sus pinturas, la piedra negra de Cibeles, y el palacio de Domiciano con la anécdota de la piedra pulida. Aclara los errores frecuentes, en especial que la Domus Severiana no es el palacio mejor conservado y que la gruta del Lupercal hallada en 2007 está muy discutida. Usa únicamente lo que dicen las fuentes: si un dato no está en ellas, no lo añadas.

## 3. Antes de publicar el audio: cómo comprobarlo

NotebookLM se apoya en tus fuentes, pero **puede equivocarse o adornar**. Escucha el episodio con esta lista al lado y apunta el minuto de cualquier fallo:

**Foro Romano**
- Las ocho columnas del templo de Saturno son del siglo IV, no del 42 a. C.
- La Curia actual es de Diocleciano, con restauración de los años treinta del siglo XX.
- El templo de Vesta que se ve es una reconstrucción parcial de 1930-31.
- La menorá del Arco de Tito y la prohibición de pasar bajo él, levantada en 1947.
- La anécdota de la horquilla de Fulvia y la cabeza de Cicerón debe presentarse como anécdota, no como hecho.
- Las cifras de las Vestales: seis, treinta años de servicio, reclutadas entre los 6 y los 10 años.

**Monte Palatino**
- La Domus Severiana **no** es el mejor palacio conservado: lo es el de Domiciano.
- "Augustana" significa "imperial", no "de Augusto".
- La casa de Augusto: la identificación es la oficial, pero hay dudas.
- El Lupercal de 2007 es una identificación discutida.
- Los frescos de Livia del Palatino no son los de Prima Porta.
- La piedra pulida de Domiciano es una anécdota de Suetonio.

## 4. Después

Si algo no cuadra, dime el minuto y lo que dice y lo corrijo en el documento para regenerar el episodio. Cuando tengas el audio aprobado, guárdalo (NotebookLM permite descargarlo) y pégalo en la carpeta `public/podcast/` del proyecto con el nombre del lugar, por ejemplo `foro-romano.m4a`. Yo lo integraré en la ficha de la parada, con su reproductor.

**Tamaño:** un episodio largo pesa entre 10 y 25 MB. Con dos o tres, la web sigue cargando bien porque el audio solo se descarga al pulsar el botón, pero en una web con muchos podcasts habría que pensar en el espacio.

## 5. Un aviso sobre datos que cambian

Los horarios y las normas de entrada del parque cambian de una temporada a otra. Los documentos recogen los vigentes el 21 de septiembre de 2026, pero **no conviene meter horarios ni precios en el audio**: envejecen. Es mejor dejarlos solo en la web, donde se pueden actualizar.
