import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminPaymentRow } from "@/lib/types/billing";
import type { PaymentStatus } from "@/lib/supabase/database.types";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";

const STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  declined: "Rechazado",
  error: "Error",
  voided: "Anulado",
};

const STATUS_TONE: Record<PaymentStatus, StatusTone> = {
  pending: "warning",
  approved: "success",
  declined: "error",
  error: "error",
  voided: "neutral",
};

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
    value
  );
}

async function getPayments(): Promise<AdminPaymentRow[]> {
  const admin = createAdminClient();
  const { data: payments, error } = await admin
    .from("payments")
    .select("id, reference, plan_id, email, nombre, amount_cop, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Failed to load payments:", error);
    return [];
  }
  if (payments.length === 0) return [];

  const { data: plans } = await admin.from("plans").select("id, name");
  const planNameById = new Map(plans?.map((p) => [p.id, p.name]) ?? []);

  return payments.map((p) => ({
    id: p.id,
    reference: p.reference,
    planName: planNameById.get(p.plan_id) ?? "—",
    email: p.email,
    nombre: p.nombre,
    amountCop: p.amount_cop,
    status: p.status,
    createdAt: p.created_at,
  }));
}

export default async function AdminPagosPage() {
  const payments = await getPayments();

  const approved = payments.filter((p) => p.status === "approved");
  const totalApprovedCop = approved.reduce((sum, p) => sum + p.amountCop, 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard label="Pagos recibidos" value={String(payments.length)} />
        <StatCard label="Aprobados" value={String(approved.length)} />
        <StatCard label="Pendientes" value={String(pendingCount)} />
        <StatCard label="Total aprobado" value={formatCop(totalApprovedCop)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    Todavía no hay pagos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-semibold">{p.nombre}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </TableCell>
                    <TableCell>{p.planName}</TableCell>
                    <TableCell>{formatCop(p.amountCop)}</TableCell>
                    <TableCell>
                      <StatusBadge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</StatusBadge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
