import { useEffect, useState } from "react";
import { BookCopy, RotateCcw, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: "Activo", cls: "bg-success/10 text-success" },
  overdue: { label: "Vencido", cls: "bg-destructive/10 text-destructive" },
  returned: { label: "Devuelto", cls: "bg-muted text-muted-foreground" },
};

const Loans = () => {
  const { user, isAdmin } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = async () => {
    let query = supabase
      .from("loans")
      .select("*, books(title), profiles!loans_user_id_fkey(name)")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq("user_id", user!.id);
    }

    const { data } = await query;
    setLoans(data || []);
    setLoading(false);
  };

  useEffect(() => { if (user) loadLoans(); }, [user]);

  const handleReturn = async (loan: any) => {
    const { error } = await supabase
      .from("loans")
      .update({ status: "returned", return_date: new Date().toISOString().split("T")[0] })
      .eq("id", loan.id);
    if (error) { toast.error("Error al devolver"); return; }
    // Mark book as available again
    await supabase.from("books").update({ available: true }).eq("id", loan.book_id);
    toast.success("Libro devuelto");
    loadLoans();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isAdmin ? "Gestión de Préstamos" : "Mis Préstamos"}</h1>
          <p className="text-muted-foreground mt-1">Gestiona {isAdmin ? "los" : "tus"} préstamos de libros.</p>
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
                    <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Usuario</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Fecha Préstamo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Fecha Límite</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Estado</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan: any) => {
                    const s = statusMap[loan.status] || statusMap.active;
                    return (
                      <tr key={loan.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-foreground">{loan.books?.title}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{loan.profiles?.name}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{loan.loan_date}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{loan.due_date}</td>
                        <td className="p-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span></td>
                        <td className="p-4 text-right">
                          {loan.status !== "returned" && isAdmin && (
                            <Button size="sm" variant="outline" onClick={() => handleReturn(loan)}>
                              <RotateCcw className="w-3 h-3 mr-1" /> Devolver
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {loans.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookCopy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay préstamos.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Loans;
