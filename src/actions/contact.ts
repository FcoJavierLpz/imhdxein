import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import {
  buildContactConfirmationHtml,
  buildContactConfirmationSubject,
  buildContactConfirmationText,
} from '../lib/email/contactNotification';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { contactInputSchema } from '../lib/validation/contact';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const EMAIL_FROM = 'Instituto Holístico <notificaciones@imhdxein.org.mx>';
const EMAIL_REPLY_TO = 'imhdxein@gmail.com';

const sendContactConfirmation = async (data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: buildContactConfirmationSubject(),
      html: buildContactConfirmationHtml(data),
      text: buildContactConfirmationText(data),
      replyTo: EMAIL_REPLY_TO,
    });

    if (error) {
      console.error(
        '[contact.submit] Resend rechazó el envío del correo de confirmación:',
        JSON.stringify(error, null, 2)
      );
    }
  } catch (error) {
    // El mensaje ya quedó registrado en Supabase; un fallo de correo no debe
    // impedir que el usuario reciba confirmación de éxito. Solo se loguea.
    console.error('[contact.submit] Error inesperado al enviar el correo de confirmación:', error);
  }
};

export const contact = {
  submit: defineAction({
    accept: 'json',
    input: contactInputSchema,
    handler: async (input) => {
      // Honeypot activado: se responde "éxito" simulado sin persistir nada,
      // para no revelar al bot que fue detectado.
      if (input.website) {
        return { success: true, contactMessageId: null } as const;
      }

      try {
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('contact_messages')
          .insert({
            full_name: input.fullName,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            origin: input.origin,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('[contact.submit] Error al insertar en Supabase:', insertError);
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.',
          });
        }

        await sendContactConfirmation({
          fullName: input.fullName,
          email: input.email,
          subject: input.subject,
          message: input.message,
          createdAt: new Date(),
        });

        return { success: true, contactMessageId: inserted?.id ?? null } as const;
      } catch (err) {
        console.error('[contact.submit] Error inesperado en el handler:', err);
        throw err;
      }
    },
  }),
};
