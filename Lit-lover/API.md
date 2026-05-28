# BiblioTrack — Contrato de API REST + Esquema MySQL

Este frontend está construido con datos **mock en localStorage** (ver `src/lib/mock-db.ts`).
Para conectarlo a tu backend Node/Express + MySQL Workbench, reemplaza las llamadas
de `db.*` por `fetch()` a los endpoints documentados aquí.

## Admin quemado
Se crea automáticamente al iniciar:

```
correo:     admin@amd.com
password:   Admin123!
rol:        admin
```

En tu backend, insértalo en el seed con la contraseña **hasheada** (bcrypt).

---

## 1. Esquema MySQL (script para Workbench)

```sql
CREATE DATABASE IF NOT EXISTS bibliotrack
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bibliotrack;

CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  correo        VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE libros (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  autor       VARCHAR(160) NOT NULL,
  categoria   VARCHAR(80),
  isbn        VARCHAR(20),
  descripcion TEXT,
  imagen      VARCHAR(500),                   -- URL o ruta
  estado      ENUM('disponible','prestado','reservado') NOT NULL DEFAULT 'disponible',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prestamos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT NOT NULL,
  libro_id          INT NOT NULL,
  fecha_inicio      DATETIME NOT NULL,
  fecha_devolucion  DATETIME NOT NULL,
  estado            ENUM('activo','devuelto','atrasado') NOT NULL DEFAULT 'activo',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (libro_id)   REFERENCES libros(id)   ON DELETE CASCADE
);

CREATE TABLE reservas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  libro_id       INT NOT NULL,
  fecha_reserva  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado         ENUM('activa','cancelada','convertida') NOT NULL DEFAULT 'activa',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (libro_id)   REFERENCES libros(id)   ON DELETE CASCADE
);

-- Restricción: un libro no puede estar prestado y reservado a la vez.
-- Se modela vía `libros.estado` + lógica de servicio en el backend.
```

---

## 2. Endpoints REST esperados

Todos los `POST/PUT/DELETE` requieren `Authorization: Bearer <jwt>`.

### Autenticación
| Método | Ruta                          | Body                                     | Respuesta            |
|-------|--------------------------------|------------------------------------------|----------------------|
| POST  | `/api/auth/register`          | `{ nombre, correo, password }`           | `{ user, token }`    |
| POST  | `/api/auth/login`             | `{ correo, password }`                   | `{ user, token }`    |
| POST  | `/api/auth/forgot-password`   | `{ correo }`                             | `{ ok: true }` + email |
| POST  | `/api/auth/reset-password`    | `{ token, newPassword }`                 | `{ ok: true }`       |

Reglas de password (validar también en backend): mínimo 8, mayúscula, número y símbolo.

### Libros
| Método | Ruta                | Quién  | Notas                              |
|-------|----------------------|--------|------------------------------------|
| GET   | `/api/libros`        | todos  | lista catálogo                     |
| GET   | `/api/libros/:id`    | todos  | detalle                            |
| POST  | `/api/libros`        | admin  | `multipart/form-data` con `imagen` |
| PUT   | `/api/libros/:id`    | admin  | actualiza datos / imagen           |
| DELETE| `/api/libros/:id`    | admin  | elimina                            |

### Préstamos
| Método | Ruta                            | Quién  |
|-------|---------------------------------|--------|
| GET   | `/api/prestamos`                 | admin  |
| GET   | `/api/prestamos/me`              | user   |
| POST  | `/api/prestamos`                 | user   | `{ libro_id }` |
| POST  | `/api/prestamos/:id/devolver`    | user   |
| POST  | `/api/prestamos/:id/renovar`     | user   |

### Reservas
| Método | Ruta                       | Quién  |
|-------|----------------------------|--------|
| GET   | `/api/reservas/me`          | user   |
| POST  | `/api/reservas`             | user   | `{ libro_id }` |
| DELETE| `/api/reservas/:id`         | user   |

### Reportes (admin)
| Método | Ruta                  | Descripción                                    |
|-------|------------------------|------------------------------------------------|
| GET   | `/api/reportes/inventario` | totales por estado                        |
| GET   | `/api/reportes/deudores`   | usuarios con préstamos atrasados          |

---

## 3. Cómo conectar el frontend

En `src/lib/mock-db.ts`, reemplaza cada función por su `fetch` equivalente,
por ejemplo:

```ts
listLibros: async () => {
  const r = await fetch(`${API_URL}/api/libros`);
  return r.json();
},
```

Y guarda el JWT recibido en `localStorage` para enviarlo en el header
`Authorization` desde un wrapper de fetch.
