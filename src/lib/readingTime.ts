import { plainText } from './seo';

// 200 palabras por minuto: ritmo de lectura cómodo en español para un público general,
// algo por debajo de la media de lectores expertos para no prometer menos tiempo del real.
const WORDS_PER_MINUTE = 200;

/** Minutos estimados de lectura de un texto Markdoc/Markdown (mínimo 1). */
export const readingMinutes = (source: string) => {
  const words = plainText(source).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
