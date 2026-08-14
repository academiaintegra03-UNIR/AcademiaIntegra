import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { enrollments } from "@/lib/data/admin";

export default function AdminMatriculasPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((e, i) => (
              <TableRow key={e.student + i}>
                <TableCell className="font-semibold">{e.student}</TableCell>
                <TableCell className="text-muted-foreground">{e.program}</TableCell>
                <TableCell>{e.plan}</TableCell>
                <TableCell>
                  <StatusBadge tone={e.tone}>{e.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
