# TiendaVirtual — Equipo 5

Tienda virtual funcional desarrollada con FastAPI (backend) y React + Tailwind CSS (frontend).

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python 3.11, FastAPI |
| Base de datos | SQLite (desarrollo) → PostgreSQL (producción) |
| Autenticación | JWT + TOTP (doble factor) |

---

## Requisitos previos

Instalar en orden antes de clonar el proyecto:

- [Python 3.11+](https://python.org) — marcar **"Add to PATH"** al instalar
- [Node.js LTS](https://nodejs.org)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tienda-virtual.git
cd tienda-virtual
```

### 2. Configurar el backend

```bash
cd tienda-backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

Crear el archivo `.env` dentro de `tienda-backend/`:

```env
SECRET_KEY=mi_clave_super_secreta_cambiar_luego_123456789
DATABASE_URL=sqlite+aiosqlite:///./tienda.db
REDIS_URL=redis://localhost:6379
DEBUG=True
```

> Cuando el compañero de base de datos tenga PostgreSQL listo, reemplazar `DATABASE_URL` por:
> `postgresql+asyncpg://usuario:password@host/tienda_db`

Correr el backend:

```bash
uvicorn app.main:app --reload
```

El backend queda disponible en: http://localhost:8000
Documentación de la API: http://localhost:8000/docs

---

### 3. Configurar el frontend

Abrir una segunda terminal:

```bash
cd tienda-frontend
npm install
npm run dev
```

El frontend queda disponible en: http://localhost:5173

---

## Estructura del proyecto

```
tienda-virtual/
├── tienda-backend/
│   ├── app/
│   │   ├── core/           # Configuración, base de datos, seguridad
│   │   ├── models/         # Modelos SQLAlchemy (tablas)
│   │   ├── schemas/        # Validación con Pydantic
│   │   ├── routers/        # Rutas de la API
│   │   ├── services/       # Lógica de negocio
│   │   ├── middleware/     # Autenticación JWT
│   │   └── main.py
│   ├── .env                # Variables de entorno (no subir a Git)
│   └── requirements.txt
│
└── tienda-frontend/
    └── src/
        ├── pages/          # Vistas principales
        ├── components/     # Componentes reutilizables
        ├── context/        # Estado global (auth)
        ├── services/       # Llamadas a la API
        └── hooks/
```

---

## Funcionalidades implementadas

### Autenticación
- Registro de usuarios
- Login con JWT
- Doble factor de autenticación (Google Authenticator)
- Rutas protegidas

### Catálogo
- Listado de productos con imagen, precio y stock
- Búsqueda por nombre o descripción
- Filtrado por categoría y rango de precio
- Gestión de categorías

### Carrito y Pedidos
- Agregar y eliminar productos del carrito
- Cálculo automático del total
- Checkout con dirección de envío
- Historial de pedidos con estados

### Soporte
- Creación de tickets (queja, consulta, devolución, otro)
- Respuestas dentro del ticket
- Cambio de estado por el administrador

---

## Rutas de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |
| POST | /auth/verify-2fa | Verificar código 2FA | No |
| GET | /products/ | Listar productos | No |
| GET | /products/categories | Listar categorías | No |
| POST | /products/ | Crear producto | Sí |
| GET | /cart/ | Ver carrito | Sí |
| POST | /cart/add | Agregar al carrito | Sí |
| POST | /cart/checkout | Crear pedido | Sí |
| GET | /cart/orders | Ver pedidos | Sí |
| POST | /tickets/ | Crear ticket | Sí |
| GET | /tickets/me | Ver mis tickets | Sí |

---
