export interface ContactEnv {
  CONTACT_KV: KVNamespaceLike;
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_ENCRYPTION_KEY: string;
  PUBLIC_SITE_URL?: string;
  ALLOWED_ORIGIN?: string;
}

export interface KVNamespaceLike {
  get<T = unknown>(key: string, type?: 'json' | 'text'): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  turnstileToken?: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const TOKEN_TTL_SECONDS = 30 * 60;
const RATE_WINDOW_SECONDS = 60 * 60;
const IP_LIMIT = 5;
const EMAIL_LIMIT = 3;

export const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });

export function publicError(status = 400) {
  return json({ ok: false, message: 'No se ha podido procesar la solicitud. Revisa los datos e inténtalo de nuevo.' }, status);
}

export function clientIp(request: Request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 'unknown';
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return base64Url(new Uint8Array(digest));
}

export function base64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function siteOrigin(request: Request, env: ContactEnv) {
  const configured = env.PUBLIC_SITE_URL || env.ALLOWED_ORIGIN;
  return (configured || new URL(request.url).origin).replace(/\/$/, '');
}

export function originAllowed(request: Request, env: ContactEnv) {
  const origin = request.headers.get('Origin');
  return !origin || origin.replace(/\/$/, '') === siteOrigin(request, env);
}

export async function parsePayload(request: Request): Promise<ContactPayload> {
  const raw = await request.text();
  if (encoder.encode(raw).byteLength > 12_000) throw new Error('payload-too-large');
  return JSON.parse(raw) as ContactPayload;
}

export function validatePayload(payload: ContactPayload) {
  if (!payload || typeof payload !== 'object') return 'Invalid form data.';
  if (payload.honeypot) return 'Invalid form data.';
  if (typeof payload.name !== 'string' || payload.name.trim().length < 2 || payload.name.trim().length > 80 || /[<>\u0000-\u001F\u007F]/.test(payload.name)) return 'Please enter a valid name.';
  if (typeof payload.email !== 'string' || payload.email.length > 254 || !EMAIL_RE.test(payload.email.trim())) return 'Please enter a valid email.';
  if (typeof payload.message !== 'string' || payload.message.trim().length < 10 || payload.message.trim().length > 4000) return 'Please enter a message between 10 and 4000 characters.';
  if (/[<>]/.test(payload.message) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(payload.message)) return 'HTML and control characters are not allowed in the message.';
  if (typeof payload.turnstileToken !== 'string' || payload.turnstileToken.length < 10 || payload.turnstileToken.length > 2048) return 'Please complete the anti-bot verification.';
  return null;
}

async function consumeRateLimit(env: ContactEnv, key: string, limit: number) {
  const current = await env.CONTACT_KV.get<{ count: number; resetAt: number }>(key, 'json');
  const now = Math.floor(Date.now() / 1000);
  if (current && current.resetAt > now && current.count >= limit) return false;
  const count = current && current.resetAt > now ? current.count + 1 : 1;
  await env.CONTACT_KV.put(key, JSON.stringify({ count, resetAt: now + RATE_WINDOW_SECONDS }), { expirationTtl: RATE_WINDOW_SECONDS });
  return true;
}

export async function enforceRateLimits(request: Request, env: ContactEnv, email: string) {
  const ipHash = await sha256(`ip:${clientIp(request)}`);
  const emailHash = await sha256(`email:${email.toLowerCase()}`);
  const [ipAllowed, emailAllowed] = await Promise.all([
    consumeRateLimit(env, `contact:rate:ip:${ipHash}`, IP_LIMIT),
    consumeRateLimit(env, `contact:rate:email:${emailHash}`, EMAIL_LIMIT),
  ]);
  return ipAllowed && emailAllowed;
}

export async function verifyTurnstile(token: string, request: Request, env: ContactEnv) {
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  body.set('remoteip', clientIp(request));
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}

async function encryptionKey(env: ContactEnv) {
  const raw = fromBase64Url(env.CONTACT_ENCRYPTION_KEY);
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptPayload(payload: ContactPayload, env: ContactEnv) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(env);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify({ name: payload.name.trim(), email: payload.email.trim().toLowerCase(), message: payload.message.trim() })));
  return { iv: base64Url(iv), data: base64Url(new Uint8Array(encrypted)) };
}

export async function decryptPayload(record: { iv: string; data: string }, env: ContactEnv) {
  const key = await encryptionKey(env);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64Url(record.iv) }, key, fromBase64Url(record.data));
  return JSON.parse(decoder.decode(decrypted)) as { name: string; email: string; message: string };
}

export function randomToken() {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function sendEmail(env: ContactEnv, options: { to: string; subject: string; text: string; replyTo?: string }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [options.to], subject: options.subject, text: options.text, ...(options.replyTo ? { reply_to: options.replyTo } : {}) }),
  });
  return response.ok;
}

export const TOKEN_TTL = TOKEN_TTL_SECONDS;
