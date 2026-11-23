# Quickstart: validar el sistema de reserva (v2)

**Plan**: [plan.md](plan.md) | **Contrato**: [contracts/](contracts/) | **Modelo**: [data-model.md](data-model.md)

## Requisitos previos

- Node.js 20 o superior y npm.

## Arranque local

```bash
npm install --prefix client
npm run dev                    # cliente con el mock en el navegador
```

Abrir `http://localhost:5173/viajex/`. No hace falta ningún servidor: MSW atiende `/graphql`.

## Pruebas automáticas (FR-030)

```bash
npm test
```

**Resultado esperado**: pasan las pruebas de `calcularNoches`, `calcularTotal`, `validarReserva` y
`FormularioReserva` (11 casos).

## Build y vista previa como en Pages

```bash
npm run build                  # genera client/dist con index.html, 404.html y mockServiceWorker.js
npm run preview                # sirve client/dist en http://localhost:4173/viajex/
```

## Publicación en GitHub Pages (R19)

```bash
npm run build
# Primera vez: rama huérfana, sin historial de código (requiere git 2.42+)
git worktree add --orphan -b gh-pages ../viajex-gh-pages
# Publicaciones siguientes: usar la rama existente y vaciarla
#   git worktree add ../viajex-gh-pages gh-pages
#   git -C ../viajex-gh-pages rm -rq .
cp -r client/dist/. ../viajex-gh-pages/
git -C ../viajex-gh-pages add -A
git -C ../viajex-gh-pages commit -m "deploy: <versión>"
git -C ../viajex-gh-pages push -u origin gh-pages
git worktree remove ../viajex-gh-pages
```

En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / root**.
La demo queda en `https://<usuario>.github.io/viajex/`.

## Escenarios manuales

Se conserva la numeración de la v1 para la trazabilidad. Los escenarios marcados *eliminado en v2*
dependían del login.

| # | Pasos | Resultado esperado | Historia |
|---|---|---|---|
| 1 | Abrir `/` | 5 o más destinos con imagen, país y actividades populares | P1 |
| 2 | Clic en un destino | Ves sus vuelos, hoteles y tours, solo los de ese destino | P1 |
| 3 | Abrir `/destinos/no-existe` | Mensaje amigable con enlace a `/` | P1 |
| 4 | Bloquear la URL `/viajex/graphql` en DevTools (Network → Block request URL) y recargar `/` | Mensaje amigable con botón Reintentar | P1 |
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
| 18 | Con `npm run preview`, abrir y recargar `/viajex/destinos/d1` y `/viajex/reservas` | La app carga en ambas rutas | P6 |
| 19 | En la URL publicada de Pages, recorrer los escenarios 1, 5, 7, 11, 13 y 16, y recargar una ruta interna | Todo funciona sin servidor propio | P6 |
