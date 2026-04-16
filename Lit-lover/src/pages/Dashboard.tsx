import { useEffect, useState } from "react";
import { BookOpen, BookCopy, CalendarCheck, Users, TrendingUp, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: 0, activeLoans: 0, pendingRes: 0, users: 0 });
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  const [popularBooks, setPopularBooks] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [booksRes, loansRes, resRes, usersRes] = await Promise.all([
        supabase.from("books").select("id", { count: "exact", head: true }),
        supabase.from("loans").select("id", { count: "exact", head: true }).in("status", ["active", "overdue"]),
        supabase.from("reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        books: booksRes.count || 0,
        activeLoans: loansRes.count || 0,
        pendingRes: resRes.count || 0,
        users: usersRes.count || 0,
      });

      const { data: loans } = await supabase
        .from("loans")
        .select("id, status, loan_date, books(title), profiles!loans_user_id_fkey(name)")
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentLoans(loans || []);

      const { data: books } = await supabase
        .from("books")
        .select("id, title, author, available, cover_color")
        .order("created_at", { ascending: false })
        .limit(4);
      setPopularBooks(books || []);
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Libros", value: stats.books, icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Préstamos Activos", value: stats.activeLoans, icon: BookCopy, color: "bg-secondary/10 text-secondary" },
    { label: "Reservas Pendientes", value: stats.pendingRes, icon: CalendarCheck, color: "bg-success/10 text-success" },
    { label: "Usuarios", value: stats.users, icon: Users, color: "bg-accent text-accent-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            ¡Hola, {user?.name || "Usuario"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Aquí tienes un resumen de tu biblioteca.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(stat => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
            </div>
            <div className="space-y-3">
              {recentLoans.map((loan: any) => (
                <div key={loan.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{loan.books?.title}</p>
                    <p className="text-xs text-muted-foreground">{loan.profiles?.name}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    loan.status === "active" ? "bg-success/10 text-success" :
                    loan.status === "overdue" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {loan.status === "active" ? "Activo" : loan.status === "overdue" ? "Vencido" : "Devuelto"}
                  </span>
                </div>
              ))}
              {recentLoans.length === 0 && <p className="text-sm text-muted-foreground">Sin actividad reciente.</p>}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-semibold text-foreground">Libros Populares</h2>
            </div>
            <div className="space-y-3">
              {popularBooks.map((book: any) => (
                <div key={book.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className={`w-10 h-14 rounded-md bg-gradient-to-br ${book.cover_color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                    book.available ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {book.available ? "Disponible" : "Prestado"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
