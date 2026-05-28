import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { db, type Libro } from "@/lib/mock-db";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth role="user">
      <Dashboard />
    </RequireAuth>
  ),
});

function Dashboard() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const libros = useMemo(() => db.listLibros(), [tick]);
  const filtrados = useMemo(
    () =>
      libros.filter(
        (b) =>
          b.titulo.toLowerCase().includes(query.toLowerCase()) ||
          b.autor.toLowerCase().includes(query.toLowerCase()) ||
          b.categoria.toLowerCase().includes(query.toLowerCase()),
      ),
    [libros, query],
  );

  const reservar = (libro: Libro) => {
    if (libro.estado !== "disponible") {
      toast.error("Este libro no está disponible.");
      return;
    }
    db.addReserva(user!.id, libro.id);
    toast.success(`Reservaste "${libro.titulo}".`);
    refresh();
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Catálogo</h1>
            <p className="text-muted-foreground">Explora libros disponibles y reserva al instante.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, autor o categoría…"
              className="pl-9"
            />
          </div>
        </div>

        {filtrados.length === 0 ? (
          <p className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            No encontramos libros para esa búsqueda.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtrados.map((libro) => (
              <BookCard key={libro.id} libro={libro} onReservar={() => reservar(libro)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BookCard({ libro, onReservar }: { libro: Libro; onReservar: () => void }) {
  const estadoColor =
    libro.estado === "disponible"
      ? "bg-success/15 text-success"
      : libro.estado === "reservado"
        ? "bg-warning/20 text-warning-foreground"
        : "bg-muted text-muted-foreground";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-elevated">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={libro.imagen}
          alt={libro.titulo}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
        <Badge className={`absolute right-2 top-2 ${estadoColor}`}>{libro.estado}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold">{libro.titulo}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{libro.autor}</p>
        <p className="mt-1 text-xs text-muted-foreground">{libro.categoria}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link to="/book/$id" params={{ id: libro.id }}>
              <Eye className="mr-1 h-4 w-4" /> Ver
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={onReservar}
            disabled={libro.estado !== "disponible"}
            className="flex-1"
          >
            <BookmarkPlus className="mr-1 h-4 w-4" /> Reservar
          </Button>
        </div>
      </div>
    </article>
  );
}
