# Sprint 4 — Definition of Done del POS

> Historias y criterios de aceptación: [`historias.md`](historias.md) ·
> Decisiones del equipo: [`decisiones.md`](decisiones.md)

## 1. Definition of Done (aplica a TODAS las historias)

Una historia se marca como **Done** solo cuando cumple todos estos puntos:

- [ ] Todos los criterios de aceptación de la historia ("Dado que / cuando / entonces") se cumplen y están marcados en [`historias.md`](historias.md).
- [ ] El endpoint respeta el **Contrato de API**: ruta, formato JSON (camelCase, campo `id`) y código de estado correcto (200, 201, 400, 401, 403, 404, 422).
- [ ] Todos los **edge cases** de `edge-cases.mdx` que aplican a la historia responden con su código y con el formato de error `{ error, details }`, y **no se guarda nada** en la base de datos cuando hay error.
- [ ] Se **probó manualmente** con REST Client o Postman (caso feliz y cada caso de error) y se **verificó en MongoDB** que los datos quedaron como se esperaba.
- [ ] **Sin regresiones ni problemas de permisos**: lo que ya funcionaba sigue funcionando (`GET /products` y `GET /customers`) y el endpoint responde **401** sin token y **403** con un rol sin permiso.
- [ ] *(Opcional)* Trabajado en su **propia rama**, con commits claros, **PR revisado** y mergeado a `main` sin conflictos, sin archivos `.env` en el repositorio y con la documentación actualizada.

---

## 2. Plan de validación para historias

**Herramientas:** REST Client (`ejemplos-api.http`) o Postman para las peticiones; `mongosh` o MongoDB Compass para revisar la base de datos.
**Datos de partida:** seed del proyecto (`npm run seed`).

| Dato del seed | Valor |
|---|---|
| Café Americano | $35 · 100 piezas |
| Croissant | $30 · 25 piezas |
| Sándwich de Pavo | $75 · 15 piezas |
| Ana López | 0 compras (0%) |
| Carlos Méndez | 2 compras (5%) |
| Juan García (`juan@example.com`) | 5 compras (10%) |
| María Torres | 9 compras (15%) |

### Historia 1: Registrar cliente

**Tipo de prueba:** Integración (API + base de datos), con casos de error de `edge-cases.mdx`.

**Qué validar:**
- Que un cliente con nombre y teléfono o correo válidos se registre con 0 compras.
- Que no se pueda registrar un cliente duplicado (mismo teléfono o correo, sin importar mayúsculas).
- Que se rechacen los datos inválidos: nombre de menos de 2 caracteres y contacto que no sea correo válido ni teléfono que empiece con `+`.

**Cómo probar:**
1. Con token de vendedor, enviar `POST /api/customers` con `{ "name": "María González", "phoneOrEmail": "+524491234567" }` y revisar en MongoDB que el cliente existe.
2. Enviar `POST /api/customers` con `{ "name": "Otro Juan", "phoneOrEmail": "JUAN@example.com" }` (`juan@example.com` ya existe en el seed).
3. Enviar `POST /api/customers` con `{ "name": "X", "phoneOrEmail": "noesuncorreo" }` y luego repetir la petición 1 sin token.

**Resultado esperado:**
- Paso 1: **201** con `id`, `name`, `phoneOrEmail` y `purchasesCount: 0`; el documento existe en la colección `customers`.
- Paso 2: **400** `Customer already exists` con `existingCustomerId`; no se crea un segundo cliente.
- Paso 3: **422** `Validation failed` con errores en `name` y `phoneOrEmail`; sin token, **401** `Authentication required`. En ningún caso se guarda el cliente.

---

### Historia 2: Crear venta con descuento

**Tipo de prueba:** Unitaria (regla de descuento) + integración (API + base de datos).

**Qué validar:**
- Que el descuento corresponda a las compras previas del cliente: 0 → 0%, 1 a 3 → 5%, 4 a 7 → 10%, 8 o más → 15%, incluyendo los valores frontera (0, 1, 3, 4, 7, 8).
- Que la venta calcule bien subtotal, monto del descuento y total, y que el `purchasesCount` del cliente suba en 1.
- Que una venta sin cliente se acepte sin descuento y sin sumar compras a nadie, y que un `customerId` inexistente se rechace.

**Cómo probar:**
1. Unitaria: verificar el cálculo del descuento con 0, 1, 3, 4, 7, 8 y 10 compras.
2. Con token de vendedor, enviar `POST /api/sales` con 2 Café Americano ($35) + 1 Croissant ($30) para cada cliente del seed: Ana (0 compras), Carlos (2), Juan (5) y María (9). Revisar en MongoDB el `purchasesCount` de cada uno.
3. Enviar la misma venta con `"customerId": null` y luego con un `customerId` inventado; consultar con `GET /api/sales/:id` una de las ventas creadas.

**Resultado esperado:**

| Compras | Descuento |
|:-:|:-:|
| 0 | 0% |
| 1 | 5% |
| 3 | 5% |
| 4 | 10% |
| 7 | 10% |
| 8 | 15% |
| 10 | 15% |

| Cliente | Subtotal | Descuento | Total | purchasesCount |
|---|:-:|:-:|:-:|:-:|
| Ana | $100 | 0% · $0 | $100 | 0 → 1 |
| Carlos | $100 | 5% · $5 | $95 | 2 → 3 |
| Juan | $100 | 10% · $10 | $90 | 5 → 6 |
| María | $100 | 15% · $15 | $85 | 9 → 10 |
| Sin cliente | $100 | 0% · $0 | $100 | ninguno cambia |

- Todas las ventas válidas responden **201**.
- Con `customerId` inventado: **400** `Customer not found` y no se guarda la venta.
- `GET /api/sales/:id` devuelve **200** con los mismos totales y el ticket con el texto del descuento, por ejemplo `"5% (-$5.00)"`.

---

### Historia 3: Validar stock insuficiente

**Tipo de prueba:** Integración (API + base de datos), caso de error de `edge-cases.mdx`.

**Qué validar:**
- Que no se pueda vender más piezas de las que hay en existencia.
- Que, si un solo producto no tiene stock suficiente, se rechace la venta completa (no hay venta parcial).
- Que una venta rechazada no modifique nada: ni el stock, ni el `purchasesCount`, ni se cree la venta.

**Cómo probar:**
1. Revisar en MongoDB el stock inicial: Sándwich de Pavo 15 piezas y Café Americano 100 piezas, y contar las ventas existentes.
2. Con token de vendedor, enviar `POST /api/sales` con 20 Sándwich de Pavo.
3. Enviar `POST /api/sales` con 1 Café Americano + 20 Sándwich de Pavo para el cliente Carlos, y volver a revisar MongoDB.

**Resultado esperado:**
- Paso 2: **400** `Insufficient stock` con `details`: `productName` "Sándwich de Pavo", `available` 15, `requested` 20 y el mensaje `"Only 15 available, requested 20"`.
- Paso 3: **400** por el Sándwich de Pavo; la venta completa se rechaza, aunque sí había Café Americano.
- En MongoDB nada cambió: Sándwich de Pavo sigue en 15, Café Americano sigue en 100, Carlos sigue con 2 compras y el número de ventas es el mismo.

---

## Notas

- El ejemplo E2E del curso dice "5% porque es 1era compra". Según las reglas de negocio, en la primera compra el cliente tiene **0 compras previas y corresponde 0%**; el 5% aplica desde la segunda. Este plan usa la regla correcta.
- El ejemplo de DoD del curso indica 404 para producto inexistente en una venta, pero `edge-cases.mdx` indica 400. Usamos **400** en `POST /api/sales` (el error está en el contenido de la venta) y **404** en `GET/PUT/DELETE /api/products/:id` (el recurso de la URL no existe).
