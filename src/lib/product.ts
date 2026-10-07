/**
 * Las categorías de producto se escriben a mano en Keystatic y llegan con variantes
 * ("SUPLEMENTOS", "Suplementos", "Sinergias  con Flores de Bach"). Se agrupan por una
 * clave normalizada para que el filtro no muestre la misma categoría dos veces.
 */
export const categoryKey = (category: string) =>
  category.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es-MX');

/** Etiqueta legible: espacios limpios y, si viene toda en mayúsculas, solo la inicial en mayúscula. */
export const categoryLabel = (category: string) => {
  const clean = category.trim().replace(/\s+/g, ' ');
  if (clean !== clean.toLocaleUpperCase('es-MX')) return clean;
  const lower = clean.toLocaleLowerCase('es-MX');
  return lower.charAt(0).toLocaleUpperCase('es-MX') + lower.slice(1);
};

const priceFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Precio en pesos con el mismo formato en tarjeta y ficha: "$315", o "$315.50" si lleva centavos. */
export const formatPrice = (price: number) => priceFormatter.format(price);
