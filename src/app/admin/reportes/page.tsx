import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { scheduledReports } from "@/lib/data/admin";

export default function AdminReportesPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporte</TableHead>
              <TableHead>Destinatario</TableHead>
              <TableHead>Programado</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledReports.map((r, i) => (
              <TableRow key={r.title + i}>
                <TableCell className="font-semibold">{r.title}</TableCell>
                <TableCell className="text-muted-foreground">{r.to}</TableCell>
                <TableCell>{r.when}</TableCell>
                <TableCell>
                  <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
