# Decisiones técnicas — Cafecito Feliz POS

Registro de decisiones del equipo. Cada una indica qué se decidió, por qué y cuándo.
Si una decisión cambia, se agrega una nueva entrada en lugar de borrar la anterior.

| # | Fecha | Decisión |
|---|---|---|
| D1 | 2026-11-08 | Base de datos: MongoDB + Mongoose |
| D2 | 2026-11-08 | Items de venta embebidos en la venta |
| D3 | 2026-11-08 | Nombres de campos en camelCase en la API |
| D4 | 2026-11-08 | Cliente duplicado → rechazar con 400 |
| D5 | 2026-11-08 | Venta con `customerId` inexistente → rechazar con 400 |
| D6 | 2026-11-08 | Búsquedas insensibles a mayúsculas y acentos |

---

## D1 — MongoDB + Mongoose

- **Decisión:** usar MongoDB local con Mongoose como ODM.
- **Por qué:** es la opción recomendada para el MVP; los documentos se parecen al JSON de la API;
  no requiere migraciones; los esquemas validan datos y agregan `createdAt`/`updatedAt` automáticamente.
- **Alternativas descartadas:** PostgreSQL (más formal de lo que el MVP necesita), SQLite.

## D2 — Items de venta embebidos

- **Decisión:** los `SaleItem` se guardan como arreglo `items` dentro de cada `Sale`, con
  `productNameSnapshot` y `unitPriceSnapshot`.
- **Por qué:** un item nunca se consulta sin su venta; se obtiene la venta completa en una sola consulta.
  Los snapshots preservan el ticket histórico aunque cambie el precio del producto.

## D3 — camelCase en la API

- **Decisión:** los JSON de la API usan camelCase (`customerId`, `purchasesCount`).
- **Por qué:** el Contrato de API menciona snake_case, pero todos sus ejemplos, la colección de Postman y
  los edge cases usan camelCase. Seguimos los ejemplos para que las pruebas del equipo funcionen.
- **Pendiente:** confirmar con el equipo senior.

## D4 — Cliente duplicado → 400

- **Decisión:** `POST /api/customers` con un `phoneOrEmail` ya registrado responde **400**:
  ```json
  {
    "error": "Customer already exists",
    "details": [{ "field": "phoneOrEmail", "message": "A customer with this phone or email already exists", "existingCustomerId": "<id>" }]
  }
  ```
- **Por qué:** `POST` tiene un solo significado (crear → 201, o fallar). El frontend usa
  `existingCustomerId` para seleccionar al cliente existente sin duplicarlo.
- **Alternativa descartada:** devolver 200 con el cliente existente (mezcla "crear" con "buscar").

## D5 — `customerId` inexistente en venta → 400

- **Decisión:** `POST /api/sales` con un `customerId` que no existe responde **400** `Customer not found`
  y no registra la venta.
- **Por qué:** mantiene la integridad de los datos. Ignorar el cliente haría que perdiera su descuento
  y su compra no se contara, sin que nadie lo note.
- **Nota:** vender sin cliente sigue siendo válido enviando `customerId: null` u omitiéndolo.

## D6 — Búsquedas insensibles a mayúsculas y acentos

- **Decisión:** `?q=` ignora mayúsculas y acentos (`cafe` encuentra "Café").
- **Por qué:** el vendedor escribe rápido y casi nunca pone acentos.
