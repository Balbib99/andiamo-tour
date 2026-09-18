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
  era: "Siglo VI a. C. al siglo IV d. C.",
  lat: 41.8925,
  lng: 12.4853,
  audio: "2 min",
  teaser: "El centro político, religioso y comercial de la Roma antigua.",
  text: [
    "Empezó como un valle pantanoso entre colinas. Desde el siglo VI a. C. fue el lugar donde se votaba, se comerciaba y se celebraban los triunfos.",
    "Fijaos en la Via Sacra, el camino que seguían los generales victoriosos, y en el Arco de Tito, en el extremo del Foro que queda más cerca del Coliseo.",
  ],
  viator: { url: "https://audioviator.com/audioguia/foros-imperiales/" },
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

const trastevere: Stop = {
  id: "trastevere",
  name: "Trastevere",
  era: "Barrio medieval",
  lat: 41.8894,
  lng: 12.4695,
  audio: "1 min",
  teaser: "Calles empedradas y plazas al otro lado del Tíber, con la basílica de Santa Maria como corazón.",
  text: [
    "Trastevere significa «al otro lado del Tíber». Sus calles empedradas y sus plazas se recorren mejor sin prisa, sobre todo por la tarde.",
    "En el centro está la basílica de Santa Maria in Trastevere, una de las iglesias más antiguas de Roma, con mosaicos dorados del siglo XII.",
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

export const days: Day[] = [
  {
    id: "1",
    title: "Roma antigua y Trastevere",
    stops: [circoMassimo, coliseo, foroRomano, trastevere],
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
