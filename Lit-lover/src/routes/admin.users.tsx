import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/mock-db";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const data = useMemo(() => {
    const usuarios = db.listUsuarios();
    const libros = db.listLibros();
    const prestamos = db.listPrestamos();
    const findLibro = (id: string) => libros.find((b) => b.id === id);

    return usuarios.map((u) => {
      const activos = prestamos.filter(
        (p) => p.usuario_id === u.id && p.estado !== "devuelto",
      );
      return {
        ...u,
        activos: activos.map((p) => ({ ...p, libro: findLibro(p.libro_id) })),
        atrasados: activos.filter((p) => p.estado === "atrasado").length,
      };
    });
  }, []);

  const deudores = data.filter((u) => u.atrasados > 0);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xl font-semibold">Usuarios con libros prestados</h2>
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Préstamos activos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{u.nombre}</td>
                  <td className="px-4 py-3">{u.correo}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.rol === "admin" ? "default" : "secondary"}>{u.rol}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {u.activos.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <ul className="space-y-1">
                        {u.activos.map((p) => (
                          <li key={p.id} className="flex items-center gap-2">
                            <span>{p.libro?.titulo ?? "—"}</span>
                            {p.estado === "atrasado" && (
                              <Badge variant="destructive">Atrasado</Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Usuarios que deben libros</h2>
        {deudores.length === 0 ? (
          <p className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
            No hay deudores en este momento.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {deudores.map((u) => (
              <div key={u.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{u.nombre}</div>
                    <div className="text-xs text-muted-foreground">{u.correo}</div>
                  </div>
                  <Badge variant="destructive">{u.atrasados} atrasado(s)</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
