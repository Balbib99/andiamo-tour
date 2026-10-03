/**
 * Se ejecuta después de `vite build` (lo encadena `npm run build`). Mira lo que hay en dist/ y escribe:
 *   - dist/offline-manifest.json: la lista de lo que la web puede guardar para funcionar sin conexión
 *       shell   → la app (código, tipografías, iconos); el service worker la guarda sola al entrar
 *       basico  → fotos, guías de voz y datos; se descarga a propósito desde la portada
 *       dias    → los podcasts de cada día, también a propósito
 *   - dist/sw.js: el service worker con la versión de esta construcción puesta, para que cada despliegue
 *     nuevo se instale solo.
 * Los podcasts de cada día salen de src/data (que Node lee directamente, como en exportar-textos.mjs).
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { days } from "../src/data/itinerario.ts";
import { podcasts } from "../src/data/podcasts.ts";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const urlOf = (file) => "/" + relative(DIST, file).split(sep).join("/");
const sizeOf = (file) => statSync(file).size;

const all = walk(DIST).map((file) => ({ url: urlOf(file), size: sizeOf(file) }));
const under = (prefix) => all.filter((f) => f.url.startsWith(prefix) && !f.url.endsWith(".txt"));

// La app: el index (que se guarda como «/»), los archivos con huella de /assets, el manifiesto de la web y los iconos.
const shell = [
  "/",
  "/offline-manifest.json",
  "/manifest.webmanifest",
  "/favicon.svg",
  ...all.filter((f) => f.url.startsWith("/assets/") || f.url.startsWith("/icons/")).map((f) => f.url),
];

// Fotos, guías de voz y datos.
const basico = [...under("/img/"), ...under("/audio/"), ...under("/data/")];

// Podcasts de cada día, sin repetir los que sirven para varias paradas.
const dias = days.map((d) => {
  const files = [...new Set(d.stops.map((s) => podcasts[s.id]?.file).filter(Boolean))];
  const archivos = files.map((name) => {
    const url = `/podcast/${name}.m4a`;
    const f = all.find((x) => x.url === url);
    if (!f) throw new Error(`Falta el podcast ${url} en dist/`);
    return f;
  });
  return { id: d.id, title: d.title, archivos };
});

const version = createHash("sha1")
  .update(JSON.stringify({ shell, basico, dias }))
  .update(readFileSync(join(DIST, "index.html")))
  .digest("hex")
  .slice(0, 10);

writeFileSync(join(DIST, "offline-manifest.json"), JSON.stringify({ version, shell, basico, dias }));

const sw = readFileSync(join(DIST, "sw.js"), "utf8");
const marcador = 'const VERSION = "__VERSION__";';
if (!sw.includes(marcador)) throw new Error("dist/sw.js no tiene la línea " + marcador);
writeFileSync(join(DIST, "sw.js"), sw.replace(marcador, `const VERSION = "${version}";`));

const mb = (n) => (n / 1048576).toFixed(1) + " MB";
console.log(`Modo sin conexión · versión ${version}`);
console.log(`  app (se guarda sola):  ${shell.length} archivos`);
console.log(`  básico (a petición):   ${basico.length} archivos, ${mb(basico.reduce((s, f) => s + f.size, 0))}`);
for (const d of dias) console.log(`  podcasts día ${d.id}:       ${d.archivos.length} archivos, ${mb(d.archivos.reduce((s, f) => s + f.size, 0))}`);
