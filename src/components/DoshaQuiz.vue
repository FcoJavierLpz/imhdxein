<script setup lang="ts">
import { actions, isInputError } from 'astro:actions';
import { computed, onMounted, ref } from 'vue';
import { doshaProfiles } from '../lib/dosha/doshaProfiles';
import type { Dosha } from '../lib/dosha/questions';
import { doshaQuestions } from '../lib/dosha/questions';
import { emailSchema } from '../lib/validation/shared';

type Step = 'intro' | 'quiz' | 'email-gate' | 'result';


const step = ref<Step>('intro');
const currentIndex = ref(0);
const answers = ref<Record<string, Dosha>>({});
const fullName = ref('');
const email = ref('');
const loading = ref(false);
const errorMessage = ref('');

// Honeypot anti-spam: campo oculto que solo un bot llenaría.
// Si llega con contenido, el servidor descarta la solicitud silenciosamente.
const honeypot = ref('');

// Referencias ocultas capturadas desde la URL (Escenarios 1 y 3).
const appointmentId = ref<string | null>(null);
const contactMessageId = ref<string | null>(null);

const resultDosha = ref<Dosha | null>(null);
const resultSecondary = ref<Dosha | null>(null);

const totalQuestions = doshaQuestions.length;
const currentQuestion = computed(() => doshaQuestions[currentIndex.value]);
const progressPercent = computed(() => Math.round(((currentIndex.value) / totalQuestions) * 100));
const isLastQuestion = computed(() => currentIndex.value === totalQuestions - 1);
const canGoNext = computed(() => !!currentQuestion.value && !!answers.value[currentQuestion.value.id]);

const validateEmail = (value: string) => emailSchema.safeParse(value).success;

// Mejora UX (Escenarios 1 y 3): si el usuario ya viene identificado desde
// una cita agendada o un mensaje de Consulta General (appointmentId /
// contactMessageId presentes en la URL) y trae un correo prellenado válido,
// nos saltamos el "Email Gate" para no pedirle datos que ya tenemos.
// Si el email prellenado no es válido (o no vino), se cae de vuelta al
// Email Gate manual como red de seguridad.
const canSkipEmailGate = computed(
  () => (!!appointmentId.value || !!contactMessageId.value) && validateEmail(email.value)
);

// Misma señal que `hasLinkedRequest` en src/actions/dosha.ts: diferencia
// Escenarios 1 y 3 (cita agendada o mensaje de Consulta General ya
// enviado) del Escenario 2 (lead frío desde el menú). Mantener el nombre
// sincronizado con el backend si cambia allá.
const hasLinkedRequest = computed(
  () => !!appointmentId.value || !!contactMessageId.value
);

// Stub mínimo: no hay proveedor de analítica (gtag/plausible/dataLayer)
// instalado en el repo todavía. Deja el punto de enganche listo — cuando
// se decida el proveedor, reemplazar el console.info por el evento real.
const trackResultVariant = (variant: 'linked' | 'cold') => {
  console.info('[dosha:result-cta]', { variant });
};


onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  appointmentId.value = params.get('appointmentId');
  contactMessageId.value = params.get('contactId');

  const prefilledEmail = params.get('email');
  if (prefilledEmail) email.value = prefilledEmail;

  const prefilledName = params.get('name');
  if (prefilledName) fullName.value = prefilledName;
});

const startQuiz = () => {
  step.value = 'quiz';
  currentIndex.value = 0;
};

const selectAnswer = (dosha: Dosha) => {
  if (!currentQuestion.value) return;
  answers.value = { ...answers.value, [currentQuestion.value.id]: dosha };
};

const goNext = async () => {
  if (!canGoNext.value) return;
  if (isLastQuestion.value) {
    if (canSkipEmailGate.value) {
      // Escenarios 1 y 3: el usuario ya viene identificado, se guarda el
      // resultado directamente sin pedirle de nuevo sus datos.
      await submitQuiz();
    } else {
      step.value = 'email-gate' as Step;
    }
    return;
  }
  currentIndex.value += 1;
};

const goBack = () => {
  if (currentIndex.value === 0) {
    step.value = 'intro';
    return;
  }
  currentIndex.value -= 1;
};

const submitQuiz = async () => {

  errorMessage.value = '';

  if (!validateEmail(email.value)) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido.';
    return;
  }

  loading.value = true;

  const { data, error } = await actions.dosha.submit({
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    answers: answers.value,
    appointmentId: appointmentId.value ?? undefined,
    contactMessageId: contactMessageId.value ?? undefined,
    website: honeypot.value,
  });

  loading.value = false;

  if (data?.success) {
    resultDosha.value = data.resultadoPrincipal;
    resultSecondary.value = data.resultadoSecundario ?? null;
    step.value = 'result';
    trackResultVariant(hasLinkedRequest.value ? 'linked' : 'cold');
    return;
  }

  // Si el envío falla (ya sea disparado manualmente desde el Email Gate o
  // automáticamente desde `goNext` al saltar el gate), nunca dejamos al
  // usuario "colgado" en la pantalla del quiz: se muestra el Email Gate
  // con el error, permitiéndole reintentar sin perder sus respuestas.
  if (error && isInputError(error)) {
    const firstFieldError = Object.values(error.fields).flat()[0];
    errorMessage.value = firstFieldError ?? 'Revisa los datos ingresados e intenta de nuevo.';
    step.value = 'email-gate';
    return;
  }

  errorMessage.value = 'No pudimos guardar tu resultado. Por favor intenta de nuevo.';
  step.value = 'email-gate';
};


const resultProfile = computed(() => (resultDosha.value ? doshaProfiles[resultDosha.value] : null));
const secondaryProfile = computed(() =>
  resultSecondary.value ? doshaProfiles[resultSecondary.value] : null
);

const restart = () => {
  step.value = 'intro';
  currentIndex.value = 0;
  answers.value = {};
  resultDosha.value = null;
  resultSecondary.value = null;
  errorMessage.value = '';
  // appointmentId/contactMessageId NO se resetean a propósito: el origen
  // (cita o mensaje previo) no cambia por repetir el test y debe seguir
  // determinando el CTA final y las notificaciones del servidor.
};
</script>

<template>
  <section class="section-padding bg-white">
    <div class="container-custom max-w-3xl">
      <!-- INTRO -->
      <div v-if="step === 'intro'" class="text-center animate-fade-in">
        <span class="text-brand-500 text-sm font-semibold tracking-wider uppercase">Antes de comenzar</span>
        <h2 class="mt-3 text-3xl md:text-4xl font-heading font-bold text-deep-900">
          Tres energías, una sola tú
        </h2>
        <p class="mt-5 text-deep-500 leading-relaxed max-w-xl mx-auto">
          La Ayurveda reconoce tres energías vitales —Vata, Pitta y Kapha— que conviven en ti en
          proporciones únicas. Conócelas antes de responder tus {{ totalQuestions }} preguntas.
        </p>

        <div class="mt-10 grid sm:grid-cols-3 gap-6 text-left">
          <div class="philosophy-card group">
            <div class="philosophy-card__icon philosophy-card__icon--spirit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>
            </div>
            <p class="font-heading font-bold text-lg text-deep-900">Vata</p>
            <p class="text-spirit-600 text-xs font-semibold uppercase tracking-wide mt-0.5">Aire y Éter</p>
            <p class="mt-3 text-deep-500 text-sm leading-relaxed">{{ doshaProfiles.Vata.tagline }}</p>
          </div>
          <div class="philosophy-card group">
            <div class="philosophy-card__icon philosophy-card__icon--brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </div>
            <p class="font-heading font-bold text-lg text-deep-900">Pitta</p>
            <p class="text-brand-600 text-xs font-semibold uppercase tracking-wide mt-0.5">Fuego y Agua</p>
            <p class="mt-3 text-deep-500 text-sm leading-relaxed">{{ doshaProfiles.Pitta.tagline }}</p>
          </div>
          <div class="philosophy-card group">
            <div class="philosophy-card__icon philosophy-card__icon--sage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <p class="font-heading font-bold text-lg text-deep-900">Kapha</p>
            <p class="text-sage-600 text-xs font-semibold uppercase tracking-wide mt-0.5">Tierra y Agua</p>
            <p class="mt-3 text-deep-500 text-sm leading-relaxed">{{ doshaProfiles.Kapha.tagline }}</p>
          </div>
        </div>

        <button
          type="button"
          class="btn-primary mt-12 inline-flex items-center gap-2 px-8 py-4 text-lg"
          @click="startQuiz"
        >
          Comenzar el Test
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>

        <div class="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-deep-400 text-xs">
          <span class="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            5 minutos
          </span>
          <span class="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            100% confidencial
          </span>
          <span class="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            Resultado personalizado
          </span>
        </div>
      </div>

      <!-- QUIZ -->
      <div v-else-if="step === 'quiz'" class="animate-fade-in">
        <div class="mb-8">
          <div class="flex justify-between items-center text-xs text-deep-400 mb-2">
            <span>Pregunta {{ currentIndex + 1 }} de {{ totalQuestions }}</span>
            <span>{{ progressPercent }}%</span>
          </div>
          <div class="h-2 rounded-full bg-deep-100 overflow-hidden">
            <div class="h-full chakra-gradient transition-all duration-300" :style="`width: ${progressPercent}%`"></div>
          </div>
        </div>

        <p class="text-brand-500 text-xs font-semibold tracking-wider uppercase mb-2">{{ currentQuestion?.category }}</p>
        <h2 class="text-2xl font-heading font-bold text-deep-900 mb-8">{{ currentQuestion?.question }}</h2>

        <div class="space-y-3">
          <button
            type="button"
            v-for="opt in currentQuestion?.options"
            :key="opt.dosha"
            class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200"
            :class="answers[currentQuestion!.id] === opt.dosha
              ? 'border-brand-500 bg-brand-50'
              : 'border-deep-100 hover:border-brand-200 hover:bg-deep-50'"
            @click="selectAnswer(opt.dosha)"
          >
            <span class="text-deep-700 text-sm">{{ opt.label }}</span>
          </button>
        </div>

        <div class="mt-10 flex justify-between">
          <button type="button" class="btn-outline disabled:opacity-40 disabled:cursor-not-allowed" :disabled="loading" @click="goBack">Atrás</button>
          <button
            type="button"
            class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!canGoNext || loading"
            @click="goNext"
          >
            {{ loading ? 'Calculando...' : (isLastQuestion ? 'Ver mi resultado' : 'Siguiente') }}
          </button>
        </div>

      </div>

      <!-- EMAIL GATE (antes de calcular/guardar el resultado) -->
      <div v-else-if="step === 'email-gate'" class="animate-fade-in max-w-md mx-auto text-center">
        <h2 class="text-2xl font-heading font-bold text-deep-900">¡Ya casi está listo tu resultado!</h2>
        <p class="mt-3 text-deep-500 leading-relaxed">
          Déjanos tu correo para enviarte tu perfil de Dosha y recomendaciones personalizadas.
        </p>
        <!--
          Honeypot anti-spam: campo invisible para humanos (fuera del
          viewport, sin afectar el layout) pero visible para bots que
          completan todos los inputs de un formulario automáticamente.
          Si llega con contenido, el servidor descarta la solicitud.
        -->
        <div style="position: absolute; left: -9999px; top: -9999px;" aria-hidden="true">
          <label for="dosha-website">No llenar este campo</label>
          <input
            type="text"
            id="dosha-website"
            name="website"
            tabindex="-1"
            autocomplete="off"
            v-model="honeypot"
          />
        </div>
        <div class="mt-6 space-y-4 text-left">
          <div>
            <label for="dosha-full-name" class="block text-sm font-medium text-deep-700 mb-1">Nombre (opcional)</label>
            <input id="dosha-full-name" type="text" class="input-field" v-model="fullName" placeholder="Tu nombre" />
          </div>
          <div>
            <label for="dosha-email" class="block text-sm font-medium text-deep-700 mb-1">Correo electrónico *</label>
            <input id="dosha-email" type="email" class="input-field" v-model="email" placeholder="tu@correo.com" />
          </div>
        </div>
        <div v-if="errorMessage" class="mt-4 bg-chakra-root/10 border border-chakra-root text-chakra-root px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        <button
          type="button"
          class="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="submitQuiz"
        >
          {{ loading ? 'Calculando...' : 'Ver mi resultado' }}
        </button>
      </div>

      <!-- RESULT -->
      <div v-else-if="step === 'result' && resultProfile" class="animate-fade-in text-center">
        <span class="text-brand-500 text-sm font-semibold tracking-wider uppercase">Tu resultado</span>
        <h2 class="mt-3 text-3xl md:text-4xl font-heading font-bold text-deep-900">
          Tu dosha dominante es <span :style="`color:${resultProfile.color}`">{{ resultProfile.title }}</span>
        </h2>
        <p class="mt-2 text-deep-400 text-sm">{{ resultProfile.element }} — {{ resultProfile.tagline }}</p>

        <p class="mt-6 text-deep-600 leading-relaxed text-left max-w-xl mx-auto">{{ resultProfile.description }}</p>

        <div class="mt-8 text-left max-w-xl mx-auto bg-deep-50 rounded-2xl p-6">
          <h3 class="font-heading font-semibold text-deep-800 mb-3">Recomendaciones para tu equilibrio</h3>
          <ul class="space-y-2">
            <li v-for="(rec, i) in resultProfile.recommendations" :key="i" class="flex gap-2 text-sm text-deep-600">
              <span class="text-brand-500 mt-0.5">•</span>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>

        <p v-if="secondaryProfile" class="mt-6 text-deep-400 text-sm">
          También muestras una influencia secundaria de <strong :style="`color:${secondaryProfile.color}`">{{ secondaryProfile.title }}</strong>.
        </p>

        <div
          class="mt-10 rounded-2xl p-8"
          :class="hasLinkedRequest ? 'bg-gradient-to-br from-sage-50 to-deep-50' : 'bg-gradient-to-br from-brand-50 to-spirit-50'"
        >
          <template v-if="!hasLinkedRequest">
            <h3 class="text-xl font-heading font-bold text-deep-900">¿Quieres profundizar en tu equilibrio?</h3>
            <p class="mt-2 text-deep-500 text-sm max-w-md mx-auto">
              Un especialista puede ayudarte a diseñar un plan personalizado a partir de tu constitución Ayurvédica.
            </p>
            <a href="/contacto" class="btn-primary inline-flex items-center gap-2 mt-6">
              Agendar una consulta
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </template>
          <template v-else>
            <h3 class="text-xl font-heading font-bold text-deep-900">Tus respuestas potencian tu atención</h3>
            <p class="mt-2 text-deep-500 text-sm max-w-md mx-auto">
              Este test ayudará a evaluar mejor tu situación de terapia y dar una atención más personalizada a tus requerimientos y necesidades. Tu especialista las revisará antes de la sesión.
            </p>
            <a href="/" class="btn-primary inline-flex items-center gap-2 mt-6">
              Finalizar y volver al inicio
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            </a>
          </template>
        </div>

        <button type="button" class="btn-outline mt-8" @click="restart">Volver a hacer el test</button>
      </div>
    </div>
  </section>
</template>
