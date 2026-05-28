import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { BookCopy, BarChart3, Users } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireAuth role="admin">
      <AdminLayout />
    </RequireAuth>
  ),
});

function AdminLayout() {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/admin/books", label: "Libros", icon: BookCopy },
    { to: "/admin/users", label: "Usuarios", icon: Users },
    { to: "/admin/reports", label: "Reportes", icon: BarChart3 },
  ];
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <p className="text-muted-foreground">Gestiona libros, usuarios y reportes.</p>
        </div>
        <nav className="mb-6 flex flex-wrap gap-2 border-b">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </Link>
            );
          })}
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
