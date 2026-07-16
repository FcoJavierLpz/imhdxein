/**
 * Plantilla de notificación por correo para nuevas solicitudes de cita.
 * Sigue la línea de diseño del sitio (dorado #D4A017 / tonos "deep").
 */

export interface AppointmentNotificationData {
  fullName: string;
  email: string;
  phone: string | null;
  therapyName: string | null;
  message: string | null;
  createdAt: Date;
}

const BRAND_GOLD = '#D4A017';
const DEEP_900 = '#1f2937';
const DEEP_500 = '#6b7280';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Mexico_City',
  }).format(date);

const renderInfoRow = (label: string, value: string): string => `
  <tr>
    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2; width: 140px; vertical-align: top;">
      <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: ${DEEP_500};">
        ${label}
      </span>
    </td>
    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2; vertical-align: top;">
      <span style="font-size: 14px; color: ${DEEP_900}; font-weight: 500;">${value}</span>
    </td>
  </tr>
`;

export const buildAppointmentSubject = (data: AppointmentNotificationData): string =>
  `Nueva solicitud de cita — ${data.fullName}`;

export const buildAppointmentHtml = (data: AppointmentNotificationData): string => {
  const rows = [
    renderInfoRow('Nombre', escapeHtml(data.fullName)),
    renderInfoRow(
      'Correo',
      `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND_GOLD}; text-decoration:none;">${escapeHtml(data.email)}</a>`
    ),
    data.phone
      ? renderInfoRow(
          'Teléfono',
          `<a href="tel:${escapeHtml(data.phone)}" style="color:${BRAND_GOLD}; text-decoration:none;">${escapeHtml(data.phone)}</a>`
        )
      : '',
    data.therapyName ? renderInfoRow('Terapia', escapeHtml(data.therapyName)) : '',
    renderInfoRow('Recibido', formatDate(data.createdAt)),
  ].join('');

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${buildAppointmentSubject(data)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#faf7f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f0; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(31, 41, 55, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, ${BRAND_GOLD}, #b8860b); padding: 28px 32px;">
                <p style="margin:0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.85); font-weight: 600;">
                  IMHDXEIN
                </p>
                <h1 style="margin: 6px 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">
                  Nueva solicitud de cita
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px;">
                <p style="margin: 0 0 20px; font-size: 14px; color: ${DEEP_500}; line-height: 1.6;">
                  Se ha recibido una nueva solicitud de información/cita a través del sitio web. Estos son los detalles:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
                ${
                  data.message
                    ? `
                <div style="margin-top: 20px;">
                  <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: ${DEEP_500};">Mensaje</span>
                  <p style="margin: 8px 0 0; padding: 14px 16px; background-color:#faf7f0; border-radius: 10px; font-size: 14px; color: ${DEEP_900}; line-height: 1.6; white-space: pre-line;">${escapeHtml(data.message)}</p>
                </div>`
                    : ''
                }
                <div style="margin-top: 28px; text-align: center;">
                  <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block; background-color: ${BRAND_GOLD}; color:#ffffff; text-decoration:none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 999px;">
                    Responder a ${escapeHtml(data.fullName.split(' ')[0] ?? '')}
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 32px; background-color:#faf7f0; text-align:center;">
                <p style="margin:0; font-size: 11px; color: ${DEEP_500};">
                  Este correo fue generado automáticamente por el formulario de contacto de imhdxein.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const buildAppointmentText = (data: AppointmentNotificationData): string => {
  const lines = [
    'Nueva solicitud de cita',
    '',
    `Nombre: ${data.fullName}`,
    `Correo: ${data.email}`,
    data.phone ? `Teléfono: ${data.phone}` : null,
    data.therapyName ? `Terapia: ${data.therapyName}` : null,
    `Recibido: ${formatDate(data.createdAt)}`,
    data.message ? `\nMensaje:\n${data.message}` : null,
  ].filter(Boolean);

  return lines.join('\n');
};

/**
 * Copia de cortesía enviada al paciente confirmando la recepción de su solicitud.
 */
export const buildPatientConfirmationSubject = (): string =>
  `Hemos recibido tu solicitud — Instituto Holístico`;

export const buildPatientConfirmationHtml = (data: AppointmentNotificationData): string => {
  const firstName = escapeHtml(data.fullName.split(' ')[0] ?? '');

  const rows = [
    renderInfoRow('Nombre', escapeHtml(data.fullName)),
    data.therapyName ? renderInfoRow('Terapia', escapeHtml(data.therapyName)) : '',
    renderInfoRow('Enviado', formatDate(data.createdAt)),
  ].join('');

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${buildPatientConfirmationSubject()}</title>

  </head>
  <body style="margin:0; padding:0; background-color:#faf7f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f0; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(31, 41, 55, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, ${BRAND_GOLD}, #b8860b); padding: 28px 32px;">
                <p style="margin:0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.85); font-weight: 600;">
                  IMHDXEIN
                </p>
                <h1 style="margin: 6px 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">
                  ¡Gracias por contactarnos, ${firstName}!
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px;">
                <p style="margin: 0 0 20px; font-size: 14px; color: ${DEEP_500}; line-height: 1.6;">
                  Hemos recibido con éxito tu solicitud${data.therapyName ? ` para <strong style="color:${DEEP_900};">${escapeHtml(data.therapyName)}</strong>` : ''}. Nuestro equipo la revisará y se pondrá en contacto contigo muy pronto para coordinar los siguientes pasos.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
                <div style="margin-top: 24px;">
                  <p style="margin: 0; font-size: 14px; color: ${DEEP_500}; line-height: 1.6;">
                    Si tienes alguna duda mientras tanto, no dudes en responder a este correo. Será un gusto acompañarte en tu proceso de bienestar.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 32px; background-color:#faf7f0; text-align:center;">
                <p style="margin:0; font-size: 11px; color: ${DEEP_500};">
                  Este correo fue generado automáticamente por el formulario de contacto de imhdxein.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const buildPatientConfirmationText = (data: AppointmentNotificationData): string => {
  const firstName = data.fullName.split(' ')[0] ?? '';
  const lines = [
    `¡Gracias por contactarnos, ${firstName}!`,
    '',
    `Hemos recibido con éxito tu solicitud${data.therapyName ? ` para ${data.therapyName}` : ''}. Nuestro equipo la revisará y se pondrá en contacto contigo muy pronto para coordinar los siguientes pasos.`,
    '',
    `Nombre: ${data.fullName}`,
    data.therapyName ? `Terapia: ${data.therapyName}` : null,
    `Enviado: ${formatDate(data.createdAt)}`,
    '',
    'Si tienes alguna duda mientras tanto, no dudes en responder a este correo.',
  ].filter(Boolean);

  return lines.join('\n');
};
