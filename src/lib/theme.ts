import { load, save } from "./storage";

/** Tema de la web: el del móvil («auto») o uno elegido a mano. */
export type Theme = "auto" | "light" | "dark";

const META_COLORS: Record<"light" | "dark", string> = { light: "#183A32", dark: "#121a18" };

export function loadTheme(): Theme {
  const saved = load<string>("theme", "auto");
  return saved === "light" || saved === "dark" ? saved : "auto";
}

/** Pone el tema en <html> (lo lee el CSS) y ajusta el color de la barra del navegador. Se guarda en el móvil. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  save("theme", theme);

  // Sin tema elegido, las dos etiquetas de index.html siguen al móvil; con uno elegido, mandan las dos el mismo color.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const original = meta.dataset.auto ?? meta.content;
    meta.dataset.auto = original;
    meta.content = theme === "auto" ? original : META_COLORS[theme];
  });
}
