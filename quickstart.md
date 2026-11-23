# Quickstart: validar el sistema de reserva

**Plan**: [plan.md](plan.md) | **Contrato**: [contracts/](contracts/) | **Modelo**: [data-model.md](data-model.md)

## Requisitos previos

- Node.js 20 o superior y npm.

## Arranque

```bash
npm install                    # en la raíz (concurrently)
npm install --prefix server
npm install --prefix client
npm run dev                    # servidor en :4000 y cliente en :5173
```

Abrir `http://localhost:5173`.

## Pruebas automáticas (FR-030)

```bash
npm test --prefix client
```

**Resultado esperado**: pasan las pruebas de `calcularNoches`, `calcularTotal`, `validarReserva` y
`FormularioReserva`.

## Escenarios manuales

| # | Pasos | Resultado esperado | Historia |
|---|---|---|---|
| 1 | Abrir `/` sin sesión | 5 o más destinos con imagen, país y actividades populares | P1 |
| 2 | Clic en un destino | Ves sus vuelos, hoteles y tours, solo los de ese destino | P1 |
| 3 | Abrir `/destinos/no-existe` | Mensaje amigable con enlace a `/` | P1 |
| 4 | Detener el servidor y recargar `/` | Mensaje amigable con botón Reintentar | P1 |
| 5 | En un destino, elegir vuelo, hotel y un tour; 2 pasajeros; 3 noches | Total = vuelo×2 + hotel×3 + tour×2, en formato `$X.XXX.XXX` | P2 |
| 6 | Confirmar sin sesión | Llevado a `/login`; tras ingresar `demo@viajes.cl` / `demo1234`, vuelves al destino con la selección intacta | P2 |
| 7 | Confirmar con sesión | Llevado a `/reservas`, donde aparece la reserva | P2 |
| 8 | Confirmar sin servicios | "Selecciona al menos un servicio para crear la reserva"; no se envía | P2 |
| 9 | Regreso igual a la salida | Mensaje de validación de fechas; no se envía | P2 |
| 10 | Login con contraseña incorrecta | "Correo o contraseña incorrectos." | P2 |
| 11 | Recargar la página con sesión | Sesión perdida; al volver a ingresar, las reservas siguen ahí | P3 |
| 12 | Abrir `/reservas` sin sesión | Llevado a `/login`; tras ingresar, vuelves a `/reservas` | P3 |
| 13 | En `/reservas/:id`, cambiar hotel, pasajeros y la fecha de regreso; guardar | Total recalculado; la reserva se muestra actualizada | P4 |
| 14 | En `/reservas/:id`, buscar cómo cambiar el destino | No existe esa opción | P4 |
| 15 | Eliminar una reserva y cancelar la confirmación | La reserva sigue | P5 |
| 16 | Eliminar una reserva y aceptar | La reserva desaparece de la lista | P5 |
| 17 | Reiniciar el servidor | `/reservas` queda vacía | FR-025 |
