import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/** Longitud que Google muestra sin cortar en la mayoría de resultados. */
const DESCRIPTION_MAX = 155;

/** Texto plano a partir de Markdoc/Markdown: sin etiquetas, imágenes ni marcas de formato. */
export const plainText = (source: string) =>
  source
    .replace(/\{%[\s\S]*?%\}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '') // marcas de énfasis: se quitan sin dejar hueco ("**Dxein** ," -> "Dxein,")
    .replace(/[#>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Meta descripción de longitud segura: espacios normalizados y, si pasa del máximo, recorte en
 * el último límite de palabra con "…" (antes se cortaba con slice(0, 160) a mitad de palabra).
 */
export const metaDescription = (text: string, max = DESCRIPTION_MAX) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * URL absoluta de la imagen para redes sociales: recorte exacto de 1200×630 en JPEG. Las redes
 * (WhatsApp, Facebook, LinkedIn, X) ignoran rutas relativas y WhatsApp descarta imágenes pesadas,
 * así que nunca se enlaza el original importado.
 */
export const ogImageUrl = async (image: ImageMetadata, site: URL) => {
  const { src } = await getImage({
    src: image,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fit: 'cover',
    format: 'jpg',
    quality: 80,
  });
  return new URL(src, site).toString();
};
