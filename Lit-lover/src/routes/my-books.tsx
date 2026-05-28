import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/mock-db";

export const Route = createFileRoute("/my-books")({
  component: () => (
    <RequireAuth role="user">
      <MyBooks />
    </RequireAuth>
  ),
});

function MyBooks() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const { reservas, prestamos } = useMemo(() => {
    const libros = db.listLibros();
    const lookup = (id: string) => libros.find((b) => b.id === id);
    return {
      reservas: db
        .listReservas()
        .filter((r) => r.usuario_id === user!.id && r.estado === "activa")
        .map((r) => ({ ...r, libro: lookup(r.libro_id) })),
      prestamos: db
        .listPrestamos()
        .filter((p) => p.usuario_id === user!.id && p.estado !== "devuelto")
        .map((p) => ({ ...p, libro: lookup(p.libro_id) })),
    };
  }, [user, tick]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Mis libros</h1>
        <p className="text-muted-foreground">Gestiona tus reservas y préstamos activos.</p>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">Reservas activas</h2>
          {reservas.length === 0 ? (
            <Empty text="No tienes reservas." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reservas.map((r) => (
                <Row
                  key={r.id}
                  titulo={r.libro?.titulo ?? "—"}
                  imagen={r.libro?.imagen}
                  meta={`Reservado el ${new Date(r.fecha_reserva).toLocaleDateString()}`}
                  badge={<Badge className="bg-warning/20 text-warning-foreground">Reservado</Badge>}
                  actions={
                    <>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/book/$id" params={{ id: r.libro_id }}>Ver</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          db.cancelarReserva(r.id);
                          toast.success("Reserva cancelada.");
                          refresh();
                        }}
                      >
                        Quitar
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">Préstamos</h2>
          {prestamos.length === 0 ? (
            <Empty text="No tienes préstamos activos." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {prestamos.map((p) => {
                const atrasado = p.estado === "atrasado";
                return (
                  <Row
                    key={p.id}
                    titulo={p.libro?.titulo ?? "—"}
                    imagen={p.libro?.imagen}
                    meta={`Devolver el ${new Date(p.fecha_devolucion).toLocaleDateString()}`}
                    badge={
                      atrasado ? (
                        <Badge variant="destructive">Atrasado</Badge>
                      ) : (
                        <Badge className="bg-success/15 text-success">Activo</Badge>
                      )
                    }
                    actions={
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            db.renovarPrestamo(p.id, 7);
                            toast.success("Préstamo renovado 7 días.");
                            refresh();
                          }}
                        >
                          Renovar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            db.devolverPrestamo(p.id);
                            toast.success("Libro devuelto.");
                            refresh();
                          }}
                        >
                          Devolver
                        </Button>
                      </>
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Row({
  titulo,
  imagen,
  meta,
  badge,
  actions,
}: {
  titulo: string;
  imagen?: string;
  meta: string;
  badge: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-3">
      {imagen && (
        <img src={imagen} alt={titulo} className="h-24 w-16 flex-none rounded-md object-cover" />
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold">{titulo}</h3>
          {badge}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
        <div className="mt-auto flex gap-2 pt-2">{actions}</div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">{text}</p>;
}
