import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { db, type Usuario } from "./mock-db";

interface AuthCtx {
  user: Usuario | null;
  login: (correo: string, password: string) => Usuario;
  register: (nombre: string, correo: string, password: string) => Usuario;
  logout: () => void;
  resetPassword: (correo: string, newPassword: string) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    db.init();
    setUser(db.getSession());
  }, []);

  const value: AuthCtx = {
    user,
    login(correo, password) {
      const u = db.findUsuarioByCorreo(correo);
      if (!u || u.password !== password) throw new Error("Credenciales incorrectas.");
      db.setSession(u);
      setUser(u);
      return u;
    },
    register(nombre, correo, password) {
      const u = db.addUsuario({ nombre, correo, password });
      db.setSession(u);
      setUser(u);
      return u;
    },
    logout() {
      db.setSession(null);
      setUser(null);
    },
    resetPassword(correo, newPassword) {
      db.updatePassword(correo, newPassword);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
}
