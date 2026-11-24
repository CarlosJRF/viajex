# Contrato de interfaz: rutas y operaciones (v3)

Todas las rutas son públicas y cuelgan de la base configurable (`VITE_BASE_PATH`; `/viajex/` en
GitHub Pages). En v2 se eliminaron `/login`, `RutaProtegida` y la operación `login`. En v3 el
listado usa REST y se agrega la ruta `*`.

| Ruta | Página | Operaciones (REST / GraphQL) | Requisitos |
|---|---|---|---|
| `/` | `PaginaInicio` | REST `GET /api/destinos` | FR-008, FR-009, FR-012 |
| `/destinos/:id` | `PaginaDestino` | `destino(id)`, `crearReserva` | FR-010, FR-011, FR-013 a FR-015 |
| `/reservas` | `PaginaReservas` | `reservas`, `eliminarReserva` | FR-017, FR-019 |
| `/reservas/:id` | `PaginaReserva` | `reserva` (incluye `destino { vuelos hoteles tours }`), `actualizarReserva`, `eliminarReserva` | FR-018, FR-019 |
| `*` | `PaginaNoEncontrada` | — | FR-036 |

Recargar cualquiera de estas rutas en Pages DEBE cargar la app (FR-033, `404.html`).

La barra resalta "Mis reservas" con `NavLink` cuando la ruta empieza por `/reservas` (FR-037).

## Mensajes amigables (FR-024)

| Situación | Mensaje |
|---|---|
| Fallo al contactar la API mock | "No pudimos conectar con el servidor. Inténtalo nuevamente." |
| Error GraphQL genérico | "Ocurrió un problema al procesar tu solicitud." |
| Destino inexistente | "No encontramos ese destino." + enlace a `/` |
| Reserva inexistente | "No encontramos esa reserva." + enlace a `/reservas` |
| Ruta inexistente | "No encontramos esta página." + enlace "Volver al inicio" |
| Sin reservas | "Aún no tienes reservas. ¡Explora destinos para planificar tu viaje!" + enlace a `/` |
