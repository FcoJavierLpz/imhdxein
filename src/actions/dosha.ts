import { ActionError, defineAction } from 'astro:actions';
import { getEntry } from 'astro:content';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { doshaQuestions } from '../lib/dosha/questions';
import { calculateDoshaResult } from '../lib/dosha/scoring';
import {
  buildDoshaLeadHtml,
  buildDoshaLeadSubject,
  buildDoshaLeadText,
} from '../lib/email/doshaNotification';
import {
  buildDoshaUpdateHtml,
  buildDoshaUpdateSubject,
  buildDoshaUpdateText,
  type DoshaUpdateSourceType,
} from '../lib/email/doshaUpdateNotification';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const doshaOptionEnum = z.enum(['Vata', 'Pitta', 'Kapha']);

// El cuerpo de respuestas es un mapa { questionId: 'Vata' | 'Pitta' | 'Kapha' }
// que debe cubrir exactamente las preguntas definidas en questions.ts.
const answersSchema = z
  .record(z.string(), doshaOptionEnum)
  .refine(
    (answers) => doshaQuestions.every((q) => answers[q.id] !== undefined),
    'Debes responder todas las preguntas del test.'
  );

const doshaInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(120, 'El nombre es demasiado largo')
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  email: z.email('Ingresa un correo electrónico válido').trim(),
  answers: answersSchema,
  // Escenario 1: viene de una cita ya agendada.
  appointmentId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  // Escenario 3: viene de un mensaje de "Consulta General".
  contactMessageId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const ADMIN_EMAIL = import.meta.env.ADMIN_NOTIFICATION_EMAIL;
const EMAIL_FROM = 'Instituto Holístico <notificaciones@imhdxein.org.mx>';

const sendLeadNotification = async (data: {
  fullName: string | null;
  email: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  createdAt: Date;
  origin: 'lead' | 'consulta_general';
}) => {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: buildDoshaLeadSubject(data),
      html: buildDoshaLeadHtml(data),
      text: buildDoshaLeadText(data),
      replyTo: data.email,
    });

    if (error) {
      console.error('[dosha.submit] Resend rechazó el envío de la notificación de lead:', error);
    }
  } catch (error) {
    // El resultado ya quedó registrado en Supabase; un fallo de correo no
    // debe impedir que el usuario reciba su resultado. Solo se loguea.
    console.error('[dosha.submit] Error inesperado al enviar la notificación de lead:', error);
  }
};

/**
 * Cierra la brecha de información descrita en la Solicitud de Requerimiento
 * Adicional: cuando el test se guarda vinculado a una solicitud previa
 * (una cita en `appointments` o un mensaje en `contact_messages`), este
 * correo avisa al administrador que ese usuario específico ya completó el
 * test — sin importar si eso ocurrió minutos u horas después del correo
 * inicial de la solicitud.
 */
const sendUpdateNotification = async (data: {
  fullName: string;
  email: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  createdAt: Date;
  sourceType: DoshaUpdateSourceType;
  sourceLabel: string;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: buildDoshaUpdateSubject(data),
      html: buildDoshaUpdateHtml(data),
      text: buildDoshaUpdateText(data),
      replyTo: data.email,
    });

    if (error) {
      console.error(
        '[dosha.submit] Resend rechazó el envío de la notificación de actualización:',
        error
      );
    }
  } catch (error) {
    // El resultado ya quedó registrado en Supabase; un fallo de correo no
    // debe impedir que el usuario reciba su resultado. Solo se loguea.
    console.error(
      '[dosha.submit] Error inesperado al enviar la notificación de actualización:',
      error
    );
  }
};

/**
 * Resuelve el nombre, correo y una etiqueta legible de la solicitud original
 * (cita o mensaje de contacto) a la que se vincula este resultado de Dosha.
 * Se usa para poblar el correo de "Actualización" con datos consistentes
 * con la solicitud inicial, en lugar de depender únicamente de lo que el
 * usuario haya vuelto a escribir en el test.
 */
const resolveLinkedRequestInfo = async (
  appointmentId: string | null,
  contactMessageId: string | null,
  fallback: { fullName: string | null; email: string }
): Promise<{
  fullName: string;
  email: string;
  sourceType: DoshaUpdateSourceType;
  sourceLabel: string;
} | null> => {
  if (appointmentId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('appointments')
        .select('full_name, email, therapy_id')
        .eq('id', appointmentId)
        .maybeSingle();

      if (error || !data) {
        console.error('[dosha.submit] Error al consultar appointments para actualización:', error);
        return null;
      }

      let therapyName: string | null = null;
      if (data.therapy_id) {
        try {
          const entry = await getEntry('therapies', data.therapy_id);
          therapyName = entry?.data.name ?? null;
        } catch {
          therapyName = null;
        }
      }

      return {
        fullName: data.full_name ?? fallback.fullName ?? fallback.email,
        email: data.email ?? fallback.email,
        sourceType: 'appointment',
        sourceLabel: therapyName ? `Terapia agendada: ${therapyName}` : 'Terapia agendada',
      };
    } catch (error) {
      console.error(
        '[dosha.submit] Error inesperado al consultar appointments para actualización:',
        error
      );
      return null;
    }
  }

  if (contactMessageId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('full_name, email, subject')
        .eq('id', contactMessageId)
        .maybeSingle();

      if (error || !data) {
        console.error(
          '[dosha.submit] Error al consultar contact_messages para actualización:',
          error
        );
        return null;
      }

      return {
        fullName: data.full_name ?? fallback.fullName ?? fallback.email,
        email: data.email ?? fallback.email,
        sourceType: 'consulta_general',
        sourceLabel: data.subject ? `Solicitud General: ${data.subject}` : 'Solicitud General',
      };
    } catch (error) {
      console.error(
        '[dosha.submit] Error inesperado al consultar contact_messages para actualización:',
        error
      );
      return null;
    }
  }

  return null;
};

export const dosha = {
  submit: defineAction({
    accept: 'json',
    input: doshaInputSchema,
    handler: async (input) => {
      const { dominant, secondary, scores } = calculateDoshaResult(input.answers);

      // Determinar el origen del test según qué referencia venga presente.
      const origin: 'appointment' | 'lead' | 'consulta_general' = input.appointmentId
        ? 'appointment'
        : input.contactMessageId
          ? 'consulta_general'
          : 'lead';

      const { error: insertError } = await supabaseAdmin.from('dosha_results').insert({
        appointment_id: input.appointmentId,
        contact_message_id: input.contactMessageId,
        email: input.email,
        full_name: input.fullName,
        respuestas_json: {
          answers: input.answers,
          scores,
          secondary,
        },
        resultado_principal: dominant,
        origen: origin,
      });

      if (insertError) {
        console.error('[dosha.submit] Error al insertar en Supabase:', insertError);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No pudimos guardar tu resultado. Por favor intenta de nuevo.',
        });
      }

      const createdAt = new Date();

      // Lógica de negocio unificada (Solicitud de Requerimiento Adicional):
      // si el resultado del test está vinculado a una solicitud previa
      // (appointment_id o contact_message_id no nulos), se notifica al
      // administrador con el correo de "Actualización" — cerrando la
      // brecha de información cuando el test se hace DESPUÉS del correo
      // inicial de la solicitud. Solo cuando NO hay ninguna solicitud
      // previa vinculada (Escenario 2: lead frío puro) se envía el correo
      // comercial original de "Lead sin cita".
      const hasLinkedRequest = Boolean(input.appointmentId || input.contactMessageId);

      if (hasLinkedRequest) {
        const linkedInfo = await resolveLinkedRequestInfo(
          input.appointmentId,
          input.contactMessageId,
          { fullName: input.fullName, email: input.email }
        );

        if (linkedInfo) {
          await sendUpdateNotification({
            fullName: linkedInfo.fullName,
            email: linkedInfo.email,
            dosha: dominant,
            createdAt,
            sourceType: linkedInfo.sourceType,
            sourceLabel: linkedInfo.sourceLabel,
          });
        }
      } else {
        // Sin solicitud previa vinculada: origin solo puede ser 'lead'
        // (nunca 'appointment', ya que eso requeriría appointmentId).
        await sendLeadNotification({
          fullName: input.fullName,
          email: input.email,
          dosha: dominant,
          createdAt,
          origin: 'lead',
        });
      }


      return {
        success: true,
        resultadoPrincipal: dominant,
        resultadoSecundario: secondary,
      } as const;
    },
  }),
};
