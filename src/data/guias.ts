import type { Photo, PhotoPoint } from "./types";

/**
 * Foto de cada parada con sus puntos para tocar y escuchar. Se une a la parada en itinerario.ts por su id.
 * Las fotos están en public/img/monumentos y vienen de Wikimedia Commons (licencias libres, con su autoría).
 * Las posiciones de los puntos se dan en píxeles de la foto y se convierten aquí a porcentaje.
 */
export interface Guide {
  photo: Photo;
  points: PhotoPoint[];
}

const photo = (id: string, w: number, h: number, alt: string, author: string, license: string): Photo => ({
  src: `/img/monumentos/${id}.jpg`,
  alt,
  ratio: `${w} / ${h}`,
  credit: `Foto: ${author}, Wikimedia Commons, ${license}`,
});

/** Crea puntos a partir de la posición en píxeles dentro de una foto de w × h. */
const on =
  (w: number, h: number) =>
  (px: number, py: number, title: string, text: string): PhotoPoint => ({
    x: Math.round((px / w) * 1000) / 10,
    y: Math.round((py / h) * 1000) / 10,
    title,
    text,
  });

const trevi = on(1280, 694);
const vittoriano = on(1280, 720);
const foro = on(1280, 526);
const circo = on(1280, 853);
const arco = on(1280, 1080);
const palatino = on(1280, 853);
const cosmedin = on(1280, 1631);
const cavalieri = on(1280, 781);
const jardin = on(1280, 960);
const sisto = on(1280, 1086);
const cecilia = on(1280, 886);
const portese = on(1280, 960);
const montorio = on(1280, 1624);
const paola = on(1280, 1226);
const gianicolo = on(1280, 844);
const vincoli = on(1280, 908);
const monti = on(1280, 960);
const mercados = on(1280, 818);
const capitolinos = on(1280, 842);
const judio = on(1280, 911);
const campo = on(1280, 897);
const largo = on(1280, 960);
const navona = on(1280, 906);
const sanPedro = on(1280, 719);
const vaticanos = on(1280, 960);

export const guides: Record<string, Guide> = {
  trevi: {
    photo: photo("trevi", 1280, 694, "La Fontana di Trevi con su fachada de palacio y el agua turquesa en primer plano", "NikonZ7II", "CC BY-SA 4.0"),
    points: [
      trevi(
        700,
        485,
        "Océano y sus caballos",
        "En el centro, Océano, el dios de las aguas, avanza sobre un carro con forma de concha tirado por dos caballos marinos. Mucha gente lo llama Neptuno, pero es Océano. Fijaos en los caballos: uno va tranquilo y el otro agitado, como los dos humores del mar.",
      ),
      trevi(
        548,
        447,
        "La Abundancia y la Salud",
        "En los dos nichos de los lados hay dos figuras que representan lo que da el agua. La Abundancia, con su cuerno lleno de frutos, y la Salud, que sostiene una copa de la que bebe una serpiente.",
      ),
      trevi(
        662,
        190,
        "El escudo y la inscripción",
        "La inscripción recuerda al papa Clemente doce, que convocó el concurso para hacer la fuente, y arriba está su escudo. Nicola Salvi ganó el encargo, pero murió en 1751 sin verla terminada. Se inauguró en 1762.",
      ),
      trevi(
        900,
        590,
        "El agua y la moneda",
        "El agua llega por el acueducto Aqua Virgo, que Agripa hizo construir en el año 19 antes de Cristo, y todavía alimenta la fuente. La costumbre es lanzar una moneda de espaldas, con la mano derecha por encima del hombro izquierdo, para asegurarse la vuelta a Roma. Lo que se recoge se destina a obras de caridad.",
      ),
    ],
  },

  vittoriano: {
    photo: photo("vittoriano", 1280, 720, "El Vittoriano, un gran monumento de mármol blanco con columnas, escalinata y estatua ecuestre", "Max Ryazanov", "CC BY-SA 3.0"),
    points: [
      vittoriano(
        645,
        300,
        "El rey a caballo",
        "El monumento honra a Víctor Manuel segundo, primer rey de la Italia unida. La enorme estatua ecuestre de bronce parece pequeña vista desde abajo, y eso da idea de la escala de todo el conjunto, que se inauguró en 1911.",
      ),
      vittoriano(
        650,
        490,
        "El Altar de la Patria",
        "Al pie de la estatua de la diosa Roma está la Tumba del Soldado Desconocido, con una llama encendida y guardia de honor. Se colocó en 1921, después de la Primera Guerra Mundial, y por eso el monumento se llama también Altar de la Patria.",
      ),
      vittoriano(
        310,
        105,
        "Las cuadrigas",
        "En lo alto, a cada lado, una cuadriga de bronce lleva a la Victoria alada. Representan la unidad y la libertad de Italia.",
      ),
      vittoriano(
        280,
        260,
        "Mármol blanco",
        "El mármol blanco y brillante viene de canteras de Brescia, en el norte de Italia. Choca con los tonos cálidos del resto de Roma, y por eso los romanos lo apodan la máquina de escribir o la tarta de bodas.",
      ),
      vittoriano(
        600,
        180,
        "La terraza",
        "Arriba, detrás de las columnas, hay una terraza con una de las mejores vistas de los Foros, del Coliseo y de toda la ciudad. Hay un ascensor panorámico para subir, y conviene consultar antes su horario.",
      ),
    ],
  },

  "foro-romano": {
    photo: photo("foro-romano", 1280, 526, "Vista panorámica del Foro Romano con las columnas del templo de Vespasiano, el arco de Septimio Severo y el Palatino al fondo", "Wolfgang Moroder", "CC BY-SA 3.0"),
    points: [
      foro(
        610,
        455,
        "Un valle pantanoso",
        "Antes de ser el centro de Roma esto era un valle pantanoso entre colinas. Se drenó con la Cloaca Máxima y se convirtió en el centro político, religioso y comercial de la ciudad. Siglos después, en la Edad Media, quedó medio enterrado y se le llamó Campo Vaccino, porque entre las ruinas pastaban las vacas.",
      ),
      foro(
        230,
        300,
        "Arco de Septimio Severo",
        "Se levantó en el año 203 para celebrar las victorias del emperador Septimio Severo y de sus hijos sobre los partos. En la inscripción se borró el nombre de Geta, el hijo pequeño, cuando su hermano Caracalla lo mandó matar.",
      ),
      foro(
        365,
        330,
        "Templo de Vespasiano y Tito",
        "Las tres columnas corintias, muy altas, son de un templo dedicado a Vespasiano y a su hijo Tito, convertidos en dioses tras su muerte. Lo terminó Domiciano, hermano de Tito. Es uno de los rincones más fotogénicos del Foro.",
      ),
      foro(
        695,
        260,
        "Templo de Saturno",
        "Guardaba el tesoro público de Roma. Las ocho columnas de granito que quedan en pie no son del templo original, sino de una reconstrucción del siglo cuatro, hecha con piezas reaprovechadas de edificios anteriores.",
      ),
      foro(
        543,
        290,
        "Columna de Focas",
        "Es una columna alta y suelta, levantada en el año 608 en honor del emperador bizantino Focas. Fue el último monumento que se añadió al Foro.",
      ),
      foro(
        455,
        200,
        "Templo de Antonino y Faustina",
        "Se levantó en el año 141 para la emperatriz Faustina y, después de su muerte, se dedicó también a su marido, el emperador Antonino Pío. Se conserva tan bien porque siglos después se convirtió en la iglesia de San Lorenzo in Miranda, cuya fachada barroca se ve encima.",
      ),
      foro(
        950,
        170,
        "El Palatino",
        "Al fondo, entre los árboles, está el Monte Palatino, la colina donde según la leyenda nació Roma y donde los emperadores tuvieron sus palacios. Es la siguiente parada de vuestro paseo.",
      ),
    ],
  },

  "circo-massimo": {
    photo: photo("circo-massimo", 1280, 853, "El Circo Máximo visto desde el Palatino, con una torre medieval de ladrillo y la pista de hierba", "Rabax63", "CC BY-SA 4.0"),
    points: [
      circo(
        930,
        600,
        "Una pista enorme",
        "Este óvalo de hierba era la pista. Medía unos seiscientos metros de largo, y según las estimaciones actuales cabían más de ciento cincuenta mil espectadores. Fue el mayor estadio de la Roma antigua, y las carreras de cuadrigas eran el espectáculo más popular.",
      ),
      circo(
        720,
        690,
        "Los obeliscos",
        "Por el centro de la pista corría un muro largo con estatuas y obeliscos. Uno lo trajo Augusto de Egipto y hoy está en la Piazza del Popolo. Otro lo trajo mucho después el emperador Constancio segundo, y ahora está en San Juan de Letrán.",
      ),
      circo(
        430,
        470,
        "La torre medieval",
        "La torre de ladrillo es medieval, de una época en que el circo ya estaba en ruinas y se aprovechaba su piedra. No tiene nada que ver con el circo original.",
      ),
      circo(
        1200,
        660,
        "El lado del palacio",
        "Por este lado se extiende el Palatino. El palacio de los emperadores daba directamente al circo, y desde allí veían las carreras sin salir de casa.",
      ),
    ],
  },

  "arco-constantino": {
    photo: photo("arco-constantino", 1280, 1080, "El Arco de Constantino, con sus tres vanos y sus relieves, junto al Coliseo", "NikonZ7II (Paris Orlando)", "CC BY-SA 4.0"),
    points: [
      arco(
        665,
        355,
        "Una inscripción con truco",
        "Dice que Constantino venció al tirano Majencio por inspiración de la divinidad. La frase es deliberadamente ambigua: no dice qué dios, y así podía gustar tanto a paganos como a cristianos. El arco se levantó en el año 315, tres años después de la batalla del Puente Milvio.",
      ),
      arco(
        470,
        320,
        "Prisioneros dacios",
        "Las grandes estatuas de la parte alta representan a prisioneros dacios y proceden de un monumento de Trajano. Es una de las pruebas de que el arco reutilizó piezas de otros edificios.",
      ),
      arco(
        390,
        610,
        "Medallones de Adriano",
        "Los medallones redondos, con escenas de caza y sacrificios, son de la época del emperador Adriano, casi dos siglos anteriores al arco. Se reaprovecharon aquí.",
      ),
      arco(
        270,
        690,
        "El friso de Constantino",
        "La banda estrecha de relieves, más tosca, sí se hizo para este arco. Cuenta la campaña contra Majencio, con el asedio de Verona y la batalla del Puente Milvio. Su estilo es más rígido que el de los relieves reutilizados.",
      ),
      arco(
        1230,
        700,
        "Junto al Coliseo",
        "Es el mayor arco de triunfo que se conserva en Roma, con unos veintiún metros de altura, y está pegado al Coliseo. Como muchos de sus relieves y estatuas son de Trajano, Adriano y Marco Aurelio, parece un museo al aire libre.",
      ),
    ],
  },

  "monte-palatino": {
    photo: photo("monte-palatino", 1280, 853, "Las ruinas de los palacios imperiales del Palatino vistas desde el Circo Máximo", "Lil Herodotus", "CC BY-SA 4.0"),
    points: [
      palatino(
        555,
        365,
        "La palabra palacio",
        "De esta colina viene nuestra palabra palacio. Los emperadores levantaron aquí sus residencias, y el nombre de la colina, Palatium, acabó significando residencia imperial. Vivieron aquí Tiberio, Calígula, Nerón y Domiciano, y según la tradición nació Augusto.",
      ),
      palatino(
        330,
        420,
        "El palacio de Domiciano",
        "Domiciano terminó hacia el año 92 un enorme palacio, con la Domus Flavia para las ceremonias y la Domus Augustana para la vida privada. Ojo, Augustana quiere decir imperial, no de Augusto. Es el conjunto más grande que se conserva en la colina.",
      ),
      palatino(
        1000,
        440,
        "La Domus Severiana",
        "Los arcos de ladrillo que dan al Circo Máximo son parte de la ampliación de Septimio Severo hacia el circo, la Domus Severiana. No es el palacio mejor conservado, como se dice a veces: de ella quedan sobre todo enormes muros y arcos.",
      ),
      palatino(
        150,
        455,
        "La loba y el Lupercal",
        "Según la tradición, Rómulo fundó Roma aquí en el año 753 antes de Cristo, después de ver doce buitres. Y en una cueva al pie de la colina, el Lupercal, una loba amamantó a los gemelos Rómulo y Remo. En 2007 se anunció el hallazgo de una gruta que podría ser esa cueva, pero es una identificación muy discutida.",
      ),
      palatino(
        450,
        770,
        "El Circo Máximo",
        "A los pies de la colina queda el Circo Máximo, con la pista de las carreras de cuadrigas. Los emperadores tenían el estadio a un paso de su casa.",
      ),
    ],
  },

  cosmedin: {
    photo: photo("cosmedin", 1280, 1631, "La iglesia de Santa María in Cosmedin con su alto campanario románico de ladrillo", "globustut.by", "CC BY-SA 4.0"),
    points: [
      cosmedin(
        300,
        1240,
        "La iglesia",
        "La iglesia de Santa María in Cosmedin nació en el siglo seis y se reformó varias veces durante la Edad Media. Según una explicación habitual, el nombre viene de una palabra griega que significa adorno, porque en este barrio vivió una comunidad de griegos.",
      ),
      cosmedin(
        555,
        1290,
        "La Bocca della Verità",
        "En el pórtico está la Bocca della Verità, un gran disco de mármol de la Roma antigua con forma de rostro. Probablemente era una tapa de alcantarilla y representa al dios Océano. La leyenda dice que si un mentiroso mete la mano en su boca, esta se cierra y se la corta. La película Vacaciones en Roma, de 1953, la hizo famosa.",
      ),
      cosmedin(
        885,
        420,
        "El campanario",
        "El campanario es románico, del siglo doce, y es uno de los más elegantes de la ciudad. Por su altura se ve desde lejos.",
      ),
      cosmedin(
        640,
        1510,
        "Dos templos cercanos",
        "A pocos pasos hay dos de los templos mejor conservados de Roma. El redondo es el Templo de Hércules Víctor, del siglo dos antes de Cristo, el edificio de mármol más antiguo que se conserva en la ciudad. El rectangular es el Templo de Portuno, que se salvó porque siglos después se convirtió en iglesia.",
      ),
    ],
  },

  "cavalieri-malta": {
    photo: photo("cavalieri-malta", 1280, 781, "El muro decorado con obeliscos y trofeos de la Piazza dei Cavalieri di Malta, en el Aventino", "Stefano Costantini", "CC BY-SA 2.0"),
    points: [
      cavalieri(
        340,
        250,
        "El muro de Piranesi",
        "La plaza la diseñó Piranesi en el siglo dieciocho. Es más famoso por sus grabados, y esta fue su única obra de arquitectura. Fijaos en el muro, decorado con obeliscos, estelas y trofeos militares con símbolos de la Orden de Malta.",
      ),
      cavalieri(
        1030,
        420,
        "Un rincón tranquilo",
        "Al fondo asoma, en ladrillo rojo, el conjunto de San Anselmo con su campanario. El Aventino es una colina de calles silenciosas y jardines, muy distinta del bullicio del centro.",
      ),
      cavalieri(
        60,
        540,
        "La cerradura",
        "En la puerta verde del priorato de la Orden de Malta, que queda a un lado de esta foto, hay una cerradura famosa. Si os asomáis, veréis al fondo del jardín la cúpula de San Pedro perfectamente enmarcada por un pasillo de setos. A veces hay que esperar turno para mirar.",
      ),
    ],
  },

  "jardin-naranjos": {
    photo: photo("jardin-naranjos", 1280, 960, "Pinos del Jardín de los Naranjos al atardecer, con la cúpula de San Pedro al fondo", "Bex-Lemon", "CC BY-SA 4.0"),
    points: [
      jardin(
        300,
        330,
        "Pinos y naranjos",
        "El nombre viene de los naranjos que lo llenan, aunque a primera vista destacan los pinos piñoneros, tan típicos de Roma. El parque se abrió en 1932 en el lugar de una fortaleza medieval de la familia Savelli, y por eso se conoce también como Parque Savello.",
      ),
      jardin(
        780,
        655,
        "La cúpula de San Pedro",
        "Al fondo, entre los pinos, asoma la cúpula de San Pedro. Desde aquí se ve alineada al final del paseo, y es una de las postales clásicas de Roma.",
      ),
      jardin(
        620,
        770,
        "La terraza",
        "La terraza mirador se abre sobre el Tíber y sobre todo el centro de la ciudad. Es uno de los mejores sitios para ver el atardecer. En noviembre el sol se pone pronto, así que conviene llegar con tiempo.",
      ),
    ],
  },

  "ponte-sisto": {
    photo: photo("ponte-sisto", 1280, 1086, "El Ponte Sisto sobre el Tíber, con sus arcos de piedra y el óculo sobre una de las pilas", "Livioandronico2013", "CC BY-SA 4.0"),
    points: [
      sisto(
        330,
        550,
        "El ojo del puente",
        "El círculo que se abre sobre una de las pilas es un óculo. Se cree que servía de válvula de alivio: cuando el Tíber crecía dejaba pasar el agua y aliviaba la presión sobre el puente.",
      ),
      sisto(
        800,
        760,
        "Sixto cuarto",
        "El papa Sixto cuarto lo mandó construir entre 1473 y 1479, aprovechando los cimientos de un puente romano anterior. Se hizo en parte para dar paso a los peregrinos del Jubileo de 1475.",
      ),
      sisto(
        1000,
        470,
        "Solo para peatones",
        "Hoy solo lo cruzan peatones. Une el centro histórico con Trastevere, y al otro lado está la Piazza Trilussa, con una gran fuente, muy animada a la hora del aperitivo.",
      ),
      sisto(
        1000,
        900,
        "El Tíber",
        "El Tíber se desbordaba con frecuencia hasta que, a finales del siglo diecinueve, se levantaron los muros que lo encauzan y las calles que lo bordean, los Lungotevere.",
      ),
    ],
  },

  "santa-cecilia": {
    photo: photo("santa-cecilia", 1280, 886, "La fachada de la basílica de Santa Cecilia en Trastevere, con su patio ajardinado y el campanario", "Rita batacchi", "CC BY-SA 4.0"),
    points: [
      cecilia(
        900,
        190,
        "El campanario",
        "La torre de ladrillo es un campanario románico del siglo doce.",
      ),
      cecilia(
        640,
        400,
        "La fachada",
        "La fachada actual es del siglo dieciocho. Detrás hay una basílica mucho más antigua, levantada sobre lo que según la tradición fue la casa de santa Cecilia, una joven mártir del siglo tres.",
      ),
      cecilia(
        640,
        690,
        "El atrio",
        "El jardín del atrio, con una gran copa de mármol que hace de fuente, es un remanso de silencio en pleno Trastevere.",
      ),
      cecilia(
        830,
        650,
        "Dentro",
        "Dentro está la escultura de santa Cecilia que hizo Stefano Maderno en 1600, con la postura en que apareció su cuerpo cuando se abrió su tumba. Además, con entrada aparte y horario limitado, se puede ver el Juicio Final de Pietro Cavallini, de finales del siglo trece, uno de los frescos medievales más importantes de Roma.",
      ),
    ],
  },

  "porta-portese": {
    photo: photo("porta-portese", 1280, 960, "La Porta Portese, una puerta monumental en la muralla de Trastevere", "Gustavo La Pizza", "CC BY-SA 4.0"),
    points: [
      portese(
        650,
        420,
        "El escudo del papa",
        "El escudo es del papa Urbano octavo, de la familia Barberini, que mandó levantar la puerta en 1644, cuando reforzó las defensas de Trastevere y del Gianicolo.",
      ),
      portese(
        330,
        330,
        "Por qué se llama Portese",
        "El nombre viene de la Via Portuense, el camino que llevaba a Portus, el gran puerto de Roma en la desembocadura del Tíber.",
      ),
      portese(
        150,
        600,
        "La muralla",
        "Los muros de ladrillo a los dos lados de la puerta forman parte de las defensas que rodeaban Trastevere.",
      ),
      portese(
        650,
        760,
        "El mercadillo",
        "Los domingos por la mañana la puerta y las calles de alrededor se llenan de puestos: ropa, antigüedades, bicicletas, de todo. Es uno de los mercadillos más grandes de Roma. Cualquier otro día solo veréis la puerta y un barrio tranquilo.",
      ),
    ],
  },

  "san-pietro-montorio": {
    photo: photo("san-pietro-montorio", 1280, 1624, "La fachada de travertino de San Pietro in Montorio, con su rosetón", "PubblicUsername", "CC BY 4.0"),
    points: [
      montorio(
        620,
        300,
        "Una iglesia muy española",
        "Mirad el escudo del frontón: esta iglesia se reconstruyó a finales del siglo quince con el apoyo económico de los Reyes Católicos y sigue muy ligada a España. Al lado está la Academia de España en Roma.",
      ),
      montorio(
        625,
        525,
        "Fachada renacentista",
        "La fachada de travertino, sencilla y con un gran rosetón circular, es típica del primer Renacimiento romano.",
      ),
      montorio(
        620,
        1020,
        "Dentro",
        "En el interior hay obras importantes, como una Flagelación de Sebastiano del Piombo, pintada a partir de dibujos de Miguel Ángel.",
      ),
      montorio(
        1100,
        1050,
        "El Tempietto",
        "En el patio de al lado está el Tempietto de Bramante, de 1502, un pequeño templo circular considerado una obra maestra del Renacimiento. Lo encargaron los Reyes Católicos y marca el lugar donde, según una antigua tradición, fue crucificado san Pedro. La mayoría de los historiadores sitúa esa crucifixión en el Vaticano.",
      ),
    ],
  },

  "acqua-paola": {
    photo: photo("acqua-paola", 1280, 1226, "El Fontanone dell'Acqua Paola, una fuente monumental de mármol con tres arcos y una gran inscripción", "Labicanense", "CC BY 4.0"),
    points: [
      paola(
        620,
        530,
        "La inscripción",
        "La inscripción en latín cuenta que el papa Pablo quinto trajo hasta aquí el agua de los manantiales de la zona del lago de Bracciano, a unos cincuenta kilómetros, restaurando antiguos conductos romanos y añadiendo otros nuevos. Debajo se lee el año 1612.",
      ),
      paola(
        620,
        290,
        "El águila y el dragón",
        "Las águilas y los dragones que adornan la fuente son los emblemas de la familia Borghese, la del papa Pablo quinto. Los ángeles de arriba sostienen su escudo.",
      ),
      paola(
        520,
        790,
        "Mármol reaprovechado",
        "Una parte del mármol procede de monumentos romanos, en concreto de los Foros Imperiales. Reaprovechar piedra antigua era muy habitual en la Roma de entonces.",
      ),
      paola(
        615,
        990,
        "Cinco chorros",
        "El agua cae por cinco chorros a una gran pila. Aquí empieza la película La gran belleza de Paolo Sorrentino, así que si la habéis visto, os sonará.",
      ),
    ],
  },

  gianicolo: {
    photo: photo("gianicolo", 1280, 844, "El monumento ecuestre a Garibaldi en la terraza del Gianicolo, rodeado de pinos", "Krzysztof Golik", "CC BY-SA 4.0"),
    points: [
      gianicolo(
        480,
        210,
        "Garibaldi",
        "El monumento ecuestre a Garibaldi es de bronce y se inauguró en 1895. Recuerda al héroe de la unificación italiana, que defendió Roma desde esta colina en 1849, en tiempos de la República Romana.",
      ),
      gianicolo(
        1000,
        560,
        "El paseo de los bustos",
        "A lo largo del paseo de la colina hay decenas de bustos de mármol de los garibaldinos, los voluntarios que lucharon con él por la unidad de Italia.",
      ),
      gianicolo(
        240,
        500,
        "No es una de las siete colinas",
        "Aunque es una de las colinas más conocidas de Roma, el Gianicolo no es una de las siete colinas clásicas, porque está en la otra orilla del Tíber. Por eso es un mirador tan bueno: desde aquí se ve Roma de frente.",
      ),
      gianicolo(
        750,
        730,
        "El cañonazo de mediodía",
        "Cada día a las doce se dispara un cañonazo desde esta colina. Es una tradición antigua, que nació para que los relojes y las campanas de Roma marcasen la misma hora. Se oye en toda la ciudad.",
      ),
    ],
  },

  "san-pietro-in-vincoli": {
    photo: photo("san-pietro-in-vincoli", 1280, 908, "El pórtico renacentista de San Pietro in Vincoli, en su plaza", "Rione I Monti", "CC BY 4.0"),
    points: [
      vincoli(
        560,
        330,
        "El pórtico",
        "Delante de la basílica hay un pórtico renacentista de finales del siglo quince. La basílica es mucho más antigua: se construyó en el siglo cinco para guardar las cadenas de san Pedro, y de ahí su nombre.",
      ),
      vincoli(
        400,
        470,
        "Las cadenas",
        "En un relicario del interior se guardan las cadenas con las que, según la tradición, san Pedro estuvo preso. La tradición cuenta que la cadena de Jerusalén y la de Roma se unieron por sí solas al acercarlas.",
      ),
      vincoli(
        740,
        470,
        "El Moisés",
        "El Moisés de Miguel Ángel, esculpido hacia 1513 para la tumba del papa Julio segundo, es la gran razón para entrar. Fijaos en los cuernos de la cabeza: vienen de un error de traducción de la Biblia, que confundió los rayos de luz con cuernos.",
      ),
    ],
  },

  monti: {
    photo: photo("monti", 1280, 960, "La plaza de la Madonna dei Monti, con su fuente, la iglesia y una terraza", "Lalupa", "CC BY-SA 4.0"),
    points: [
      monti(
        510,
        760,
        "La fuente de los Catecúmenos",
        "La fuente de la plaza es de finales del siglo dieciséis, obra de Giacomo della Porta. También se la conoce como la Fuente de los Catecúmenos.",
      ),
      monti(
        660,
        320,
        "La Madonna dei Monti",
        "La iglesia que da nombre a la plaza es Santa María dei Monti, del siglo dieciséis. Es el corazón de este pequeño barrio.",
      ),
      monti(
        150,
        700,
        "Un rincón de pueblo",
        "Hoy Monti es un barrio de calles empinadas, tiendas de artesanía, tabernas y trattorias, con aire de pueblo y a un paso del Coliseo. Esta plaza es el mejor sitio para parar a tomar algo.",
      ),
      monti(
        1050,
        700,
        "La Subura",
        "En la Antigüedad esta zona fue la Subura, el arrabal popular y bullicioso de Roma. Se dice que el joven Julio César vivió aquí, en una casa modesta, antes de hacerse famoso. Monti es el rione número uno de la ciudad.",
      ),
    ],
  },

  "mercados-trajano": {
    photo: photo("mercados-trajano", 1280, 818, "Los Mercados de Trajano, con su fachada curva de ladrillo y la Torre de las Milicias al fondo", "NikonZ7II", "CC BY-SA 4.0"),
    points: [
      mercados(
        595,
        150,
        "La Torre de las Milicias",
        "La torre de ladrillo que domina el conjunto es medieval, del siglo trece. Una leyenda dice que Nerón vio desde ella el incendio de Roma, pero es imposible: la torre se levantó mil años después.",
      ),
      mercados(
        700,
        500,
        "El edificio en curva",
        "El conjunto de tiendas y oficinas escalonadas en la ladera se atribuye a Apolodoro de Damasco y se hizo hacia el año 110. Por eso se le llama el primer centro comercial de la historia.",
      ),
      mercados(
        600,
        700,
        "El Foro de Trajano",
        "A vuestros pies están los restos del Foro de Trajano, el más grande de los foros imperiales. Muy cerca se alza la Columna de Trajano, con sus relieves en espiral sobre las guerras en Dacia. Hoy los mercados albergan el Museo de los Foros Imperiales.",
      ),
    ],
  },

  "museos-capitolinos": {
    photo: photo("museos-capitolinos", 1280, 842, "La Cordonata, la escalinata que sube a la plaza del Campidoglio, con los Dioscuros y el Palacio Senatorio", "Jean-Pol GRANDMONT", "CC BY-SA 3.0"),
    points: [
      capitolinos(
        620,
        650,
        "La Cordonata",
        "La rampa escalonada de acceso a la plaza es obra de Miguel Ángel, de peldaños muy bajos y anchos para poder subir cómodamente. En la base hay dos leones de piedra que hacen de fuente.",
      ),
      capitolinos(
        470,
        380,
        "Los Dioscuros",
        "Las estatuas de Cástor y Pólux con sus caballos, en lo alto de la escalinata, son esculturas romanas colocadas aquí en el siglo dieciséis.",
      ),
      capitolinos(
        650,
        230,
        "El Palacio Senatorio",
        "Al fondo, con su torre, está el Palazzo Senatorio, que hoy es la sede del Ayuntamiento de Roma. Se levantó sobre el antiguo Tabularium, el archivo del Estado romano, desde el que se ve todo el Foro.",
      ),
      capitolinos(
        1090,
        240,
        "El Palacio de los Conservadores",
        "El palacio de la derecha guarda la Loba Capitolina, símbolo de Roma, y el original de la estatua ecuestre de Marco Aurelio, cuya copia preside el centro de la plaza. En 1471 el papa Sixto cuarto donó al pueblo de Roma un grupo de esculturas de bronce, y de ahí se dice que este es el museo público más antiguo del mundo.",
      ),
      capitolinos(
        160,
        260,
        "El Palazzo Nuovo",
        "El palacio de la izquierda, el Palazzo Nuovo, guarda esculturas antiguas famosas, como el Galata moribundo y la Venus Capitolina.",
      ),
    ],
  },

  "barrio-judio": {
    photo: photo("barrio-judio", 1280, 911, "El Pórtico de Octavia, restos de época romana con columnas corintias y un gran arco de ladrillo", "Jensens", "dominio público"),
    points: [
      judio(
        780,
        220,
        "El Pórtico de Octavia",
        "La inscripción recuerda que Septimio Severo y Caracalla lo restauraron hacia el año 203. El pórtico original lo levantó Augusto y lo dedicó a su hermana Octavia.",
      ),
      judio(
        390,
        600,
        "Las columnas",
        "Las columnas corintias y el frontón son restos de un gran pórtico rectangular que rodeaba dos templos. Formaba una especie de plaza cubierta en el corazón de la Roma antigua.",
      ),
      judio(
        720,
        500,
        "La Pescheria",
        "En la Edad Media el pórtico se usó como mercado de pescado, y la zona se conoció como Pescheria. También se construyó dentro una iglesia, Sant'Angelo in Pescheria, que aprovechó sus muros y ayudó a que se conservara.",
      ),
      judio(
        1200,
        440,
        "El gueto",
        "La comunidad judía vive en Roma desde hace más de dos mil años, una de las más antiguas de Europa. En 1555 el papa Pablo cuarto creó el gueto, un barrio cerrado cuyas puertas se cerraban de noche, y duró hasta 1870.",
      ),
      judio(
        140,
        570,
        "Alcachofas a la judía",
        "Este barrio es el lugar para probar las alcachofas a la judía, el plato típico de la cocina romano-judía: alcachofas fritas hasta quedar crujientes como una flor.",
      ),
    ],
  },

  "campo-de-fiori": {
    photo: photo("campo-de-fiori", 1280, 897, "El mercado de Campo de' Fiori con la estatua de Giordano Bruno en el centro de la plaza", "Myrabella", "CC BY-SA 3.0"),
    points: [
      campo(
        622,
        430,
        "Giordano Bruno",
        "La estatua encapuchada es de Giordano Bruno, el filósofo que fue quemado vivo en esta plaza por orden de la Inquisición en el año 1600. El monumento se inauguró en 1889.",
      ),
      campo(
        650,
        650,
        "El mercado",
        "Por la mañana la plaza se llena de puestos de fruta, verdura, flores y especias. Al caer la tarde dan paso a terrazas y bares, y de noche es una de las zonas con más ambiente.",
      ),
      campo(
        735,
        510,
        "El Palazzo Farnese",
        "El cartel de Farnese que se ve es de un cine, pero a un paso de aquí está el Palazzo Farnese, uno de los palacios renacentistas más importantes de Roma y hoy embajada de Francia.",
      ),
      campo(
        1050,
        300,
        "Un campo de flores",
        "El nombre significa campo de flores y se cree que viene de un prado que había aquí en la Edad Media. Durante siglos fue también lugar de ejecuciones públicas.",
      ),
    ],
  },

  "largo-argentina": {
    photo: photo("largo-argentina", 1280, 960, "Las ruinas de los templos republicanos de Largo di Torre Argentina, en un hueco bajo el nivel de la calle", "Sotamies", "CC BY-SA 4.0"),
    points: [
      largo(
        200,
        650,
        "Templos republicanos",
        "En este hueco, más bajo que la calle, hay cuatro templos de la época de la República, de entre los siglos cuatro y dos antes de Cristo. El redondo es el llamado templo B, dedicado a Fortuna Huiusce Diei, la Fortuna de este mismo día.",
      ),
      largo(
        330,
        540,
        "La Curia de Pompeyo",
        "Pegada a los templos estaba la Curia de Pompeyo, donde fue asesinado Julio César, en los idus de marzo del año 44 antes de Cristo. Sus restos están en esta misma zona, en parte bajo los edificios de al lado.",
      ),
      largo(
        500,
        300,
        "¿Argentina?",
        "El nombre no tiene nada que ver con el país. Viene de una torre cercana, la Torre Argentina, llamada así por Argentoratum, el nombre latino de Estrasburgo, la ciudad de donde era Johannes Burckardt, el maestro de ceremonias del papa que la mandó construir.",
      ),
      largo(
        1000,
        720,
        "Los gatos",
        "Las ruinas se descubrieron en los años veinte del siglo pasado, al derribar casas para abrir calles. Hoy son también un refugio de gatos callejeros, cuidados por voluntarios.",
      ),
    ],
  },

  "piazza-navona": {
    photo: photo("piazza-navona", 1280, 906, "La Piazza Navona de noche, con el obelisco, la Fuente de los Cuatro Ríos y la iglesia de Santa Inés", "NikonZ7II", "CC BY-SA 4.0"),
    points: [
      navona(
        597,
        400,
        "El obelisco",
        "El obelisco que corona la fuente es del siglo primero, de la época del emperador Domiciano. Lo trasladó aquí el papa Inocencio décimo, y arriba lo remata una paloma, el emblema de su familia, los Pamphilj.",
      ),
      navona(
        610,
        660,
        "Los Cuatro Ríos",
        "La Fuente de los Cuatro Ríos, de Bernini, se terminó en 1651. Los cuatro gigantes representan los grandes ríos de cuatro continentes: el Danubio, el Ganges, el Nilo y el Río de la Plata. Al Nilo se le tapa la cabeza con un paño, porque en aquella época no se conocía su nacimiento.",
      ),
      navona(
        1040,
        300,
        "Santa Inés en Agonía",
        "Frente a la fuente se alza la iglesia barroca de Santa Inés en Agonía, con la fachada curva de Borromini. Cuentan que el Río de la Plata levanta la mano por miedo a que la iglesia se caiga, pero es una leyenda, porque la fachada se hizo después que la fuente.",
      ),
      navona(
        200,
        560,
        "La forma de un estadio",
        "La plaza conserva la forma alargada del estadio de Domiciano, inaugurado hacia el año 86, donde se celebraban competiciones de atletismo. Los edificios se levantaron sobre las gradas. El nombre Navona viene de «in agone», que significa en competición.",
      ),
    ],
  },

  "plaza-san-pedro": {
    photo: photo("plaza-san-pedro", 1280, 719, "Vista aérea de la Plaza de San Pedro con sus columnatas, el obelisco y la Via della Conciliazione", "Diliff", "CC BY-SA 3.0"),
    points: [
      sanPedro(
        648,
        470,
        "El obelisco",
        "El obelisco es egipcio y llegó a Roma en tiempos del emperador Calígula. El papa Sixto quinto lo hizo colocar en el centro de la plaza en 1586, en una operación de ingeniería famosa por su dificultad.",
      ),
      sanPedro(
        330,
        430,
        "La columnata",
        "Bernini diseñó la plaza entre 1656 y 1667. Sus dos columnatas forman como unos brazos que reciben a quien llega. Hay más de doscientas ochenta columnas y, encima, ciento cuarenta estatuas de santos.",
      ),
      sanPedro(
        878,
        515,
        "El truco de los discos",
        "A cada lado del obelisco hay una fuente, y entre el obelisco y cada fuente, un disco de piedra en el suelo. Si os ponéis encima de uno, las cuatro filas de columnas parecen una sola.",
      ),
      sanPedro(
        700,
        625,
        "La fachada",
        "Al fondo está la basílica, consagrada en 1626. Sobre la fachada hay estatuas de Cristo y de los apóstoles. Su cúpula parte de un proyecto de Miguel Ángel.",
      ),
      sanPedro(
        640,
        290,
        "La Via della Conciliazione",
        "La gran avenida que llega a la plaza se abrió entre 1936 y 1950, derribando parte de un barrio medieval. Antes, quien llegaba a San Pedro salía de calles estrechas y se encontraba la plaza de golpe.",
      ),
    ],
  },

  "museos-vaticanos": {
    photo: photo("museos-vaticanos", 1280, 960, "El Cortile della Pigna de los Museos Vaticanos, con la esfera dorada y la gran piña de bronce ante un nicho enorme", "Lalupa", "CC BY-SA 3.0"),
    points: [
      vaticanos(
        618,
        590,
        "La Piña",
        "La gran piña de bronce es romana, de los siglos primero o segundo, y estuvo en una fuente antes de acabar en San Pedro. Da nombre a este patio, el Cortile della Pigna. Hasta Dante la cita en la Divina Comedia.",
      ),
      vaticanos(
        620,
        730,
        "Esfera con esfera",
        "La gran bola dorada es una escultura moderna de Arnaldo Pomodoro, de 1990, llamada Esfera con esfera. Su superficie abierta deja ver un mecanismo interior, como una máquina rota.",
      ),
      vaticanos(
        610,
        400,
        "El gran nicho",
        "El enorme nicho del fondo es obra de Pirro Ligorio. Todo el conjunto nació con el proyecto de Bramante para Julio segundo, en 1506, el mismo año en que se expuso el Laocoonte, la estatua que dio origen a los museos.",
      ),
      vaticanos(
        300,
        860,
        "Antes de entrar",
        "El recorrido termina en la Capilla Sixtina, cuya bóveda pintó Miguel Ángel entre 1508 y 1512. Conviene reservar la entrada con antelación, llevar los hombros y las rodillas cubiertos y tener en cuenta que dentro de la capilla no se pueden hacer fotos.",
      ),
    ],
  },
};
