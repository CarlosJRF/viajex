# Data Model: Sistema de reserva de vuelos y hoteles

**Fecha**: 2026-11-23 | **Plan**: [plan.md](plan.md) | **Contrato**: [contracts/schema.graphql](contracts/schema.graphql)

**Versión 2** (constitución v2.0.0): sin `Usuario`; las reservas se respaldan en `localStorage`.

Todas las entidades viven en memoria, en el store de `createMockStore` que corre en el navegador.
Las del catálogo son de solo lectura; solo `Reserva` se crea, modifica y elimina, y se respalda en
`localStorage`. Los montos son enteros en CLP y las
fechas son textos ISO `AAAA-MM-DD`.

## Entidades del catálogo (solo lectura)

*`Usuario` se eliminó en v2: no hay login.*

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
| id | ID | sí | Lo genera el mock (`crypto.randomUUID()` del navegador) |
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

### Respaldo en localStorage (FR-031)

- **Clave**: `viajex:reservas`.
- **Valor**: arreglo JSON de reservas planas, en el orden de creación:

```json
[
  {
    "id": "3f1c…",
    "destinoId": "d4",
    "vueloId": "v8",
    "hotelId": null,
    "tourIds": ["t8"],
    "pasajeros": 2,
    "fechaSalida": "2026-12-01",
    "fechaRegreso": "2026-12-04",
    "total": 2372000
  }
]
```

- Se escribe la lista completa después de cada `crearReserva`, `actualizarReserva` y
  `eliminarReserva`.
- Al crear el store, se leen las reservas guardadas y se insertan solo las que tienen destino y
  opciones existentes en el catálogo. Si la lectura falla o el JSON es inválido, se parte con `[]`.

## Estado del cliente (useState)

| Estado | Dónde vive | Contenido |
|---|---|---|
| `seleccion` | `PaginaDestino` / `PaginaReserva` | `{ vueloId, hotelId, tourIds[], pasajeros, fechaSalida, fechaRegreso }` |
| datos remotos | cada página | `{ cargando, error, datos }` con `useEffect` |
