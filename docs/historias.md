# Backlog e historias de usuario — Cafecito Feliz

Este documento tiene dos partes:

1. **Backlog inicial**: todas las necesidades del usuario y del negocio, ordenadas por prioridad.
2. **Historias refinadas**: las historias listas para desarrollarse, con criterios de aceptación.

La estimación y el plan del sprint están en [`sprint-planning.md`](sprint-planning.md).

Los criterios de aceptación también sirven como **guía de pruebas**: una historia está terminada
cuando todos sus criterios se cumplen.

---

## 1. Backlog inicial (Sprint 0)

| # | Historia | Refinada como |
|---|---|---|
| 1 | Como **vendedor** quiero registrar una venta con los productos que pide el cliente para cobrar sin tener que anotarla en libreta o Excel. | HU-01 |
| 2 | Como **vendedor** quiero ver el total de la venta calculado automáticamente para cobrar el monto correcto sin hacer cuentas a mano. | HU-01 |
| 3 | Como **administrador** quiero dar de alta productos con nombre, precio y existencias para que los vendedores puedan venderlos con el precio correcto. | HU-02 |
| 4 | Como **vendedor** quiero buscar productos por nombre para encontrar rápido lo que pide el cliente y no hacerlo esperar. | HU-03 |
| 5 | Como **administrador** quiero actualizar el precio y las existencias de un producto para mantener el catálogo al día cuando cambian los costos o llega mercancía. | — |
| 6 | Como **dueño de la cafetería** quiero que no se pueda vender más de lo que hay en existencia para no cobrar productos que ya no tenemos. | HU-01 (criterio) |
| 7 | Como **vendedor** quiero registrar a un cliente con su nombre y su teléfono o correo para reconocerlo en sus próximas visitas. | HU-04 |
| 8 | Como **vendedor** quiero buscar a un cliente ya registrado para asociarle su compra y que vaya acumulando visitas. | — |
| 9 | Como **cliente frecuente** quiero recibir un descuento automático según mis compras anteriores para sentir que vale la pena regresar. | HU-05 |
| 10 | Como **cliente** quiero recibir un ticket con el detalle de mi compra para saber exactamente qué pagué y cuánto me descontaron. | — |
| 11 | Como **administrador** quiero eliminar los productos que ya no se venden para que el catálogo solo muestre lo disponible. | — |
| 12 | Como **dueño de la cafetería** quiero que solo los administradores puedan modificar productos para evitar cambios de precio no autorizados. | HU-02 (criterio) |

**Criterio de priorización:** primero lo indispensable para que la cafetería pueda vender desde el primer día (1-3),
luego lo que hace la venta rápida y confiable (4-6), después el registro de clientes (7-8), que es la base para la
fidelización con descuentos y ticket (9-10), y al final mantenimiento y control del catálogo (11-12).

---

## 2. Historias refinadas con criterios de aceptación

### HU-01 — Registrar una venta

> Como **vendedor** quiero registrar una venta con los productos y cantidades que pide el cliente, viendo el total
> calculado automáticamente, para cobrar el monto correcto sin anotarlo en libreta o Excel.

**Criterios de aceptación**

- [ ] **Dado que** el vendedor agregó 2 Café Americano de $35 y 1 Croissant de $30, **cuando** revisa la venta, **entonces** ve un subtotal de $100 y el total a cobrar.
- [ ] **Dado que** la venta tiene al menos un producto, **cuando** el vendedor la confirma, **entonces** la venta queda registrada con su fecha, productos, cantidades, método de pago y total.
- [ ] **Dado que** la venta no tiene ningún producto, **cuando** el vendedor intenta confirmarla, **entonces** el sistema no la registra y le indica que debe agregar al menos un producto.
- [ ] **Dado que** un producto tiene 10 piezas en existencia, **cuando** el vendedor intenta vender 20, **entonces** la venta completa se rechaza y se le informa que solo hay 10 disponibles.

### HU-02 — Dar de alta productos

> Como **administrador** quiero dar de alta productos con nombre, precio y existencias para que los vendedores
> puedan venderlos con el precio correcto.

**Criterios de aceptación**

- [ ] **Dado que** el administrador captura "Espresso", precio $30 y 100 piezas, **cuando** guarda el producto, **entonces** este aparece en el catálogo disponible para venta.
- [ ] **Dado que** el administrador deja el nombre vacío, **cuando** intenta guardar, **entonces** el producto no se crea y se le indica que el nombre es obligatorio.
- [ ] **Dado que** el administrador captura un precio de $0 o negativo, **cuando** intenta guardar, **entonces** el producto no se crea y se le indica que el precio debe ser mayor a 0.
- [ ] **Dado que** un vendedor (no administrador) intenta dar de alta un producto, **cuando** lo guarda, **entonces** el sistema se lo impide por no tener permiso.

### HU-03 — Buscar productos por nombre

> Como **vendedor** quiero buscar productos por nombre para encontrar rápido lo que pide el cliente y no hacerlo esperar.

**Criterios de aceptación**

- [x] **Dado que** existen "Café Americano" y "Café Latte", **cuando** el vendedor busca "cafe" (sin acento y en minúsculas), **entonces** ve ambos productos.
- [x] **Dado que** ningún producto coincide, **cuando** el vendedor busca "pizza", **entonces** ve un mensaje de que no se encontraron productos, sin que se considere un error.
- [x] **Dado que** el vendedor no escribe nada en la búsqueda, **cuando** consulta los productos, **entonces** ve el catálogo completo.

> ✅ Los tres criterios ya se cumplen en la API (`GET /api/products?q=`). Falta la búsqueda en la pantalla de ventas.

### HU-04 — Registrar un cliente

> Como **vendedor** quiero registrar a un cliente con su nombre y su teléfono o correo para reconocerlo en sus
> próximas visitas y que acumule sus compras.

**Criterios de aceptación**

- [ ] **Dado que** el vendedor captura "María González" y "+524491234567", **cuando** guarda, **entonces** el cliente queda registrado con 0 compras.
- [ ] **Dado que** ya existe un cliente con el correo "juan@example.com", **cuando** el vendedor intenta registrar otro cliente con ese mismo correo, **entonces** el sistema no lo duplica y le indica que el cliente ya existe.
- [ ] **Dado que** el vendedor captura "noesuncorreo" como contacto, **cuando** intenta guardar, **entonces** el cliente no se registra y se le indica que debe ser un correo válido o un teléfono que inicie con +.
- [ ] **Dado que** el vendedor captura un nombre de 1 letra, **cuando** intenta guardar, **entonces** el cliente no se registra y se le indica que el nombre debe tener entre 2 y 100 caracteres.

### HU-05 — Descuento automático por cliente frecuente

> Como **cliente frecuente** quiero recibir un descuento automático según mis compras anteriores para sentir que
> vale la pena regresar.

**Criterios de aceptación**

- [ ] **Dado que** el cliente tiene 0 compras previas, **cuando** se registra su venta, **entonces** no se aplica descuento.
- [ ] **Dado que** el cliente tiene entre 1 y 3 compras previas, **cuando** se registra una venta de $100, **entonces** se aplica 5% de descuento y paga $95.
- [ ] **Dado que** el cliente tiene entre 4 y 7 compras previas, **cuando** se registra una venta de $100, **entonces** se aplica 10% de descuento y paga $90.
- [ ] **Dado que** el cliente tiene 8 o más compras previas, **cuando** se registra una venta de $100, **entonces** se aplica 15% de descuento y paga $85.
- [ ] **Dado que** la venta se hace sin cliente identificado, **cuando** se registra, **entonces** no se aplica descuento y no se suma compra a ningún cliente.
- [ ] **Dado que** se registra una venta a un cliente con 2 compras, **cuando** la venta se confirma, **entonces** su contador pasa a 3 compras.
