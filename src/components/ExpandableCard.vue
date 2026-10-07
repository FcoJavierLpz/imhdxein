<script setup lang="ts">
import { ref, useId } from 'vue';

// Micro-componente de expansión fluida para tarjetas con texto extenso.
// Muestra un extracto corto siempre visible y revela el resto del contenido
// de forma controlada mediante un botón "Ver más / Ver menos", evitando
// saturar la primera impresión visual de la tarjeta.
//
// `useId()` da el mismo id en servidor y cliente (Astro aplica un prefijo por isla),
// así `aria-controls` no se desincroniza al hidratar como pasaba con `Math.random()`.

const props = defineProps<{
  excerpt: string;
  rest: string;
}>();

const expanded = ref(false);
const contentId = `expandable-content-${useId()}`;

const toggle = () => {
  expanded.value = !expanded.value;
};
</script>

<template>
  <div>
    <p class="text-deep-600 text-sm leading-relaxed">{{ props.excerpt }}</p>

    <div
      :id="contentId"
      class="expandable-panel"
      :class="{ 'expandable-panel--open': expanded }"
      :inert="!expanded"
    >
      <div class="expandable-panel__inner">
        <p class="text-deep-600 text-sm leading-relaxed mt-2">{{ props.rest }}</p>
      </div>
    </div>

    <button
      type="button"
      class="expandable-toggle"
      :aria-expanded="expanded"
      :aria-controls="contentId"
      @click="toggle"
    >
      {{ expanded ? 'Ver menos' : 'Ver más' }}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="expandable-toggle__icon"
        :class="{ 'expandable-toggle__icon--open': expanded }"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.expandable-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}

.expandable-panel--open {
  grid-template-rows: 1fr;
}

.expandable-panel__inner {
  overflow: hidden;
  min-height: 0;
}

.expandable-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  /* 44px de área táctil sin cambiar el ritmo visual: el margen absorbe el alto extra. */
  min-height: 2.75rem;
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-600);
  transition: color 0.2s ease;
}

.expandable-toggle:hover {
  color: var(--color-brand-700);
}

.expandable-toggle__icon {
  transition: transform 0.25s ease;
}

.expandable-toggle__icon--open {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .expandable-panel,
  .expandable-toggle__icon {
    transition: none;
  }
}
</style>
