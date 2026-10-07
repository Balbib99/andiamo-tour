export interface LatLng {
  lat: number;
  lng: number;
}

/** Punto numerado sobre la foto de una parada. x e y son porcentajes de la imagen. */
export interface PhotoPoint {
  x: number;
  y: number;
  title: string;
  text: string;
}

export interface Photo {
  src: string;
  alt: string;
  /** Proporción ancho / alto de la foto, por ejemplo "1280 / 897". */
  ratio: string;
  credit: string;
}

/** Un lugar concreto dentro de una parada, por ejemplo un templo del Foro Romano. */
export interface Highlight {
  name: string;
  note: string;
  lat?: number;
  lng?: number;
}

/** Foto de un sitio para comer: casi siempre de Wikimedia Commons, con su autoría y licencia. */
export interface EatPhoto {
  src: string;
  alt: string;
  author: string;
  license: string;
  /** Página de la foto en Commons, para la atribución. */
  page: string;
  /** true si enseña el tipo de plato y no el propio local. */
  illustrative: boolean;
}

/** Un sitio para comer o tomar algo cerca de una parada. */
export interface Eat extends LatLng {
  name: string;
  /** Qué es: café, restaurante, helados... */
  kind: string;
  /** Qué se recomienda tomar. */
  note: string;
  photo: EatPhoto;
}

/** Enlace a la web oficial donde se sacan las entradas o se hace la reserva de un sitio. */
export interface Tickets {
  url: string;
  /** Qué hay que saber antes de ir a la web (si hace falta reservar, qué cubre la entrada...). Sin precios ni horarios. */
  note: string;
}

export interface Stop extends LatLng {
  id: string;
  name: string;
  era: string;
  teaser: string;
  /** Historia en párrafos. Se usa cuando la parada no tiene foto con puntos. */
  text: string[];
  /** Duración aproximada del audio, para mostrar en pantalla. */
  audio: string;
  /** Lugares que ver dentro de la parada, en el orden en que conviene recorrerlos. */
  highlights?: Highlight[];
  /** Sitios para comer o tomar algo cerca de la parada. */
  eat?: Eat[];
  photo?: Photo;
  points?: PhotoPoint[];
  /** Web oficial para sacar las entradas o reservar, si el sitio lo necesita. */
  tickets?: Tickets;
  /** Enlace a una audioguía externa para completar la información. */
  viator?: { url: string; note?: string };
}

export interface Day {
  id: string;
  title: string;
  stops: Stop[];
  /** true si el orden de las paradas es deliberado: la ruta lo respeta y no lo reordena por cercanía al empezar. */
  fixedOrder?: boolean;
}
