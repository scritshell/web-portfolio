# Contact — configuración de producción

El formulario usa **Cloudflare Pages Functions**, **Turnstile**, **Cloudflare KV** y la API HTTP de **Resend**. No se guardan credenciales en el frontend ni en el repositorio.

## Variables de Cloudflare

Configúralas en **Pages → Settings → Environment variables**. Añádelas tanto para Preview como para Production cuando corresponda.

### Variables públicas de build

| Variable | Valor | Sensible |
|---|---|---:|
| `PUBLIC_SITE_URL` | `https://tu-dominio.com` | No |
| `PUBLIC_TURNSTILE_SITE_KEY` | Site Key pública de Turnstile | No |
| `PUBLIC_GITHUB_URL` | URL pública de tu perfil GitHub | No |
| `PUBLIC_DISCORD_URL` | URL pública de tu perfil o servidor Discord | No |

### Variables secretas de Functions

| Variable | Valor | Sensible |
|---|---|---:|
| `TURNSTILE_SECRET_KEY` | Secret Key de Turnstile | Sí |
| `RESEND_API_KEY` | API key de Resend | Sí |
| `CONTACT_FROM_EMAIL` | Remitente de un dominio verificado en Resend | No, pero debe ser válido |
| `CONTACT_TO_EMAIL` | `scritshell@gmail.com` | No |
| `CONTACT_ENCRYPTION_KEY` | 32 bytes codificados en base64url | Sí |

Genera la clave de cifrado una sola vez:

```bash
openssl rand -base64 32 | tr '+/' '-_' | tr -d '='
```

No la regeneres después de empezar a recibir mensajes: los tokens pendientes dejarían de poder descifrarse.

## KV binding

Crea un namespace y asígnalo a la Function con el nombre exacto `CONTACT_KV`:

```bash
npx wrangler kv namespace create CONTACT_KV
```

En Cloudflare Pages:

1. Project → **Settings** → **Functions**.
2. Añade un KV namespace binding.
3. Variable name: `CONTACT_KV`.
4. Selecciona el namespace creado.
5. Repite para Preview si quieres probar en una URL de preview.

KV guarda únicamente:

- contadores temporales de rate limit;
- mensajes pendientes cifrados;
- tokens de verificación hasheados indirectamente.

Los mensajes pendientes caducan a los 30 minutos y el token se elimina antes de entregar el mensaje, por lo que solo puede utilizarse una vez.

## Turnstile

1. Crea un widget Turnstile para tu dominio en Cloudflare.
2. Guarda la Site Key en `PUBLIC_TURNSTILE_SITE_KEY`.
3. Guarda la Secret Key como `TURNSTILE_SECRET_KEY`.
4. No copies la Secret Key en Astro, HTML o JavaScript público.

## Resend

1. Crea una cuenta en Resend.
2. Verifica un dominio de envío.
3. Crea una API key con permiso suficiente para enviar emails.
4. Configura `CONTACT_FROM_EMAIL` con una dirección de ese dominio, por ejemplo `contact@tu-dominio.com`.
5. Configura `CONTACT_TO_EMAIL` como `scritshell@gmail.com`.

El mensaje final se envía con `Reply-To` igual al email que introdujo la persona, para poder responder desde Gmail directamente.

## Build y despliegue

Usa un único lockfile y configura Cloudflare Pages así:

```text
Build command: pnpm build
Build output directory: dist
```

Astro genera el sitio estático y Cloudflare Pages publica además la carpeta `functions/` como Pages Functions.

## Prueba local del frontend

El build normal comprueba Astro, pero no ejecuta Pages Functions por sí solo. Para probar el flujo serverless con bindings locales necesitas Wrangler y valores de desarrollo:

```bash
pnpm exec wrangler pages dev dist --kv CONTACT_KV --compatibility-date 2026-10-04
```

Para una prueba real de envío necesitarás un `.dev.vars` local —nunca lo subas a Git— con los secretos y el binding KV configurados en Wrangler. Usa las claves de prueba de Turnstile en local si no estás probando el dominio real.

## Flujo completo esperado

1. La persona completa Nombre, Email y Mensaje.
2. El cliente valida formato, longitud y ausencia de HTML.
3. Turnstile entrega un token; el servidor lo valida contra Cloudflare.
4. El servidor comprueba el honeypot, origen, tamaño del request y límites por IP/email.
5. El mensaje se cifra y se guarda temporalmente en KV.
6. Se envía un email de verificación al usuario.
7. El usuario pulsa el enlace único.
8. La Function consume y elimina el token.
9. Descifra el mensaje y lo envía a `scritshell@gmail.com` con `Reply-To` del usuario.

Los errores públicos son genéricos cuando fallan servicios internos para no revelar detalles de infraestructura.
