import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * Imagen ya optimizada (WebP + srcset) lista para pasarse como prop serializable
 * a una isla Vue. Las islas no pueden usar <Image> de Astro, y pasarles
 * `image.src` sirve el archivo original sin redimensionar (PNG de ~2 MB).
 */
export interface ResponsiveImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

export async function toResponsiveImage(
  image: ImageMetadata,
  widths: number[]
): Promise<ResponsiveImage>;
export async function toResponsiveImage(
  image: ImageMetadata | undefined,
  widths: number[]
): Promise<ResponsiveImage | undefined>;
export async function toResponsiveImage(
  image: ImageMetadata | undefined,
  widths: number[]
): Promise<ResponsiveImage | undefined> {
  if (!image) return undefined;

  // Nunca se escala por encima del original; el original actúa como tope del srcset.
  const usable = widths.filter((w) => w < image.width);
  usable.push(Math.min(image.width, Math.max(...widths)));
  const largest = Math.max(...usable);

  const result = await getImage({
    src: image,
    widths: [...new Set(usable)],
    width: largest,
    format: 'webp',
  });

  return {
    src: result.src,
    srcset: result.srcSet.attribute,
    width: largest,
    height: Math.round((largest * image.height) / image.width),
  };
}
