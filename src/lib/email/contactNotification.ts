/**
 * Plantilla de correo de confirmación para el formulario de contacto.
 * Sigue la línea de diseño del sitio (dorado #D4A017 / tonos "deep").
 */

export interface ContactNotificationData {
  fullName: string;
  subject: string;
  message: string;
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

export const buildContactConfirmationSubject = (): string =>
  `Hemos recibido tu mensaje — Instituto Holístico`;

export const buildContactConfirmationHtml = (data: ContactNotificationData): string => {
  const firstName = escapeHtml(data.fullName.split(' ')[0] ?? '');

  const rows = [
    renderInfoRow('Nombre', escapeHtml(data.fullName)),
    renderInfoRow('Asunto', escapeHtml(data.subject)),
    renderInfoRow('Enviado', formatDate(data.createdAt)),
  ].join('');

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${buildContactConfirmationSubject()}</title>
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
                  Hemos recibido con éxito tu mensaje. Nuestro equipo lo revisará y te responderemos en un plazo de 24 horas.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
                <div style="margin-top: 20px;">
                  <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: ${DEEP_500};">Mensaje</span>
                  <p style="margin: 8px 0 0; padding: 14px 16px; background-color:#faf7f0; border-radius: 10px; font-size: 14px; color: ${DEEP_900}; line-height: 1.6; white-space: pre-line;">${escapeHtml(data.message)}</p>
                </div>
                <div style="margin-top: 24px;">
                  <p style="margin: 0; font-size: 14px; color: ${DEEP_500}; line-height: 1.6;">
                    Si tienes alguna duda mientras tanto, no dudes en responder a este correo.
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

export const buildContactConfirmationText = (data: ContactNotificationData): string => {
  const firstName = data.fullName.split(' ')[0] ?? '';
  const lines = [
    `¡Gracias por contactarnos, ${firstName}!`,
    '',
    'Hemos recibido con éxito tu mensaje. Nuestro equipo lo revisará y te responderemos en un plazo de 24 horas.',
    '',
    `Nombre: ${data.fullName}`,
    `Asunto: ${data.subject}`,
    `Enviado: ${formatDate(data.createdAt)}`,
    '',
    `Mensaje:\n${data.message}`,
    '',
    'Si tienes alguna duda mientras tanto, no dudes en responder a este correo.',
  ].filter(Boolean);

  return lines.join('\n');
};
