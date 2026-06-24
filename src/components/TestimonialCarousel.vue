<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  therapy: string;
}

const props = defineProps<{ testimonials: Testimonial[] }>();

const active = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (props.testimonials.length > 0) {
    interval = setInterval(() => {
      active.value = (active.value + 1) % props.testimonials.length;
    }, 6000);
  }
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<template>
  <div v-if="testimonials.length > 0" class="max-w-3xl mx-auto">
    <div class="bg-deep-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative">
      <svg class="text-brand-500/20 absolute top-6 left-6" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 0 0 4-1 6zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 0 0 4-1 6z"/></svg>
      <p class="text-deep-200 text-lg leading-relaxed italic relative z-10">
        "{{ testimonials[active].text }}"
      </p>
      <div class="mt-6 flex items-center justify-between">
        <div>
          <p class="text-white font-semibold">{{ testimonials[active].name }}</p>
          <p class="text-brand-400 text-sm">{{ testimonials[active].therapy }}</p>
        </div>
        <div class="flex gap-0.5">
          <svg
            v-for="i in testimonials[active].rating"
            :key="i"
            width="16" height="16" viewBox="0 0 24 24"
            fill="currentColor"
            class="text-brand-400"
          ><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-2 mt-6">
      <button
        v-for="(_, i) in testimonials"
        :key="i"
        :class="['w-2.5 h-2.5 rounded-full transition-all duration-300', i === active ? 'bg-brand-400 w-8' : 'bg-deep-600 hover:bg-deep-500']"
        @click="active = i"
      />
    </div>
  </div>
</template>
