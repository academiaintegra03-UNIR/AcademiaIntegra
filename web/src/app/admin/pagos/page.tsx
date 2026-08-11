import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { payments } from "@/lib/data/admin";

export default function AdminPagosPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transacción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p, i) => (
              <TableRow key={p.desc + i}>
                <TableCell className="font-semibold">{p.desc}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell className="text-muted-foreground">{p.method}</TableCell>
                <TableCell>
                  <StatusBadge tone={p.tone}>{p.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
