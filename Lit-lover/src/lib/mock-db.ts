// Mock data layer using localStorage.
// Replace these functions with real fetch() calls to your MySQL backend.
// See API.md for the expected REST contract.

export type Role = "admin" | "user";

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  password: string; // mock only — real backend must hash (bcrypt)
  rol: Role;
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  isbn: string;
  descripcion: string;
  imagen: string; // data URL or remote URL
  estado: "disponible" | "prestado" | "reservado";
}

export interface Prestamo {
  id: string;
  usuario_id: string;
  libro_id: string;
  fecha_inicio: string;
  fecha_devolucion: string; // ISO date
  estado: "activo" | "devuelto" | "atrasado";
}

export interface Reserva {
  id: string;
  usuario_id: string;
  libro_id: string;
  fecha_reserva: string;
  estado: "activa" | "cancelada" | "convertida";
}

const KEYS = {
  usuarios: "bt_usuarios",
  libros: "bt_libros",
  prestamos: "bt_prestamos",
  reservas: "bt_reservas",
  session: "bt_session",
  seeded: "bt_seeded_v1",
};

const ADMIN: Usuario = {
  id: "admin-1",
  nombre: "Administrador",
  correo: "admin@amd.com",
  password: "Admin123!",
  rol: "admin",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const SAMPLE_BOOKS: Libro[] = [
  {
    id: "b1",
    titulo: "Cien Años de Soledad",
    autor: "Gabriel García Márquez",
    categoria: "Realismo mágico",
    isbn: "978-0307474728",
    descripcion:
      "La historia multigeneracional de la familia Buendía en el mítico pueblo de Macondo. Obra cumbre del realismo mágico latinoamericano.",
    imagen: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80",
    estado: "disponible",
  },
  {
    id: "b2",
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Fábula",
    isbn: "978-0156012195",
    descripcion:
      "Un piloto perdido en el desierto se encuentra con un pequeño príncipe llegado de otro planeta.",
    imagen: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=600&q=80",
    estado: "disponible",
  },
  {
    id: "b3",
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Distopía",
    isbn: "978-0451524935",
    descripcion:
      "En un futuro totalitario, Winston Smith lucha contra el control absoluto del Gran Hermano.",
    imagen: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&q=80",
    estado: "disponible",
  },
  {
    id: "b4",
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    categoria: "Clásico",
    isbn: "978-8420412146",
    descripcion:
      "Las aventuras del ingenioso hidalgo y su fiel escudero Sancho Panza por tierras de La Mancha.",
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    estado: "disponible",
  },
  {
    id: "b5",
    titulo: "Sapiens",
    autor: "Yuval Noah Harari",
    categoria: "Historia",
    isbn: "978-0062316097",
    descripcion:
      "Un recorrido por la historia de la humanidad desde la edad de piedra hasta el siglo XXI.",
    imagen: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    estado: "disponible",
  },
  {
    id: "b6",
    titulo: "El Nombre del Viento",
    autor: "Patrick Rothfuss",
    categoria: "Fantasía",
    isbn: "978-8401352836",
    descripcion:
      "La biografía del legendario mago Kvothe, narrada por él mismo en una posada perdida.",
    imagen: "https://images.unsplash.com/photo-1531901599143-df5010ab9438?w=600&q=80",
    estado: "disponible",
  },
];

function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;
  write(KEYS.usuarios, [ADMIN]);
  write(KEYS.libros, SAMPLE_BOOKS);
  write(KEYS.prestamos, []);
  write(KEYS.reservas, []);
  localStorage.setItem(KEYS.seeded, "1");
}

export const db = {
  init: seedIfNeeded,
  // Usuarios
  listUsuarios: () => read<Usuario[]>(KEYS.usuarios, [ADMIN]),
  findUsuarioByCorreo: (correo: string) =>
    read<Usuario[]>(KEYS.usuarios, [ADMIN]).find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase(),
    ),
  addUsuario: (u: Omit<Usuario, "id" | "rol">): Usuario => {
    const list = read<Usuario[]>(KEYS.usuarios, [ADMIN]);
    if (list.some((x) => x.correo.toLowerCase() === u.correo.toLowerCase())) {
      throw new Error("Ya existe una cuenta con ese correo.");
    }
    const nuevo: Usuario = { ...u, id: uid(), rol: "user" };
    write(KEYS.usuarios, [...list, nuevo]);
    return nuevo;
  },
  updatePassword: (correo: string, newPassword: string) => {
    const list = read<Usuario[]>(KEYS.usuarios, [ADMIN]);
    const idx = list.findIndex((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (idx === -1) throw new Error("Correo no registrado.");
    list[idx] = { ...list[idx], password: newPassword };
    write(KEYS.usuarios, list);
  },

  // Libros
  listLibros: () => read<Libro[]>(KEYS.libros, SAMPLE_BOOKS),
  getLibro: (id: string) => read<Libro[]>(KEYS.libros, SAMPLE_BOOKS).find((b) => b.id === id),
  addLibro: (l: Omit<Libro, "id" | "estado">): Libro => {
    const list = read<Libro[]>(KEYS.libros, SAMPLE_BOOKS);
    const nuevo: Libro = { ...l, id: uid(), estado: "disponible" };
    write(KEYS.libros, [nuevo, ...list]);
    return nuevo;
  },
  updateLibro: (id: string, patch: Partial<Libro>) => {
    const list = read<Libro[]>(KEYS.libros, SAMPLE_BOOKS);
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], ...patch };
    write(KEYS.libros, list);
  },
  deleteLibro: (id: string) => {
    const list = read<Libro[]>(KEYS.libros, SAMPLE_BOOKS).filter((b) => b.id !== id);
    write(KEYS.libros, list);
  },

  // Préstamos
  listPrestamos: () => recomputeAtrasos(read<Prestamo[]>(KEYS.prestamos, [])),
  addPrestamo: (usuario_id: string, libro_id: string, dias = 14): Prestamo => {
    const start = new Date();
    const end = new Date(start.getTime() + dias * 24 * 60 * 60 * 1000);
    const p: Prestamo = {
      id: uid(),
      usuario_id,
      libro_id,
      fecha_inicio: start.toISOString(),
      fecha_devolucion: end.toISOString(),
      estado: "activo",
    };
    write(KEYS.prestamos, [...read<Prestamo[]>(KEYS.prestamos, []), p]);
    db.updateLibro(libro_id, { estado: "prestado" });
    return p;
  },
  devolverPrestamo: (id: string) => {
    const list = read<Prestamo[]>(KEYS.prestamos, []);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], estado: "devuelto" };
    write(KEYS.prestamos, list);
    db.updateLibro(list[idx].libro_id, { estado: "disponible" });
  },
  renovarPrestamo: (id: string, dias = 7) => {
    const list = read<Prestamo[]>(KEYS.prestamos, []);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const nueva = new Date(
      new Date(list[idx].fecha_devolucion).getTime() + dias * 24 * 60 * 60 * 1000,
    ).toISOString();
    list[idx] = { ...list[idx], fecha_devolucion: nueva, estado: "activo" };
    write(KEYS.prestamos, list);
  },

  // Reservas
  listReservas: () => read<Reserva[]>(KEYS.reservas, []),
  addReserva: (usuario_id: string, libro_id: string): Reserva => {
    const r: Reserva = {
      id: uid(),
      usuario_id,
      libro_id,
      fecha_reserva: new Date().toISOString(),
      estado: "activa",
    };
    write(KEYS.reservas, [...read<Reserva[]>(KEYS.reservas, []), r]);
    db.updateLibro(libro_id, { estado: "reservado" });
    return r;
  },
  cancelarReserva: (id: string) => {
    const list = read<Reserva[]>(KEYS.reservas, []);
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], estado: "cancelada" };
    write(KEYS.reservas, list);
    // si era el único bloqueo, liberar libro
    const libroId = list[idx].libro_id;
    const activas = list.filter((r) => r.libro_id === libroId && r.estado === "activa");
    const prestamoActivo = read<Prestamo[]>(KEYS.prestamos, []).some(
      (p) => p.libro_id === libroId && p.estado !== "devuelto",
    );
    if (activas.length === 0 && !prestamoActivo) {
      db.updateLibro(libroId, { estado: "disponible" });
    }
  },

  // Session
  getSession: (): Usuario | null => read<Usuario | null>(KEYS.session, null),
  setSession: (u: Usuario | null) => write(KEYS.session, u),
};

function recomputeAtrasos(list: Prestamo[]) {
  const now = Date.now();
  return list.map((p) =>
    p.estado === "activo" && new Date(p.fecha_devolucion).getTime() < now
      ? { ...p, estado: "atrasado" as const }
      : p,
  );
}

// Validador de contraseña (mín 8, mayúscula, número, símbolo)
export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Mínimo 8 caracteres.";
  if (!/[A-Z]/.test(pw)) return "Debe incluir al menos una mayúscula.";
  if (!/[0-9]/.test(pw)) return "Debe incluir al menos un número.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Debe incluir al menos un símbolo.";
  return null;
}
