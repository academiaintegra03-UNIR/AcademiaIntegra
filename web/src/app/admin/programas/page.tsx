import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { programsAdmin } from "@/lib/data/admin";

export default function AdminProgramasPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Programa</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Cupos</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programsAdmin.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-semibold">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.level}</TableCell>
                <TableCell>{p.seats}</TableCell>
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
