import { useEffect, useState } from "react";
import { Users, Shield, User, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

const UsersAdmin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });
      setUsers(profiles || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administración de Usuarios</h1>
          <p className="text-muted-foreground mt-1">Gestiona los usuarios del sistema.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Nombre</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Correo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => {
                    const role = u.user_roles?.[0]?.role || "user";
                    return (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-foreground">{u.name}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                            role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {role === "admin" ? "Admin" : "Usuario"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay usuarios.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersAdmin;
