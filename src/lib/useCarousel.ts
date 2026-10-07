import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

/**
 * Estado y controles accesibles compartidos por los carruseles del sitio
 * (patrón "Carousel" de WAI-ARIA APG + WCAG 2.2.2 "Pausar, detener, ocultar"):
 * - el autoplay se puede pausar y arranca en pausa con prefers-reduced-motion;
 * - se detiene mientras el ratón o el foco de teclado están dentro del carrusel;
 * - deslizar horizontalmente en táctil cambia de diapositiva.
 */
export function useCarousel(count: () => number, intervalMs = 6000) {
  const current = ref(0);
  const userPaused = ref(false);
  const hovering = ref(false);
  const focusWithin = ref(false);
  const isPlaying = computed(() => !userPaused.value && !hovering.value && !focusWithin.value);

  let timer: ReturnType<typeof setInterval> | null = null;
  const stopTimer = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const startTimer = () => {
    stopTimer();
    if (isPlaying.value && count() > 1) {
      timer = setInterval(() => {
        current.value = (current.value + 1) % count();
      }, intervalMs);
    }
  };
  watch(isPlaying, startTimer);

  // La navegación manual reinicia el intervalo para no saltar justo después de un clic.
  const goTo = (i: number) => {
    const n = count();
    if (n === 0) return;
    current.value = (i + n) % n;
    startTimer();
  };
  const next = () => goTo(current.value + 1);
  const prev = () => goTo(current.value - 1);
  const togglePause = () => {
    userPaused.value = !userPaused.value;
  };

  // Solo el ratón pausa por hover: en táctil, un toque emula pointerenter sin el leave.
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') hovering.value = true;
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') hovering.value = false;
  };

  // Pausa solo con foco de teclado; un clic de ratón en una flecha no detiene el autoplay.
  const onFocusIn = (event: FocusEvent) => {
    if ((event.target as Element).matches(':focus-visible')) focusWithin.value = true;
  };
  const onFocusOut = (event: FocusEvent) => {
    const root = event.currentTarget as HTMLElement;
    if (!root.contains(event.relatedTarget as Node | null)) focusWithin.value = false;
  };

  const SWIPE_MIN_PX = 50;
  let touchStart: { x: number; y: number } | null = null;
  const onTouchStart = (event: TouchEvent) => {
    const t = event.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (!touchStart) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };
  const onTouchCancel = () => {
    touchStart = null;
  };

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) userPaused.value = true;
    startTimer();
  });
  onUnmounted(stopTimer);

  return {
    current,
    userPaused,
    isPlaying,
    goTo,
    next,
    prev,
    togglePause,
    // Para el elemento raíz del carrusel (los táctiles, con .passive para no frenar el scroll).
    onPointerEnter,
    onPointerLeave,
    onFocusIn,
    onFocusOut,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
  };
}
