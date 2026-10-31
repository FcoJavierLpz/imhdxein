<script setup lang="ts">
import { useCarousel } from '../lib/useCarousel';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  therapy: string;
}

const props = defineProps<{ testimonials: Testimonial[] }>();

const { current: active, userPaused, isPlaying, goTo, togglePause, ...carousel } = useCarousel(
  () => props.testimonials.length
);
</script>

<template>
  <section
    v-if="testimonials.length > 0"
    class="max-w-3xl mx-auto"
    aria-roledescription="carrusel"
    aria-label="Testimonios de pacientes"
    @pointerenter="carousel.onPointerEnter"
    @pointerleave="carousel.onPointerLeave"
    @focusin="carousel.onFocusIn"
    @focusout="carousel.onFocusOut"
    @touchstart.passive="carousel.onTouchStart"
    @touchend.passive="carousel.onTouchEnd"
    @touchcancel.passive="carousel.onTouchCancel"
  >
    <!-- En reproducción no se anuncia cada cambio; en pausa (o al interactuar) sí. -->
    <!-- biome-ignore lint/a11y/useSemanticElements: patrón Carousel de WAI-ARIA APG; cada diapositiva es un group, no un fieldset de formulario. -->
    <figure
      class="bg-deep-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative"
      role="group"
      aria-roledescription="diapositiva"
      :aria-label="`${active + 1} de ${testimonials.length}`"
      :aria-live="isPlaying ? 'off' : 'polite'"
      aria-atomic="true"
    >
      <svg class="text-brand-500/20 absolute top-6 left-6" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 0 0 4-1 6zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 0 0 4-1 6z"/></svg>
      <blockquote class="text-deep-200 text-lg leading-relaxed italic relative z-10">
        "{{ testimonials[active].text }}"
      </blockquote>
      <figcaption class="mt-6 flex items-center justify-between">
        <div>
          <p class="text-white font-semibold">{{ testimonials[active].name }}</p>
          <p class="text-brand-400 text-sm">{{ testimonials[active].therapy }}</p>
        </div>
        <div class="flex gap-0.5">
          <span class="sr-only">Calificación: {{ testimonials[active].rating }} de 5</span>
          <svg
            v-for="i in testimonials[active].rating"
            :key="i"
            width="16" height="16" viewBox="0 0 24 24"
            fill="currentColor"
            class="text-brand-400"
            aria-hidden="true"
          ><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
      </figcaption>
    </figure>

    <div v-if="testimonials.length > 1" class="flex justify-center items-center gap-1 mt-6">
      <!-- WCAG 2.2.2: el contenido que se mueve solo debe poder pausarse. -->
      <button
        type="button"
        class="flex items-center justify-center w-11 h-11 rounded-full text-deep-300 hover:text-white hover:bg-white/10 transition-colors mr-2"
        :aria-label="userPaused ? 'Reanudar testimonios' : 'Pausar testimonios'"
        @click="togglePause"
      >
        <svg v-if="userPaused" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
      </button>
      <!-- Área táctil de 44px alrededor de cada punto visual. -->
      <button
        type="button"
        v-for="(t, i) in testimonials"
        :key="t.id"
        class="group flex items-center justify-center h-11 min-w-11 px-1"
        :aria-label="`Ver testimonio ${i + 1} de ${testimonials.length}: ${t.name}`"
        :aria-current="i === active ? 'true' : undefined"
        @click="goTo(i)"
      >
        <span
          :class="['block h-2.5 rounded-full transition-all duration-300', i === active ? 'bg-brand-400 w-8' : 'w-2.5 bg-deep-500 group-hover:bg-deep-400']"
        ></span>
      </button>
    </div>
  </section>
</template>
