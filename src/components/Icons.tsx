import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: "0 0 18 18",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ChevronLeft = () => (
  <svg {...base} width={16} height={16}>
    <path d="M11 3 5.5 9 11 15" />
  </svg>
);

export const ChevronDown = () => (
  <svg {...base} width={16} height={16}>
    <path d="M3 6.5 9 12l6-5.5" />
  </svg>
);

export const MapIcon = () => (
  <svg {...base}>
    <path d="M2 4.5 6.5 3l5 1.5L16 3v10.5L11.5 15l-5-1.5L2 15z" />
    <path d="M6.5 3v10.5M11.5 4.5V15" />
  </svg>
);

export const ExternalIcon = () => (
  <svg {...base}>
    <path d="M7 3H3.5v11.5H15V11M10 3h5v5M15 3 8.5 9.5" />
  </svg>
);

export const PlayIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6 3.5v13l11-6.5z" />
  </svg>
);

export const PauseIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <rect x="5" y="4" width="3.6" height="12" rx="1" />
    <rect x="11.4" y="4" width="3.6" height="12" rx="1" />
  </svg>
);

export const StopIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <rect x="5" y="5" width="10" height="10" rx="1.5" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base} width={14} height={14}>
    <path d="m3.5 9.5 3.5 3.5 7.5-8" />
  </svg>
);

export const AudioIcon = () => (
  <svg {...base} width={14} height={14}>
    <path d="M2 6.5v5h3.5L10 15V3L5.5 6.5z" fill="currentColor" stroke="none" />
    <path d="M12.5 6a4 4 0 0 1 0 6" />
  </svg>
);

export const PhotoIcon = () => (
  <svg {...base} width={14} height={14}>
    <rect x="1.5" y="3.5" width="15" height="11" rx="2" />
    <circle cx="9" cy="9" r="2.8" />
  </svg>
);

export const PinIcon = () => (
  <svg {...base}>
    <path d="M9 16s5-4.6 5-8.5a5 5 0 0 0-10 0C4 11.400 9 16 9 16Z" />
    <circle cx="9" cy="7.5" r="1.8" />
  </svg>
);

/** Cubiertos: tenedor y cuchillo. Marca los sitios para comer o tomar algo. */
export const EatIcon = () => (
  <svg {...base}>
    <path d="M5 2v5.5a2 2 0 0 0 2 2V16M3.5 2v4M6.5 2v4" />
    <path d="M13.5 16V2c-1.8 1.2-2.8 3.4-2.8 6 0 1.3.9 2 2.8 2" />
  </svg>
);

export const MicIcon = () => (
  <svg {...base}>
    <rect x="6.5" y="2" width="5" height="9" rx="2.5" />
    <path d="M3.5 8.5a5.5 5.5 0 0 0 11 0M9 14v2.5M6.5 16.5h5" />
  </svg>
);

export const SunIcon = () => (
  <svg {...base}>
    <circle cx="9" cy="9" r="3.2" />
    <path d="M9 1.8v1.6M9 14.6v1.6M1.8 9h1.6M14.6 9h1.6M3.9 3.9l1.1 1.1M13 13l1.1 1.1M3.9 14.1 5 13M13 5l1.1-1.1" />
  </svg>
);

export const MoonIcon = () => (
  <svg {...base}>
    <path d="M15 10.4A6.4 6.4 0 0 1 7.6 3 6.4 6.4 0 1 0 15 10.4Z" />
  </svg>
);

/** Círculo partido: «el tema del móvil». */
export const AutoThemeIcon = () => (
  <svg {...base}>
    <circle cx="9" cy="9" r="6.2" />
    <path d="M9 2.8v12.4" />
    <path d="M9 2.8a6.2 6.2 0 0 1 0 12.4Z" fill="currentColor" stroke="none" />
  </svg>
);

export const SlidersIcon = () => (
  <svg {...base}>
    <path d="M3 5.5h7M13 5.5h2M3 12.5h2M8 12.5h7" />
    <circle cx="11.5" cy="5.5" r="1.5" />
    <circle cx="6.5" cy="12.5" r="1.5" />
  </svg>
);

export const ArrowRight = () => (
  <svg {...base} width={16} height={16}>
    <path d="M3 9h12M10.5 4.5 15 9l-4.5 4.5" />
  </svg>
);
