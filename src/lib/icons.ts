// Paths SVG (viewBox 24x24, estilo lucide) para las opciones de ICON_OPTIONS
// en keystatic.config.ts. Fuente única de verdad: si se agrega un ícono
// nuevo aquí, se refleja automáticamente en todos los lugares que lo usan
// (index.astro, TherapySelector.vue) sin tener que actualizar cada copia.
export const ICON_PATHS: Record<string, string> = {
  Sparkles:
    '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  Flower2:
    '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v0M12 5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3m0-12c1.657 0 3 1.343 3 3v6c0 1.657-1.343 3-3 3m0-12c-1.657 0-3 1.343-3 3v6c0 1.657 1.343 3 3 3m0 0a3 3 0 0 0 3-3"/><path d="M12 17a3 3 0 0 1-3-3"/>',
  Hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  Brain:
    '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .583-.786"/><path d="M19.94 10.11a4 4 0 0 1 .583.786"/><path d="M6.399 15.5a3 3 0 0 0-.399 1.375"/><path d="M17.601 15.5a3 3 0 0 0 .399 1.375"/><path d="M20.523 15.104a4 4 0 0 1-.583.786"/><path d="M3.477 15.104a4 4 0 0 0-.583-.786"/><path d="M9 13a4.5 4.5 0 0 0 3 4"/>',
  Droplet:
    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.4-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>',
  CircleDot: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  Pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  Gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
};

export const getIconPaths = (name: string): string => ICON_PATHS[name] ?? ICON_PATHS.Sparkles;
