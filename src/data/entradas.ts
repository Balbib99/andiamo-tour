import type { Tickets } from "./types";

/**
 * Webs oficiales para sacar las entradas o reservar, por parada (id de la parada). Solo se enlazan páginas oficiales
 * (del propio sitio o del Ministerio de Cultura y el Ayuntamiento), contrastadas el 7/10/2026. Las notas no llevan
 * precios ni horarios, porque cambian: se ven en la propia web. Se unen a la parada en itinerario.ts.
 * Para añadir una: id de la parada, dirección de la web oficial y una nota breve de lo que conviene saber.
 */
const coliseo = "https://colosseo.it/orari-e-biglietti/";
const vaticanos = "https://tickets.museivaticani.va";
const basilica = "https://www.basilicasanpietro.va/es/products";

export const tickets: Record<string, Tickets> = {
  coliseo: {
    url: coliseo,
    note: "Una misma entrada del Parque Arqueológico del Coliseo sirve para el Coliseo y para el Foro Romano y el Palatino.",
  },
  "foro-romano": {
    url: coliseo,
    note: "La entrada del Parque Arqueológico del Coliseo incluye el Foro Romano, el Palatino y el Coliseo.",
  },
  "monte-palatino": {
    url: coliseo,
    note: "La entrada del Parque Arqueológico del Coliseo incluye el Palatino, el Foro Romano y el Coliseo.",
  },
  "museos-vaticanos": {
    url: vaticanos,
    note: "Es la única web oficial de entradas. Conviene reservar con antelación y fijarse en que la dirección sea esta: hay páginas parecidas que cobran de más.",
  },
  "jardines-vaticanos": {
    url: vaticanos,
    note: "Los jardines solo se visitan con visita guiada, que se reserva en la web de los Museos Vaticanos.",
  },
  "cupula-san-pedro": {
    url: basilica,
    note: "La subida a la cúpula se reserva en la web oficial de la basílica, eligiendo día y hora.",
  },
  "basilica-san-pedro": {
    url: basilica,
    note: "Entrar en la basílica no exige reserva, pero se puede reservar el acceso en la web oficial.",
  },
  "necropolis-vaticana": {
    url: basilica,
    note: "La reserva es obligatoria y hay plazas limitadas cada día. Se solicita en la web oficial de la basílica.",
  },
  "castel-sant-angelo": {
    url: "https://direzionemuseiroma.cultura.gov.it/en/museo-nazionale-di-castel-santangelo/",
    note: "Se recomienda reservar la entrada. La web oficial del Ministerio de Cultura lleva a la venta.",
  },
  panteon: {
    url: "https://direzionemuseiroma.cultura.gov.it/en/pantheon/",
    note: "Para entrar hace falta una entrada oficial, que se compra en la web de Musei Italiani, en su aplicación o en las taquillas del propio Panteón.",
  },
  "museos-capitolinos": {
    url: "https://www.museicapitolini.org/it/biglietti-e-prenotazioni/biglietti-e-videoguide",
    note: "Las entradas se compran en la web oficial de los Museos Capitolinos.",
  },
  "mercados-trajano": {
    url: "https://www.mercatiditraiano.it/it/biglietti-e-prenotazioni/biglietti-e-videoguide-0",
    note: "Las entradas se compran en la web oficial de los Mercados de Trajano.",
  },
  trevi: {
    url: "https://fontanaditrevi.roma.it",
    note: "Desde el 2 de febrero de 2026, acceder a la zona junto a la fuente exige entrada de pago para quien no vive en Roma. Se compra en la web oficial.",
  },
  vittoriano: {
    url: "https://vive.cultura.gov.it/en/panoramic-terrace",
    note: "El monumento se puede visitar gratis, pero la terraza panorámica con ascensor requiere entrada, que se compra en la web oficial.",
  },
  "barrio-judio": {
    url: "https://www.museoebraico.roma.it",
    note: "Para visitar el Museo Judío de Roma y la Sinagoga, la web oficial explica cómo reservar.",
  },
};
