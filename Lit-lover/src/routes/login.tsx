import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
      toast.error("Correo inválido.");
      return;
    }
    setLoading(true);
    try {
      const u = login(correo.trim(), password);
      toast.success(`Bienvenido, ${u.nombre}`);
      navigate({ to: u.rol === "admin" ? "/admin/books" : "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-elevated">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="BiblioTrack" className="h-16 w-16 object-contain" />
            <h1 className="mt-3 text-2xl font-bold">Iniciar sesión</h1>
            <p className="text-sm text-muted-foreground">Accede a tu cuenta de BiblioTrack</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 flex justify-between text-sm">
            <Link to="/forgot-password" className="text-accent hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/register" className="text-accent hover:underline">
              Crear cuenta
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
