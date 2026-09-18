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

export interface Stop extends LatLng {
  id: string;
  name: string;
  era: string;
  teaser: string;
  /** Historia en párrafos. Se usa cuando la parada no tiene foto con puntos. */
  text: string[];
  /** Duración aproximada del audio, para mostrar en pantalla. */
  audio: string;
  photo?: Photo;
  points?: PhotoPoint[];
  /** Enlace a una audioguía externa para completar la información. */
  viator?: { url: string; note?: string };
}

export interface Day {
  id: string;
  title: string;
  stops: Stop[];
}

export interface Lodging extends LatLng {
  name: string;
  /** true mientras el alojamiento sea el de ejemplo. */
  isExample?: boolean;
}
