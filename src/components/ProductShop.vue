<script setup lang="ts">
import { ref, computed } from 'vue';
import { CONTACT_WHATSAPP_PHONE } from '../constants/contact';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  orderIndex: number;
}

const props = defineProps<{
  products: Product[];
}>();

const categories = [...new Set(props.products.map(p => p.category))];
const activeCategory = ref('Todos');

const filtered = computed(() =>
  activeCategory.value === 'Todos'
    ? props.products
    : props.products.filter(p => p.category === activeCategory.value)
);

/**
 * Genera dinámicamente el enlace de WhatsApp (wa.me) para "solicitar" un
 * producto, incluyendo automáticamente su nombre y precio en el mensaje.
 */
const whatsappLink = (product: Product) => {
  const text =
    `Hola!, me interesa el producto *${product.name}* ` +
    `(Precio: $${product.price} MXN). ¿Me podrían dar más información para solicitarlo?`;
  return `https://wa.me/${CONTACT_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};
</script>


<template>
  <section class="section-padding bg-white">
    <div class="container-custom">

      <!-- Filtros de categoría -->
      <div class="flex flex-wrap gap-2 mb-10">
        <button
          @click="activeCategory = 'Todos'"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-all', activeCategory === 'Todos' ? 'bg-brand-500 text-white shadow-md' : 'bg-deep-100 text-deep-600 hover:bg-deep-200']"
        >Todos</button>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-all', activeCategory === cat ? 'bg-brand-500 text-white shadow-md' : 'bg-deep-100 text-deep-600 hover:bg-deep-200']"
        >{{ cat }}</button>
      </div>

      <!-- Grid de productos -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filtered"
          :key="product.id"
          class="card group flex flex-col"
        >
          <!-- Imagen -->
          <div class="h-52 overflow-hidden relative flex-shrink-0 bg-deep-100">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span
              v-if="product.price"
              class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-deep-800 shadow-sm"
            >${{ product.price }}</span>
            <span
              v-if="!product.isAvailable"
              class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm"
            >No disponible</span>
          </div>

          <!-- Contenido -->
          <div class="p-5 flex flex-col flex-1">
            <span class="text-xs text-brand-600 font-medium uppercase tracking-wide">{{ product.category }}</span>
            <h3 class="font-heading font-semibold text-deep-800 mt-1 leading-snug">{{ product.name }}</h3>
            <p class="mt-2 text-deep-500 text-sm leading-relaxed line-clamp-3 flex-1">{{ product.description }}</p>

            <!-- Botón "Solicitar" por WhatsApp -->
            <a
              v-if="product.isAvailable"
              :href="whatsappLink(product)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-95"
              style="background-color: #25D366;"
              :aria-label="`Solicitar ${product.name} por WhatsApp`"
            >
              <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M16.004 3C9.377 3 4 8.373 4 15c0 2.362.687 4.564 1.872 6.415L4 29l7.767-1.83A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.77 9.77 0 0 1-4.98-1.366l-.357-.212-4.61 1.087 1.104-4.49-.234-.367A9.76 9.76 0 0 1 5.2 15c0-5.966 4.847-10.818 10.804-10.818S26.809 9.034 26.809 15 21.961 24.818 16.004 24.818Zm5.61-7.98c-.307-.154-1.816-.897-2.098-1-.28-.103-.485-.154-.688.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.663.077-.307-.154-1.296-.478-2.468-1.523-.912-.813-1.528-1.817-1.707-2.124-.178-.307-.019-.473.135-.626.139-.138.307-.359.46-.538.154-.18.205-.308.307-.513.103-.205.051-.384-.026-.538-.077-.154-.688-1.659-.943-2.272-.248-.596-.5-.516-.688-.526l-.586-.01c-.205 0-.538.077-.82.384-.28.307-1.07 1.046-1.07 2.551 0 1.505 1.096 2.96 1.249 3.164.153.205 2.157 3.294 5.228 4.62.73.315 1.3.503 1.744.643.733.233 1.4.2 1.928.121.588-.088 1.816-.742 2.072-1.459.256-.717.256-1.331.18-1.459-.077-.128-.281-.205-.588-.359Z"/>
              </svg>
              Solicitar
            </a>
            <span
              v-else
              class="mt-4 w-full flex items-center justify-center gap-2 bg-deep-100 text-deep-400 rounded-xl py-2.5 text-sm font-medium cursor-not-allowed"
            >No disponible</span>

          </div>
        </div>
      </div>

      <!-- Aviso informativo -->
      <div class="mt-14 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #25D366;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        </div>
        <div>
          <p class="font-semibold text-deep-800 text-sm">Solicita tu producto por WhatsApp</p>
          <p class="text-deep-500 text-sm mt-1">Al hacer clic en "Solicitar" se abrirá WhatsApp con un mensaje prellenado para que nuestro equipo te ayude a completar tu compra directamente.</p>
        </div>
      </div>


    </div>
  </section>
</template>
