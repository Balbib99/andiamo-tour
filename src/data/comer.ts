import type { Eat } from "./types";

/**
 * Sitios para comer o tomar algo cerca de cada parada. Las coordenadas salen del mapa del itinerario de la familia;
 * cada sitio va en la parada más cercana. En `note` va lo que se recomienda: lo que dice el itinerario cuando lo dice, y
 * si no, lo más conocido del local según guías y reseñas (conviene comprobarlo). Las fotos son de Wikimedia Commons;
 * salvo la de Tazza d'Oro, enseñan el tipo de plato y no el local (`illustrative`).
 * Para añadir uno: id de la parada, nombre, tipo, coordenadas de Google Maps, recomendación y foto en public/img/comer.
 */
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const eats: Record<string, Eat[]> = {
  "barrio-judio": [
    {
      name: "Cappuccino Bar",
      kind: "Bar",
      note: "Un cappuccino decorado, tomado de pie en la barra.",
      lat: 41.892136,
      lng: 12.4748579,
      photo: {
        src: "/img/comer/cappuccino-bar.jpg",
        alt: "Un cappuccino con un dibujo de espuma en forma de hoja",
        author: "Drew Coffman",
        license: "CC0",
        page: commons("Latte_art_on_cappuccino_(Unsplash).jpg"),
        illustrative: true,
      },
    },
    {
      name: "Caffè 67",
      kind: "Café",
      note: "Un cappuccino y un panino. Está en Trastevere, al otro lado del Tíber.",
      lat: 41.8889038,
      lng: 12.4754685,
      photo: {
        src: "/img/comer/caffe-67.jpg",
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
      note: "Pizza bianca al corte, con aceite y sal, o pizza rossa. Se pide por trozos.",
      lat: 41.8958558,
      lng: 12.4715634,
      photo: {
        src: "/img/comer/forno-campo-de-fiori.jpg",
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
      note: "Pasta fresca hecha a mano, como la carbonara o la cacio e pepe. Conviene reservar.",
      lat: 41.8961235,
      lng: 12.4716678,
      photo: {
        src: "/img/comer/osteria-da-fortunata.jpg",
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
      note: "Un cannolo siciliano, o cualquier dulce de almendra o pistacho.",
      lat: 41.8940972,
      lng: 12.4730667,
      photo: {
        src: "/img/comer/nonna-vincenza.jpg",
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
      note: "Un café de filtro o un cappuccino con bollería. Suele haber cola.",
      lat: 41.8970566,
      lng: 12.469997,
      photo: {
        src: "/img/comer/barnum.jpg",
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
      note: "Perfecto para probar el tiramisú de pistacho.",
      lat: 41.8980142,
      lng: 12.471566,
      photo: {
        src: "/img/comer/two-sizes.jpg",
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
      note: "Helados cubiertos de chocolate caliente.",
      lat: 41.8982333,
      lng: 12.4704548,
      photo: {
        src: "/img/comer/frigidarium.jpg",
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
      note: "Uno de los mejores cafés de Roma, al salir del Panteón. Un café o un cappuccino con cornetto.",
      lat: 41.899434,
      lng: 12.477407,
      photo: {
        src: "/img/comer/tazza-doro.jpg",
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
      note: "El gran caffè: un espresso más grande y dulce, con mucha crema. Se paga primero en la caja y con el ticket se pide en la barra.",
      lat: 41.8982749,
      lng: 12.4754254,
      photo: {
        src: "/img/comer/sant-eustachio.jpg",
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
      note: "Helado de pistacho, o el cucurucho bañado en chocolate y crujiente de nougatine.",
      lat: 41.8995074,
      lng: 12.4772941,
      photo: {
        src: "/img/comer/venchi.jpg",
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
      note: "Para cenar un panini o una tabla de quesos y embutidos, cerca de la fuente.",
      lat: 41.900629,
      lng: 12.481772,
      photo: {
        src: "/img/comer/pane-e-salame.jpg",
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
      note: "Un cappuccino con cornetto, a un paso del Trevi.",
      lat: 41.8990373,
      lng: 12.4825101,
      photo: {
        src: "/img/comer/san-marcello.jpg",
        alt: "Un café con leche y un cornetto sobre una barra",
        author: "Ensahequ",
        license: "CC BY-SA 4.0",
        page: commons("Cornetto_e_cappuccino.jpg"),
        illustrative: true,
      },
    },
  ],
};
