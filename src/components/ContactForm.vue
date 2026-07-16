<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { actions, isInputError } from 'astro:actions';


interface Therapy { id: string; name: string; durationMinutes: number; }

const props = defineProps<{ therapies: Therapy[] }>();

const activeTab = ref<'appointment' | 'contact'>('appointment');
const activeChakra = ref<number | null>(null);

const chakraDays = [
  {
    letter: 'L', day: 'Lunes', chakra: 'Chakra Raíz (Muladhara)',
    color: '#C41E3A',
    description: 'Energía de la tierra, estabilidad y fundamentos. Ideal para iniciar procesos de arraigo, trabajo con el cuerpo físico y terapias que buscan seguridad y sostén.',
  },
  {
    letter: 'M', day: 'Martes', chakra: 'Chakra Sacro (Svadhisthana)',
    color: '#E8751A',
    description: 'Energía creativa, emocional y relacional. Propicio para sesiones de liberación emocional, fertilidad, creatividad y vínculos afectivos.',
  },
  {
    letter: 'M', day: 'Miércoles', chakra: 'Chakra Solar (Manipura)',
    color: '#D4A017',
    description: 'Energía de la voluntad y el poder personal. Día para trabajar la autoestima, la digestión, el sistema nervioso y la toma de decisiones desde el centro.',
  },
  {
    letter: 'J', day: 'Jueves', chakra: 'Chakra Corazón (Anahata)',
    color: '#3A7D44',
    description: 'Energía del amor incondicional y la compasión. Óptimo para sanar duelos, relaciones, el sistema inmune y abrir el corazón a nuevas posibilidades.',
  },
  {
    letter: 'V', day: 'Viernes', chakra: 'Chakra Garganta (Vishuddha)',
    color: '#1E90C6',
    description: 'Energía de la expresión y la verdad. Indicado para trabajar la comunicación, la tiroides, la voz interior y la capacidad de decir lo que el alma necesita.',
  },
  {
    letter: 'S', day: 'Sábado', chakra: 'Chakra Corona (Sahasrara)',
    color: '#7B2D8E',
    description: 'Energía de la conciencia expandida y la conexión espiritual. El mejor día para meditaciones profundas, integración espiritual y estados de paz superior.',
  },
];

const appointmentSubmitted = ref(false);
const contactSubmitted = ref(false);
const appointmentError = ref('');
const contactError = ref('');
const appointmentLoading = ref(false);
const contactLoading = ref(false);
const appointmentForm = ref({ full_name: '', email: '', phone: '', therapy_id: '', message: '' });
const contactForm = ref({ full_name: '', email: '', phone: '', subject: '', message: '' });

// Honeypot anti-spam: campo oculto que solo un bot llenaría.
// Si llega con contenido, el servidor descarta la solicitud silenciosamente.
const appointmentHoneypot = ref('');

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^[0-9\s\-\+\(\)]{10,}$/.test(phone);


onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const therapyId = params.get('therapy');
  if (!therapyId) return;

  const therapyExists = props.therapies.some((t) => t.id === therapyId);
  if (therapyExists) {
    appointmentForm.value.therapy_id = therapyId;
    activeTab.value = 'appointment';
  }
});


const handleAppointment = async () => {
  appointmentError.value = '';
  if (!appointmentForm.value.full_name.trim() || appointmentForm.value.full_name.length < 3) { appointmentError.value = 'Por favor ingresa un nombre válido (mínimo 3 caracteres)'; return; }
  if (!validateEmail(appointmentForm.value.email)) { appointmentError.value = 'Por favor ingresa un correo electrónico válido'; return; }
  if (appointmentForm.value.phone && !validatePhone(appointmentForm.value.phone)) { appointmentError.value = 'Por favor ingresa un teléfono válido'; return; }

  appointmentLoading.value = true;

  const { data, error } = await actions.appointments.submit({
    fullName: appointmentForm.value.full_name.trim(),
    email: appointmentForm.value.email.trim(),
    phone: appointmentForm.value.phone.trim(),
    therapyId: appointmentForm.value.therapy_id || undefined,
    message: appointmentForm.value.message.trim(),
    website: appointmentHoneypot.value,
  });

  appointmentLoading.value = false;

  if (data?.success) {
    appointmentSubmitted.value = true;
    appointmentForm.value = { full_name: '', email: '', phone: '', therapy_id: '', message: '' };
    appointmentHoneypot.value = '';
    return;
  }

  if (error && isInputError(error)) {
    const firstFieldError = Object.values(error.fields).flat()[0];
    appointmentError.value = firstFieldError ?? 'Revisa los datos ingresados e intenta de nuevo.';
    return;
  }

  appointmentError.value = 'Error al enviar la solicitud. Por favor intenta de nuevo.';
};


const handleContact = async () => {
  contactError.value = '';
  if (!contactForm.value.full_name.trim() || contactForm.value.full_name.length < 3) { contactError.value = 'Por favor ingresa un nombre válido (mínimo 3 caracteres)'; return; }
  if (!validateEmail(contactForm.value.email)) { contactError.value = 'Por favor ingresa un correo electrónico válido'; return; }
  if (!contactForm.value.subject.trim() || contactForm.value.subject.length < 5) { contactError.value = 'Por favor ingresa un asunto válido (mínimo 5 caracteres)'; return; }
  if (!contactForm.value.message.trim() || contactForm.value.message.length < 10) { contactError.value = 'Por favor ingresa un mensaje válido (mínimo 10 caracteres)'; return; }

  contactLoading.value = true;

  const { data, error } = await actions.contact.submit({
    fullName: contactForm.value.full_name.trim(),
    email: contactForm.value.email.trim(),
    phone: contactForm.value.phone.trim(),
    subject: contactForm.value.subject.trim(),
    message: contactForm.value.message.trim(),
  });

  contactLoading.value = false;

  if (data?.success) {
    contactSubmitted.value = true;
    contactForm.value = { full_name: '', email: '', phone: '', subject: '', message: '' };
    return;
  }

  if (error && isInputError(error)) {
    const firstFieldError = Object.values(error.fields).flat()[0];
    contactError.value = firstFieldError ?? 'Revisa los datos ingresados e intenta de nuevo.';
    return;
  }

  contactError.value = 'Error al enviar el mensaje. Por favor intenta de nuevo.';
};

</script>

<template>
  <section class="section-padding bg-white">
    <div class="container-custom">
      <div class="grid lg:grid-cols-3 gap-12">
        <div class="lg:col-span-1">
          <h2 class="text-2xl font-heading font-bold text-deep-900 mb-6">Información</h2>
          <div class="space-y-6">
            <a href="tel:+525512345678" class="flex gap-4 group">
              <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div><p class="text-deep-400 text-xs uppercase tracking-wider font-medium">Teléfono</p><p class="text-deep-800 font-medium text-sm mt-0.5">+52 33 1842 2251</p></div>
            </a>
            <a href="mailto:imhdxein@gmail.com" class="flex gap-4 group">
              <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div><p class="text-deep-400 text-xs uppercase tracking-wider font-medium">Correo</p><p class="text-deep-800 font-medium text-sm mt-0.5">imhdxein@gmail.com</p></div>
            </a>
            <a href="#" class="flex gap-4 group">
              <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div><p class="text-deep-400 text-xs uppercase tracking-wider font-medium">Dirección</p><p class="text-deep-800 font-medium text-sm mt-0.5">Calle Buenos Aires 2910, Col. Providencia, Guadalajara Jalisco CP 66439</p></div>
            </a>
            <div class="flex gap-4 group">
              <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div><p class="text-deep-400 text-xs uppercase tracking-wider font-medium">Horario</p><p class="text-deep-800 font-medium text-sm mt-0.5">Lun - Vie: 10:00 - 13:00 hrs | Sáb: 10:00 - 13:00 hrs</p></div>
            </div>
          </div>
                    <div class="mt-10 bg-gradient-to-br from-sage-50 to-brand-50 rounded-2xl p-6">
            <h3 class="font-heading font-semibold text-deep-800 mb-1">Chakras y Días de Atención</h3>
            <p class="text-deep-500 text-sm leading-relaxed mb-4">
              En la tradición védica cada día de la semana está regido por una energía sutil distinta.
              Nuestro instituto alinea su agenda con esta sabiduría para que puedas elegir el día
              más armónico según el trabajo interior que deseas iniciar.
            </p>
            <div class="flex gap-1.5">
              <button
                v-for="(c, i) in chakraDays"
                :key="i"
                class="flex-1 flex flex-col items-center gap-1 group focus:outline-none"
                @click="activeChakra = activeChakra === i ? null : i"
              >
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-200 group-hover:scale-110 ring-2 ring-transparent"
                  :style="`background-color: ${c.color}; ${activeChakra === i ? `box-shadow: 0 0 0 3px ${c.color}40; ring-color: ${c.color}` : ''}`"
                >{{ c.letter }}</div>
                <span class="text-[9px] text-deep-400 leading-none hidden sm:block">{{ c.day.slice(0, 3) }}</span>
              </button>
            </div>
            <!-- Detail panel -->
            <Transition name="chakra-detail">
              <div
                v-if="activeChakra !== null"
                class="mt-4 rounded-xl p-4 text-sm leading-relaxed border-l-4 bg-white/60"
                :style="`border-color: ${chakraDays[activeChakra].color}`"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="w-5 h-5 rounded-full inline-block flex-shrink-0"
                    :style="`background-color: ${chakraDays[activeChakra].color}`"
                  ></span>
                  <span class="font-semibold text-deep-800">{{ chakraDays[activeChakra].day }} — {{ chakraDays[activeChakra].chakra }}</span>
                </div>
                <p class="text-deep-500">{{ chakraDays[activeChakra].description }}</p>
              </div>
            </Transition>
          </div>

        </div>

        <div class="lg:col-span-2">
          <div class="flex border-b border-deep-200 mb-8">
            <button @click="activeTab = 'appointment'" :class="['px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2', activeTab === 'appointment' ? 'border-brand-500 text-brand-600' : 'border-transparent text-deep-400 hover:text-deep-600']">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Solicitar Información
            </button>
            <button @click="activeTab = 'contact'" :class="['px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2', activeTab === 'contact' ? 'border-brand-500 text-brand-600' : 'border-transparent text-deep-400 hover:text-deep-600']">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Mensaje General
            </button>
          </div>

          <div v-if="activeTab === 'appointment'">
            <div v-if="appointmentSubmitted" class="bg-sage-50 rounded-2xl p-10 text-center animate-fade-in">
              <svg class="text-sage-500 mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m22 11-3-3"/></svg>
              <h3 class="text-2xl font-heading font-bold text-deep-900">Solicitud Enviada</h3>
              <p class="mt-3 text-deep-500">Tu solicitud ha sido enviada. Nos pondremos en contacto contigo para acordar la fecha y hora de tu cita.</p>
              <button @click="appointmentSubmitted = false" class="btn-outline mt-6">Enviar otra solicitud</button>
            </div>
            <form v-else class="space-y-5" @submit.prevent="handleAppointment">
              <!--
                Honeypot anti-spam: campo invisible para humanos (fuera del
                viewport, sin afectar el layout) pero visible para bots que
                completan todos los inputs de un formulario automáticamente.
                Si llega con contenido, el servidor descarta la solicitud.
              -->
              <div style="position: absolute; left: -9999px; top: -9999px;" aria-hidden="true">
                <label for="website">No llenar este campo</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                  v-model="appointmentHoneypot"
                />
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Nombre completo *</label><input type="text" required class="input-field" v-model="appointmentForm.full_name" placeholder="Tu nombre completo" /></div>

                <div><label class="block text-sm font-medium text-deep-700 mb-1">Correo electrónico *</label><input type="email" required class="input-field" v-model="appointmentForm.email" placeholder="tu@correo.com" /></div>
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Teléfono</label><input type="tel" class="input-field" v-model="appointmentForm.phone" placeholder="+52 33 1842 2251" /></div>
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Terapia *</label>
                  <select required class="input-field" v-model="appointmentForm.therapy_id">
                    <option value="">Selecciona una terapia</option>
                    <option v-for="t in therapies" :key="t.id" :value="t.id">{{ t.name }} ({{ t.durationMinutes }} min)</option>
                  </select>
                </div>
              </div>
              <div><label class="block text-sm font-medium text-deep-700 mb-1">Mensaje</label><textarea class="input-field" rows="4" v-model="appointmentForm.message" placeholder="Cuéntanos sobre tu situación y nos comunicaremos contigo para acordar la fecha y hora de tu cita..."></textarea></div>
              <div v-if="appointmentError" class="bg-chakra-root/10 border border-chakra-root text-chakra-root px-4 py-3 rounded-lg text-sm">{{ appointmentError }}</div>
              <button type="submit" :disabled="appointmentLoading" class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg> {{ appointmentLoading ? 'Enviando...' : 'Enviar Solicitud' }}</button>
            </form>
          </div>

          <div v-if="activeTab === 'contact'">
            <div v-if="contactSubmitted" class="bg-sage-50 rounded-2xl p-10 text-center animate-fade-in">
              <svg class="text-sage-500 mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m22 11-3-3"/></svg>
              <h3 class="text-2xl font-heading font-bold text-deep-900">Mensaje Enviado</h3>
              <p class="mt-3 text-deep-500">Te responderemos en un plazo de 24 horas.</p>
              <button @click="contactSubmitted = false" class="btn-outline mt-6">Enviar otro mensaje</button>
            </div>
            <form v-else class="space-y-5" @submit.prevent="handleContact">
              <div class="grid sm:grid-cols-2 gap-5">
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Nombre completo *</label><input type="text" required class="input-field" v-model="contactForm.full_name" placeholder="Tu nombre completo" /></div>
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Correo electrónico *</label><input type="email" required class="input-field" v-model="contactForm.email" placeholder="tu@correo.com" /></div>
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Teléfono</label><input type="tel" class="input-field" v-model="contactForm.phone" placeholder="+52 33 1842 2251" /></div>
                <div><label class="block text-sm font-medium text-deep-700 mb-1">Asunto *</label><input type="text" required class="input-field" v-model="contactForm.subject" placeholder="Asunto de tu mensaje" /></div>
              </div>
              <div><label class="block text-sm font-medium text-deep-700 mb-1">Mensaje *</label><textarea required class="input-field" rows="5" v-model="contactForm.message" placeholder="Escribe tu mensaje aquí..."></textarea></div>

              <div v-if="contactError" class="bg-chakra-root/10 border border-chakra-root text-chakra-root px-4 py-3 rounded-lg text-sm">{{ contactError }}</div>
              <button type="submit" :disabled="contactLoading" class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg> {{ contactLoading ? 'Enviando...' : 'Enviar Mensaje' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chakra-detail-enter-active,
.chakra-detail-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.chakra-detail-enter-from,
.chakra-detail-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
