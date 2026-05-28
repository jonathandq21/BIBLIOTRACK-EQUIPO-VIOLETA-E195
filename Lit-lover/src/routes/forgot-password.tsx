import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import { db, validatePassword } from "@/lib/mock-db";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [correo, setCorreo] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const onRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const u = db.findUsuarioByCorreo(correo.trim());
    if (!u) return toast.error("No existe una cuenta con ese correo.");
    toast.success(
      "Enviamos un enlace de recuperación a tu correo (simulado). Define tu nueva contraseña abajo.",
    );
    setStep("reset");
  };

  const onReset = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePassword(newPw);
    if (err) return toast.error(err);
    if (newPw !== confirm) return toast.error("Las contraseñas no coinciden.");
    try {
      resetPassword(correo.trim(), newPw);
      toast.success("Contraseña actualizada. Ya puedes iniciar sesión.");
      setStep("request");
      setCorreo("");
      setNewPw("");
      setConfirm("");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-elevated">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="BiblioTrack" className="h-14 w-14 object-contain" />
            <h1 className="mt-3 text-2xl font-bold">Recuperar contraseña</h1>
            <p className="text-center text-sm text-muted-foreground">
              {step === "request"
                ? "Te enviaremos un enlace seguro a tu correo."
                : "Define una nueva contraseña."}
            </p>
          </div>

          {step === "request" ? (
            <form onSubmit={onRequest} className="space-y-4">
              <div>
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Enviar enlace</Button>
            </form>
          ) : (
            <form onSubmit={onReset} className="space-y-4">
              <div>
                <Label htmlFor="np">Nueva contraseña</Label>
                <Input id="np" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="cf">Confirmar</Label>
                <Input id="cf" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Actualizar contraseña</Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-accent hover:underline">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
