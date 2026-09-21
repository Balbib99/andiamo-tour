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

export const MicIcon = () => (
  <svg {...base}>
    <rect x="6.5" y="2" width="5" height="9" rx="2.5" />
    <path d="M3.5 8.5a5.5 5.5 0 0 0 11 0M9 14v2.5M6.5 16.5h5" />
  </svg>
);
