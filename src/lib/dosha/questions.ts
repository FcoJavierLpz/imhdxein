/**
 * Guion del Test de Dosha.
 *
 * 18 preguntas de opción múltiple (Vata / Pitta / Kapha) que exploran
 * constitución física, hábitos, digestión, sueño, temperamento y manejo
 * del estrés — los ejes clásicos usados en la valoración ayurvédica de
 * Prakriti (constitución natural).
 *
 * Cada pregunta tiene exactamente 3 opciones, una por dosha, en el mismo
 * orden (Vata, Pitta, Kapha) para simplificar el render en el componente.
 */

export type Dosha = 'Vata' | 'Pitta' | 'Kapha';

export interface DoshaQuestionOption {
  dosha: Dosha;
  label: string;
}

export interface DoshaQuestion {
  id: string;
  category: string;
  question: string;
  options: DoshaQuestionOption[];
}

export const doshaQuestions: DoshaQuestion[] = [
  {
    id: 'complexion',
    category: 'Cuerpo',
    question: '¿Cómo describirías tu contextura corporal?',
    options: [
      { dosha: 'Vata', label: 'Delgada, ligera, me cuesta subir de peso' },
      { dosha: 'Pitta', label: 'Mediana, atlética, musculatura definida' },
      { dosha: 'Kapha', label: 'Robusta, sólida, subo de peso con facilidad' },
    ],
  },
  {
    id: 'skin',
    category: 'Cuerpo',
    question: '¿Cómo es tu piel habitualmente?',
    options: [
      { dosha: 'Vata', label: 'Seca, áspera o fría al tacto' },
      { dosha: 'Pitta', label: 'Cálida, rojiza, sensible o con tendencia a irritarse' },
      { dosha: 'Kapha', label: 'Gruesa, suave, húmeda y untuosa' },
    ],
  },
  {
    id: 'hair',
    category: 'Cuerpo',
    question: '¿Cómo es tu cabello?',
    options: [
      { dosha: 'Vata', label: 'Seco, delgado, encrespado o con caspa' },
      { dosha: 'Pitta', label: 'Fino, con canas o calvicie temprana' },
      { dosha: 'Kapha', label: 'Grueso, ondulado, abundante y brillante' },
    ],
  },
  {
    id: 'appetite',
    category: 'Digestión',
    question: '¿Cómo es tu apetito la mayor parte del tiempo?',
    options: [
      { dosha: 'Vata', label: 'Variable e irregular, a veces se me olvida comer' },
      { dosha: 'Pitta', label: 'Fuerte y constante, me irrito si me salto una comida' },
      { dosha: 'Kapha', label: 'Bajo y estable, puedo pasar horas sin hambre' },
    ],
  },
  {
    id: 'digestion',
    category: 'Digestión',
    question: '¿Cómo es tu digestión en general?',
    options: [
      { dosha: 'Vata', label: 'Irregular, con gases o hinchazón frecuente' },
      { dosha: 'Pitta', label: 'Rápida y eficiente, a veces con acidez' },
      { dosha: 'Kapha', label: 'Lenta y pesada después de comer' },
    ],
  },
  {
    id: 'weight',
    category: 'Digestión',
    question: '¿Cómo se comporta tu peso corporal?',
    options: [
      { dosha: 'Vata', label: 'Me cuesta trabajo ganar peso' },
      { dosha: 'Pitta', label: 'Se mantiene estable con facilidad' },
      { dosha: 'Kapha', label: 'Subo de peso con facilidad y me cuesta bajarlo' },
    ],
  },
  {
    id: 'sleep',
    category: 'Sueño y energía',
    question: '¿Cómo describirías tu sueño?',
    options: [
      { dosha: 'Vata', label: 'Ligero, interrumpido, me despierto varias veces' },
      { dosha: 'Pitta', label: 'Moderado y reparador, duermo pocas horas pero bien' },
      { dosha: 'Kapha', label: 'Profundo y prolongado, me cuesta despertar' },
    ],
  },
  {
    id: 'energy',
    category: 'Sueño y energía',
    question: '¿Cómo es tu nivel de energía durante el día?',
    options: [
      { dosha: 'Vata', label: 'En ráfagas, con altibajos de energía' },
      { dosha: 'Pitta', label: 'Intenso y constante, con buena resistencia' },
      { dosha: 'Kapha', label: 'Estable pero de arranque lento por las mañanas' },
    ],
  },
  {
    id: 'climate',
    category: 'Sueño y energía',
    question: '¿Qué clima prefieres o toleras mejor?',
    options: [
      { dosha: 'Vata', label: 'Prefiero el calor, me afecta el frío y el viento' },
      { dosha: 'Pitta', label: 'Prefiero el frío, el calor me resulta incómodo' },
      { dosha: 'Kapha', label: 'Prefiero climas cálidos y secos, me afecta la humedad' },
    ],
  },
  {
    id: 'temperament',
    category: 'Mente y emociones',
    question: '¿Cómo describirías tu temperamento habitual?',
    options: [
      { dosha: 'Vata', label: 'Entusiasta, creativo, a veces ansioso' },
      { dosha: 'Pitta', label: 'Decidido, apasionado, a veces irritable' },
      { dosha: 'Kapha', label: 'Tranquilo, paciente, a veces me cuesta motivarme' },
    ],
  },
  {
    id: 'stress',
    category: 'Mente y emociones',
    question: 'Ante el estrés, ¿cómo reaccionas con más frecuencia?',
    options: [
      { dosha: 'Vata', label: 'Con ansiedad, preocupación o inquietud mental' },
      { dosha: 'Pitta', label: 'Con enojo, frustración o irritabilidad' },
      { dosha: 'Kapha', label: 'Con desánimo, apatía o deseo de aislarme' },
    ],
  },
  {
    id: 'memory',
    category: 'Mente y emociones',
    question: '¿Cómo es tu memoria?',
    options: [
      { dosha: 'Vata', label: 'Aprendo rápido pero olvido con la misma rapidez' },
      { dosha: 'Pitta', label: 'Aguda y precisa, buena memoria a mediano plazo' },
      { dosha: 'Kapha', label: 'Aprendo despacio pero retengo por mucho tiempo' },
    ],
  },
  {
    id: 'decision',
    category: 'Mente y emociones',
    question: '¿Cómo tomas decisiones habitualmente?',
    options: [
      { dosha: 'Vata', label: 'Cambio de opinión con facilidad, indeciso/a' },
      { dosha: 'Pitta', label: 'Rápido y con determinación' },
      { dosha: 'Kapha', label: 'Despacio, tras reflexionarlo con calma' },
    ],
  },
  {
    id: 'speech',
    category: 'Estilo de vida',
    question: '¿Cómo es tu forma de hablar?',
    options: [
      { dosha: 'Vata', label: 'Rápida, hablo mucho y salto de tema' },
      { dosha: 'Pitta', label: 'Clara, directa y persuasiva' },
      { dosha: 'Kapha', label: 'Pausada, suave y constante' },
    ],
  },
  {
    id: 'movement',
    category: 'Estilo de vida',
    question: '¿Cómo describirías tu forma de moverte?',
    options: [
      { dosha: 'Vata', label: 'Rápida, inquieta, siempre en movimiento' },
      { dosha: 'Pitta', label: 'Firme, decidida, con buena coordinación' },
      { dosha: 'Kapha', label: 'Lenta, relajada y constante' },
    ],
  },
  {
    id: 'routine',
    category: 'Estilo de vida',
    question: '¿Cómo te llevas con las rutinas y los horarios?',
    options: [
      { dosha: 'Vata', label: 'Me cuesta seguir rutinas fijas, prefiero variar' },
      { dosha: 'Pitta', label: 'Me organizo bien y cumplo lo planeado' },
      { dosha: 'Kapha', label: 'Prefiero rutinas estables, me cuesta el cambio' },
    ],
  },
  {
    id: 'immunity',
    category: 'Estilo de vida',
    question: '¿Cómo es tu sistema inmunológico?',
    options: [
      { dosha: 'Vata', label: 'Variable, me enfermo cuando estoy muy estresado/a' },
      { dosha: 'Pitta', label: 'Bueno, aunque sensible a inflamaciones o infecciones' },
      { dosha: 'Kapha', label: 'Fuerte y resistente, rara vez me enfermo' },
    ],
  },
  {
    id: 'goal',
    category: 'Estilo de vida',
    question: 'Cuando buscas equilibrio, ¿qué es lo que más necesitas?',
    options: [
      { dosha: 'Vata', label: 'Estabilidad, calma y una rutina que me sostenga' },
      { dosha: 'Pitta', label: 'Frescura, moderación y soltar el control' },
      { dosha: 'Kapha', label: 'Estímulo, movimiento y motivación para activarme' },
    ],
  },
];
