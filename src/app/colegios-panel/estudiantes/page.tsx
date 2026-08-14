import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { NameCell } from "@/components/shared/name-cell";
import { students } from "@/lib/data/colegios-panel";

export default function ColegiosEstudiantesPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Avance</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.name}>
                <TableCell>
                  <NameCell name={s.name} />
                </TableCell>
                <TableCell className="text-muted-foreground">{s.group}</TableCell>
                <TableCell>{s.pct}%</TableCell>
                <TableCell>
                  <StatusBadge tone={s.tone}>{s.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
