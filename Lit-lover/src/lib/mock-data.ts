export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
  available: boolean;
  coverColor: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "active" | "returned" | "overdue";
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  reservedDate: string;
  status: "pending" | "ready" | "cancelled";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const books: Book[] = [
  { id: "1", title: "Cien Años de Soledad", author: "Gabriel García Márquez", category: "Ficción", isbn: "978-0-06-088328-7", description: "Una de las obras más importantes de la literatura latinoamericana. Narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.", available: true, coverColor: "from-primary to-secondary" },
  { id: "2", title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", category: "Clásicos", isbn: "978-84-376-0494-7", description: "La historia del ingenioso hidalgo que, enloquecido por la lectura de libros de caballerías, decide convertirse en caballero andante.", available: true, coverColor: "from-secondary to-success" },
  { id: "3", title: "El Principito", author: "Antoine de Saint-Exupéry", category: "Infantil", isbn: "978-0-15-601219-5", description: "Un piloto se encuentra con un pequeño príncipe de otro planeta que le cuenta sus aventuras y reflexiones sobre la vida.", available: false, coverColor: "from-success to-primary" },
  { id: "4", title: "1984", author: "George Orwell", category: "Ciencia Ficción", isbn: "978-0-451-52493-5", description: "Una novela distópica que presenta una sociedad totalitaria donde el Gran Hermano lo vigila todo.", available: true, coverColor: "from-destructive to-primary" },
  { id: "5", title: "Rayuela", author: "Julio Cortázar", category: "Ficción", isbn: "978-84-376-0602-6", description: "Una novela experimental que puede leerse de múltiples maneras, siguiendo las instrucciones del autor.", available: true, coverColor: "from-primary to-accent" },
  { id: "6", title: "La Casa de los Espíritus", author: "Isabel Allende", category: "Ficción", isbn: "978-0-553-38380-6", description: "La saga de la familia Trueba a lo largo de cuatro generaciones, mezclando realismo mágico con historia política.", available: false, coverColor: "from-secondary to-destructive" },
  { id: "7", title: "Ficciones", author: "Jorge Luis Borges", category: "Cuentos", isbn: "978-0-8021-3305-9", description: "Colección de cuentos que exploran temas filosóficos como el infinito, los espejos y los laberintos.", available: true, coverColor: "from-primary to-success" },
  { id: "8", title: "Pedro Páramo", author: "Juan Rulfo", category: "Ficción", isbn: "978-0-8021-3368-4", description: "Juan Preciado viaja a Comala en busca de su padre Pedro Páramo, encontrando un pueblo habitado por fantasmas.", available: true, coverColor: "from-accent to-secondary" },
];

export const loans: Loan[] = [
  { id: "1", userId: "1", userName: "María González", bookId: "3", bookTitle: "El Principito", loanDate: "2024-01-15", dueDate: "2024-02-15", returnDate: null, status: "overdue" },
  { id: "2", userId: "2", userName: "Carlos Rodríguez", bookId: "6", bookTitle: "La Casa de los Espíritus", loanDate: "2024-03-01", dueDate: "2024-04-01", returnDate: null, status: "active" },
  { id: "3", userId: "3", userName: "Ana López", bookId: "1", bookTitle: "Cien Años de Soledad", loanDate: "2024-01-10", dueDate: "2024-02-10", returnDate: "2024-02-08", status: "returned" },
];

export const reservations: Reservation[] = [
  { id: "1", bookId: "3", bookTitle: "El Principito", reservedDate: "2024-03-10", status: "pending" },
  { id: "2", bookId: "6", bookTitle: "La Casa de los Espíritus", reservedDate: "2024-03-08", status: "ready" },
];

export const users: User[] = [
  { id: "1", name: "María González", email: "maria@email.com", role: "user" },
  { id: "2", name: "Carlos Rodríguez", email: "carlos@email.com", role: "user" },
  { id: "3", name: "Ana López", email: "ana@email.com", role: "admin" },
  { id: "4", name: "Pedro Martínez", email: "pedro@email.com", role: "user" },
];

export const categories = ["Ficción", "Clásicos", "Infantil", "Ciencia Ficción", "Cuentos", "Historia", "Poesía"];
