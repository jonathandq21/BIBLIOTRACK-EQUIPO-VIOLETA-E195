import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, BookMarked, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: user.rol === "admin" ? "/admin/books" : "/dashboard" });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-16">
        <section className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Gestiona, organiza y conecta
            </span>
            <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">
              <span className="text-brand-gradient">BiblioTrack</span>
              <br />
              <span className="text-foreground">tu biblioteca, ordenada.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Sistema integral para bibliotecas que te permite consultar el catálogo, reservar libros,
              realizar préstamos y mantener el control total de tu inventario desde un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/register">
                  Empezar gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Administración" text="Gestión completa de libros, usuarios y reportes" />
              <Feature icon={<BookMarked className="h-5 w-5" />} title="Préstamos y reservas" text="Seguimiento de préstamos, reservas y vencimientos" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-brand-gradient opacity-20 blur-3xl" />
            <div className="rounded-3xl border bg-card p-8 shadow-elevated">
              <img src={logo} alt="BiblioTrack" className="mx-auto h-72 w-72 object-contain" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
