/**
 * Plantillas de correo relacionadas con el Test de Dosha.
 * Siguen la misma línea de diseño del resto de notificaciones
 * (dorado #D4A017 / tonos "deep").
 */

import { doshaProfiles } from '../dosha/doshaProfiles';
import type { Dosha } from '../dosha/questions';

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

/**
 * Bloque de texto plano ("🔔 ESTADO DOSHA: ...") que se inserta en el
 * correo de notificación de una nueva cita (Punto 3 de la estrategia).
 */
export const buildDoshaStatusText = (dosha: Dosha | null): string =>
  dosha
    ? `🔔 ESTADO DOSHA: Paciente YA completó el test. Resultado: ${dosha}.`
    : '🔔 ESTADO DOSHA: Paciente AÚN NO ha realizado el test.';

/**
 * Bloque HTML destacado con el estado del Test de Dosha, para insertarse
 * dentro del correo de notificación de nueva cita al administrador.
 */
export const buildDoshaStatusHtml = (dosha: Dosha | null): string => {
  if (dosha) {
    const profile = doshaProfiles[dosha];
    return `
      <div style="margin-top: 20px; padding: 14px 16px; background-color: #f0f7f1; border-left: 4px solid ${profile.color}; border-radius: 10px;">
        <span style="font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: ${profile.color};">🔔 Estado Dosha</span>
        <p style="margin: 6px 0 0; font-size: 14px; color: ${DEEP_900}; line-height: 1.6;">
          Paciente <strong>YA completó</strong> el Test de Dosha. Resultado: <strong>${escapeHtml(profile.title)}</strong> (${escapeHtml(profile.element)}).
        </p>
      </div>`;
  }

  return `
    <div style="margin-top: 20px; padding: 14px 16px; background-color: #faf3e6; border-left: 4px solid ${BRAND_GOLD}; border-radius: 10px;">
      <span style="font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: ${BRAND_GOLD};">🔔 Estado Dosha</span>
      <p style="margin: 6px 0 0; font-size: 14px; color: ${DEEP_900}; line-height: 1.6;">
        Paciente <strong>aún no</strong> ha realizado el Test de Dosha.
      </p>
    </div>`;
};

/**
 * Correo comercial enviado a recepción/administración cuando un usuario
 * completa el Test de Dosha SIN tener una cita agendada (Escenario 2:
 * "Lead frío"). Permite al equipo comercial contactarlo proactivamente.
 */
export interface DoshaLeadNotificationData {
  fullName: string | null;
  email: string;
  dosha: Dosha;
  createdAt: Date;
  origin: 'lead' | 'consulta_general';
}

export const buildDoshaLeadSubject = (data: DoshaLeadNotificationData): string =>
  `Nuevo Resultado de Test Dosha (Lead sin cita): ${data.fullName ?? data.email}`;

export const buildDoshaLeadHtml = (data: DoshaLeadNotificationData): string => {
  const profile = doshaProfiles[data.dosha];
  const displayName = data.fullName ? escapeHtml(data.fullName) : 'Sin nombre registrado';

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${buildDoshaLeadSubject(data)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#faf7f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f0; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(31, 41, 55, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, ${profile.color}, ${BRAND_GOLD}); padding: 28px 32px;">
                <p style="margin:0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.85); font-weight: 600;">
                  IMHDXEIN &middot; Test de Dosha
                </p>
                <h1 style="margin: 6px 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">
                  Nuevo Resultado de Test Dosha
                </h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">
                  Lead ${data.origin === 'consulta_general' ? 'de Consulta General' : 'sin cita'} — requiere seguimiento comercial
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px;">
                <p style="margin: 0 0 20px; font-size: 14px; color: ${DEEP_500}; line-height: 1.6;">
                  Una persona completó el Test de Dosha gratuito sin haber agendado una cita previamente.
                  Se recomienda contactarla para ofrecerle una consulta.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2; width: 140px;">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Nombre</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 14px; color: ${DEEP_900}; font-weight: 500;">${displayName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Correo</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND_GOLD}; text-decoration:none; font-size: 14px; font-weight: 500;">${escapeHtml(data.email)}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Resultado</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 14px; color: ${profile.color}; font-weight: 700;">${escapeHtml(profile.title)}</span>
                      <span style="font-size: 13px; color: ${DEEP_500};"> (${escapeHtml(profile.element)})</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Fecha</span>
                    </td>
                    <td style="padding: 10px 0;">
                      <span style="font-size: 14px; color: ${DEEP_900};">${formatDate(data.createdAt)}</span>
                    </td>
                  </tr>
                </table>
                <div style="margin-top: 28px; text-align: center;">
                  <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block; background-color: ${BRAND_GOLD}; color:#ffffff; text-decoration:none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 999px;">
                    Contactar para ofrecer consulta
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 32px; background-color:#faf7f0; text-align:center;">
                <p style="margin:0; font-size: 11px; color: ${DEEP_500};">
                  Este correo fue generado automáticamente por el Test de Dosha de imhdxein.org.mx
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

export const buildDoshaLeadText = (data: DoshaLeadNotificationData): string => {
  const profile = doshaProfiles[data.dosha];
  const lines = [
    'Nuevo Resultado de Test Dosha (Lead sin cita)',
    '',
    `Nombre: ${data.fullName ?? 'Sin nombre registrado'}`,
    `Correo: ${data.email}`,
    `Resultado: ${profile.title} (${profile.element})`,
    `Origen: ${data.origin === 'consulta_general' ? 'Consulta General' : 'Menú principal (Test Dosha)'}`,
    `Fecha: ${formatDate(data.createdAt)}`,
    '',
    'Se recomienda contactar a esta persona para ofrecerle una cita.',
  ];

  return lines.join('\n');
};
