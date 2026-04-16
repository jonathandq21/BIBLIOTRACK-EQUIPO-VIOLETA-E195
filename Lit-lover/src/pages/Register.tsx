import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { toast.error("Completa todos los campos"); return; }
    if (password !== confirm) { toast.error("Las contraseñas no coinciden"); return; }
    if (password.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("¡Registro exitoso! Ya puedes iniciar sesión.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Error al registrarse");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">BiblioTrack</h1>
        </div>
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Crear Cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Crear Cuenta
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <Link to="/login" className="text-secondary hover:underline font-medium">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
