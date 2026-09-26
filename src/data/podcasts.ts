/**
 * Podcasts de NotebookLM, uno por parada. `file` es el nombre del archivo en public/podcast (sin la extensión .m4a)
 * y `min` la duración redondeada en minutos. Para añadir uno: ver el apartado «Podcasts» del README.
 * Un mismo podcast puede servir para varias paradas repitiendo su `file`.
 */
export interface Podcast {
  file: string;
  min: number;
}

export const podcasts: Record<string, Podcast> = {
  cosmedin: { file: "santa-maria-in-cosmedin-y-foro-boario", min: 16 },
  "foro-romano": { file: "foro-romano", min: 14 },
  "monte-palatino": { file: "monte-palatino", min: 31 },
  "arco-constantino": { file: "arco-constantino-y-circo-maximo", min: 17 },
  "circo-massimo": { file: "arco-constantino-y-circo-maximo", min: 17 },
  coliseo: { file: "coliseo", min: 24 },
  "cavalieri-malta": { file: "aventino", min: 16 },
  "jardin-naranjos": { file: "aventino", min: 16 },
  "santa-cecilia": { file: "trastevere", min: 25 },
  "ponte-sisto": { file: "trastevere", min: 25 },
  "porta-portese": { file: "trastevere", min: 25 },
  "san-pietro-montorio": { file: "gianicolo", min: 23 },
  "acqua-paola": { file: "gianicolo", min: 23 },
  gianicolo: { file: "gianicolo", min: 23 },
  "plaza-san-pedro": { file: "san-pedro", min: 22 },
  "museos-vaticanos": { file: "museos-vaticanos-y-capilla-sixtina", min: 23 },
  "piazza-navona": { file: "piazza-navona-y-campo-de-fiori", min: 20 },
  "campo-de-fiori": { file: "piazza-navona-y-campo-de-fiori", min: 20 },
  trevi: { file: "fontana-di-trevi", min: 28 },
  "museos-capitolinos": { file: "campidoglio-y-museos-capitolinos", min: 12 },
  // Pendientes de audio todavía: monti, san-pietro-in-vincoli, largo-argentina, barrio-judio,
  // mercados-trajano, panteon, vittoriano. Se añaden en cuanto lleguen sus podcasts.
};

export const podcastSrc = (p: Podcast) => `/podcast/${p.file}.m4a`;
