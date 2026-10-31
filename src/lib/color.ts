const relativeLuminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const WHITE = '#FFFFFF';
const INK = '#151210'; // deep-900

/** Texto blanco u oscuro, el que más contraste dé sobre un fondo de color (p. ej. los chakras). */
export const readableTextOn = (background: string) =>
  contrast(WHITE, background) >= contrast(INK, background) ? WHITE : INK;
