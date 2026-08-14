# Supabase — configuración

## 1. Crear el proyecto

1. Crea una cuenta en https://supabase.com y un proyecto nuevo (región
   sugerida: la más cercana a los usuarios, p. ej. South America (São Paulo)
   si está disponible).
2. En **Project Settings → API** copia `Project URL`, `anon public key` y
   `service_role key`.
3. Pon esos tres valores en `web/.env.local` (ver `web/.env.example`).

## 2. Aplicar el esquema

Copia el contenido de `migrations/0001_profiles.sql` y pégalo en
**SQL Editor → New query** en el dashboard de Supabase, y ejecútalo.

Crea la tabla `profiles`, el enum `user_role`, RLS, y el trigger que crea
automáticamente el `profile` cuando se crea un usuario en Supabase Auth.

## 3. Crear usuarios de prueba (uno por rol)

En **Authentication → Users → Add user**, para cada uno: correo, contraseña,
y en **User Metadata** (JSON) exactamente:

| Rol | User Metadata |
|---|---|
| estudiante | `{"role": "estudiante", "nombre": "Mariana Gómez"}` |
| acudiente | `{"role": "acudiente", "nombre": "Luisa Gómez"}` |
| colegio | `{"role": "colegio", "nombre": "Colegio San Rafael"}` |
| tutor | `{"role": "tutor", "nombre": "Andrés Rojas"}` |
| administrador | `{"role": "administrador", "nombre": "Sofía Arango"}` |

El trigger `on_auth_user_created` crea la fila en `profiles` a partir de ese
metadata. Si el metadata no trae `role`, el insert falla (a propósito: evita
usuarios sin rol asignado).

## Notas

- No hay auto-registro público todavía — todos los usuarios se crean desde
  el dashboard de Supabase (o, más adelante, desde `admin/usuarios` usando
  `src/lib/supabase/admin.ts`).
- `supabase db push` / `supabase gen types` no se usan aún porque requieren
  `supabase login` interactivo (abre navegador). Si en algún momento
  configuras la CLI localmente, `migrations/0001_profiles.sql` queda listo
  para `supabase link` + `supabase db push`.
