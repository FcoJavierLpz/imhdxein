<script setup lang="ts">
import { ref, computed } from 'vue';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  order_index: number;
  mercadolibre_url: string | null;
}

const props = defineProps<{ products: Product[] }>();

const categories = [...new Set(props.products.map(p => p.category))];
const activeCategory = ref('Todos');

const filtered = computed(() =>
  activeCategory.value === 'Todos'
    ? props.products
    : props.products.filter(p => p.category === activeCategory.value)
);
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
          <div class="h-52 overflow-hidden relative flex-shrink-0">
            <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span
              v-if="product.price"
              class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-deep-800 shadow-sm"
            >${{ product.price }}</span>
            <span
              v-if="!product.is_available"
              class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm"
            >No disponible</span>
          </div>

          <!-- Contenido -->
          <div class="p-5 flex flex-col flex-1">
            <span class="text-xs text-brand-600 font-medium uppercase tracking-wide">{{ product.category }}</span>
            <h3 class="font-heading font-semibold text-deep-800 mt-1 leading-snug">{{ product.name }}</h3>
            <p class="mt-2 text-deep-500 text-sm leading-relaxed line-clamp-3 flex-1">{{ product.description }}</p>

            <!-- Botón Mercado Libre -->
            <a
              v-if="product.mercadolibre_url && product.is_available"
              :href="product.mercadolibre_url"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-md active:scale-95"
              style="background-color: #FFE600; color: #333;"
            >
              <!-- Ícono Mercado Libre -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Ver en Mercado Libre
            </a>
            <span
              v-else-if="!product.is_available"
              class="mt-4 w-full flex items-center justify-center gap-2 bg-deep-100 text-deep-400 rounded-xl py-2.5 text-sm font-medium cursor-not-allowed"
            >No disponible</span>
            <span
              v-else
              class="mt-4 w-full flex items-center justify-center gap-2 bg-deep-100 text-deep-400 rounded-xl py-2.5 text-sm font-medium"
            >Próximamente en ML</span>
          </div>
        </div>
      </div>

      <!-- Aviso informativo -->
      <div class="mt-14 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #FFE600;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        </div>
        <div>
          <p class="font-semibold text-deep-800 text-sm">Compra segura a través de Mercado Libre</p>
          <p class="text-deep-500 text-sm mt-1">Al hacer clic en "Ver en Mercado Libre" serás redirigido a nuestra tienda oficial para completar tu compra con total seguridad, métodos de pago flexibles y protección al comprador.</p>
        </div>
      </div>

    </div>
  </section>
</template>
