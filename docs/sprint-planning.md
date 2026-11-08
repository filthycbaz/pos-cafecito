# Planeación del Sprint — Cafecito Feliz

> Detalle de cada historia y sus criterios de aceptación: [`historias.md`](historias.md).

## Escala de estimación

- **Story points** en escala Fibonacci: 1, 2, 3, 5, 8.
- Se estima por **complejidad relativa**, no en horas.
- **Historia de referencia:** Historia 5 *(Registrar cliente)* = **3 puntos**. Es una captura con validaciones,
  sin cálculos ni dependencias. Las demás se estiman comparándolas con ella.

## Backlog estimado

| # | Historia | Ref. | Pts | Por qué |
|:-:|---|:-:|:-:|---|
| 1 | Como **vendedor** quiero registrar una venta con los productos y cantidades que pide el cliente, viendo el total calculado automáticamente, para cobrar el monto correcto sin anotarlo en libreta o Excel. | HU-01 | **8** | Varios productos, cálculo del total y validación de existencias con rechazo de la venta completa |
| 2 | Como **administrador** quiero dar de alta productos con nombre, precio y existencias para que los vendedores puedan venderlos con el precio correcto. | HU-02 | **5** | Validaciones más control de permisos de administrador, que se construye desde cero |
| 3 | Como **vendedor** quiero buscar productos por nombre para encontrar rápido lo que pide el cliente y no hacerlo esperar. | HU-03 | **2** | Simple; parte del trabajo ya existe |
| 4 | Como **administrador** quiero actualizar el precio y las existencias de un producto para mantener el catálogo al día. | — | **2** | Reutiliza las validaciones y permisos de la Historia 2 |
| 5 | Como **vendedor** quiero registrar a un cliente con su nombre y su teléfono o correo para reconocerlo en sus próximas visitas. | HU-04 | **3** | ⭐ Referencia |
| 6 | Como **vendedor** quiero buscar a un cliente ya registrado para asociarle su compra. | — | **2** | Similar a la Historia 3 |
| 7 | Como **cliente frecuente** quiero recibir un descuento automático según mis compras anteriores para sentir que vale la pena regresar. | HU-05 | **3** | Regla clara, pero depende de ventas y clientes |
| 8 | Como **cliente** quiero recibir un ticket con el detalle de mi compra para saber exactamente qué pagué y cuánto me descontaron. | — | **3** | Junta venta, productos y descuento |
| 9 | Como **administrador** quiero eliminar los productos que ya no se venden para que el catálogo solo muestre lo disponible. | — | **1** | La más simple |
| | **Total del backlog** | | **29** | |

## Sprint seleccionado

**Capacidad:** 20 puntos.

| # | Historia | Pts | Acumulado |
|:-:|---|:-:|:-:|
| 1 | Registrar venta | 8 | 8 |
| 2 | Alta de productos | 5 | 13 |
| 3 | Buscar productos | 2 | 15 |
| 4 | Actualizar producto | 2 | 17 |
| 5 | Registrar cliente | 3 | **20** |

**Total puntos del sprint: 20 / 20**

### 🎯 Objetivo del sprint

> La cafetería puede gestionar su catálogo, registrar ventas con el total correcto sin vender más de lo que hay,
> y empezar a registrar a sus clientes.

### Fuera del sprint → siguiente sprint (9 pts)

| # | Historia | Pts |
|:-:|---|:-:|
| 6 | Buscar cliente | 2 |
| 7 | Descuento automático | 3 |
| 8 | Ticket | 3 |
| 9 | Eliminar producto | 1 |

Juntas completan la **fidelización**: identificar al cliente, aplicar su descuento y mostrarlo en el ticket.

## Justificación

**¿Por qué estas historias y no otras?**

- Se seleccionaron **respetando el orden de prioridad del backlog** hasta llegar a la capacidad de 20 puntos.
- Son lo indispensable para que la cafetería deje la libreta y Excel: sin productos dados de alta (2) y sin poder
  registrar ventas con el total correcto (1) no puede operar. La búsqueda (3) y la actualización de precios y
  existencias (4) hacen la venta rápida y confiable. Registrar clientes (5) es la base de la fidelización.
- La Historia 1 vale 8 porque combina varios productos, el cálculo del total y la validación de existencias.
  La Historia 2 vale 5 porque incluye el control de permisos; la Historia 4 lo reutiliza y por eso solo vale 2.
- El descuento (7) y el ticket (8) **dependen** de que ya existan ventas y clientes registrados.
- No se partieron historias ni se cambió el alcance del MVP para que entraran más. La Historia 6 solo vale 2 puntos,
  pero incluirla rebasaría la capacidad.
