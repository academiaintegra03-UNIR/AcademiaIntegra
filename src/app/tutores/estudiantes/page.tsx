import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { NameCell } from "@/components/shared/name-cell";
import { assignedStudents } from "@/lib/data/tutores";

export default function TutoresEstudiantesPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Próxima entrega</TableHead>
              <TableHead>Alerta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedStudents.map((s) => (
              <TableRow key={s.name}>
                <TableCell>
                  <NameCell name={s.name} />
                </TableCell>
                <TableCell className="text-muted-foreground">{s.group}</TableCell>
                <TableCell>{s.due}</TableCell>
                <TableCell>
                  <StatusBadge tone={s.tone}>{s.alert}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
