---
name: IMHDXEIN
description: Instituto de Medicina Integrativa y Holística — rigor clínico con calidez holística.
colors:
  gold-dawn: "#D4A017"
  gold-bright: "#FFD040"
  gold-glow: "#FFDB6F"
  gold-text: "#8C6600"
  gold-ink: "#745500"
  gold-mist: "#FFF9E6"
  gold-veil: "#FFF0BF"
  sage-leaf: "#3A7D44"
  sage-mist: "#F0F7F1"
  spirit-plum: "#7B2D8E"
  spirit-mist: "#F5F0FF"
  night-earth: "#151210"
  earth-ink: "#2A2520"
  earth-muted: "#5D5445"
  earth-quiet: "#7A6F60"
  earth-dusk: "#9C8E7A"
  earth-line: "#D1C9BD"
  earth-sand: "#E8E4DE"
  earth-paper: "#F5F3F0"
  clinic-white: "#FFFFFF"
  whatsapp: "#25D366"
  whatsapp-strong: "#007F34"
  chakra-root: "#C41E3A"
  chakra-sacral: "#E8751A"
  chakra-solar: "#D4A017"
  chakra-heart: "#3A7D44"
  chakra-throat: "#1E90C6"
  chakra-third: "#4B0082"
  chakra-crown: "#7B2D8E"
typography:
  display:
    fontFamily: "Gelasio, Georgia, serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Gelasio, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Gelasio, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.375
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  lead:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
spacing:
  gutter: "1rem"
  card: "1.5rem"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.gold-dawn}"
    textColor: "{colors.night-earth}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.night-earth}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.gold-text}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
  button-outline-hover:
    backgroundColor: "{colors.gold-dawn}"
    textColor: "{colors.night-earth}"
  button-secondary:
    backgroundColor: "{colors.spirit-plum}"
    textColor: "{colors.clinic-white}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp-strong}"
    textColor: "{colors.clinic-white}"
    rounded: "{rounded.md}"
    padding: "0.875rem 1rem"
  card:
    backgroundColor: "{colors.clinic-white}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card}"
  input:
    backgroundColor: "{colors.clinic-white}"
    textColor: "{colors.earth-ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
  chip:
    backgroundColor: "{colors.earth-sand}"
    textColor: "{colors.earth-muted}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  chip-active:
    backgroundColor: "{colors.gold-dawn}"
    textColor: "{colors.night-earth}"
---

# Design System: IMHDXEIN

## Overview

**Creative North Star: "La consulta luminosa"**

El sitio se comporta como un consultorio bien iluminado: superficies blancas, orden clínico y tipografía serif sobria transmiten rigor; la luz dorada y la paleta chakra aportan la calidez holística como acento, nunca como ruido. Cada pantalla debe poder leerse primero como información médica seria y, en segundo plano, como un espacio acogedor. El enfoque es complementario, no sustitutivo, y el diseño lo refleja: lo clínico sostiene, lo espiritual acompaña.

La densidad es generosa y pausada. Las secciones respiran (5rem de margen vertical), los objetivos táctiles son amplios y el contraste se mantiene en WCAG 2.2 AA o mejor, porque una parte importante del público son pacientes mayores. Los heroes de cada página son oscuros y atmosféricos (fotografía o degradado con velo), y todo lo demás vive sobre blanco o papel cálido.

El movimiento es escaso y siempre interrumpible: los carruseles se pueden pausar, nada se mueve en bucle infinito y todo respeta `prefers-reduced-motion`.

**Key Characteristics:**
- Blanco clínico como lienzo; el dorado es la voz de la acción.
- Serif Gelasio para titulares, Inter para todo lo que se lee o se usa.
- La paleta chakra es firma: logotipo, barra bajo cada hero y marcadores de energía; no decoración general.
- Sombras cálidas y difusas; nada salta ni se eleva al pasar el ratón.
- Controles grandes, foco visible y contraste AA verificado.

## Colors

Una paleta cálida de tierra y oro, con la escala chakra reservada como firma de marca.

### Primary
- **Oro del amanecer** (gold-dawn): fondo de la acción principal ("Agendar consulta", chip activo, CTA). Siempre con texto oscuro (night-earth); el blanco sobre este oro no llega a AA.
- **Oro de texto** (gold-text): enlaces, "Ver más", precios destacados y bordes de botón de contorno sobre fondos claros (≥ 5:1 sobre blanco).
- **Oro tinta** (gold-ink): etiquetas en mayúsculas y texto dorado pequeño sobre fondos claros o dorados (≥ 6.5:1).
- **Oro resplandor** (gold-glow): énfasis de titulares y anillo de foco sobre heroes y secciones oscuras.
- **Velo dorado** (gold-mist, gold-veil): fondos de etiquetas, del ítem activo de la navegación y de iconos.

### Secondary
- **Hoja de salvia** (sage-leaf) y **niebla de salvia** (sage-mist): secciones de confianza (Acerca de, Formación) y marcadores de bienestar.

### Tertiary
- **Ciruela espiritual** (spirit-plum) y **niebla violeta** (spirit-mist): botón secundario, degradados de tarjetas de terapeutas y el hero de productos.

### Neutral
- **Tierra nocturna** (night-earth): texto sobre oro, fondo del pie y de las bandas oscuras.
- **Tinta de tierra** (earth-ink): texto principal sobre blanco.
- **Tierra apagada** (earth-muted) y **tierra serena** (earth-quiet): texto secundario y metadatos sobre fondos claros. Sobre `earth-paper` o fondos tintados, usar earth-muted.
- **Tierra al atardecer** (earth-dusk): texto secundario solo sobre fondos oscuros (pie de página).
- **Línea de tierra** (earth-line), **arena** (earth-sand), **papel** (earth-paper): bordes de campos, chips inactivos y superficies de tarjetas seleccionables.
- **WhatsApp** (whatsapp) para el botón flotante con el logo; **WhatsApp intenso** (whatsapp-strong) para cualquier botón con texto.

### Named Rules
**The Dark Ink on Gold Rule.** Sobre oro (gold-dawn o gold-bright) el texto es siempre night-earth. El blanco sobre oro da 2.4:1.

**The Chakra Signature Rule.** Los siete colores chakra aparecen juntos solo en el logotipo y en la barra de 6px bajo cada hero, una vez por página. Un color chakra suelto marca una energía concreta (día de atención, dosha), nunca decora.

**The Surface-Specific Gray Rule.** Un gris de texto se elige según la superficie: earth-quiet sobre blanco, earth-muted sobre papel o tintados, earth-dusk solo sobre oscuro. No hay un gris "secundario" universal.

## Typography

**Display Font:** Gelasio (con Georgia, serif)
**Body Font:** Inter (con system-ui, sans-serif)

**Character:** Gelasio conserva las proporciones de Georgia (la voz histórica del sitio) con un toque editorial y cálido; Inter aporta la claridad neutra de un documento clínico. Ambas se alojan en el propio sitio con fallbacks de métricas ajustadas.

### Hierarchy
- **Display** (700, de 36 a 72px, 1.25): titular del carrusel de la portada.
- **Headline** (700, de 30 a 48px, 1.25): títulos de página en los heroes (`text-4xl md:text-5xl`) y de sección (`text-3xl md:text-4xl`).
- **Title** (600–700, 18–20px, 1.375): títulos de tarjetas, pasos y bloques.
- **Body** (400, 16px, 1.625): texto general. En artículos, 18px dentro de la columna única del artículo (56rem).
- **Lead** (400, 18–20px, 1.625): entradilla bajo los títulos de hero y de sección.
- **Label** (500–700, 12–14px, tracking 0.05–0.1em, mayúsculas): categorías, metadatos y rótulos de datos (Teléfono, Formación académica, Paso 1). Nunca encima de un título como antetítulo. Nunca por debajo de 12px.

### Named Rules
**The Italic Accent Rule.** El énfasis dentro de un titular de hero es una palabra en Gelasio cursiva color gold-glow ("Artículos de *bienestar*"). Nunca texto con degradado.

**The Heading Speaks Rule.** Ningún título lleva antetítulo en mayúsculas ("NUESTRO EQUIPO" sobre "Terapeutas certificados"). Si el título necesita contexto, se reescribe el título o la entradilla.

**The 12px Floor Rule.** Ningún texto legible baja de 12px; la excepción es la línea "Medicina Integrativa" del logotipo.

## Layout

Contenedor centrado de 80rem (`max-w-7xl`) con 1rem de margen lateral, ampliado a 1.5–2rem en pantallas medianas y grandes. Las secciones usan 5rem de margen vertical. Los textos de introducción se limitan a 42–48rem. Los artículos del blog usan una única columna de 56rem para todos sus bloques.

Puntos de quiebre de Tailwind: 640, 768, 1024 y 1280px. La navegación completa aparece desde 1024px; por debajo, menú desplegable. Las rejillas de tarjetas van de 1 columna en móvil a 2, 3 o 4 en escritorio. En móvil los controles del carrusel forman una fila bajo los CTA para no tapar el texto.

## Elevation & Depth

Sistema de sombras suaves y cálidas. Las tarjetas descansan sobre sombras difusas, a veces teñidas de oro oscuro, y al interactuar la sombra crece; el elemento no se desplaza. Los elementos flotantes (navegación al hacer scroll, botón de WhatsApp, aviso de ayuda) usan sombras más marcadas porque viven sobre el contenido.

### Shadow Vocabulary
- **Reposo de tarjeta** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): tarjetas de producto, blog y terapeutas.
- **Respuesta de tarjeta** (`box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): la misma tarjeta al pasar el ratón.
- **Reposo dorado** (`box-shadow: 0 2px 8px -2px rgba(100, 64, 0, 0.06), 0 8px 24px -8px rgba(100, 64, 0, 0.08)`): tarjetas de filosofía y de pasos.
- **Respuesta dorada** (`box-shadow: 0 4px 12px -4px rgba(184, 136, 14, 0.15), 0 20px 40px -12px rgba(184, 136, 14, 0.18)`): las mismas al pasar el ratón.
- **Flotante** (`box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25)`): botón flotante de WhatsApp.

### Named Rules
**The Grounded Hover Rule.** Al pasar el ratón cambia la sombra o el color, nunca la posición. Nada salta.

## Shapes

Formas amables y redondeadas, coherentes con un trato cercano. Botones y campos con esquinas suaves (0.5rem); tarjetas e imágenes con esquinas generosas (1rem); las tarjetas destacadas de filosofía llegan a 1.5rem. Chips, insignias de precio, botones de icono y puntos de color son píldoras o círculos completos. El único contorno orgánico es el icono de las tarjetas de filosofía, que cambia de forma suavemente al pasar el ratón. Los bordes son de 1px en tonos de tierra; no hay bordes laterales gruesos.

## Components

### Buttons
Acogedores y claros: grandes, de un solo vistazo, con contraste alto.
- **Shape:** esquinas suaves (0.5rem); altura mínima de 44px.
- **Primary:** fondo gold-dawn con texto night-earth, semibold, 0.75rem × 1.5rem. Es la acción de cita en todo el sitio.
- **Hover / Focus:** el fondo se aclara a gold-bright y la sombra crece. El foco es un contorno de 3px gold-ink con 3px de separación (gold-glow sobre fondos oscuros).
- **Outline:** borde de 2px gold-dawn con texto gold-text; al pasar el ratón se rellena de oro con texto oscuro. Sobre heroes oscuros, borde blanco translúcido y texto blanco.
- **Secondary:** fondo spirit-plum con texto blanco.
- **WhatsApp:** fondo whatsapp-strong con texto blanco y logo; ocupa todo el ancho en fichas de producto y de terapeuta.

### Chips
- **Style:** píldoras de 44px de alto, fondo earth-sand, texto earth-muted.
- **State:** el activo pasa a gold-dawn con texto night-earth y `aria-pressed`. Se usan como filtros dentro de un `fieldset` con leyenda.

### Cards / Containers
- **Corner Style:** 1rem (1.5rem en las tarjetas de filosofía).
- **Background:** blanco; las destacadas usan un degradado casi imperceptible a gold-mist.
- **Shadow Strategy:** reposo y respuesta descritos en Elevation & Depth.
- **Border:** ninguno por defecto; las seleccionables usan fondo earth-paper y, al activarse, un borde tintado.
- **Internal Padding:** 1.25–1.75rem.

### Inputs / Fields
- **Style:** fondo blanco, borde de 1px earth-line, esquinas de 0.5rem, 0.75rem × 1rem de relleno y etiqueta visible encima.
- **Focus:** borde y anillo de 2px gold-text.
- **Error / Disabled:** mensajes en línea bajo el campo; los deshabilitados en earth-sand con texto earth-dusk.

### Navigation
Barra superior pegajosa sobre blanco al 95%, que al hacer scroll gana desenfoque y sombra. Enlaces en Inter 14px earth-muted; el activo con fondo gold-mist, texto gold-ink y `aria-current="page"`. El CTA "Agendar consulta" es un botón primario compacto. En móvil, un botón de menú de 44px abre una lista vertical de enlaces amplios con el CTA a todo el ancho; se cierra con Escape.

### Barra chakra
Franja de 6px con el degradado de los siete chakras, colocada una sola vez bajo el hero de cada página. Es la firma visual del instituto.

### Hero de página
Banda oscura con fotografía o degradado de color con velo, titular Gelasio blanco con una palabra de énfasis en cursiva gold-glow, y entradilla en un neutro claro. Si el degradado tiene transparencia, la sección lleva fondo night-earth para no mezclarse con blanco.

## Do's and Don'ts

### Do:
- **Do** usar texto night-earth sobre cualquier fondo dorado.
- **Do** elegir el gris de texto según la superficie (Surface-Specific Gray Rule) y comprobar 4.5:1 en texto normal y 3:1 en texto grande e iconos.
- **Do** mantener objetivos táctiles de al menos 44 × 44px y foco visible en todo control.
- **Do** dar a todo carrusel o movimiento automático un control de pausa y respetar `prefers-reduced-motion`.
- **Do** mantener el artículo del blog como una sola columna uniforme (56rem): imagen, título, audio, texto y compartir comparten el mismo ancho y borde.
- **Do** reservar la barra chakra para debajo del hero, una vez por página.

### Don't:
- **Don't** poner texto blanco sobre gold-dawn ni sobre el verde whatsapp claro.
- **Don't** usar texto con degradado fuera del logotipo.
- **Don't** elevar elementos al pasar el ratón ni usar animaciones en bucle infinito.
- **Don't** usar bordes laterales gruesos de color en tarjetas, avisos o paneles.
- **Don't** bajar de 12px en texto legible.
- **Don't** poner antetítulos en mayúsculas sobre los títulos de sección o de hero.
- **Don't** repetir la barra chakra varias veces seguidas.
