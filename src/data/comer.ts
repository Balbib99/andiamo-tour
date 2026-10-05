import type { Eat } from "./types";

/**
 * Sitios para comer o tomar algo cerca de cada parada. Las coordenadas salen del mapa del itinerario de la familia;
 * cada sitio va en la parada más cercana. En `note` solo va lo que se ha contrastado con la web del local, guías
 * (Time Out, Katie Parla, Gambero Rosso, Wanted in Rome...) o reseñas coincidentes, además de lo que dice el itinerario.
 * Un sitio sin información fiable no se añade. Las fotos son de Wikimedia Commons; salvo la de Tazza d'Oro, enseñan
 * el tipo de plato y no el local (`illustrative`).
 * Para añadir uno: id de la parada, nombre, tipo, coordenadas de Google Maps, recomendación y foto en public/img/comer.
 */
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const eats: Record<string, Eat[]> = {
  "barrio-judio": [
    {
      name: "Caffè 67",
      kind: "Café",
      note: "Cappuccino con dibujo en la espuma y panini, como el de jamón crudo y brie. Está en Trastevere, al otro lado del Tíber.",
      lat: 41.8889038,
      lng: 12.4754685,
      photo: {
        src: "/img/comer/caffe-67.webp",
        alt: "Un panino de jamón crudo y queso",
        author: "Pava",
        license: "CC BY-SA 3.0 it",
        page: commons("%22_15_-_ITALY_-_sandwich_with_Prosciutto_Crudo_PARMA_32_mesi_(32_months)_and_FIORE_Sardo_DOP_cheese.jpg"),
        illustrative: true,
      },
    },
  ],
  "campo-de-fiori": [
    {
      name: "Forno Campo de' Fiori",
      kind: "Panadería",
      note: "Pizza bianca o pizza rossa al corte: cortan el trozo, lo pesan y lo envuelven. También el bocadillo de pizza bianca con mortadela.",
      lat: 41.8958558,
      lng: 12.4715634,
      photo: {
        src: "/img/comer/forno-campo-de-fiori.webp",
        alt: "Bandejas de pizza al corte en un local de Roma",
        author: "Jon Gudorf Photography",
        license: "CC BY-SA 2.0",
        page: commons("Pizza_by_the_slice_in_Roma,_Italy.jpg"),
        illustrative: true,
      },
    },
    {
      name: "Osteria da Fortunata",
      kind: "Restaurante",
      note: "Pasta fresca hecha a mano, que se ve preparar en el local. Probad los clásicos romanos, como la cacio e pepe o la carbonara. Admite reserva y suele haber cola.",
      lat: 41.8961235,
      lng: 12.4716678,
      photo: {
        src: "/img/comer/osteria-da-fortunata.webp",
        alt: "Un plato de pasta a la carbonara",
        author: "philip.mallis",
        license: "CC BY-SA 2.0",
        page: commons("Carbonara,_Ostia_Antica.jpg"),
        illustrative: true,
      },
    },
    {
      name: "I Dolci di Nonna Vincenza",
      kind: "Pastelería siciliana",
      note: "Un cannolo siciliano, su dulce más conocido.",
      lat: 41.8940972,
      lng: 12.4730667,
      photo: {
        src: "/img/comer/nonna-vincenza.webp",
        alt: "Cannoli sicilianos rellenos de crema y con cerezas confitadas",
        author: "Stefano Mortellaro",
        license: "CC BY 2.0",
        page: commons("Cannoli_siciliani.jpg"),
        illustrative: true,
      },
    },
    {
      name: "Barnum Roma",
      kind: "Café de especialidad",
      note: "Café de especialidad con bollería de inspiración francesa y nórdica. Suele haber cola.",
      lat: 41.8970566,
      lng: 12.469997,
      photo: {
        src: "/img/comer/barnum.webp",
        alt: "Café de filtro goteando sobre una mesa",
        author: "Kim Sanso",
        license: "CC0",
        page: commons("Manual_drip_(pour-over)_coffee.jpg"),
        illustrative: true,
      },
    },
  ],
  "piazza-navona": [
    {
      name: "Two Sizes",
      kind: "Dulces",
      note: "Perfecto para probar el tiramisú de pistacho. Se toma para llevar, paseando.",
      lat: 41.8980142,
      lng: 12.471566,
      photo: {
        src: "/img/comer/two-sizes.webp",
        alt: "Una porción de tiramisú en un plato",
        author: "Navneet Sharma",
        license: "CC BY-SA 4.0",
        page: commons("Tiramisu_dessert.jpg"),
        illustrative: true,
      },
    },
    {
      name: "Frigidarium",
      kind: "Heladería",
      note: "Pedid el helado cubierto de chocolate negro o blanco: se endurece y forma una capa. Es un local pequeño y suele haber cola.",
      lat: 41.8982333,
      lng: 12.4704548,
      photo: {
        src: "/img/comer/frigidarium.webp",
        alt: "Un cucurucho de helado bañado en chocolate",
        author: "Tomwsulcer",
        license: "CC0",
        page: commons("Ice_cream_cone_chocolate_dipped_held_in_hand.jpg"),
        illustrative: true,
      },
    },
  ],
  panteon: [
    {
      name: "La Casa del Caffè Tazza d'Oro",
      kind: "Café",
      note: "Uno de los mejores cafés de Roma, al salir del Panteón. Su especialidad es la granita di caffè con panna en verano y el chocolate caliente con nata en invierno.",
      lat: 41.899434,
      lng: 12.477407,
      photo: {
        src: "/img/comer/tazza-doro.webp",
        alt: "Dos cappuccini y un cornetto en la barra del Caffè Tazza d'Oro",
        author: "Blackcat",
        license: "CC BY-SA 4.0",
        page: commons("Roma_-_Cappuccini_e_cornetto_al_caff%C3%A8_Tazza_d%27Oro.jpg"),
        illustrative: false,
      },
    },
    {
      name: "Sant'Eustachio Caffè",
      kind: "Café",
      note: "El gran caffè, su especialidad: viene muy dulce (para sin azúcar, pedid «amaro»). Se paga primero en la caja y con el ticket se pide en la barra; sentados sale más caro.",
      lat: 41.8982749,
      lng: 12.4754254,
      photo: {
        src: "/img/comer/sant-eustachio.webp",
        alt: "Un espresso en una taza sobre su plato",
        author: "Fraapal",
        license: "CC BY-SA 4.0",
        page: commons("Espresso_coffee.jpg"),
        illustrative: true,
      },
    },
    {
      name: "Venchi Cioccolato e Gelato",
      kind: "Helados y chocolate",
      note: "El cucurucho bañado en chocolate con nougatine, antes de rellenarlo de helado.",
      lat: 41.8995074,
      lng: 12.4772941,
      photo: {
        src: "/img/comer/venchi.webp",
        alt: "Tarrinas de helado de distintos sabores en una vitrina",
        author: "Sphilbrick",
        license: "CC BY-SA 3.0",
        page: commons("Gelato_in_Florence,_Italy.jpg"),
        illustrative: true,
      },
    },
  ],
  trevi: [
    {
      name: "Pane e Salame",
      kind: "Panini y tablas",
      note: "Para cenar un panini o una tabla de quesos y embutidos, cerca de la fuente. Los preparan a la vista; tiene pocas mesas y también es para llevar.",
      lat: 41.900629,
      lng: 12.481772,
      photo: {
        src: "/img/comer/pane-e-salame.webp",
        alt: "Una tabla de embutidos y quesos",
        author: "Albarubescens",
        license: "CC BY-SA 4.0",
        page: commons("Tagliere_toscano.jpg"),
        illustrative: true,
      },
    },
    {
      name: "Bar San Marcello",
      kind: "Bar",
      note: "Cornetto y cappuccino, a un paso del Trevi, y comida sencilla al mediodía. Según las fichas locales solo abre de lunes a viernes.",
      lat: 41.8990373,
      lng: 12.4825101,
      photo: {
        src: "/img/comer/san-marcello.webp",
        alt: "Un café con leche y un cornetto sobre una barra",
        author: "Ensahequ",
        license: "CC BY-SA 4.0",
        page: commons("Cornetto_e_cappuccino.jpg"),
        illustrative: true,
      },
    },
  ],
};
