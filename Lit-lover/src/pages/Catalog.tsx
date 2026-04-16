import { useState, useEffect, useCallback } from "react";
import { Search, Filter, BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BookFormDialog from "@/components/BookFormDialog";

const categories = ["Ficción", "Clásicos", "Infantil", "Ciencia Ficción", "Cuentos", "Historia", "Poesía"];

const Catalog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [editBook, setEditBook] = useState<any>(null);
  const [deleteBook, setDeleteBook] = useState<any>(null);

  const loadBooks = useCallback(async () => {
    const { data } = await supabase.from("books").select("*").order("title");
    setBooks(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search);
    const matchCat = category === "all" || b.category === category;
    return matchSearch && matchCat;
  });

  const handleReserve = async (book: any) => {
    if (!user) return;
    const { error } = await supabase.from("reservations").insert({
      user_id: user.id,
      book_id: book.id,
    });
    if (error) { toast.error("Error al reservar"); return; }
    toast.success(`"${book.title}" reservado`);
  };

  const handleDelete = async () => {
    if (!deleteBook) return;
    const { error } = await supabase.from("books").delete().eq("id", deleteBook.id);
    if (error) { toast.error("Error al eliminar libro"); return; }
    toast.success("Libro eliminado");
    setDeleteBook(null);
    loadBooks();
  };

  const openEdit = (book: any) => { setEditBook(book); setFormOpen(true); };
  const openCreate = () => { setEditBook(null); setFormOpen(true); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Catálogo de Libros</h1>
            <p className="text-muted-foreground mt-1">Explora y reserva libros de nuestra colección.</p>
          </div>
          {isAdmin && (
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Nuevo libro</Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por título, autor o ISBN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Cargando...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(book => (
              <div key={book.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group relative">
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => openEdit(book)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => setDeleteBook(book)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                <div className={`h-40 bg-gradient-to-br ${book.cover_color} flex items-center justify-center`}>
                  <BookOpen className="w-12 h-12 text-primary-foreground/80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      book.available ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}>
                      {book.available ? "Disponible" : "Prestado"}
                    </span>
                    <span className="text-xs text-muted-foreground">{book.category}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link to={`/book/${book.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">Ver más</Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      disabled={!book.available}
                      onClick={() => handleReserve(book)}
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron libros.</p>
          </div>
        )}
      </div>

      <BookFormDialog open={formOpen} onOpenChange={setFormOpen} book={editBook} onSaved={loadBooks} />

      <AlertDialog open={!!deleteBook} onOpenChange={open => !open && setDeleteBook(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar libro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente "{deleteBook?.title}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Catalog;
