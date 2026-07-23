<script setup lang="ts">
import { actions, isInputError } from 'astro:actions';
import { computed, onMounted, ref } from 'vue';
import { doshaProfiles } from '../lib/dosha/doshaProfiles';
import type { Dosha } from '../lib/dosha/questions';
import { doshaQuestions } from '../lib/dosha/questions';

type Step = 'intro' | 'quiz' | 'email-gate' | 'result';


const step = ref<Step>('intro');
const currentIndex = ref(0);
const answers = ref<Record<string, Dosha>>({});
const fullName = ref('');
const email = ref('');
const loading = ref(false);
const errorMessage = ref('');

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

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Mejora UX (Escenarios 1 y 3): si el usuario ya viene identificado desde
// una cita agendada o un mensaje de Consulta General (appointmentId /
// contactMessageId presentes en la URL) y trae un correo prellenado válido,
// nos saltamos el "Email Gate" para no pedirle datos que ya tenemos.
// Si el email prellenado no es válido (o no vino), se cae de vuelta al
// Email Gate manual como red de seguridad.
const canSkipEmailGate = computed(
  () => (!!appointmentId.value || !!contactMessageId.value) && validateEmail(email.value)
);


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
  });

  loading.value = false;

  if (data?.success) {
    resultDosha.value = data.resultadoPrincipal;
    resultSecondary.value = data.resultadoSecundario ?? null;
    step.value = 'result';
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
};
</script>

<template>
  <section class="section-padding bg-white">
    <div class="container-custom max-w-3xl">
      <!-- INTRO -->
      <div v-if="step === 'intro'" class="text-center animate-fade-in">
        <span class="text-brand-500 text-sm font-semibold tracking-wider uppercase">Test Gratuito</span>
        <h1 class="mt-3 text-3xl md:text-4xl font-heading font-bold text-deep-900">
          Descubre tu <span class="chakra-gradient-text">Dosha</span>
        </h1>
        <p class="mt-5 text-deep-500 leading-relaxed max-w-xl mx-auto">
          En la Ayurveda, cada persona tiene una constitución única formada por tres energías:
          Vata, Pitta y Kapha. Responde estas {{ totalQuestions }} preguntas para descubrir tu
          dosha dominante y recibir recomendaciones personalizadas para tu bienestar.
        </p>
        <div class="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
          <div class="rounded-xl bg-spirit-50 p-4">
            <p class="font-heading font-semibold text-spirit-600">Vata</p>
            <p class="text-deep-400 text-xs mt-1">Aire y Éter</p>
          </div>
          <div class="rounded-xl bg-brand-50 p-4">
            <p class="font-heading font-semibold text-brand-600">Pitta</p>
            <p class="text-deep-400 text-xs mt-1">Fuego y Agua</p>
          </div>
          <div class="rounded-xl bg-sage-50 p-4">
            <p class="font-heading font-semibold text-sage-600">Kapha</p>
            <p class="text-deep-400 text-xs mt-1">Tierra y Agua</p>
          </div>
        </div>
        <button class="btn-primary mt-10" @click="startQuiz">Comenzar el Test</button>
        <p class="mt-4 text-deep-400 text-xs">Toma menos de 5 minutos. 100% gratuito y confidencial.</p>
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
          <button class="btn-outline disabled:opacity-40 disabled:cursor-not-allowed" :disabled="loading" @click="goBack">Atrás</button>
          <button
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
        <div class="mt-6 space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-deep-700 mb-1">Nombre (opcional)</label>
            <input type="text" class="input-field" v-model="fullName" placeholder="Tu nombre" />
          </div>
          <div>
            <label class="block text-sm font-medium text-deep-700 mb-1">Correo electrónico *</label>
            <input type="email" class="input-field" v-model="email" placeholder="tu@correo.com" />
          </div>
        </div>
        <div v-if="errorMessage" class="mt-4 bg-chakra-root/10 border border-chakra-root text-chakra-root px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        <button
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

        <div class="mt-10 bg-gradient-to-br from-brand-50 to-spirit-50 rounded-2xl p-8">
          <h3 class="text-xl font-heading font-bold text-deep-900">¿Quieres profundizar en tu equilibrio?</h3>
          <p class="mt-2 text-deep-500 text-sm max-w-md mx-auto">
            Un especialista puede ayudarte a diseñar un plan personalizado a partir de tu constitución Ayurvédica.
          </p>
          <a href="/contacto" class="btn-primary inline-flex items-center gap-2 mt-6">
            Agendar una consulta
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <button class="btn-outline mt-8" @click="restart">Volver a hacer el test</button>
      </div>
    </div>
  </section>
</template>
