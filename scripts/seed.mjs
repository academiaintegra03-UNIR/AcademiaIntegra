// Vacía la base (todo menos las cuentas con role = 'administrador') y la
// puebla con planes + usuarios + suscripciones + pagos de prueba.
//
// Uso:
//   node scripts/seed.mjs
//
// Requiere .env.local en la raíz del repo con NEXT_PUBLIC_SUPABASE_URL y
// SUPABASE_SERVICE_ROLE_KEY (los mismos que usa la app).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const path = join(__dirname, "..", ".env.local");
  const raw = readFileSync(path, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_PASSWORD = "AcademiaTest2026!";
const TEST_DOMAIN = "seed.test"; // dominio reservado para pruebas (RFC 2606) — nunca envía correos reales

function log(msg) {
  console.log(`- ${msg}`);
}

async function wipe() {
  console.log("\n== Vaciando base de datos (se conservan las cuentas administrador) ==");

  const { data: authUsers, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;

  const { data: profiles, error: profilesError } = await admin.from("profiles").select("id, role");
  if (profilesError) throw profilesError;
  const roleById = new Map(profiles.map((p) => [p.id, p.role]));

  const toDelete = authUsers.users.filter((u) => roleById.get(u.id) !== "administrador");
  log(`${toDelete.length} cuenta(s) a eliminar de ${authUsers.users.length} totales.`);

  for (const user of toDelete) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) console.error(`  ! No se pudo eliminar ${user.email}:`, error.message);
  }

  // Limpieza explícita en orden seguro para FKs (hijos antes que padres) —
  // la mayoría ya cae por cascada al borrar los usuarios de arriba, esto
  // es para dejar todo limpio incluso si quedó algo suelto (ej. grupos
  // "libres" sin colegio). `.not(col, "is", null)` sobre una columna que
  // nunca es null es el filtro estándar de PostgREST para "borra todo".
  const cleanupSteps = [
    ["payments", "id"],
    ["subscriptions", "id"],
    ["grupo_estudiantes", "grupo_id"],
    ["grupos", "id"],
    ["guardian_students", "guardian_id"],
    ["plans", "id"],
  ];
  for (const [table, col] of cleanupSteps) {
    const { error } = await admin.from(table).delete().not(col, "is", null);
    if (error) console.error(`  ! Error limpiando ${table}:`, error.message);
  }

  log("Base vaciada.");
}

async function seedPlans() {
  console.log("\n== Creando planes de ejemplo ==");

  const plans = [
    {
      name: "Individual",
      description: "Para un solo estudiante — acceso completo a la plataforma.",
      type: "individual",
      price_cop: 150000,
      seat_limit: null,
      period: "Pago único · semestre",
      badge: null,
      features: ["Acceso a todos los cursos", "Simulacros ilimitados", "Tutor con IA"],
      group_label: null,
      active: true,
      allow_subgrupos: true,
      allow_acudientes: true,
      billing_type: "pago_unico",
      duration_days: null,
    },
    {
      name: "Familiar",
      description: "Para acudientes con varios hijos en la plataforma.",
      type: "grupal",
      price_cop: 350000,
      seat_limit: 4,
      period: "Pago único · semestre",
      badge: "Más popular",
      features: ["Hasta 4 estudiantes", "Panel de seguimiento familiar", "Tutor con IA"],
      group_label: null,
      active: true,
      allow_subgrupos: true,
      allow_acudientes: true,
      billing_type: "pago_unico",
      duration_days: null,
    },
    {
      name: "Institucional Estándar",
      description: "Para colegios — gestiona tus grupos y estudiantes.",
      type: "institucional",
      price_cop: 2000000,
      seat_limit: 50,
      period: "Mensual",
      badge: null,
      features: ["Hasta 50 estudiantes", "Subgrupos propios", "Invita acudientes"],
      group_label: null,
      active: true,
      allow_subgrupos: true,
      allow_acudientes: true,
      billing_type: "mensual",
      duration_days: 30,
    },
    {
      name: "Institucional Prueba Gratis",
      description: "14 días para que el colegio pruebe la plataforma.",
      type: "institucional",
      price_cop: 0,
      seat_limit: 20,
      period: "Prueba · 14 días",
      badge: "Prueba gratis",
      features: ["Hasta 20 estudiantes", "Sin subgrupos propios durante la prueba"],
      group_label: null,
      active: true,
      allow_subgrupos: false,
      allow_acudientes: true,
      billing_type: "prueba_gratis",
      duration_days: 14,
    },
  ];

  const { data, error } = await admin.from("plans").insert(plans).select("id, name, type");
  if (error) throw error;
  data.forEach((p) => log(`Plan "${p.name}" (${p.type})`));

  return {
    individual: data.find((p) => p.name === "Individual"),
    familiar: data.find((p) => p.name === "Familiar"),
    institucionalEstandar: data.find((p) => p.name === "Institucional Estándar"),
    institucionalPrueba: data.find((p) => p.name === "Institucional Prueba Gratis"),
  };
}

async function createUser({ email, nombre, role, colegioId }) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { role, nombre, colegio_id: colegioId ?? "" },
  });
  if (error) throw new Error(`Creando ${email}: ${error.message}`);
  log(`${role.padEnd(12)} ${email}`);
  return data.user.id;
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function activateSubscription(profileId, planId, expiresAt) {
  const { error } = await admin
    .from("subscriptions")
    .insert({ profile_id: profileId, plan_id: planId, status: "active", expires_at: expiresAt });
  if (error) throw error;
}

async function seedUsers(plans) {
  console.log("\n== Creando usuarios de prueba ==");

  const colegioAId = await createUser({
    email: `colegio.sanjose@${TEST_DOMAIN}`,
    nombre: "Colegio San José",
    role: "colegio",
  });
  const colegioBId = await createUser({
    email: `colegio.esperanza@${TEST_DOMAIN}`,
    nombre: "Colegio La Esperanza",
    role: "colegio",
  });

  // Colegio A: plan institucional activo y vigente.
  await activateSubscription(colegioAId, plans.institucionalEstandar.id, daysFromNow(330));
  log("Suscripción activa para Colegio San José (institucional estándar, vence en ~11 meses).");

  // Colegio B: prueba gratis ya vencida — para probar que el vencimiento
  // automático bloquea el cupo/subgrupos sin que nadie la marque a mano.
  await activateSubscription(colegioBId, plans.institucionalPrueba.id, daysFromNow(-2));
  log("Suscripción VENCIDA para Colegio La Esperanza (prueba gratis, venció hace 2 días).");

  const tutor1Id = await createUser({ email: `tutor.laura@${TEST_DOMAIN}`, nombre: "Laura Gómez", role: "tutor" });
  await createUser({ email: `tutor.andres@${TEST_DOMAIN}`, nombre: "Andrés Ruiz", role: "tutor" });

  const estudiantesColegioA = [];
  for (const nombre of ["Camila Torres", "Juan Pérez", "Valentina Ríos", "Santiago Mora"]) {
    const id = await createUser({
      email: `est.${nombre.split(" ")[0].toLowerCase()}@${TEST_DOMAIN}`,
      nombre,
      role: "estudiante",
      colegioId: colegioAId,
    });
    estudiantesColegioA.push(id);
  }

  const estudianteColegioBId = await createUser({
    email: `est.mariajose@${TEST_DOMAIN}`,
    nombre: "María José Salazar",
    role: "estudiante",
    colegioId: colegioBId,
  });

  const estudianteIndependienteId = await createUser({
    email: `est.independiente@${TEST_DOMAIN}`,
    nombre: "Daniel Castro",
    role: "estudiante",
  });

  const acudienteId = await createUser({
    email: `acudiente.marcela@${TEST_DOMAIN}`,
    nombre: "Marcela Herrera",
    role: "acudiente",
  });
  await activateSubscription(acudienteId, plans.familiar.id, null);
  log("Suscripción activa para Marcela Herrera (familiar, sin vencimiento).");

  await admin.from("guardian_students").insert([
    { guardian_id: acudienteId, student_id: estudianteIndependienteId },
    { guardian_id: acudienteId, student_id: estudiantesColegioA[0] },
  ]);
  log("Marcela Herrera vinculada como acudiente de 2 estudiantes.");

  // Tutor asignado al grupo automático del Colegio San José.
  const { data: grupoDefault } = await admin
    .from("grupos")
    .select("id")
    .eq("colegio_id", colegioAId)
    .eq("es_default_colegio", true)
    .single();
  if (grupoDefault) {
    await admin.from("grupos").update({ tutor_id: tutor1Id }).eq("id", grupoDefault.id);
    log("Laura Gómez asignada como tutora del grupo automático de Colegio San José.");
  }

  return {
    colegioAId,
    colegioBId,
    acudienteId,
    estudiantesColegioA,
    estudianteColegioBId,
    estudianteIndependienteId,
  };
}

async function seedPayments(plans, users) {
  console.log("\n== Creando pagos de prueba ==");

  const payments = [
    {
      reference: `ai-seed-${crypto.randomUUID()}`,
      plan_id: plans.institucionalEstandar.id,
      email: `colegio.sanjose@${TEST_DOMAIN}`,
      nombre: "Colegio San José",
      amount_cop: plans.institucionalEstandar.price_cop ?? 2000000,
      status: "approved",
      profile_id: users.colegioAId,
    },
    {
      reference: `ai-seed-${crypto.randomUUID()}`,
      plan_id: plans.familiar.id,
      email: `acudiente.marcela@${TEST_DOMAIN}`,
      nombre: "Marcela Herrera",
      amount_cop: 350000,
      status: "approved",
      profile_id: users.acudienteId,
    },
    {
      reference: `ai-seed-${crypto.randomUUID()}`,
      plan_id: plans.individual.id,
      email: `intento.pendiente@${TEST_DOMAIN}`,
      nombre: "Pago Pendiente De Prueba",
      amount_cop: 150000,
      status: "pending",
      profile_id: null,
    },
    {
      reference: `ai-seed-${crypto.randomUUID()}`,
      plan_id: plans.individual.id,
      email: `intento.rechazado@${TEST_DOMAIN}`,
      nombre: "Pago Rechazado De Prueba",
      amount_cop: 150000,
      status: "declined",
      profile_id: null,
    },
  ];

  // amount_cop es NOT NULL — los planes gratis (price_cop 0) ya quedan bien arriba.
  const { error } = await admin.from("payments").insert(
    payments.map((p) => ({ ...p, amount_cop: p.amount_cop ?? 0 }))
  );
  if (error) throw error;
  payments.forEach((p) => log(`Pago ${p.status} — ${p.nombre}`));
}

async function main() {
  await wipe();
  const plans = await seedPlans();
  const users = await seedUsers(plans);
  await seedPayments(plans, users);

  console.log("\n== Listo ==");
  console.log(`Contraseña de todas las cuentas de prueba: ${SEED_PASSWORD}`);
  console.log(`Dominio de correos de prueba: @${TEST_DOMAIN} (no envía correos reales)`);
  console.log("Revisa /admin/usuarios, /admin/planes y /admin/pagos para ver los datos.");
}

main().catch((err) => {
  console.error("\nFalló el seed:", err);
  process.exit(1);
});
