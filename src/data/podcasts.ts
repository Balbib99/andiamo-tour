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
  "foro-romano": { file: "foro-romano", min: 14 },
  "monte-palatino": { file: "monte-palatino", min: 31 },
  coliseo: { file: "coliseo", min: 24 },
};

export const podcastSrc = (p: Podcast) => `/podcast/${p.file}.m4a`;
