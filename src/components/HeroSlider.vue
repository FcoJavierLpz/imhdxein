<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden">
    <div
      v-for="(slide, i) in slides"
      :key="i"
      class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
      :class="current === i ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <template v-if="slide.type === 'brand'">
        <div class="absolute inset-0 bg-gradient-to-br from-spirit-900 via-deep-900 to-sage-900"></div>
        <div class="absolute inset-0 lotus-bg opacity-30 ken-burns" :class="current === i ? 'ken-burns-active' : 'ken-burns-idle'"
        ></div>
      </template>

      <template v-else>
        <img
          :src="slide.image"
          :alt="slide.alt"
          class="absolute inset-0 w-full h-full object-cover object-bottom ken-burns"
          :class="current === i ? 'ken-burns-active' : 'ken-burns-idle'"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
      </template>
    </div>

    <div class="container-custom px-4 relative z-20 w-full">
      <transition name="hero-content" mode="out-in">
        <div :key="current" class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v0M12 5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3m0-12c1.657 0 3 1.343 3 3v6c0 1.657-1.343 3-3 3m0-12c-1.657 0-3 1.343-3 3v6c0 1.657 1.343 3 3 3m0 0a3 3 0 0 0 3-3"/>
            </svg>
            <span class="text-brand-300 text-sm font-medium">Instituto de Medicina Integrativa y Holística</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
            {{ slides[current].title }}
            <span class="block chakra-gradient-text">{{ slides[current].subtitle }}</span>
          </h1>
          
          <p class="mt-6 text-lg md:text-xl text-deep-300 max-w-xl leading-relaxed">
            {{ slides[current].description }}
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <a href="/contacto" class="btn-primary text-base">Agendar tu Cita</a>
            <a href="/terapias" class="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-base">Explorar Terapias</a>
          </div>
        </div>
      </transition>
    </div>

    <div class="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-5 z-30">
      <button
        v-for="(dot, i) in chakraDots"
        :key="i"
        class="rounded-full transition-all duration-500 focus:outline-none"
        :class="current === i ? 'w-4 h-4 shadow-lg scale-125' : 'w-3 h-3 opacity-60 hover:opacity-90'"
        :style="`background-color: ${dot.color}; ${current === i ? `box-shadow: 0 0 12px 3px ${dot.color}80` : ''}`"
        @click="goTo(i)"
      />
    </div>

    <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <button @click="next" class="absolute right-4 xl:right-20 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
    </button>

    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import imgAmanecer from '../assets/images/hero/amanecer-nueva-oportunidad.webp';
import imgPoderSanacion from '../assets/images/hero/poder-sanacion.webp';
import imgEncuentraNorte from '../assets/images/hero/encuentra-tu-norte.webp';

const slides = [
  { 
    type: 'brand', 
    title: 'Sanación integral', 
    subtitle: 'del ser', 
    description: 'Integrando tradiciones milenarias con ciencia contemporánea para restaurar el equilibrio.' ,
    alt: '',
  },
  { 
    type: 'image', 
    image: imgAmanecer.src,
    title: 'Cada amanecer es', 
    subtitle: 'una oportunidad', 
    description: 'El universo nos otorga cambios de paradigmas. El camino del guerrero es la acción.',
    alt: 'Amanecer brumoso en la montaña representando un nuevo comienzo',
  },
  { 
    type: 'image', 
    image: imgPoderSanacion.src, 
    title: 'El poder de sanar', 
    subtitle: 'está en ti', 
    description: 'Somos los únicos capaces de iniciar el camino hacia el cambio verdadero.',
    alt: 'Persona meditando frente a un paisaje montañoso al amanecer',
  },
  { 
    type: 'image', 
    image: imgEncuentraNorte.src,
    alt: 'Mujer de pie en la cima de una montaña contemplando un amanecer neblinoso, junto a una brújula dorada antigua y una geoda de cuarzo que simbolizan la guía y la sanación espiritual.',
    title: 'Recupera tu equilibrio', 
    subtitle: 'original', 
    description: 'Tu cuerpo tiene la sabiduría para sanar. Integra terapias ancestrales y encuentra el mapa de retorno a tu bienestar.' 
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

const current = ref(0);
let timer: any = null;

const goTo = (i: number) => { current.value = i % slides.length; resetTimer(); };
const next = () => { current.value = (current.value + 1) % slides.length; resetTimer(); };
const prev = () => { current.value = (current.value - 1 + slides.length) % slides.length; resetTimer(); };
const resetTimer = () => { clearInterval(timer); startTimer(); };
const startTimer = () => { timer = setInterval(next, 6000); };

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % slides.length;
  }, 6000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
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
}
</style>
