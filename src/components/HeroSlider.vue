<template>
  <section
    class="on-dark relative min-h-[90vh] flex flex-col justify-center pt-12 pb-36 lg:py-0 overflow-hidden"
    aria-roledescription="carrusel"
    aria-label="Mensajes destacados"
    @pointerenter="carousel.onPointerEnter"
    @pointerleave="carousel.onPointerLeave"
    @focusin="carousel.onFocusIn"
    @focusout="carousel.onFocusOut"
    @touchstart.passive="carousel.onTouchStart"
    @touchend.passive="carousel.onTouchEnd"
    @touchcancel.passive="carousel.onTouchCancel"
  >
    <!-- Título estable de la página: el texto visible del slide rota, el h1 no. -->
    <h1 class="sr-only">IMHDXEIN, Instituto de Medicina Integrativa y Holística</h1>

    <div
      v-for="(slide, i) in slides"
      :key="i"
      class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
      :class="current === i ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      :aria-hidden="current !== i"
    >
      <template v-if="slide.type === 'brand'">
        <div class="absolute inset-0 bg-gradient-to-br from-spirit-900 via-deep-900 to-sage-900"></div>
        <div class="absolute inset-0 lotus-bg opacity-30 ken-burns" :class="current === i ? 'ken-burns-active' : 'ken-burns-idle'"
        ></div>
      </template>

      <template v-else>
        <img
          v-if="mounted.has(i)"
          :src="images[slide.image].src"
          :srcset="images[slide.image].srcset"
          sizes="100vw"
          :width="images[slide.image].width"
          :height="images[slide.image].height"
          :alt="slide.alt"
          class="absolute inset-0 w-full h-full object-cover object-bottom ken-burns"
          :class="current === i ? 'ken-burns-active' : 'ken-burns-idle'"
          decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
      </template>
    </div>

    <!-- En reproducción no se anuncia cada cambio; en pausa (o al interactuar) sí. -->
    <div class="container-custom px-4 relative z-20 w-full" :aria-live="isPlaying ? 'off' : 'polite'" aria-atomic="true">
      <transition name="hero-content" mode="out-in">
        <!-- biome-ignore lint/a11y/useSemanticElements: patrón Carousel de WAI-ARIA APG; cada diapositiva es un group, no un fieldset de formulario. -->
        <div
          :key="current"
          class="max-w-3xl"
          role="group"
          aria-roledescription="diapositiva"
          :aria-label="`${current + 1} de ${slides.length}`"
        >
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v0M12 5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3m0-12c1.657 0 3 1.343 3 3v6c0 1.657-1.343 3-3 3m0-12c-1.657 0-3 1.343-3 3v6c0 1.657 1.343 3 3 3m0 0a3 3 0 0 0 3-3"/>
            </svg>
            <span class="text-brand-300 text-sm font-medium">Instituto de Medicina Integrativa y Holística</span>
          </div>

          <p class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
            {{ slides[current].title }}
            <span class="block headline-accent">{{ slides[current].subtitle }}</span>
          </p>

          <p class="mt-6 text-lg md:text-xl text-deep-300 max-w-xl leading-relaxed">
            {{ slides[current].description }}
          </p>

          <p v-if="slides[current].author" class="mt-2 max-w-xl text-right font-heading italic text-deep-300 text-sm tracking-wide">
            — {{ slides[current].author }}
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <a href="/contacto" class="btn-primary text-base">Agendar consulta</a>
            <a href="/terapias" class="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-base">Explorar terapias</a>
          </div>
        </div>
      </transition>
    </div>

    <div class="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-1 z-30">
      <button
        type="button"
        v-for="(dot, i) in chakraDots"
        :key="i"
        class="group flex items-center justify-center w-7 h-7 rounded-full"
        :aria-label="`Ir a la diapositiva ${i + 1}: ${slides[i].title} ${slides[i].subtitle}`"
        :aria-current="current === i ? 'true' : undefined"
        @click="goTo(i)"
      >
        <span
          class="block rounded-full transition-all duration-500"
          :class="current === i ? 'w-4 h-4 shadow-lg scale-125' : 'w-3 h-3 opacity-60 group-hover:opacity-90'"
          :style="`background-color: ${dot.color}; ${current === i ? `box-shadow: 0 0 12px 3px ${dot.color}80` : ''}`"
        ></span>
      </button>
    </div>

    <!--
      Por debajo de lg los controles forman una fila bajo los CTA para no tapar el texto;
      desde lg el contenedor se disuelve (lg:contents) y cada botón vuelve a su sitio lateral.
      WCAG 2.2.2: el contenido que se mueve solo debe poder pausarse.
    -->
    <div class="container-custom px-4 relative z-30 w-full mt-10 flex items-center gap-3 lg:contents">
      <button type="button" aria-label="Diapositiva anterior" @click="prev" :class="[controlClass, 'lg:absolute lg:left-4 lg:top-1/2 lg:-translate-y-1/2']">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button
        type="button"
        :aria-label="userPaused ? 'Reanudar presentación' : 'Pausar presentación'"
        @click="togglePause"
        :class="[controlClass, 'lg:absolute lg:right-4 xl:right-20 lg:bottom-36']"
      >
        <svg v-if="userPaused" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
      </button>
      <button type="button" aria-label="Diapositiva siguiente" @click="next" :class="[controlClass, 'lg:absolute lg:right-4 xl:right-20 lg:top-1/2 lg:-translate-y-1/2']">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <span class="ml-1 text-sm text-deep-300 tabular-nums lg:hidden" aria-hidden="true">{{ current + 1 }} / {{ slides.length }}</span>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { ResponsiveImage } from '../lib/images';
import { useCarousel } from '../lib/useCarousel';

type HeroImageKey = 'amanecer' | 'poderSanacion' | 'encuentraNorte' | 'slide4' | 'slide6' | 'slide7';

const { images } = defineProps<{ images: Record<HeroImageKey, ResponsiveImage> }>();

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  author?: string;
  alt: string;
} & ({ type: 'brand' } | { type: 'image'; image: HeroImageKey });

const slides: Slide[] = [
  { 
    type: 'brand', 
    title: 'Sanación integral', 
    subtitle: 'del ser', 
    description: 'Integrando tradiciones milenarias con ciencia contemporánea para restaurar el equilibrio.' ,
    alt: '',
  },
  { 
    type: 'image', 
    image: 'amanecer',
    title: 'Cada amanecer es',
    subtitle: 'una invitación',
    description: 'A despertar nuestra consciencia y seguir creciendo. Hoy es un nuevo comienzo.',
    author: 'acehrlobo',
    alt: 'Amanecer brumoso en la montaña representando un nuevo comienzo',
  },
  { 
    type: 'image', 
    image: 'poderSanacion',
    title: 'El poder de sanar', 
    subtitle: 'está en ti', 
    description: 'Somos los únicos capaces de iniciar el camino hacia el cambio verdadero.',
    alt: 'Persona meditando frente a un paisaje montañoso al amanecer',
  },
  { 
    type: 'image', 
    image: 'encuentraNorte',
    alt: 'Mujer de pie en la cima de una montaña contemplando un amanecer neblinoso, junto a una brújula dorada antigua y una geoda de cuarzo que simbolizan la guía y la sanación espiritual.',
    title: 'Recupera tu equilibrio', 
    subtitle: 'original', 
    description: 'Tu cuerpo tiene la sabiduría para sanar. Integra terapias ancestrales y encuentra el mapa de retorno a tu bienestar.' 
  },
  {
    type: 'image',
    image: 'slide4',
    title: 'El arcoíris es muestra',
    subtitle: 'de que somos luz',
    description: 'Tenemos que vivir nuestra experiencia para continuar nuestro proceso de trascendencia.',
    alt: 'Majestuoso paisaje de montaña con un río y un arcoíris brillante sobre el bosque durante el amanecer dorado.'
  },
  {
    type: 'image',
    image: 'slide6',
    title: 'Comienza tu camino',
    subtitle: 'de sanación',
    description: 'Un espacio seguro donde la medicina integrativa te acompaña a reconectar con tu equilibrio físico, mental y espiritual.',
    alt: 'Un sendero de madera extendido serpentea a través de una densa jungla hacia un valle montañoso neblinoso durante la puesta de sol dorada.',
  },
  {
    type: 'image',
    image: 'slide7',
    title: 'Todo es energía',
    subtitle: 'haz la conexión',
    description: 'Un espacio de paz para equilibrar tu energía interior.',
    alt: 'Persona meditando junto a un río en un entorno natural al atardecer, con un arcoíris y símbolos de geometría sagrada en el cielo.',
  }
];

const chakraDots = [
  { color: '#C41E3A' },
  { color: '#E8751A' },
  { color: '#D4A017' },
  { color: '#3A7D44' },
  { color: '#1E90C6' },
  { color: '#4B0082' },
  { color: '#7B2D8E' },
];

const controlClass =
  'z-30 w-11 h-11 shrink-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all';

const { current, userPaused, isPlaying, goTo, next, prev, togglePause, ...carousel } = useCarousel(
  () => slides.length
);

// Solo se montan las imágenes del slide visible y del siguiente: antes las 6
// se descargaban al cargar la página aunque estuvieran ocultas con opacity-0.
const mounted = reactive(new Set([0, 1]));
watch(current, (i) => {
  mounted.add(i);
  mounted.add((i + 1) % slides.length);
});
</script>

<style scoped>
.hero-content-enter-active,
.hero-content-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.hero-content-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.hero-content-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.lotus-bg {
  background-image: url("../assets/images/background.webp");
  background-repeat: repeat;
  background-size: auto;
}

/* Ken Burns effect: slow zoom + pan while slide is visible */
.ken-burns {
  transform-origin: center center;
  will-change: transform;
}
.ken-burns-idle {
  transform: scale(1);
  transition: none;
}
.ken-burns-active {
  animation: kenBurns 9s ease-out forwards;
}

@keyframes kenBurns {
  0% {
    transform: scale(1) translateY(0); /* Comienza con la imagen completa */
  }
  100% {
    transform: scale(1.04) translateY(-1%); /* Pequeño zoom y traslación gradual */
  }
}


@media (prefers-reduced-motion: reduce) {
  .ken-burns-active {
    animation: none;
  }
  .hero-content-enter-from,
  .hero-content-leave-to {
    transform: none;
  }
}
</style>
