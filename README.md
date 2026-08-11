# Academia Integra

Sitio público y paneles (campus, acudientes, colegios, tutores, administración) de
Academia Integra, migrados desde los prototipos `.dc.html` originales a una
aplicación Next.js real.

## Estructura del repositorio

```text
Academia Integra/
├── web/                  Aplicación Next.js (App Router, TypeScript, Tailwind v4, shadcn/ui)
├── reference/
│   └── prototipos/       Prototipos .dc.html originales + Matriz de Migración (solo consulta)
└── README.md             Este archivo
```

## Cómo correr el proyecto

Requiere Node.js 20+ y `pnpm`. Todo el código vive dentro de `web/`.

```bash
cd web
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

Otros comandos útiles dentro de `web/`:

```bash
pnpm lint     # ESLint
pnpm build    # Build de producción (también corre el chequeo de TypeScript)
pnpm start    # Sirve el build de producción
```

## Estructura de `web/src`

```text
app/
  (marketing)/     Sitio público: home, programas, países/exámenes, diagnóstico,
                    planes y precios, recursos, colegios, nosotros, faq, contacto
  login/           Selector de rol simulado (modo demostración)
  campus/          Panel del estudiante (rol "estudiante")
  acudientes/      Panel de acudientes (rol "acudiente")
  colegios-panel/  Panel institucional para colegios (rol "colegio")
  tutores/         Panel del tutor (rol "tutor")
  admin/           Panel administrativo (rol "administrador")
components/
  ui/              Componentes shadcn/ui (autogenerados, no editar a mano)
  layout/          Header, footer, sidebar de paneles, menú de usuario
  shared/          Componentes reutilizables (badges, tarjetas de estadística, etc.)
features/          Lógica de UI específica por área (programas, diagnóstico, campus, ...)
lib/
  data/            Datos de contenido y de los paneles, tipados, portados del prototipo
  types/           Tipos compartidos
  session/         Sesión simulada por rol (contexto de React + localStorage)
```

## Qué está simulado (no es real todavía)

- **Autenticación**: `/login` deja elegir un rol de demostración (estudiante,
  acudiente, colegio, tutor, administrador) que se guarda en `localStorage` del
  navegador. No hay contraseñas ni verificación real — se reemplaza por
  autenticación con **Supabase** en una fase posterior.
- **Datos de los paneles**: estudiantes, mensajes, calificaciones, pagos y
  reportes que aparecen en los paneles son datos de ejemplo fijos (en
  `lib/data/*.ts`), no provienen de una base de datos.
- **Formularios**: el formulario de contacto, el diagnóstico, "crear usuario",
  "calificar actividad" y "generar reporte" simulan el envío (con confirmación
  visual) pero no persisten ni disparan integraciones reales.
- **Precios, testimonios y cifras**: cualquier dato marcado con el badge
  "Pendiente de validación con el propietario" proviene de la Matriz de
  Migración de los sitios legados y **no debe reemplazarse por datos
  inventados** hasta que el propietario del negocio lo confirme.

## Qué falta conectar

- Autenticación y roles reales (Supabase Auth + base de datos).
- Persistencia real de matrículas, pagos, mensajes y reportes.
- Pasarela de pagos regulada (los prototipos legados exponían datos bancarios
  personales directamente en la página — ver `reference/prototipos/Matriz de
  Migracion.dc.html`, que documenta este y otros hallazgos).
- Integración de WhatsApp/correo para notificaciones y reportes automáticos.
- Flujo completo de preguntas del diagnóstico académico.
- Chat en vivo del tutor con IA (hoy es una conversación de ejemplo estática).

## Imágenes

Las fotografías en `web/public/images/` son de uso libre, descargadas de
[Pexels](https://www.pexels.com) (licencia Pexels: uso comercial gratuito, sin
atribución obligatoria). Son fotografía genérica de ambiente (estudiantes
estudiando, grupos de estudio) — no representan a estudiantes, tutores ni
personal real de Academia Integra, y no deben usarse como si lo fueran (por
ejemplo, no colocarlas en "Nosotros" como si fueran fotos del equipo).

`web/public/Nova-PNG.png` es el logo oficial (confirmado por el propietario) y
se usa como marca de Academia Integra en el header, favicon, ícono de la app
y la imagen Open Graph; también aparece como crédito en el pie de página como
estudio desarrollador del sitio.

## Prototipos originales

Los prototipos `.dc.html` (componentes con datos reales embebidos) y la
Matriz de Migración que documenta qué conservar/fusionar/mejorar/eliminar de
los tres sitios legados están archivados, sin modificar, en
[`reference/prototipos/`](./reference/prototipos/). El contenido real (copy,
programas, precios, países, textos legales) de esos archivos fue portado a
`web/src/lib/data/` — cualquier duda sobre el copy original debe resolverse
consultando esos prototipos, no inventando contenido nuevo.
