// Artículos, preposiciones y conjunciones que el español deja en minúscula dentro de un título.
const LOWERCASE_WORDS = new Set([
  'a', 'al', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'los', 'o', 'para', 'por', 'u', 'y',
]);

/**
 * Nombres y cargos llegan de Keystatic a veces TODO EN MAYÚSCULAS y con espacios dobles.
 * Se normalizan a formato título en español: "Especialista en Educación Integral para el Bienestar".
 */
export const toTitleCase = (text: string) =>
  text
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es-MX')
    .split(' ')
    .map((word, i) =>
      i > 0 && LOWERCASE_WORDS.has(word)
        ? word
        : word.replace(/(^|[.'/(-])\p{L}/gu, (c) => c.toLocaleUpperCase('es-MX'))
    )
    .join(' ');
