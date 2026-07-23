<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

// Banner flotante de conversión no intrusiva para /terapias: reemplaza al
// antiguo Triage Interactivo estático. Aparece tras un pequeño tiempo en
// página o tras un scroll moderado (lo que ocurra primero), una vez que el
// usuario ya tuvo oportunidad de explorar el catálogo de terapias.
const props = defineProps<{ whatsappPhone: string }>();

const STORAGE_KEY = 'therapy-help-banner-dismissed';
const APPEAR_DELAY_MS = 7000;
const SCROLL_THRESHOLD_RATIO = 0.35;

const visible = ref(false);
const dismissed = ref(false);

let appearTimeout: ReturnType<typeof setTimeout> | null = null;

const clearAppearTimeout = () => {
  if (appearTimeout) {
    clearTimeout(appearTimeout);
    appearTimeout = null;
  }
};

const show = () => {
  if (dismissed.value || visible.value) return;
  visible.value = true;
  clearAppearTimeout();
  window.removeEventListener('scroll', onScroll);
};

const onScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return;
  const ratio = window.scrollY / scrollable;
  if (ratio >= SCROLL_THRESHOLD_RATIO) {
    show();
  }
};

const dismiss = () => {
  visible.value = false;
  dismissed.value = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // sessionStorage puede fallar en modo privado; no es crítico.
  }
};

onMounted(() => {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      dismissed.value = true;
      return;
    }
  } catch {
    // Si sessionStorage no está disponible, simplemente no persistimos el cierre.
  }

  appearTimeout = setTimeout(show, APPEAR_DELAY_MS);
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  clearAppearTimeout();
  window.removeEventListener('scroll', onScroll);
});

const whatsappHref = computed(() => {
  const cleanPhone = props.whatsappPhone.replace(/\D/g, '');
  const message =
    'Hola! 🌿 No estoy seguro/a de qué terapia elegir, ¿me pueden ayudar a orientar mi proceso de sanación?';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
});

// Puerta de entrada de diagnóstico inicial: redirige directamente al
// formulario de "Solicitar Terapia" con la Consulta Médica Integrativa
// preseleccionada (ContactForm.vue ya detecta `?therapy=<id>`, valida que
// exista en la lista de terapias, la preselecciona en el <select> y activa
// automáticamente la pestaña de "Solicitar Terapia").
const generalConsultHref = '/contacto?therapy=consulta-medica-integrativa';

</script>

<template>
  <Transition name="banner">
    <div
      v-if="visible"
      class="therapy-help-banner"
      role="dialog"
      aria-live="polite"
      aria-label="¿No sabes qué terapia elegir?"
    >
      <button
        class="therapy-help-banner__close"
        type="button"
        aria-label="Cerrar"
        @click="dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-spirit-500 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <p class="text-sm text-deep-700 leading-relaxed pr-4">
          ¿No sabes qué terapia elegir o por dónde empezar? Te ayudamos a orientar tu proceso de sanación.
        </p>
      </div>

      <div class="mt-4 flex flex-col gap-2">
        <a :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="therapy-help-banner__cta-primary">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.362.687 4.564 1.872 6.415L4 29l7.767-1.83A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.77 9.77 0 0 1-4.98-1.366l-.357-.212-4.61 1.087 1.104-4.49-.234-.367A9.76 9.76 0 0 1 5.2 15c0-5.966 4.847-10.818 10.804-10.818S26.809 9.034 26.809 15 21.961 24.818 16.004 24.818Zm5.61-7.98c-.307-.154-1.816-.897-2.098-1-.28-.103-.485-.154-.688.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.663.077-.307-.154-1.296-.478-2.468-1.523-.912-.813-1.528-1.817-1.707-2.124-.178-.307-.019-.473.135-.626.139-.138.307-.359.46-.538.154-.18.205-.308.307-.513.103-.205.051-.384-.026-.538-.077-.154-.688-1.659-.943-2.272-.248-.596-.5-.516-.688-.526l-.586-.01c-.205 0-.538.077-.82.384-.28.307-1.07 1.046-1.07 2.551 0 1.505 1.096 2.96 1.249 3.164.153.205 2.157 3.294 5.228 4.62.73.315 1.3.503 1.744.643.733.233 1.4.2 1.928.121.588-.088 1.816-.742 2.072-1.459.256-.717.256-1.331.18-1.459-.077-.128-.281-.205-.588-.359Z"/></svg>
          Solicitar ayuda por WhatsApp
        </a>
        <a :href="generalConsultHref" class="therapy-help-banner__cta-secondary">
          Agendar Consulta Médica Integrativa
        </a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.therapy-help-banner {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 50;
  width: 320px;
  max-width: calc(100vw - 2.5rem);
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 12px 32px rgba(21, 18, 16, 0.18);
  padding: 1.25rem;
  padding-top: 1.5rem;
}

.therapy-help-banner__close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: var(--color-deep-400, #9c8e7a);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.therapy-help-banner__close:hover {
  background-color: var(--color-deep-100, #e8e4de);
  color: var(--color-deep-700, #403a30);
}

.therapy-help-banner__cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #25d366;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.therapy-help-banner__cta-primary:hover {
  background-color: #1fb958;
  transform: translateY(-1px);
}

.therapy-help-banner__cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  border: 2px solid var(--color-brand-500, #d4a017);
  color: var(--color-brand-600, #b8880e);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.therapy-help-banner__cta-secondary:hover {
  background-color: var(--color-brand-500, #d4a017);
  color: #ffffff;
}

@media (max-width: 640px) {
  .therapy-help-banner {
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.75rem;
    width: auto;
    max-width: none;
  }
}

/* Animación de entrada/salida: fade + slide desde la esquina inferior. */
.banner-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.banner-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(24px);
}

@media (prefers-reduced-motion: reduce) {
  .banner-enter-active,
  .banner-leave-active {
    transition: opacity 0.2s ease;
  }
  .banner-enter-from,
  .banner-leave-to {
    transform: none;
  }
}
</style>
