# ☕ Cafecito Feliz — POS

Sistema de **Punto de Venta (MVP)** para *Cafecito Feliz*, una cafetería en Aguascalientes.
Permite vender (carrito, total y ticket), registrar y buscar clientes con **descuentos progresivos
por recurrencia**, y gestionar productos.

> Proyecto de aprendizaje desarrollado con **Scrum**, sprint a sprint.

| Módulo | Qué incluye | Estado |
|---|---|---|
| Productos | Listado y búsqueda · CRUD (admin) | 🟡 Listado listo |
| Clientes | Registro y búsqueda | ⚪ Pendiente |
| Ventas | Carrito, descuento automático, ticket | ⚪ Pendiente |
| Autenticación | Roles vendedor / administrador | ⚪ Pendiente |

---

## 🧰 Requisitos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | 2.30+ | `git --version` |
| MongoDB | 6+ (local, Docker o Atlas) | servicio corriendo en `localhost:27017` |

## 📦 Instalación

```bash
git clone https://github.com/filthycbaz/pos-cafecito.git
cd pos-cafecito

cd backend && npm install
cd ../frontend && npm install
```

## ⚙️ Variables de entorno

Cada desarrollador crea sus propios archivos a partir de los ejemplos. **Nunca se suben a Git.**

| Archivo | Se crea desde | Variables |
|---|---|---|
| `backend/.env` | `backend/.env.example` | `PORT`, `NODE_ENV`, `DB_CONNECTION_STRING`, `FRONTEND_URL` |
| `frontend/.env.local` | `frontend/.env.example` | `VITE_API_URL` |

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

> El frontend usa **Vite**, por eso sus variables empiezan con `VITE_` (no `REACT_APP_`).

## 🚀 Ejecución

Usa dos terminales:

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd backend
npm run seed   # solo la primera vez o para reiniciar datos de prueba
npm run dev
```

```bash
# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
npm run dev
```

Verifica:

- API: <http://localhost:3001/api/products>
- App: <http://localhost:3000>

### Scripts

| Carpeta | Comando | Qué hace |
|---|---|---|
| backend | `npm run dev` | Servidor con recarga automática (nodemon) |
| backend | `npm start` | Servidor en modo producción |
| backend | `npm run seed` | ⚠️ Borra y recrea productos, clientes y ventas de prueba |
| frontend | `npm run dev` | Servidor de desarrollo de Vite |
| frontend | `npm run build` | Build de producción en `frontend/dist` |
| frontend | `npm run lint` | Revisa el código con oxlint |

## 🗂️ Estructura

```
pos-cafecito/
├── backend/
│   ├── .env.example
│   └── src/
│       ├── server.js        → arranca: conecta a la BD y abre el puerto
│       ├── app.js           → configura Express (middlewares y rutas)
│       ├── routes/          → define endpoints (URL + método → controlador)
│       ├── controllers/     → recibe el request, valida y arma la respuesta
│       ├── services/        → lógica de negocio (descuentos, stock…)
│       ├── models/          → esquemas Mongoose (Product, Customer, Sale)
│       ├── middlewares/     → errores, autenticación
│       ├── config/          → conexión a la BD
│       ├── utils/           → helpers (paginación, búsqueda)
│       └── seed.js          → datos de prueba
├── frontend/
│   ├── .env.example
│   └── src/
│       ├── pages/           → vistas: Ventas, Clientes, Productos
│       ├── components/      → componentes reutilizables
│       ├── services/        → llamadas a la API (api.js)
│       └── styles/          → estilos
└── docs/
    └── decisiones.md        → decisiones técnicas del equipo
```

**Flujo de una petición en el backend:**
`route → controller → service → model → MongoDB`

## 🌿 Forma de trabajo (Git)

- ❌ No se trabaja directo sobre `main`.
- 🌱 Cada historia de usuario va en su propia rama:
  `feature/HU-01-listar-productos`, `fix/...`, `chore/...`, `docs/...`
- 🔀 Los cambios entran a `main` mediante **Pull Request** (aunque lo apruebes tú mismo).
- ✍️ Commits pequeños y descriptivos.

## 🐞 Reportar errores

Abre un issue en <https://github.com/filthycbaz/pos-cafecito/issues> con:

1. Qué hiciste (pasos para reproducir).
2. Qué esperabas que pasara.
3. Qué pasó (mensaje de error, captura).

## 📝 Notas

- El contrato de API, los edge cases y las reglas de negocio vienen del **Kit de Arranque** del curso.
- Las decisiones tomadas por el equipo están en [`docs/decisiones.md`](docs/decisiones.md).
- Fuera del alcance del MVP: pagos reales, facturación, impresoras, multi-sucursal, reportes avanzados.
