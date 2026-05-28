import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db, type Libro } from "@/lib/mock-db";

export const Route = createFileRoute("/admin/books")({
  component: AdminBooks,
});

function emptyForm() {
  return {
    titulo: "",
    autor: "",
    categoria: "",
    isbn: "",
    descripcion: "",
    imagen: "",
  };
}

function AdminBooks() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const libros = useMemo(() => db.listLibros(), [tick]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Libro | null>(null);
  const [form, setForm] = useState(emptyForm());
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };
  const openEdit = (l: Libro) => {
    setEditing(l);
    setForm({
      titulo: l.titulo,
      autor: l.autor,
      categoria: l.categoria,
      isbn: l.isbn,
      descripcion: l.descripcion,
      imagen: l.imagen,
    });
    setOpen(true);
  };

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 2_000_000) return toast.error("Imagen máxima 2MB.");
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imagen: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.autor.trim()) return toast.error("Título y autor son obligatorios.");
    if (!form.imagen) return toast.error("Sube una imagen del libro.");
    if (editing) {
      db.updateLibro(editing.id, form);
      toast.success("Libro actualizado.");
    } else {
      db.addLibro(form);
      toast.success("Libro creado.");
    }
    setOpen(false);
    refresh();
  };

  const onDelete = (id: string) => {
    if (!confirm("¿Eliminar este libro?")) return;
    db.deleteLibro(id);
    toast.success("Libro eliminado.");
    refresh();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Catálogo ({libros.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" /> Nuevo libro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar libro" : "Crear libro"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Título</Label>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
                </div>
                <div>
                  <Label>Autor</Label>
                  <Input value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} required />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>ISBN</Label>
                  <Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Descripción</Label>
                  <Textarea
                    rows={3}
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Imagen del libro</Label>
                  <div className="flex items-center gap-3">
                    {form.imagen && (
                      <img src={form.imagen} alt="" className="h-20 w-14 rounded-md border object-cover" />
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                      <Upload className="mr-1 h-4 w-4" />
                      {form.imagen ? "Cambiar imagen" : "Subir imagen"}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editing ? "Guardar cambios" : "Crear libro"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Libro</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">ISBN</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={l.imagen} alt="" className="h-12 w-9 rounded object-cover" />
                    <div>
                      <div className="font-medium">{l.titulo}</div>
                      <div className="text-xs text-muted-foreground">{l.autor}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{l.categoria}</td>
                <td className="px-4 py-3 font-mono text-xs">{l.isbn}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      l.estado === "disponible"
                        ? "bg-success/15 text-success"
                        : l.estado === "reservado"
                          ? "bg-warning/20 text-warning-foreground"
                          : "bg-muted text-muted-foreground"
                    }
                  >
                    {l.estado}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(l)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(l.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
