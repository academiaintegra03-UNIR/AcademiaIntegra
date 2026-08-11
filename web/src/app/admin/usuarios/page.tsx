import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { NameCell } from "@/components/shared/name-cell";
import { CreateUserDialog } from "@/features/admin/create-user-dialog";
import { roleFilters, users } from "@/lib/data/admin";

export default function AdminUsuariosPage() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {roleFilters.map((rf) => (
            <Badge key={rf} variant="outline" className="h-auto px-3 py-1.5 text-xs">
              {rf}
            </Badge>
          ))}
        </div>
        <CreateUserDialog />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.email}>
                  <TableCell>
                    <NameCell name={u.name} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <StatusBadge tone={u.roleTone}>{u.role}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={u.statusTone}>{u.status}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
