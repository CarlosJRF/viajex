# Data Model: Sistema de reserva de vuelos y hoteles

**Fecha**: 2026-11-23 | **Plan**: [plan.md](plan.md) | **Contrato**: [contracts/schema.graphql](contracts/schema.graphql)

Todas las entidades viven en memoria, en el store de `createMockStore`. Las del catálogo son de
solo lectura; solo `Reserva` se crea, modifica y elimina. Los montos son enteros en CLP y las
fechas son textos ISO `AAAA-MM-DD`.

## Entidades del catálogo (solo lectura)

### Usuario
| Campo | Tipo | Notas |
|---|---|---|
| id | ID | `u1` |
| nombre | String | Nombre que muestra la barra de navegación |
| correo | String | `demo@viajes.cl` |
| contrasena | — | Solo existe en `mocks.js`; **no** se expone en el esquema |

### Pais
| Campo | Tipo |
|---|---|
| id | ID |
| nombre | String |

### Actividad
| Campo | Tipo |
|---|---|
| id | ID |
| nombre | String |

### Destino
| Campo | Tipo | Relación |
|---|---|---|
| id | ID | |
| nombre | String | |
| imagen | String | URL |
| pais | Pais | N:1 |
| actividadesPopulares | [Actividad] | N:M |
| vuelos | [Vuelo] | 1:N (solo los del destino) |
| hoteles | [Hotel] | 1:N |
| tours | [Tour] | 1:N |

### Vuelo
| Campo | Tipo | Notas |
|---|---|---|
| id | ID | |
| aerolinea | String | |
| horarioIda | String | `HH:MM` |
| horarioVuelta | String | `HH:MM` |
| precio | Int | CLP por pasajero, ida y vuelta |

### Hotel
| Campo | Tipo | Notas |
|---|---|---|
| id | ID | |
| nombre | String | |
| categoria | Int | Estrellas, de 1 a 5 |
| precioNoche | Int | CLP por noche, no depende de los pasajeros |

### Tour
| Campo | Tipo | Notas |
|---|---|---|
| id | ID | |
| nombre | String | |
| actividades | [Actividad] | 2 o 3 |
| precio | Int | CLP por persona |

**Catálogo mínimo**: 5 destinos de países distintos; cada uno con 2 o 3 vuelos, 2 o 3 hoteles y
2 o 3 tours.

## Reserva (CRUD)

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | ID | sí | Lo genera el servidor (`crypto.randomUUID()`) |
| usuarioId | ID | sí | Dueño de la reserva |
| destino | Destino | sí | **Inmutable** después de crear la reserva |
| vuelo | Vuelo | no | Como máximo uno |
| hotel | Hotel | no | Como máximo uno |
| tours | [Tour] | no | Cero o más, sin repetir |
| pasajeros | Int | sí | ≥ 1 |
| fechaSalida | String | sí | ISO |
| fechaRegreso | String | sí | ISO, posterior a `fechaSalida` |
| total | Int | sí | Calculado en el cliente con FR-027 |

### Reglas de validación (cliente, antes de enviar la mutation)

| Regla | Origen | Mensaje |
|---|---|---|
| `vuelo` o `hotel` o `tours.length > 0` | FR-020 | "Selecciona al menos un servicio para crear la reserva" |
| `pasajeros >= 1` (entero) | FR-021 | "Indica al menos 1 pasajero" |
| `fechaSalida` y `fechaRegreso` informadas | FR-022 | "Indica las fechas de salida y regreso" |
| `fechaRegreso > fechaSalida` | FR-022 | "La fecha de regreso debe ser posterior a la de salida" |

`validarReserva(reserva)` devuelve un arreglo con los mensajes de las reglas que no se cumplen.
Si el arreglo está vacío, la reserva es válida.

### Cálculo (FR-026 a FR-028)

```text
noches = días entre fechaSalida y fechaRegreso
total  = (vuelo?.precio ?? 0) × pasajeros
       + (hotel?.precioNoche ?? 0) × noches
       + Σ tour.precio × pasajeros
```

### Ciclo de vida

```text
(selección en el cliente) --crearReserva--> Reserva --actualizarReserva--> Reserva
                                               |
                                               +--eliminarReserva--> (no existe)
```

No hay estados como "cancelada": eliminar borra la reserva.

## Estado del cliente (useState)

| Estado | Dónde vive | Contenido |
|---|---|---|
| `usuario` | `App.jsx` | `{ id, nombre, correo }` o `null` |
| `seleccion` | `PaginaDestino` / `PaginaReserva` | `{ vueloId, hotelId, tourIds[], pasajeros, fechaSalida, fechaRegreso }` |
| datos remotos | cada página | `{ cargando, error, datos }` con `useEffect` |
