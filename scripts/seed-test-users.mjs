// One-off dev tooling script — not part of the app bundle.
// Usage (from web/): node --env-file=.env.local scripts/seed-test-users.mjs
//
// Creates one confirmed auth user per role via the Admin API. Requires
// migrations/0001_profiles.sql to already be applied — its trigger is what
// turns each created user into a row in `profiles`.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_PASSWORD = "Prueba123!";

const testUsers = [
  { role: "estudiante", nombre: "Mariana Gómez", email: "estudiante@test.academiaintegra.com" },
  { role: "acudiente", nombre: "Luisa Gómez", email: "acudiente@test.academiaintegra.com" },
  { role: "colegio", nombre: "Colegio San Rafael", email: "colegio@test.academiaintegra.com" },
  { role: "tutor", nombre: "Andrés Rojas", email: "tutor@test.academiaintegra.com" },
  { role: "administrador", nombre: "Sofía Arango", email: "admin@test.academiaintegra.com" },
];

for (const { role, nombre, email } of testUsers) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { role, nombre },
  });

  if (error) {
    console.error(`✗ ${email}: ${error.message}`);
    continue;
  }

  console.log(`✓ ${email} (${role}) — id ${data.user.id}`);
}
