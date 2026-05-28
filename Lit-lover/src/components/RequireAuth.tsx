import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function RequireAuth({ children, role }: { children: ReactNode; role?: "admin" | "user" }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    } else if (role && user.rol !== role) {
      navigate({ to: user.rol === "admin" ? "/admin/books" : "/dashboard" });
    }
  }, [user, role, navigate]);

  if (!user) return null;
  if (role && user.rol !== role) return null;
  return <>{children}</>;
}
