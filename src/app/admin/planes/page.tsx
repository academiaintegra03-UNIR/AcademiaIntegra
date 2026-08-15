import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/lib/types/billing";
import { Button } from "@/components/ui/button";
import { PlanFormDialog } from "@/features/admin/plan-form-dialog";
import { PlansTable } from "@/features/admin/plans-table";

async function getPlans(): Promise<Plan[]> {
  // Admin necesita ver también los planes inactivos, así que usa el
  // cliente admin en vez del cliente normal (que por RLS solo ve activos).
  const admin = createAdminClient();
  const { data, error } = await admin.from("plans").select("*").order("price_cop");

  if (error) {
    console.error("Failed to load plans:", error);
    return [];
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    type: p.type,
    priceCop: p.price_cop,
    seatLimit: p.seat_limit,
    period: p.period,
    badge: p.badge,
    features: p.features,
    groupLabel: p.group_label,
    active: p.active,
  }));
}

export default async function AdminPlanesPage() {
  const plans = await getPlans();
  const existingGroupLabels = Array.from(
    new Set(plans.map((p) => p.groupLabel).filter((l): l is string => Boolean(l)))
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <PlanFormDialog
          existingGroupLabels={existingGroupLabels}
          trigger={<Button size="sm">+ Crear plan</Button>}
        />
      </div>
      <PlansTable plans={plans} existingGroupLabels={existingGroupLabels} />
    </div>
  );
}
