import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.rol === "admin";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="BiblioTrack" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-brand-gradient">BiblioTrack</span>
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {!isAdmin && (
              <>
                <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                  Catálogo
                </Link>
                <Link to="/my-books" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                  Mis libros
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/books" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                  Libros
                </Link>
                <Link to="/admin/users" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                  Usuarios
                </Link>
                <Link to="/admin/reports" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                  Reportes
                </Link>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground sm:inline-flex">
                {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                {user.nombre}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-1 h-4 w-4" /> Salir
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/login" })}>
                Iniciar sesión
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/register" })}>
                <BookOpen className="mr-1 h-4 w-4" /> Registrarme
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
