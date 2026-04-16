import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = ["Ficción", "Clásicos", "Infantil", "Ciencia Ficción", "Cuentos", "Historia", "Poesía"];
const coverColors = [
  "from-primary to-secondary",
  "from-blue-500 to-purple-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
];

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: any;
  onSaved: () => void;
}

export default function BookFormDialog({ open, onOpenChange, book, onSaved }: BookFormDialogProps) {
  const isEdit = !!book;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Ficción",
    isbn: "",
    description: "",
    cover_color: coverColors[0],
    available: true,
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        category: book.category || "Ficción",
        isbn: book.isbn || "",
        description: book.description || "",
        cover_color: book.cover_color || coverColors[0],
        available: book.available ?? true,
      });
    } else {
      setForm({ title: "", author: "", category: "Ficción", isbn: "", description: "", cover_color: coverColors[0], available: true });
    }
  }, [book, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      toast.error("Título y autor son obligatorios");
      return;
    }
    setLoading(true);
    if (isEdit) {
      const { error } = await supabase.from("books").update(form).eq("id", book.id);
      if (error) { toast.error("Error al actualizar libro"); setLoading(false); return; }
      toast.success("Libro actualizado");
    } else {
      const { error } = await supabase.from("books").insert(form);
      if (error) { toast.error("Error al crear libro"); setLoading(false); return; }
      toast.success("Libro creado");
    }
    setLoading(false);
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Libro" : "Nuevo Libro"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={200} />
            </div>
            <div className="space-y-1.5">
              <Label>Autor *</Label>
              <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} maxLength={200} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>ISBN</Label>
              <Input value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} maxLength={20} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Color de portada</Label>
            <div className="flex gap-2">
              {coverColors.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm(f => ({ ...f, cover_color: c }))}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 transition-all ${form.cover_color === c ? "border-foreground scale-110" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} maxLength={1000} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {isEdit ? "Guardar cambios" : "Crear libro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
