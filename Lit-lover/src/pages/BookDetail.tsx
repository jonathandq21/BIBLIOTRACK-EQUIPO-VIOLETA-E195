import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Tag, Hash, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("books").select("*").eq("id", id!).maybeSingle();
      setBook(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleReserve = async () => {
    if (!user || !book) return;
    const { error } = await supabase.from("reservations").insert({
      user_id: user.id,
      book_id: book.id,
    });
    if (error) { toast.error("Error al reservar"); return; }
    toast.success(`"${book.title}" reservado exitosamente`);
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  if (!book) return (
    <DashboardLayout>
      <div className="text-center py-20 text-muted-foreground">
        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Libro no encontrado</p>
        <Link to="/catalog"><Button variant="outline" className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button></Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className={`h-72 lg:h-full rounded-xl bg-gradient-to-br ${book.cover_color} flex items-center justify-center`}>
            <BookOpen className="w-20 h-20 text-primary-foreground/60" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{book.title}</h1>
              <p className="text-lg text-muted-foreground mt-1">{book.author}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {book.available ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Disponible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                  <XCircle className="w-4 h-4" /> No disponible
                </span>
              )}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Tag className="w-3 h-3" /> Categoría</div>
                <p className="font-medium text-foreground">{book.category}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Hash className="w-3 h-3" /> ISBN</div>
                <p className="font-medium text-foreground text-sm">{book.isbn}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><User className="w-3 h-3" /> Autor</div>
                <p className="font-medium text-foreground">{book.author}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>
            <Button size="lg" disabled={!book.available} onClick={handleReserve}>
              {book.available ? "Reservar este libro" : "No disponible"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookDetail;
