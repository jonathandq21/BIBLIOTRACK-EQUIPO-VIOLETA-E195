import { ReactNode } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, Library, BookCopy, CalendarCheck, Bell, Users, LogOut, Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Catálogo", path: "/catalog", icon: Library },
  { title: "Mis Préstamos", path: "/loans", icon: BookCopy },
  { title: "Mis Reservas", path: "/reservations", icon: CalendarCheck },
  { title: "Notificaciones", path: "/notifications", icon: Bell },
];

const adminItems = [
  { title: "Usuarios", path: "/users", icon: Users },
];

function SidebarContent({ currentPath, onNavigate }: { currentPath: string; onNavigate?: () => void }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const items = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-primary">BiblioTrack</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map(item => {
          const active = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-muted truncate">{user?.role === "admin" ? "Administrador" : "Usuario"}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={async () => { await logout(); navigate("/login"); }}
        >
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:block w-64 border-r border-border shrink-0">
        <SidebarContent currentPath={location.pathname} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border h-14 flex items-center px-4">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
          </SheetTrigger>
          <div className="flex items-center gap-2 ml-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">BiblioTrack</span>
          </div>
        </div>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent currentPath={location.pathname} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
