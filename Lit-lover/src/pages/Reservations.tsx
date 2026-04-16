import { useEffect, useState } from "react";
import { CalendarCheck, X, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "bg-secondary/10 text-secondary" },
  ready: { label: "Listo", cls: "bg-success/10 text-success" },
  cancelled: { label: "Cancelada", cls: "bg-destructive/10 text-destructive" },
};

const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    const { data } = await supabase
      .from("reservations")
      .select("*, books(title)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setReservations(data || []);
    setLoading(false);
  };

  useEffect(() => { if (user) loadReservations(); }, [user]);

  const handleCancel = async (id: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) { toast.error("Error al cancelar"); return; }
    toast("Reserva cancelada");
    loadReservations();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Reservas</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus reservas de libros.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Libro</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Fecha Reserva</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Estado</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r: any) => {
                    const s = statusMap[r.status] || statusMap.pending;
                    return (
                      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-foreground">{r.books?.title}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{r.reserved_date}</td>
                        <td className="p-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span></td>
                        <td className="p-4 text-right">
                          {r.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => handleCancel(r.id)}>
                              <X className="w-3 h-3 mr-1" /> Cancelar
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {reservations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tienes reservas.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reservations;
