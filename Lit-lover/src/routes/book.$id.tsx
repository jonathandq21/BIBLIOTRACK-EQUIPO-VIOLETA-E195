import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, BookmarkPlus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/mock-db";

export const Route = createFileRoute("/book/$id")({
  component: () => (
    <RequireAuth>
      <BookDetail />
    </RequireAuth>
  ),
});

function BookDetail() {
  const { id } = useParams({ from: "/book/$id" });
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const libro = useMemo(() => db.getLibro(id), [id, tick]);

  if (!libro) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <div className="container mx-auto py-16 text-center">
          <p className="text-muted-foreground">Libro no encontrado.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Volver al catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  const reservar = () => {
    if (libro.estado !== "disponible") return toast.error("Este libro no está disponible.");
    db.addReserva(user!.id, libro.id);
    toast.success(`Reservaste "${libro.titulo}".`);
    setTick((t) => t + 1);
  };

  const prestar = () => {
    if (libro.estado !== "disponible") return toast.error("Este libro no está disponible.");
    db.addPrestamo(user!.id, libro.id, 14);
    toast.success(`Préstamo creado por 14 días.`);
    setTick((t) => t + 1);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/dashboard">
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-[320px_1fr]">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-elevated">
            <img src={libro.imagen} alt={libro.titulo} className="aspect-[3/4] w-full object-cover" />
          </div>

          <div>
            <Badge
              className={
                libro.estado === "disponible"
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground"
              }
            >
              {libro.estado}
            </Badge>
            <h1 className="mt-3 text-4xl font-bold">{libro.titulo}</h1>
            <p className="mt-1 text-lg text-muted-foreground">por {libro.autor}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Field label="Categoría" value={libro.categoria} />
              <Field label="ISBN" value={libro.isbn} />
            </dl>

            <h2 className="mt-8 text-lg font-semibold">Descripción</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{libro.descripcion}</p>

            {user?.rol === "user" && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={reservar} disabled={libro.estado !== "disponible"}>
                  <BookmarkPlus className="mr-2 h-4 w-4" /> Reservar
                </Button>
                <Button variant="outline" onClick={prestar} disabled={libro.estado !== "disponible"}>
                  <BookOpen className="mr-2 h-4 w-4" /> Pedir prestado
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
