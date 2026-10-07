# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pacientes que buscan medicina integrativa y bienestar holístico. El espectro va desde personas que desean complementar un diagnóstico o tratamiento médico vigente con alternativas naturales, hasta quienes buscan terapias energéticas, sistémicas y fitoterapia con un enfoque profesional. Incluye pacientes mayores, que son una audiencia relevante para accesibilidad.

## Product Purpose

Sitio del Instituto de Medicina Holística Dxein (IMHDXEIN, CDMX). Presenta el instituto, su equipo de médicos y terapeutas, el catálogo de terapias y productos, contenido educativo (blog) y un test de dosha. El éxito es que el visitante confíe en el enfoque y agende una consulta (formulario de contacto o WhatsApp), solicite una terapia o compre un producto.

## Positioning

IMHDXEIN fusiona el rigor clínico y científico con saberes tradicionales y holísticos: un enfoque integrativo serio, ético y **complementario, no sustitutivo** del tratamiento médico. Sus especialistas son médicos titulados.

## Operating Context

- Contenido gestionado en Keystatic (terapias, productos, terapeutas, testimonios, blog).
- Conversión vía formulario de contacto/citas (Astro Actions + Supabase + Resend), WhatsApp y enlaces a Mercado Libre para productos.
- Test de dosha ayurvédico con resultados enviados por correo.

## Capabilities and Constraints

- Stack existente: Astro 7 (SSR, Netlify), islas Vue 3, Tailwind CSS v4, Keystatic, Supabase.
- Idioma: español (es-MX).

## Brand Commitments

- Identidad visual cálida existente (paleta chakra, dorado, salvia, tipografía serif en titulares); preservarla.
- Voz humana, empática y ética; sin presión comercial.

## Evidence on Hand

- Testimonios reales gestionados en Keystatic (`src/content/testimonials`); no inventar ni alterar.
- Precios de terapias y productos definidos en Keystatic; respetarlos tal cual.
- Fotos reales de terapeutas, terapias y productos en `src/assets/images/`.
- No fabricar estadísticas, certificaciones, estudios ni resultados clínicos.

## Product Principles

1. Veracidad y rigor: ninguna afirmación de salud promete curas ni resultados; el lenguaje es complementario, nunca sustitutivo.
2. Confianza antes que conversión: explicar el proceso y el enfoque antes de pedir la cita.
3. Accesible para todos, en especial pacientes mayores: legibilidad, contraste y controles claros.
4. Calidez profesional: la identidad holística convive con la seriedad clínica.

## Accessibility & Inclusion

Objetivo WCAG 2.2 AA como mínimo, con atención a pacientes mayores: contraste suficiente, texto legible y escalable, objetivos táctiles amplios, foco visible y movimiento controlable (sin carruseles que no se puedan pausar).
