<script setup lang="ts">
import { ref, computed } from 'vue';

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

/** Ruta a la ficha de detalle del producto. Se codifica el id porque puede contener espacios. */
const productHref = (product: Product) => `/productos/${encodeURIComponent(product.id)}`;
</script>


<template>
  <section class="section-padding bg-white">
    <div class="container-custom">

      <!-- Filtros de categoría -->
      <div class="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          @click="activeCategory = 'Todos'"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-all', activeCategory === 'Todos' ? 'bg-brand-500 text-white shadow-md' : 'bg-deep-100 text-deep-600 hover:bg-deep-200']"
        >Todos</button>
        <button
          type="button"
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
          <!-- Imagen (enlaza a la ficha de producto) -->
          <a :href="productHref(product)" class="h-52 overflow-hidden relative flex-shrink-0 bg-deep-100 block">
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
          </a>

          <!-- Contenido -->
          <div class="p-5 flex flex-col flex-1">
            <span class="text-xs text-brand-600 font-medium uppercase tracking-wide">{{ product.category }}</span>
            <a :href="productHref(product)" class="mt-1">
              <h3 class="font-heading font-semibold text-deep-800 leading-snug group-hover:text-brand-600 transition-colors">{{ product.name }}</h3>
            </a>
            <p class="mt-2 text-deep-500 text-sm leading-relaxed line-clamp-3 flex-1">{{ product.description }}</p>

            <a
              :href="productHref(product)"
              class="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-brand-600 border-2 border-brand-500 transition-all duration-200 hover:bg-brand-500 hover:text-white active:scale-95"
            >
              Ver producto
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Aviso informativo -->
      <div class="mt-14 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #25D366;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        </div>
        <div>
          <p class="font-semibold text-deep-800 text-sm">Conoce el producto y solicítalo por WhatsApp</p>
          <p class="text-deep-500 text-sm mt-1">Da clic en "Ver producto" para revisar todos los detalles; ahí podrás solicitarlo directamente por WhatsApp con nuestro equipo.</p>
        </div>
      </div>


    </div>
  </section>
</template>
