import type { Dosha } from './questions';

export interface DoshaProfile {
  dosha: Dosha;
  title: string;
  element: string;
  tagline: string;
  description: string;
  recommendations: string[];
  color: string;
}

/**
 * Perfiles de resultado del Test de Dosha.
 * Se reutilizan tanto en la página de resultado (Vue) como en el
 * correo de notificación comercial y en el correo de estado dosha
 * para el administrador.
 */
export const doshaProfiles: Record<Dosha, DoshaProfile> = {
  Vata: {
    dosha: 'Vata',
    title: 'Vata',
    element: 'Aire y Éter',
    tagline: 'Creatividad en movimiento',
    description:
      'Tu energía dominante es Vata: aire y espacio en constante movimiento. Eres creativo/a, entusiasta y rápido/a para aprender, aunque cuando te desequilibras puede aparecer ansiedad, insomnio o dificultad para sostener rutinas. Tu bienestar florece con calidez, constancia y calma.',
    recommendations: [
      'Mantén horarios regulares de sueño y comidas.',
      'Prioriza alimentos cálidos, cocidos y nutritivos.',
      'Incorpora rutinas suaves de relajación (meditación, respiración, automasaje con aceite tibio).',
      'Evita el exceso de estimulantes, viajes y cambios abruptos.',
    ],
    color: '#9B6EFF',
  },
  Pitta: {
    dosha: 'Pitta',
    title: 'Pitta',
    element: 'Fuego y Agua',
    tagline: 'Foco, pasión y determinación',
    description:
      'Tu energía dominante es Pitta: fuego transformador. Eres decidido/a, apasionado/a y con gran capacidad de liderazgo, pero cuando te desequilibras puede aparecer irritabilidad, inflamación o exceso de autoexigencia. Tu bienestar florece con frescura, moderación y soltura.',
    recommendations: [
      'Evita el exceso de picante, frituras y comidas muy calientes.',
      'Reserva espacios de descanso y ocio sin agenda ni exigencias.',
      'Practica actividades que enfríen la mente: contacto con la naturaleza, natación, luna llena.',
      'Cultiva la paciencia y evita la sobrecarga de trabajo y competencia constante.',
    ],
    color: '#D4A017',
  },
  Kapha: {
    dosha: 'Kapha',
    title: 'Kapha',
    element: 'Tierra y Agua',
    tagline: 'Estabilidad y calma profunda',
    description:
      'Tu energía dominante es Kapha: tierra y agua que sostienen. Eres tranquilo/a, leal y con gran capacidad de resistencia física y emocional, pero cuando te desequilibras puede aparecer letargo, apego o dificultad para soltar el pasado. Tu bienestar florece con movimiento, estímulo y ligereza.',
    recommendations: [
      'Incorpora ejercicio vigoroso y variado de forma regular.',
      'Prioriza alimentos ligeros, tibios y especiados; evita el exceso de lácteos y azúcares.',
      'Evita las siestas largas y la rutina excesiva; busca nuevos estímulos.',
      'Cultiva el hábito de soltar: personas, objetos y emociones que ya no te sirven.',
    ],
    color: '#3A7D44',
  },
};

/** Texto corto usado en el asunto de correos y en badges de UI. */
export const doshaShortLabel = (dosha: Dosha): string => doshaProfiles[dosha].title;
