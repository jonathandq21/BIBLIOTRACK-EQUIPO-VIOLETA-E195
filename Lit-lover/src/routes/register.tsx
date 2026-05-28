import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import { validatePassword } from "@/lib/mock-db";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 2) return toast.error("Nombre demasiado corto.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) return toast.error("Correo inválido.");
    const pwErr = validatePassword(password);
    if (pwErr) return toast.error(pwErr);
    if (password !== confirm) return toast.error("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      register(nombre.trim(), correo.trim(), password);
      toast.success("Cuenta creada. ¡Bienvenido!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-elevated">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="BiblioTrack" className="h-16 w-16 object-contain" />
            <h1 className="mt-3 text-2xl font-bold">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground">Únete a BiblioTrack</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Mínimo 8 caracteres, una mayúscula, un número y un símbolo.
              </p>
            </div>
            <div>
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando…" : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
