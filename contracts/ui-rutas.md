# Contrato de interfaz: rutas y operaciones (v2)

Todas las rutas son públicas y cuelgan de la base `/viajex/` (GitHub Pages). En v2 se eliminaron
`/login`, `RutaProtegida` y la operación `login`.

| Ruta | Página | Operaciones GraphQL | Requisitos |
|---|---|---|---|
| `/` | `PaginaInicio` | `destinos` | FR-008, FR-009, FR-012 |
| `/destinos/:id` | `PaginaDestino` | `destino(id)`, `crearReserva` | FR-010, FR-011, FR-013 a FR-015 |
| `/reservas` | `PaginaReservas` | `reservas`, `eliminarReserva` | FR-017, FR-019 |
| `/reservas/:id` | `PaginaReserva` | `reserva` (incluye `destino { vuelos hoteles tours }`), `actualizarReserva`, `eliminarReserva` | FR-018, FR-019 |

Recargar cualquiera de estas rutas en Pages DEBE cargar la app (FR-033, `404.html`).

## Mensajes amigables (FR-024)

| Situación | Mensaje |
|---|---|
| Fallo al contactar la API mock | "No pudimos conectar con el servidor. Inténtalo nuevamente." |
| Error GraphQL genérico | "Ocurrió un problema al procesar tu solicitud." |
| Destino inexistente | "No encontramos ese destino." + enlace a `/` |
| Reserva inexistente | "No encontramos esa reserva." + enlace a `/reservas` |
| Sin reservas | "Aún no tienes reservas. ¡Explora destinos para planificar tu viaje!" + enlace a `/` |
