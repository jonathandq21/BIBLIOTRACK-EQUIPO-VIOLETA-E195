import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookCopy, BookOpenCheck, BookmarkCheck, AlertTriangle } from "lucide-react";
import { db } from "@/lib/mock-db";

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

function Reports() {
  const stats = useMemo(() => {
    const libros = db.listLibros();
    const prestamos = db.listPrestamos();
    const reservas = db.listReservas();
    return {
      total: libros.length,
      disponibles: libros.filter((b) => b.estado === "disponible").length,
      prestados: libros.filter((b) => b.estado === "prestado").length,
      reservados: libros.filter((b) => b.estado === "reservado").length,
      activos: prestamos.filter((p) => p.estado !== "devuelto").length,
      atrasados: prestamos.filter((p) => p.estado === "atrasado").length,
      reservasActivas: reservas.filter((r) => r.estado === "activa").length,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={<BookCopy />} label="Total libros" value={stats.total} />
        <Card icon={<BookOpenCheck />} label="Disponibles" value={stats.disponibles} tone="success" />
        <Card icon={<BookmarkCheck />} label="Reservados" value={stats.reservados} tone="warning" />
        <Card icon={<AlertTriangle />} label="Atrasados" value={stats.atrasados} tone="danger" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Préstamos activos" value={stats.activos} />
        <Card label="Libros prestados" value={stats.prestados} />
        <Card label="Reservas activas" value={stats.reservasActivas} />
      </div>
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  value: number;
  tone?: "success" | "warning" | "danger";
}) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning-foreground"
        : tone === "danger"
          ? "text-destructive"
          : "text-primary";
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && <span className={toneCls}>{icon}</span>}
      </div>
      <div className={`mt-2 text-3xl font-bold ${toneCls}`}>{value}</div>
    </div>
  );
}
