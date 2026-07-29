-- ============================================
-- Documentar el propósito de `product_orders`
-- ============================================
-- Esta tabla no tiene ningún flujo activo hoy: ProductShop.vue resuelve los
-- pedidos abriendo un enlace de WhatsApp, no hay una Action `orders.submit`.
-- Se conserva intencionalmente (con su RLS INSERT-only e índices) porque
-- está reservada para el futuro carrito de compras; el flujo de WhatsApp es
-- provisional, no definitivo.
COMMENT ON TABLE product_orders IS
  'Reservada para el futuro carrito de compras. El flujo de pedidos actual usa un enlace de WhatsApp (ProductShop.vue) como solución provisional; sin Action activa hasta que se implemente el checkout definitivo.';
