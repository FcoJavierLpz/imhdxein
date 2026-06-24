<template>
  <section class="section-padding bg-white">
    <div class="container-custom">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <div class="sticky top-28 space-y-3">
            <button
              v-for="(therapy, i) in therapies"
              :key="therapy.id"
              :id="therapy.slug"
              :class="[
                'w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left',
                selected?.id === therapy.id
                  ? `${chakraBg[i]} border-2 border-brand-500/30 shadow-md`
                  : 'bg-deep-50 hover:bg-deep-100 border-2 border-transparent'
              ]"
              @click="select(therapy)"
            >
              <div :class="`w-10 h-10 rounded-xl bg-gradient-to-br ${chakraColors[i]} flex items-center justify-center flex-shrink-0`">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons[therapy.icon] || icons.Sparkles" />
              </div>
              <div class="min-w-0">
                <h3 :class="['font-semibold text-sm', selected?.id === therapy.id ? 'text-deep-900' : 'text-deep-600']">{{ therapy.name }}</h3>
                <div class="flex items-center gap-2 text-xs text-deep-400 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{{ therapy.duration_minutes }} min</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div v-if="selected" class="animate-fade-in">
            <div class="rounded-2xl overflow-hidden shadow-lg mb-8">
              <img :src="selected.image_url" :alt="selected.name" class="w-full h-72 md:h-80 object-cover" />
            </div>
            <h2 class="text-3xl md:text-4xl font-heading font-bold text-deep-900">{{ selected.name }}</h2>
            <div class="mt-4 flex items-center gap-6 text-deep-500">
              <span class="flex items-center gap-2 text-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {{ selected.duration_minutes }} minutos</span>
              <span v-if="selected.price !== null" class="flex items-center gap-2 text-sm font-semibold text-deep-800">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {{ selected.price }} MXN
              </span>
              <span v-else class="flex items-center gap-2 text-sm text-brand-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Costo personalizado según evaluación
              </span>
            </div>
            <div class="mt-6 text-deep-600 leading-relaxed">
              <template v-for="(seg, i) in parsedDescription" :key="i">
                <div v-if="seg.type === 'heading'" class="flex items-center gap-2 mt-6 mb-2">
                  <span class="w-1 h-5 rounded-full bg-brand-400 flex-shrink-0"></span>
                  <span class="font-semibold text-deep-800 tracking-wide">{{ seg.text }}</span>
                </div>
                <div v-else class="whitespace-pre-line" :class="{ 'min-h-[0.75rem]': seg.text.trim() === '' }">{{ seg.text }}</div>
              </template>
            </div>
            <div class="mt-8">
              <a href="/contacto" class="btn-primary inline-flex items-center gap-2">
                Solicitar Información <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Therapy {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_minutes: number;
  price: number | null;
  icon: string;
  image_url: string;
}

const props = defineProps<{ therapies: Therapy[] }>();

const selected = ref<Therapy | null>(props.therapies[0] || null);

const select = (therapy: Therapy) => {
  selected.value = therapy;
};

const icons: Record<string, string> = {
  Sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
  Flower2: '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v0M12 5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3m0-12c1.657 0 3 1.343 3 3v6c0 1.657-1.343 3-3 3m0-12c-1.657 0-3 1.343-3 3v6c0 1.657 1.343 3 3 3"/>',
  Hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>',
  Brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77"/>',
  Droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.4-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>',
  CircleDot: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/>',
  Pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>',
  Gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
};

const chakraColors = [
  'from-chakra-root to-chakra-sacral',
  'from-chakra-sacral to-chakra-solar',
  'from-chakra-solar to-chakra-heart',
  'from-chakra-heart to-chakra-throat',
  'from-chakra-throat to-chakra-third',
  'from-chakra-third to-chakra-crown',
  'from-chakra-crown to-spirit-600',
  'from-spirit-600 to-chakra-root',
];

const chakraBg = [
  'bg-chakra-root/10', 'bg-chakra-sacral/10', 'bg-chakra-solar/10', 'bg-chakra-heart/10',
  'bg-chakra-throat/10', 'bg-chakra-third/10', 'bg-chakra-crown/10', 'bg-spirit-600/10',
];

type DescriptionSegment = { type: 'heading'; text: string } | { type: 'text'; text: string };

const parsedDescription = computed<DescriptionSegment[]>(() => {
  if (!selected.value) return [];
  return selected.value.description.split('\n').map((line) => {
    const trimmed = line.trim();
    if (trimmed.endsWith(':') && trimmed.length < 80 && !trimmed.startsWith('•')) {
      return { type: 'heading', text: trimmed };
    }
    return { type: 'text', text: line };
  });
});
</script>