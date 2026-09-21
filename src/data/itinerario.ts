import { guides } from "./guias.ts";
import type { Day, Stop } from "./types";

/**
 * Aquí se edita el viaje: los días y las paradas de cada día.
 * Las coordenadas se sacan de Google Maps (clic derecho sobre el sitio, y se copian los dos números).
 * Todo lo que lleva "(ejemplo)" es de prueba.
 *
 * El alojamiento NO se guarda aquí: cada persona lo escribe una vez en la web y queda guardado en su móvil.
 */

const panteon: Stop = {
  id: "panteon",
  name: "Panteón",
  era: "Año 126 d. C.",
  lat: 41.8986,
  lng: 12.4769,
  audio: "1 min",
  teaser: "El templo de todos los dioses, con la cúpula de hormigón más grande del mundo.",
  text: [
    "Agripa levantó el primer templo en el 27 a. C., pero el edificio que veis hoy lo reconstruyó el emperador Adriano hacia el año 126.",
    "Su cúpula mide 43 metros de diámetro y sigue siendo la mayor de hormigón sin armar del mundo. Por el óculo central entra la luz, y también la lluvia.",
    "Desde el año 609 es una iglesia, y eso lo salvó del expolio.",
  ],
  viator: { url: "https://audioviator.com/audioguia/el-panteon-de-agripa/" },
  photo: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Fa%C3%A7ade_of_the_Pantheon%2C_Rome%2C_Italy.jpg/1280px-Fa%C3%A7ade_of_the_Pantheon%2C_Rome%2C_Italy.jpg",
    alt: "Fachada del Panteón de Roma con su pórtico de columnas de granito",
    ratio: "1280 / 878",
    credit: "Foto: Wikimedia Commons, dominio público (CC0)",
  },
  points: [
    {
      x: 50,
      y: 43,
      title: "La inscripción de Agripa",
      text: "Dice: «Marco Agripa, hijo de Lucio, cónsul por tercera vez, lo hizo». Aunque este edificio lo levantó Adriano, se conservó el nombre de Agripa, que fundó el primer templo.",
    },
    {
      x: 57,
      y: 62,
      title: "Columnas de granito",
      text: "Son dieciséis columnas de granito, de unos doce metros de altura y de una sola pieza. Salieron de canteras de Egipto y llegaron a Roma por el Nilo y por el mar.",
    },
    {
      x: 50,
      y: 22,
      title: "Los agujeros del frontón",
      text: "Los pequeños agujeros del frontón sujetaban adornos de bronce que se perdieron con el tiempo. Ese metal se reutilizó en otras obras de la ciudad.",
    },
    {
      x: 50,
      y: 80,
      title: "Al cruzar la puerta",
      text: "Dentro os espera la cúpula de 43 metros de diámetro, con el óculo abierto en lo alto. Fijaos en cómo cambia la luz según la hora: se mueve por las paredes como un reloj de sol.",
    },
  ],
};

const trevi: Stop = {
  id: "trevi",
  name: "Fontana di Trevi",
  era: "Año 1762",
  lat: 41.9009,
  lng: 12.4833,
  audio: "1 min",
  teaser: "La fuente más famosa de Roma marca el final de un acueducto de hace 2.000 años.",
  text: [
    "Nicola Salvi diseñó esta fuente barroca, que se inauguró en 1762 tras décadas de obras.",
    "El agua llega por el acueducto Aqua Virgo, que Agripa mandó construir en el 19 a. C. Todavía hoy la abastece.",
    "La tradición pide lanzar una moneda de espaldas, con la mano derecha por encima del hombro izquierdo, para volver a Roma.",
  ],
  viator: { url: "https://audioviator.com/audioguia/la-fontana-di-trevi/" },
};

const vittoriano: Stop = {
  id: "vittoriano",
  name: "Monumento a Víctor Manuel II",
  era: "Año 1911",
  lat: 41.8947,
  lng: 12.4831,
  audio: "1 min",
  teaser: "El Vittoriano, o Altare della Patria, domina Piazza Venezia con su mármol blanco.",
  text: [
    "El Vittoriano se inauguró en 1911 para honrar a Víctor Manuel II, primer rey de la Italia unida.",
    "Los romanos lo llaman la máquina de escribir o la tarta de bodas. Desde su terraza superior hay una de las mejores vistas de los Foros.",
  ],
};

const foroRomano: Stop = {
  id: "foro-romano",
  name: "Foro Romano",
  era: "Siglo VII a. C. al siglo IV d. C.",
  lat: 41.89246,
  lng: 12.48532,
  audio: "2 min",
  teaser: "El centro político, religioso y comercial de la Roma antigua, con sus templos, arcos y basílicas.",
  text: [
    "Durante siglos fue el corazón de Roma. Era un valle pantanoso entre colinas hasta que en el siglo siete antes de Cristo se drenó con la Cloaca Máxima y se convirtió en el centro político, religioso, comercial y judicial de la ciudad. Aquí se hacía la vida diaria de los romanos y aquí estaban los principales edificios del gobierno.",
    "Entre ellos está la Curia que era la sede del Senado; la que vemos hoy es la que reconstruyó Diocleciano hacia el año 300 aunque el tejado y parte de los muros son de una restauración de los años treinta del siglo veinte. También están los Rostra que eran las tribunas desde las que hablaban los oradores y el Templo de Saturno donde se guardaba el tesoro de Roma y del que se conservan ocho columnas del siglo cuatro.",
    "Otro edificio impresionante es la Basílica de Majencio con sus enormes bóvedas aún visibles. Hay además templos dedicados a divinidades y emperadores como Vesta, César, Venus y Roma, los Dioscuros Cástor y Pólux, Antonino y Faustina, Vespasiano y Tito, la Concordia y Rómulo el hijo de Majencio.",
    "Tras la caída de Roma el Foro se fue abandonando y en la Edad Media se le llamó Campo Vaccino porque allí pastaban las vacas. Quedó enterrado bajo la tierra y los escombros hasta que las excavaciones lo sacaron a la luz a partir del siglo diecinueve.",
  ],
  viator: {
    url: "https://audioviator.com/audioguia/foros-imperiales/",
    note: "Audioguía de los Foros Imperiales, para completar la zona.",
  },
  highlights: [
    { name: "Templo de Venus y Roma", note: "Fue el templo más grande de la Roma antigua y lo proyectó el emperador Adriano.", lat: 41.89083, lng: 12.48998 },
    { name: "Arco de Tito", note: "Del año 81. Conmemora la conquista de Jerusalén y uno de sus relieves muestra el candelabro de siete brazos.", lat: 41.8907, lng: 12.48865 },
    { name: "Vía Sacra", note: "La calle principal del Foro. Por ella desfilaban los generales que celebraban un triunfo.", lat: 41.89049, lng: 12.48939 },
    { name: "Basílica de Majencio y Constantino", note: "La empezó Majencio en el año 308 y la terminó Constantino. Se conservan las enormes bóvedas de una nave lateral.", lat: 41.89197, lng: 12.4882 },
    { name: "Templo de Antonino y Faustina", note: "Del año 141. En la Edad Media se convirtió en iglesia y por eso se conserva tan bien.", lat: 41.89225, lng: 12.48683 },
    { name: "Casa de las Vestales", note: "Aquí vivían las sacerdotisas de Vesta, encargadas de mantener el fuego sagrado de Roma.", lat: 41.89141, lng: 12.48664 },
    { name: "Templo de Vesta", note: "Pequeño templo redondo donde ardía el fuego sagrado de la ciudad.", lat: 41.89171, lng: 12.48621 },
    { name: "Templo de Julio César", note: "Lo levantó Augusto en el año 29 antes de Cristo en el lugar donde fue incinerado César.", lat: 41.89207, lng: 12.48602 },
    { name: "Templo de Cástor y Pólux", note: "Solo quedan tres columnas corintias, pero es una de las imágenes más famosas del Foro.", lat: 41.8917, lng: 12.48566 },
    { name: "Curia Julia", note: "La sede del Senado. En el interior se conserva un suelo de mármol de colores.", lat: 41.89297, lng: 12.48543 },
    { name: "Columna de Focas", note: "Se levantó en el año 608 y fue el último monumento que se añadió al Foro.", lat: 41.89246, lng: 12.48487 },
    { name: "Templo de Saturno", note: "Guardaba el tesoro de Roma. Se conservan ocho columnas de granito.", lat: 41.89254, lng: 12.48426 },
    { name: "Arco de Septimio Severo", note: "Del año 203. Celebra las victorias del emperador sobre los partos.", lat: 41.89288, lng: 12.48474 },
    { name: "Mirador de la Piazza del Campidoglio", note: "Desde la terraza que hay detrás del palacio del Senado se ve todo el Foro desde arriba.", lat: 41.89348, lng: 12.48307 },
  ],
};

const coliseo: Stop = {
  id: "coliseo",
  name: "Coliseo",
  era: "Año 80 d. C.",
  lat: 41.8902,
  lng: 12.4922,
  audio: "2 min",
  teaser: "El anfiteatro más grande del Imperio, con sitio para unas 50.000 personas.",
  text: [
    "Vespasiano empezó a construirlo hacia el año 70 y su hijo Tito lo inauguró en el 80 con cien días de juegos.",
    "Se llamaba Anfiteatro Flavio. El nombre de Coliseo viene, probablemente, de la colosal estatua de Nerón que se alzaba cerca.",
    "Bajo la arena había túneles, montacargas y jaulas para los animales: el hipogeo.",
  ],
  viator: {
    url: "https://audioviator.com/audioguia/el-coliseo-de-roma/",
    note: "Audioguía completa de unos 13 minutos.",
  },
  photo: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg",
    alt: "El Coliseo de Roma visto desde el exterior, con sus tres pisos de arcos",
    ratio: "1280 / 897",
    credit: "Foto: FeaturedPics, Wikimedia Commons, CC BY-SA 4.0",
  },
  points: [
    {
      x: 31,
      y: 56,
      title: "Tres pisos, tres órdenes",
      text: "Los arcos se apilan en tres pisos con tres estilos de columna: dórico abajo, jónico en medio y corintio arriba. Es como una lección de arquitectura clásica puesta en vertical.",
    },
    {
      x: 26,
      y: 22,
      title: "El muro exterior que sigue en pie",
      text: "Esta parte alta es lo que queda del muro exterior. El resto se vino abajo con los terremotos, sobre todo el de 1349, y siglos después su piedra sirvió para levantar palacios e iglesias.",
    },
    {
      x: 68,
      y: 47,
      title: "El muro interior a la vista",
      text: "Donde falta el muro exterior se ve la estructura de dentro, más baja, de ladrillo y hormigón. El hormigón romano es una de las razones por las que el edificio sigue en pie.",
    },
    {
      x: 52,
      y: 78,
      title: "Ochenta arcos, ochenta puertas",
      text: "En la planta baja había ochenta arcos. Setenta y seis, numerados, eran para el público, y cuatro para las autoridades. Cada número llevaba a tu zona de las gradas, y así se podía desalojar el edificio con rapidez.",
    },
  ],
};

const circoMassimo: Stop = {
  id: "circo-massimo",
  name: "Circo Massimo",
  era: "Siglo VI a. C. al siglo IV d. C.",
  lat: 41.8862,
  lng: 12.4853,
  audio: "1 min",
  teaser: "El mayor estadio de la Roma antigua, hecho para las carreras de cuadrigas.",
  text: [
    "Fue el mayor estadio de la Roma antigua, y las carreras de cuadrigas eran el espectáculo más popular. La pista medía unos 600 metros y, según las estimaciones actuales, cabían más de 150.000 espectadores.",
    "Hoy es un gran prado a los pies del Palatino, pero el óvalo de la pista se sigue reconociendo. Es un buen sitio para sentarse un rato.",
  ],
};

const arcoConstantino: Stop = {
  id: "arco-constantino",
  name: "Arco de Constantino",
  era: "Año 315",
  lat: 41.88976,
  lng: 12.49067,
  audio: "1 min",
  teaser: "El mayor arco de triunfo de Roma, junto al Coliseo.",
  text: [
    "Se levantó en el año 315 para celebrar la victoria del emperador Constantino sobre Majencio en la batalla del Puente Milvio tres años antes. Es el mayor arco de triunfo que se conserva en Roma y mide unos 21 metros de altura. Muchos de sus relieves y estatuas proceden de monumentos de Trajano, Adriano y Marco Aurelio y por eso parece un museo al aire libre.",
  ],
};

const montePalatino: Stop = {
  id: "monte-palatino",
  name: "Monte Palatino",
  era: "Desde el siglo VIII a. C.",
  lat: 41.8889,
  lng: 12.4862,
  audio: "2 min",
  teaser: "La colina donde según la leyenda nació Roma y donde los emperadores tuvieron sus palacios.",
  text: [
    "Es una de las siete colinas de Roma y según la leyenda el lugar donde Rómulo fundó la ciudad en el año 753 antes de Cristo. La tradición cuenta que fue aquí donde Rómulo vio doce buitres que le señalaron el sitio y que en una cueva al pie de la colina la loba amamantó a los gemelos Rómulo y Remo.",
    "Con el tiempo fue el barrio elegante de la República y después el lugar elegido por los emperadores para levantar sus palacios; de hecho de esta colina viene nuestra palabra palacio. Aquí vivieron Tiberio, Calígula, Nerón y Domiciano y según la tradición aquí nació Augusto.",
    "El conjunto más grande es el palacio de Domiciano terminado hacia el año 92 con la Domus Flavia para las ceremonias y la Domus Augustana para la vida privada. En la Domus Flavia quedan restos de suelos de mármol de colores y las mejores pinturas murales se ven en la Casa de Livia y en la Casa de Augusto. Más tarde Septimio Severo amplió el palacio hacia el Circo Máximo con la Domus Severiana de la que quedan sobre todo enormes muros y arcos de ladrillo.",
  ],
  highlights: [
    { name: "Terraza del Palatino", note: "Los jardines Farnesio, del siglo XVI, tienen vistas al Foro y a la ciudad." },
    { name: "Casa de Livia", note: "Conserva pinturas murales muy bien conservadas del siglo I antes de Cristo.", lat: 41.88931, lng: 12.48567 },
    { name: "Casa de Augusto", note: "Con pinturas murales del primer emperador. Suele visitarse solo en horarios concretos.", lat: 41.88902, lng: 12.48517 },
    { name: "Domus Flavia", note: "Las salas de ceremonias del palacio de Domiciano, con un gran patio y una fuente octogonal.", lat: 41.88872, lng: 12.48653 },
    { name: "Museo Palatino", note: "Guarda hallazgos de las excavaciones de la colina.", lat: 41.88844, lng: 12.4871 },
    { name: "Estadio de Domiciano", note: "Un estadio ajardinado que formaba parte del palacio, de más de 150 metros de largo.", lat: 41.88773, lng: 12.48766 },
  ],
};

const cosmedin: Stop = {
  id: "cosmedin",
  name: "Santa María in Cosmedin y el Foro Boario",
  era: "Siglos II a. C. al XII",
  lat: 41.8884,
  lng: 12.4812,
  audio: "1 min",
  teaser: "La Bocca della Verità y dos de los templos mejor conservados de Roma.",
  text: [
    "La iglesia de Santa María in Cosmedin nació en el siglo seis y su torre románica es del siglo doce. En el pórtico está la Bocca della Verità un gran disco de mármol de la Roma antigua con forma de rostro que probablemente era una tapa de alcantarilla y representa al dios Océano. La leyenda dice que si un mentiroso mete la mano en su boca esta se cierra y se la corta; la escena se hizo famosa con la película Vacaciones en Roma de 1953.",
    "A pocos pasos hay dos de los templos mejor conservados de la ciudad. El redondo es el Templo de Hércules Víctor del siglo dos antes de Cristo y es el edificio de mármol más antiguo que se conserva en Roma. El rectangular es el Templo de Portuno de finales de la República y se salvó porque siglos después se convirtió en iglesia.",
  ],
  highlights: [
    { name: "Bocca della Verità", note: "En el pórtico de la iglesia. Suele haber cola para la foto.", lat: 41.88801, lng: 12.48159 },
    { name: "Templo de Hércules Víctor", note: "El templo redondo, del siglo II antes de Cristo.", lat: 41.88874, lng: 12.48077 },
    { name: "Templo de Portuno", note: "El templo rectangular, de finales de la República.", lat: 41.88924, lng: 12.48091 },
  ],
};

const cavalieriMalta: Stop = {
  id: "cavalieri-malta",
  name: "Piazza dei Cavalieri di Malta",
  era: "Siglo XVIII",
  lat: 41.88285,
  lng: 12.47855,
  audio: "1 min",
  teaser: "Una plaza tranquila del Aventino con una cerradura que enmarca la cúpula de San Pedro.",
  text: [
    "Es una plaza tranquila del Aventino diseñada por Piranesi en el siglo dieciocho y en ella está la sede del Priorato de la Orden de Malta. Su secreto está en la puerta verde del priorato: por el ojo de la cerradura se ve al fondo del jardín la cúpula de San Pedro perfectamente enmarcada por un pasillo de setos. A veces hay que esperar turno para mirar.",
  ],
};

const jardinNaranjos: Stop = {
  id: "jardin-naranjos",
  name: "Jardín de los Naranjos",
  era: "Desde 1932",
  lat: 41.88493,
  lng: 12.48045,
  audio: "1 min",
  teaser: "Un jardín de naranjos con la mejor terraza del Aventino sobre Roma.",
  text: [
    "El Giardino degli Aranci o Parque Savello se abrió en 1932 en el lugar de una antigua fortaleza medieval de la familia Savelli. Está lleno de naranjos y desde su terraza mirador se ve Roma entera con la cúpula de San Pedro al fondo. Es uno de los mejores sitios de la ciudad para ver el atardecer.",
  ],
};

const pontesisto: Stop = {
  id: "ponte-sisto",
  name: "Ponte Sisto y Piazza Trilussa",
  era: "Años 1473 a 1479",
  lat: 41.892,
  lng: 12.4705,
  audio: "1 min",
  teaser: "El puente peatonal que lleva a Trastevere y la plaza más animada del barrio.",
  text: [
    "El Ponte Sisto lo mandó construir el papa Sixto cuarto entre 1473 y 1479 y hoy solo pueden cruzarlo los peatones. Une el centro histórico con Trastevere y al otro lado está la Piazza Trilussa que lleva el nombre de un poeta romano y tiene una gran fuente. Es uno de los sitios más animados de Trastevere a la hora del aperitivo.",
  ],
  highlights: [
    { name: "Piazza Trilussa", note: "Con el Fontanone di Ponte Sisto y muchísimo ambiente por la tarde.", lat: 41.89174, lng: 12.47017 },
  ],
};

const santaCecilia: Stop = {
  id: "santa-cecilia",
  name: "Basílica de Santa Cecilia",
  era: "Siglo III",
  lat: 41.88732,
  lng: 12.47583,
  audio: "1 min",
  teaser: "La casa de una santa romana, una escultura famosa y un fresco medieval.",
  text: [
    "La basílica se levantó sobre lo que según la tradición fue la casa de santa Cecilia una joven mártir del siglo tres. Dentro está la escultura de la santa que hizo Stefano Maderno en 1600 con la postura en que apareció su cuerpo cuando se abrió su tumba. Además se puede visitar con entrada aparte y en horario limitado el Juicio Final de Pietro Cavallini de finales del siglo trece uno de los frescos medievales más importantes de Roma.",
  ],
};

const portaPortese: Stop = {
  id: "porta-portese",
  name: "Porta Portese",
  era: "Año 1644",
  lat: 41.88378,
  lng: 12.47418,
  audio: "1 min",
  teaser: "La puerta de Trastevere famosa por su mercadillo de los domingos.",
  text: [
    "La puerta actual la levantó el papa Urbano octavo en 1644. Es famosa por el mercadillo de Porta Portese que se celebra los domingos por la mañana y donde se vende de todo desde ropa hasta antigüedades. Cualquier otro día solo veréis la puerta y un barrio tranquilo.",
  ],
};

const sanPietroMontorio: Stop = {
  id: "san-pietro-montorio",
  name: "San Pietro in Montorio",
  era: "Año 1502",
  lat: 41.88869,
  lng: 12.46638,
  audio: "1 min",
  teaser: "Una iglesia con el Tempietto de Bramante y una gran panorámica de Roma.",
  text: [
    "Según una antigua tradición esta colina es el lugar donde fue crucificado san Pedro. En el patio de la iglesia está el Tempietto de Bramante de 1502 un pequeño templo circular considerado una obra maestra del Renacimiento y encargado por los Reyes Católicos. Desde la terraza se ve una gran panorámica de Roma.",
  ],
  highlights: [
    { name: "Tempietto de Bramante", note: "En el patio de la iglesia. Es uno de los templos más perfectos del Renacimiento.", lat: 41.88865, lng: 12.46655 },
  ],
};

const acquaPaola: Stop = {
  id: "acqua-paola",
  name: "Fontana dell'Acqua Paola",
  era: "Año 1612",
  lat: 41.88881,
  lng: 12.46429,
  audio: "1 min",
  teaser: "El Fontanone, la gran fuente monumental del Gianicolo.",
  text: [
    "El Fontanone se terminó en 1612 por orden del papa Pablo quinto para celebrar la llegada del agua del antiguo acueducto de Trajano que él mandó restaurar. Cinco chorros caen en grandes pilas y una parte del mármol procede de los Foros Imperiales. Es el lugar donde empieza la película La gran belleza de Paolo Sorrentino.",
  ],
};

const gianicolo: Stop = {
  id: "gianicolo",
  name: "Gianicolo",
  era: "Miradores de 1895 y 1911",
  lat: 41.8917,
  lng: 12.461,
  audio: "1 min",
  teaser: "La colina con la mejor panorámica de Roma, el monumento a Garibaldi y el faro.",
  text: [
    "Es la colina desde la que mejor se ve Roma con sus cúpulas y campanarios. Aquí está el gran monumento ecuestre a Garibaldi de 1895 y cada día a mediodía se dispara un cañonazo que se oye por toda la ciudad. Un poco más allá está el Faro del Gianicolo de 1911 obra del arquitecto Manfredo Manfredi y regalo de los italianos de Buenos Aires por el cincuenta aniversario de la unidad de Italia; hoy solo se enciende en ocasiones especiales.",
  ],
  highlights: [
    { name: "Monumento a Garibaldi", note: "Estatua ecuestre de 1895 en la terraza principal.", lat: 41.8917, lng: 12.461 },
    { name: "Faro del Gianicolo", note: "Un poco más al norte, con vistas a San Pedro y al Monte Mario.", lat: 41.89475, lng: 12.46086 },
    { name: "Cañonazo del mediodía", note: "Todos los días a las doce se dispara un cañón desde la colina." },
  ],
};

const sanPietroInVincoli: Stop = {
  id: "san-pietro-in-vincoli",
  name: "San Pietro in Vincoli",
  era: "Siglo V",
  lat: 41.8939,
  lng: 12.4932,
  audio: "1 min",
  teaser: "La basílica que guarda las cadenas de san Pedro y el Moisés de Miguel Ángel.",
  text: [
    "La basílica se construyó en el siglo V para guardar las cadenas con las que, según la tradición, san Pedro estuvo preso. De ahí su nombre: «vincoli» significa cadenas.",
    "Dentro está el Moisés de Miguel Ángel, esculpido hacia 1513 para la tumba del papa Julio II. Fijaos en los cuernos de la cabeza, que vienen de un error de traducción de la Biblia.",
  ],
};

const monti: Stop = {
  id: "monti",
  name: "Barrio de Monti",
  era: "Barrio antiguo",
  lat: 41.8949,
  lng: 12.4909,
  audio: "1 min",
  teaser: "Uno de los barrios más antiguos de Roma, con aire de pueblo junto al Coliseo.",
  text: [
    "Monti es el rione número I de Roma y uno de sus barrios más antiguos. En la Antigüedad fue la Subura, el arrabal popular y bullicioso de la ciudad.",
    "Hoy es un rincón de calles empinadas, tiendas de artesanía y trattorias. La plaza de la Madonna dei Monti, con su fuente, es el mejor sitio para hacer una parada.",
  ],
};

const mercadosTrajano: Stop = {
  id: "mercados-trajano",
  name: "Mercados de Trajano",
  era: "Hacia el año 110",
  lat: 41.8956,
  lng: 12.4863,
  audio: "1 min",
  teaser: "Tiendas y oficinas escalonadas en la ladera, junto al foro de Trajano.",
  text: [
    "Formaban parte del gran complejo del foro de Trajano, levantado a comienzos del siglo II por el arquitecto Apolodoro de Damasco.",
    "Sus locales se escalonan por la ladera del Quirinal, y por eso se los suele llamar el primer centro comercial de la historia. Hoy alberga el Museo de los Foros Imperiales.",
  ],
};

const museosCapitolinos: Stop = {
  id: "museos-capitolinos",
  name: "Museos Capitolinos",
  era: "Desde 1471",
  lat: 41.8927,
  lng: 12.4822,
  audio: "1 min",
  teaser: "Considerado el museo público más antiguo del mundo, sobre la colina del Capitolio.",
  text: [
    "Se considera el museo público más antiguo del mundo: en 1471 el papa Sixto IV donó al pueblo de Roma un grupo de esculturas antiguas de bronce.",
    "Están en la plaza del Campidoglio, diseñada por Miguel Ángel. Entre sus piezas destacan la Loba Capitolina y la estatua ecuestre de Marco Aurelio, cuyo original está dentro y cuya copia preside la plaza.",
  ],
};

const barrioJudio: Stop = {
  id: "barrio-judio",
  name: "Barrio Judío",
  era: "Más de 2.000 años",
  lat: 41.8925,
  lng: 12.4786,
  audio: "1 min",
  teaser: "Una de las comunidades judías más antiguas de Europa, junto al Pórtico de Octavia.",
  text: [
    "La comunidad judía vive en Roma desde hace más de dos mil años, una de las más antiguas de Europa.",
    "El gueto se creó en 1555 por orden del papa Pablo IV y duró hasta 1870. Hoy el barrio conserva el Pórtico de Octavia, de época romana, y es el lugar para probar las alcachofas a la judía.",
  ],
};

const campoDeFiori: Stop = {
  id: "campo-de-fiori",
  name: "Campo de' Fiori",
  era: "Plaza medieval",
  lat: 41.8956,
  lng: 12.4722,
  audio: "1 min",
  teaser: "Mercado por la mañana y ambiente por la noche, con la estatua de Giordano Bruno.",
  text: [
    "Su nombre, «campo de flores», viene de un prado que había aquí en la Edad Media.",
    "En el centro se alza la estatua de Giordano Bruno, que fue quemado en esta misma plaza en 1600. Por la mañana hay mercado de fruta, flores y especias.",
  ],
};

const largoArgentina: Stop = {
  id: "largo-argentina",
  name: "Largo di Torre Argentina",
  era: "Siglos IV a II a. C.",
  lat: 41.8953,
  lng: 12.4769,
  audio: "1 min",
  teaser: "Cuatro templos republicanos en pleno centro, junto al lugar donde mataron a César.",
  text: [
    "Es una excavación en pleno centro con cuatro templos de la época republicana, levantados entre los siglos IV y II a. C.",
    "Junto a estas ruinas estaba la Curia de Pompeyo, donde fue asesinado Julio César en el año 44 a. C. Hoy el recinto es también un refugio de gatos callejeros.",
  ],
};

const piazzaNavona: Stop = {
  id: "piazza-navona",
  name: "Piazza Navona",
  era: "Año 86 y año 1651",
  lat: 41.8989,
  lng: 12.4731,
  audio: "1 min",
  teaser: "Una plaza con la forma de un estadio romano y la fuente de los Cuatro Ríos.",
  text: [
    "La plaza conserva la forma alargada del estadio de Domiciano, inaugurado hacia el año 86, donde se celebraban competiciones de atletismo.",
    "En el centro está la Fuente de los Cuatro Ríos, de Bernini, terminada en 1651. Frente a ella se alza la iglesia de Santa Inés en Agonía, barroca, con la fachada de Borromini.",
  ],
};

const plazaSanPedro: Stop = {
  id: "plaza-san-pedro",
  name: "Plaza y Basílica de San Pedro",
  era: "Años 1656 a 1667",
  lat: 41.9022,
  lng: 12.4539,
  audio: "1 min",
  teaser: "La plaza de Bernini abraza a quien llega con dos brazos de columnas.",
  text: [
    "Gian Lorenzo Bernini diseñó la plaza entre 1656 y 1667. Sus dos columnatas forman como unos brazos que reciben a quien llega.",
    "En el centro se alza un obelisco egipcio que se colocó aquí en 1586 por orden del papa Sixto V.",
    "Al fondo está la basílica, consagrada en 1626. Su cúpula parte de un proyecto de Miguel Ángel.",
  ],
  viator: { url: "https://audioviator.com/audioguia/plaza-basilica-san-pedro/" },
};

const museosVaticanos: Stop = {
  id: "museos-vaticanos",
  name: "Museos Vaticanos",
  era: "Desde 1506",
  lat: 41.9065,
  lng: 12.4536,
  audio: "1 min",
  teaser: "Kilómetros de arte, desde la Antigüedad hasta la Capilla Sixtina.",
  text: [
    "Los museos nacieron en 1506, cuando el papa Julio II expuso una estatua recién descubierta, el Laocoonte.",
    "El recorrido termina en la Capilla Sixtina, cuya bóveda pintó Miguel Ángel entre 1508 y 1512.",
    "Conviene reservar la entrada con antelación y llevar los hombros y las rodillas cubiertos.",
  ],
  viator: {
    url: "https://audioviator.com/audioguia/capilla-sixtina/",
    note: "Audioguía de la Capilla Sixtina.",
  },
};

const baseDays: Day[] = [
  {
    id: "1",
    title: "Roma antigua, Aventino y Trastevere",
    stops: [
      cosmedin,
      foroRomano,
      montePalatino,
      arcoConstantino,
      coliseo,
      circoMassimo,
      cavalieriMalta,
      jardinNaranjos,
      portaPortese,
      santaCecilia,
      pontesisto,
      sanPietroMontorio,
      acquaPaola,
      gianicolo,
    ],
  },
  {
    id: "2",
    title: "Vaticano y sus museos",
    stops: [plazaSanPedro, museosVaticanos],
  },
  {
    id: "3",
    title: "Monti y el centro histórico",
    stops: [
      campoDeFiori,
      piazzaNavona,
      panteon,
      trevi,
      mercadosTrajano,
      monti,
      sanPietroInVincoli,
      museosCapitolinos,
      vittoriano,
      largoArgentina,
      barrioJudio,
    ],
  },
];

/** Une a cada parada su foto con puntos, si la tiene en guias.ts. */
const withGuide = (stop: Stop): Stop => (guides[stop.id] ? { ...stop, ...guides[stop.id] } : stop);

export const days: Day[] = baseDays.map((d) => ({ ...d, stops: d.stops.map(withGuide) }));

export const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function findDay(dayId: string | undefined): Day | undefined {
  return days.find((d) => d.id === dayId);
}

export function findStop(day: Day | undefined, stopId: string | undefined): Stop | undefined {
  return day?.stops.find((s) => s.id === stopId);
}

/** Todas las paradas de todos los días, con el día al que pertenecen. */
export const allStops: { stop: Stop; dayId: string }[] = days.flatMap((d) =>
  d.stops.map((stop) => ({ stop, dayId: d.id })),
);
