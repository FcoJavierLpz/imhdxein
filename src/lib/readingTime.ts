// 200 palabras por minuto: ritmo de lectura cómodo en español para un público general,
// algo por debajo de la media de lectores expertos para no prometer menos tiempo del real.
const WORDS_PER_MINUTE = 200;

/** Minutos estimados de lectura de un texto Markdoc/Markdown (mínimo 1). */
export const readingMinutes = (source: string) => {
  const text = source
    .replace(/\{%[\s\S]*?%\}/g, ' ') // etiquetas Markdoc
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // imágenes
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // enlaces: se cuenta solo el texto
    .replace(/[#>*_`~|-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
