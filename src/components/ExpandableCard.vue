<script setup lang="ts">
import { ref } from 'vue';

// Micro-componente de expansión fluida para tarjetas con texto extenso.
// Muestra un extracto corto siempre visible y revela el resto del contenido
// de forma controlada mediante un botón "Ver más / Ver menos", evitando
// saturar la primera impresión visual de la tarjeta.
//
// Nota: se evita `useId()` (API de Vue 3.5+) para prevenir conflictos con
// el transform de Fast Refresh de Vite/Vue durante desarrollo (error
// "$RefreshSig$ is not defined"). En su lugar se genera un id único por
// instancia con `Math.random()`, suficiente para el uso de aria-controls
// dentro de una misma página.

const props = defineProps<{
  excerpt: string;
  rest: string;
}>();

const expanded = ref(false);
const contentId = `expandable-content-${Math.random().toString(36).slice(2, 10)}`;

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
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-600, #b8880e);
  transition: color 0.2s ease;
}

.expandable-toggle:hover {
  color: var(--color-brand-700, #96700b);
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
