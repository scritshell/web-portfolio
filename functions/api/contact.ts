import {
  enforceRateLimits,
  encryptPayload,
  json,
  originAllowed,
  parsePayload,
  publicError,
  randomToken,
  sendEmail,
  sha256,
  siteOrigin,
  TOKEN_TTL,
  validatePayload,
  verifyTurnstile,
} from '../_lib/contact';
import type { ContactEnv } from '../_lib/contact';

export const onRequestOptions = async () => new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS' } });

export const onRequestPost = async ({ request, env }: { request: Request; env: ContactEnv }) => {
  if (!originAllowed(request, env)) return publicError(403);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 12_000) return publicError(413);

  let payload;
  try {
    payload = await parsePayload(request);
  } catch {
    return publicError();
  }
  const validationError = validatePayload(payload);
  if (validationError) return json({ ok: false, message: validationError }, 400);

  try {
    if (!(await verifyTurnstile(payload.turnstileToken!, request, env))) return json({ ok: false, message: 'La verificación anti-bot no ha sido válida. Inténtalo de nuevo.' }, 400);
    if (!(await enforceRateLimits(request, env, payload.email))) return json({ ok: false, message: 'Has alcanzado el límite temporal de envíos. Espera un poco e inténtalo de nuevo.' }, 429);

    const token = randomToken();
    const tokenHash = await sha256(`verification:${token}`);
    const encrypted = await encryptPayload(payload, env);
    await env.CONTACT_KV.put(`contact:verification:${tokenHash}`, JSON.stringify(encrypted), { expirationTtl: TOKEN_TTL });

    const verificationUrl = `${siteOrigin(request, env)}/api/contact/verify?token=${encodeURIComponent(token)}`;
    const sent = await sendEmail(env, {
      to: payload.email.trim().toLowerCase(),
      subject: 'Confirma tu mensaje para SCRITSHELL',
      text: `Hola ${payload.name.trim()},\n\nPulsa este enlace para confirmar que quieres enviar tu mensaje a SCRITSHELL. El enlace caduca en 30 minutos y solo puede utilizarse una vez:\n\n${verificationUrl}\n\nSi no has iniciado este envío, puedes ignorar este correo.`,
    });
    if (!sent) {
      await env.CONTACT_KV.delete(`contact:verification:${tokenHash}`);
      return publicError(502);
    }
    return json({ ok: true, message: 'Te hemos enviado un correo de verificación. Confirma el enlace para completar el envío.' });
  } catch {
    return publicError(500);
  }
};
