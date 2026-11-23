# Contrato de interfaz: rutas y operaciones

| Ruta | Página | Acceso | Operaciones GraphQL | Requisitos |
|---|---|---|---|---|
| `/` | `PaginaInicio` | Público | `destinos` | FR-008, FR-009, FR-012 |
| `/destinos/:id` | `PaginaDestino` | Público para ver; confirmar exige sesión | `destino(id)`, `crearReserva` | FR-010, FR-011, FR-013 a FR-016 |
| `/login` | `PaginaLogin` | Público | `login` | FR-001 a FR-005 |
| `/reservas` | `PaginaReservas` | `RutaProtegida` | `reservas`, `eliminarReserva` | FR-017, FR-019 |
| `/reservas/:id` | `PaginaReserva` | `RutaProtegida` | `reserva` (incluye `destino { vuelos hoteles tours }`), `actualizarReserva`, `eliminarReserva` | FR-018, FR-019 |

## Estado de navegación

| Origen → destino | `location.state` | Efecto |
|---|---|---|
| `RutaProtegida` → `/login` | `{ desde }` | Tras el login, vuelve a `desde` |
| `PaginaDestino` (confirmar sin sesión) → `/login` | `{ desde, seleccion }` | Tras el login, vuelve a `desde` con `seleccion` como estado inicial |
| `/login` (sin `desde`) | — | Tras el login, va a `/` |
| Cerrar sesión | — | `usuario = null` y navega a `/` |

## Mensajes amigables (FR-024)

| Situación | Mensaje |
|---|---|
| Fallo de red o servidor caído | "No pudimos conectar con el servidor. Inténtalo nuevamente." |
| Error GraphQL genérico | "Ocurrió un problema al procesar tu solicitud." |
| Credenciales incorrectas | "Correo o contraseña incorrectos." |
| Destino inexistente | "No encontramos ese destino." + enlace a `/` |
| Reserva inexistente | "No encontramos esa reserva." + enlace a `/reservas` |
| Sin reservas | "Aún no tienes reservas. ¡Explora destinos para planificar tu viaje!" + enlace a `/` |
