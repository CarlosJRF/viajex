# Quickstart: validar el sistema de reserva (v3)

**Plan**: [plan.md](plan.md) | **Contratos**: [contracts/](contracts/) | **Modelo**: [data-model.md](data-model.md)

## Requisitos previos

- Node.js 20 o superior y npm.

## Arranque local

```bash
npm install --prefix client
npm run dev                    # cliente con la API mock (REST + GraphQL) en el navegador
```

Abrir `http://localhost:5173/`. No hace falta ningún servidor: MSW atiende `/api/destinos` y
`/graphql`.

## Pruebas automáticas (FR-030)

```bash
npm test
```

**Resultado esperado**: pasan las pruebas de `calcularNoches`, `calcularTotal`, `validarReserva` y
`FormularioReserva` (11 casos).

## Build y vista previa como en Pages

```bash
VITE_BASE_PATH=/viajex/ npm run build   # client/dist con index.html, 404.html y mockServiceWorker.js
npm run preview                          # http://localhost:4173/viajex/
```

## Publicación en GitHub Pages (R30)

1. Hacer push a `main`. El workflow `.github/workflows/publicar.yml` instala, prueba, compila con
   `VITE_BASE_PATH=/viajex/` y sube `client/dist` a la rama `gh-pages`. También se puede lanzar a
   mano desde la pestaña Actions ("Run workflow").
2. Solo la primera vez: **Settings → Pages → Build and deployment → Deploy from a branch →
   `gh-pages` / root**.
3. La demo queda en `https://<usuario>.github.io/viajex/`.

## Escenarios manuales

Se conserva la numeración de versiones anteriores para la trazabilidad.

| # | Pasos | Resultado esperado | Historia |
|---|---|---|---|
| 1 | Abrir `/` | 5 o más destinos con imagen, país y actividades populares (vía REST) | P1 |
| 2 | Clic en un destino | Ves sus vuelos, hoteles y tours, solo los de ese destino | P1 |
| 3 | Abrir `/destinos/no-existe` | Mensaje amigable con enlace a `/` | P1 |
| 4 | Bloquear la URL `api/destinos` en DevTools (Network → Block request URL) y recargar `/` | Mensaje amigable con botón Reintentar | P1 |
| 5 | En un destino, elegir vuelo, hotel y un tour; 2 pasajeros; 3 noches | Total = vuelo×2 + hotel×3 + tour×2, en formato `$X.XXX.XXX` | P2 |
| 6 | *Eliminado en v2 (login)* | — | — |
| 7 | Confirmar una reserva válida | Llevado a `/reservas`, donde aparece la reserva | P2 |
| 8 | Confirmar sin servicios | "Selecciona al menos un servicio para crear la reserva"; no se envía | P2 |
| 9 | Regreso igual a la salida | Mensaje de validación de fechas; no se envía | P2 |
| 10 | *Eliminado en v2 (login)* | — | — |
| 11 | Recargar `/reservas` | Las reservas siguen ahí (`localStorage`) | P3 |
| 12 | Abrir directamente `/reservas/:id` de una reserva existente | Se ve su detalle editable | P3 |
| 13 | En `/reservas/:id`, cambiar hotel, pasajeros y fecha de regreso; guardar; recargar | Total recalculado; el cambio se conserva tras recargar | P4 |
| 14 | En `/reservas/:id`, buscar cómo cambiar el destino | No existe esa opción | P4 |
| 15 | Eliminar una reserva y cancelar la confirmación | La reserva sigue | P5 |
| 16 | Eliminar una reserva, aceptar y recargar | La reserva desaparece y no vuelve | P5 |
| 17 | Borrar los datos del sitio (o abrir una ventana privada) y abrir `/reservas` | "Aún no tienes reservas…" | FR-031 |
| 18 | Con la vista previa, abrir y recargar `/viajex/destinos/d1` y `/viajex/reservas` | La app carga en ambas rutas | P6 |
| 19 | En la URL publicada, recorrer los escenarios 1, 5, 7, 11, 13 y 16, y recargar una ruta interna | Todo funciona sin servidor propio | P6 |
| 20 | En un destino, cada vuelo y cada hotel | Vuelos con fechas de ida y vuelta (`dd/mm/aaaa`) y cupos; hoteles con rango de fechas y habitaciones | FR-010 |
| 21 | Escribir fechas y luego elegir un vuelo; después quitarlo | Las fechas pasan a ser las del vuelo; al quitarlo se conservan; siguen siendo editables | FR-034 |
| 22 | Indicar más pasajeros que los cupos del vuelo y confirmar | La reserva se crea | FR-035 |
| 23 | Abrir `/ruta-que-no-existe` | "No encontramos esta página." con enlace al inicio | FR-036 |
| 24 | Ir a "Mis reservas" | El enlace de la barra se ve activo | FR-037 |
| 25 | Abrir un destino y volver al inicio de inmediato, varias veces | Sin errores visibles ni en la consola | FR-039 |
| 26 | Vista a 375, 768 y 1280 px en inicio, destino (selector y formulario) y reservas | Sin desplazamiento horizontal; todo es operable | FR-040 |
| 27 | Escenarios 1, 5, 7, 13, 16, 18 y 23 en Chrome, Firefox, Edge, Safari y móvil sobre la URL publicada | Resultado registrado en la matriz del README | FR-042 |
