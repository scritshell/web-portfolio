import {
  decryptPayload,
  html,
  sendEmail,
  sha256,
} from '../../_lib/contact';
import type { ContactEnv } from '../../_lib/contact';

const page = (title: string, message: string) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — SCRITSHELL</title><link rel="stylesheet" href="/verify.css"></head><body><main><p>SCRITSHELL / CONTACT</p><h1>${title}</h1><p>${message}</p><a href="/contact">Volver a Contact</a></main></body></html>`;

export const onRequestGet = async ({ request, env }: { request: Request; env: ContactEnv }) => {
  const token = new URL(request.url).searchParams.get('token');
  if (!token || token.length > 128) return html(page('Enlace no válido', 'Este enlace de verificación no es válido o está incompleto.'), 400);

  const tokenHash = await sha256(`verification:${token}`);
  const key = `contact:verification:${tokenHash}`;
  const record = await env.CONTACT_KV.get<{ iv: string; data: string }>(key, 'json');
  if (!record) return html(page('Enlace caducado', 'El enlace ya se ha utilizado o ha caducado. Envía el formulario de nuevo si todavía quieres contactar.'), 410);

  // Delete before delivery: the link is single-use even if delivery is retried or refreshed.
  await env.CONTACT_KV.delete(key);
  try {
    const message = await decryptPayload(record, env);
    const sent = await sendEmail(env, {
      to: env.CONTACT_TO_EMAIL || 'scritshell@gmail.com',
      subject: `Nuevo mensaje de ${message.name} · SCRITSHELL`,
      replyTo: message.email,
      text: `Nombre: ${message.name}\nEmail: ${message.email}\n\nMensaje:\n${message.message}`,
    });
    if (!sent) return html(page('No se ha podido entregar', 'La verificación fue correcta, pero no se ha podido entregar el mensaje. Inténtalo de nuevo más tarde.'), 502);
    return html(page('Mensaje enviado', 'Gracias. Tu mensaje ha sido verificado y entregado correctamente.'));
  } catch {
    return html(page('No se ha podido completar', 'No se ha podido procesar el enlace. Inténtalo de nuevo desde el formulario de Contact.'), 500);
  }
};
