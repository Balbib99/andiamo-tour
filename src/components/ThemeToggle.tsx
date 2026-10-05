import type { ReactNode } from "react";
import { useApp } from "../state/AppState";
import type { Theme } from "../lib/theme";
import { AutoThemeIcon, MoonIcon, SunIcon } from "./Icons";

const OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: "auto", label: "Tema del móvil", icon: <AutoThemeIcon /> },
  { value: "light", label: "Tema claro", icon: <SunIcon /> },
  { value: "dark", label: "Tema oscuro", icon: <MoonIcon /> },
];

/** Elige entre el tema del móvil, el claro y el oscuro. La elección se guarda en el móvil. */
export function ThemeToggle() {
  const { theme, setTheme } = useApp();
  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Tema de la web">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={theme === o.value}
          aria-label={o.label}
          title={o.label}
          className={theme === o.value ? "on" : ""}
          onClick={() => setTheme(o.value)}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
