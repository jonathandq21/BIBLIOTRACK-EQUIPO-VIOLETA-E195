import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Ingresa tu correo"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
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
          {sent ? (
            <div className="text-center py-4 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Correo enviado</h2>
              <p className="text-muted-foreground mb-6">Revisa tu bandeja de entrada para restablecer tu contraseña.</p>
              <Link to="/login"><Button variant="outline" className="w-full"><ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio</Button></Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-foreground mb-2">Recuperar Contraseña</h2>
              <p className="text-muted-foreground text-sm mb-6">Ingresa tu correo y te enviaremos un enlace.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Enviar enlace
                </Button>
              </form>
              <Link to="/login" className="mt-4 text-sm text-secondary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Volver al inicio de sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
