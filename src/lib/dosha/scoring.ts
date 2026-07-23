import { type Dosha, doshaQuestions } from './questions';

/**
 * Respuestas del usuario: mapa `questionId -> dosha elegido`.
 */
export type DoshaAnswers = Record<string, Dosha>;

export interface DoshaScoreResult {
  scores: Record<Dosha, number>;
  /** Dosha con mayor puntaje. En caso de empate se usa el orden Vata > Pitta > Kapha. */
  dominant: Dosha;
  /** Segundo dosha más puntuado, útil para describir constituciones duales (ej. Vata-Pitta). */
  secondary: Dosha | null;
  totalAnswered: number;
}

const DOSHA_PRIORITY: Dosha[] = ['Vata', 'Pitta', 'Kapha'];

/**
 * Algoritmo de cálculo del Test de Dosha:
 * 1. Cada pregunta contestada suma +1 al dosha de la opción elegida.
 * 2. El dosha con más puntos es el "resultado_principal".
 * 3. Si hay empate entre dos o tres doshas, se prioriza Vata > Pitta > Kapha
 *    (orden convencional usado en la mayoría de los test ayurvédicos).
 * 4. Se calcula también un dosha "secundario" (el segundo con más puntos)
 *    para poder comunicar constituciones combinadas (ej. Vata-Pitta),
 *    aunque `resultado_principal` en la base de datos siempre es un único dosha.
 */
export const calculateDoshaResult = (answers: DoshaAnswers): DoshaScoreResult => {
  const scores: Record<Dosha, number> = { Vata: 0, Pitta: 0, Kapha: 0 };

  for (const question of doshaQuestions) {
    const chosen = answers[question.id];
    if (chosen) {
      scores[chosen] += 1;
    }
  }

  const totalAnswered = Object.values(scores).reduce((sum, n) => sum + n, 0);

  const ranked = [...DOSHA_PRIORITY].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return DOSHA_PRIORITY.indexOf(a) - DOSHA_PRIORITY.indexOf(b);
  });

  const dominant = ranked[0] ?? 'Vata';
  const secondary = ranked[1] && scores[ranked[1]] > 0 ? ranked[1] : null;

  return { scores, dominant, secondary, totalAnswered };
};

/**
 * Valida que las respuestas cubran todas las preguntas del cuestionario
 * y que cada valor corresponda a un dosha válido.
 */
export const isCompleteAnswerSet = (answers: DoshaAnswers): boolean =>
  doshaQuestions.every((q) => {
    const value = answers[q.id];
    return value === 'Vata' || value === 'Pitta' || value === 'Kapha';
  });
