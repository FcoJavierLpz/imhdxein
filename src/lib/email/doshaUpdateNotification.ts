/**
 * Plantilla de correo de "Actualización" del Test de Dosha.
 *
 * Se dispara cuando un usuario que YA tenía una solicitud previa registrada
 * (una cita en `appointments` o un mensaje en `contact_messages`) completa
 * el Test de Dosha DESPUÉS de haber enviado ese formulario inicial.
 *
 * A diferencia de `doshaNotification.ts` (correo comercial de "Lead sin
 * cita"), este correo es meramente informativo: el administrador ya tiene
 * el contacto de esta persona, solo se le avisa que ahora también cuenta
 * con su perfil de Dosha para enriquecer el seguimiento.
 *
 * Sigue la misma línea de diseño del resto de notificaciones
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

export type DoshaUpdateSourceType = 'appointment' | 'consulta_general';

export interface DoshaUpdateNotificationData {
  /** Nombre del usuario, tomado de la solicitud original (appointment/contact_message). */
  fullName: string;
  email: string;
  dosha: Dosha;
  createdAt: Date;
  /** Tipo de solicitud original a la que se vincula este resultado. */
  sourceType: DoshaUpdateSourceType;
  /**
   * Etiqueta legible de la solicitud original, ej. "Terapia agendada: Alineación de Chakras"
   * o "Solicitud General: Consulta General y de Diagnóstico".
   */
  sourceLabel: string;
}

export const buildDoshaUpdateSubject = (data: DoshaUpdateNotificationData): string =>
  `🔄 ACTUALIZACIÓN: El usuario ${data.fullName} YA completó el Test Dosha`;

export const buildDoshaUpdateHtml = (data: DoshaUpdateNotificationData): string => {
  const profile = doshaProfiles[data.dosha];
  const displayName = escapeHtml(data.fullName);

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${buildDoshaUpdateSubject(data)}</title>
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
                  🔄 Actualización de perfil
                </h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">
                  El usuario ya completó el Test de Dosha
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px;">
                <p style="margin: 0 0 20px; font-size: 14px; color: ${DEEP_500}; line-height: 1.6;">
                  <strong style="color:${DEEP_900};">${displayName}</strong> completó voluntariamente el Test de
                  Dosha después de enviar su solicitud inicial. Esta información ya está disponible en la base
                  de datos para enriquecer su perfil de paciente/cliente. No se requiere ninguna acción
                  comercial inmediata; es solo un dato adicional para tu seguimiento.
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
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Solicitud original</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 14px; color: ${DEEP_900};">${escapeHtml(data.sourceLabel)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Nuevo Estado Dosha</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0e6d2;">
                      <span style="font-size: 14px; color: ${profile.color}; font-weight: 700;">${escapeHtml(profile.title)}</span>
                      <span style="font-size: 13px; color: ${DEEP_500};"> (${escapeHtml(profile.element)})</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${DEEP_500};">Fecha del test</span>
                    </td>
                    <td style="padding: 10px 0;">
                      <span style="font-size: 14px; color: ${DEEP_900};">${formatDate(data.createdAt)}</span>
                    </td>
                  </tr>
                </table>
                <div style="margin-top: 20px; padding: 14px 16px; background-color: #f0f7f1; border-left: 4px solid ${profile.color}; border-radius: 10px;">
                  <p style="margin: 0; font-size: 13px; color: ${DEEP_900}; line-height: 1.6;">
                    💡 Puedes usar este resultado (<strong>${escapeHtml(profile.title)}</strong>) para personalizar la
                    conversación en la cita/seguimiento con este paciente.
                  </p>
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

export const buildDoshaUpdateText = (data: DoshaUpdateNotificationData): string => {
  const profile = doshaProfiles[data.dosha];
  const lines = [
    '🔄 ACTUALIZACIÓN: El usuario ya completó el Test de Dosha',
    '',
    `${data.fullName} completó voluntariamente el Test de Dosha después de enviar su solicitud inicial.`,
    'Esta información ya está disponible en la base de datos para enriquecer su perfil.',
    'No se requiere ninguna acción comercial inmediata.',
    '',
    `Nombre: ${data.fullName}`,
    `Correo: ${data.email}`,
    `Solicitud original: ${data.sourceLabel}`,
    `Nuevo Estado Dosha: ${profile.title} (${profile.element})`,
    `Fecha del test: ${formatDate(data.createdAt)}`,
  ];

  return lines.join('\n');
};
