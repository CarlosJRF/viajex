# Implementation Plan: Sistema de reserva de vuelos y hoteles

**Branch**: `plan` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Especificación de la feature en `spec.md` v2 (raíz), con `constitucion.md` v2.0.0

**Versión del plan**: 2.0.0 (ver Historial de versiones)

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Demo académica de reservas de viaje, publicada como sitio estático en GitHub Pages. El visitante
explora destinos y sus vuelos, hoteles y tours, y crea, ve, modifica (incluidas las fechas) y
elimina reservas, sin login.

Enfoque técnico v2:
- El cliente React + Vite + Tailwind sigue consumiendo `/graphql` con `fetch` nativo.
- La API GraphQL mock corre **en el navegador**: Mock Service Worker intercepta `/graphql` y
  ejecuta el esquema con `@graphql-tools/mock` y `createMockStore` (mismo catálogo y resolvers que
  en v1, sin usuarios).
- Las reservas se respaldan en `localStorage`.
- El total y las validaciones siguen siendo funciones puras del cliente, las únicas piezas con
  pruebas.

Detalle de las decisiones en [research.md](research.md) (R14–R21 para v2).

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos ES) en el navegador; Node.js 20+ solo para
desarrollo y build; JSX en el cliente

**Primary Dependencies**:
- Cliente: React 19, Vite 7, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`).
- Mock en el navegador: `msw` 2, `graphql` 16, `@graphql-tools/mock` 9, `@graphql-tools/schema` 10.
- Se eliminan `server/` (`@apollo/server`) y `concurrently` (R14).
- Dependencias de soporte: ver [research.md](research.md) R2 y R14.

**Storage**: store en memoria de `createMockStore`, respaldado en `localStorage`
(`viajex:reservas`)

**Testing**: Vitest 3 + Testing Library (`@testing-library/react`, `@testing-library/dom`, `jsdom`),
solo en el cliente

**Target Platform**: navegador de escritorio moderno con soporte de service workers; sitio estático
en GitHub Pages bajo `/viajex/`; en local, Vite en `:5173/viajex/`

**Project Type**: aplicación web estática (SPA con API GraphQL mock en el navegador)

**Performance Goals**: el total se actualiza en menos de 1 s tras cada cambio (SC-006)

**Constraints**:
- `fetch` nativo en el código de la app; librerías GraphQL solo dentro de `client/src/mocks/`.
- Solo `useState` y `useEffect`, sin estado global.
- Sin TypeScript.
- Identificadores en español.
- Comentarios de 100 caracteres como máximo.
- Sin servidor propio: todo debe funcionar como archivos estáticos.

**Scale/Scope**: 5 destinos o más, 4 páginas, unos 10 componentes, reservas por navegador

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Verificación | Estado |
|---|---|---|
| I. Demo académica y simplicidad | Un solo paquete de app (`client/`); sin servidor; publicación sin CI ni paquetes extra (R19); `404.html` copiado en el build en lugar de un router especial | ✅ |
| II. Stack tecnológico cerrado | React + Vite + Tailwind, React Router, `fetch`, `useState`/`useEffect`, MSW + `graphql` + `@graphql-tools/mock` + `createMockStore`, `localStorage`, GitHub Pages, JS, Vitest + Testing Library. Las librerías GraphQL solo viven en `client/src/mocks/` | ✅ (ver Complexity Tracking) |
| III. Reglas de dominio inmutables | Un destino por reserva, inmutable al editar; vuelo, hotel y tours opcionales con al menos uno; pasajeros y fechas obligatorios y editables; eliminar borra; sin login (v2.0.0); reservas por navegador en `localStorage`; CLP sin decimales; ISO en la API y `dd/mm/aaaa` en la UI | ✅ |
| IV. Código funcional, modular y en español | Funciones puras para cálculo, validación, formato y persistencia; `SelectorServicios` y `FormularioReserva` compartidos; módulos del mock en español (`catalogo`, `persistencia`, `navegador`) | ✅ |
| V. Errores amigables y validación en el cliente | `consultar()` traduce todos los errores; `validarReserva()` antes de cada mutation; la persistencia nunca lanza errores hacia la UI (R16) | ✅ |
| VI. Cero código sombra y flujo SDD | Cada cambio de v2 se rastrea hasta FR-031–FR-033 o a la eliminación de FR-001–FR-007/FR-016 (ver trazabilidad); documentos en la raíz | ✅ |

**Re-evaluación tras la Fase 1**: el diseño v2 (data-model, contratos, quickstart) no agrega
entidades, rutas ni dependencias fuera de lo anterior. ✅

## Project Structure

### Documentation (this feature)

```text
./                       # raíz (documentos SDD en la raíz)
├── constitucion.md      # v2.0.0
├── spec.md              # v2
├── checklists/requirements.md
├── plan.md              # este archivo (v2.0.0)
├── research.md          # R1–R13 (v1) + R14–R21 (v2)
├── data-model.md        # v2: sin Usuario, respaldo en localStorage
├── quickstart.md        # v2: escenarios 1–19 y publicación
├── contracts/
│   ├── schema.graphql   # v2: sin login ni usuarioId
│   └── ui-rutas.md      # v2: rutas públicas bajo /viajex/
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
package.json                   # scripts raíz que delegan en client/ (sin concurrently)
client/
├── package.json               # + msw, graphql, @graphql-tools/mock, @graphql-tools/schema
├── vite.config.js             # base '/viajex/', plugins react + tailwind, test: jsdom (sin proxy)
├── index.html
├── public/
│   ├── mockServiceWorker.js   # generado por `npx msw init public --save`
│   └── .nojekyll              # Pages sin Jekyll (R18)
└── src/
    ├── main.jsx               # arranca el worker de MSW y luego monta <App> con basename
    ├── index.css
    ├── App.jsx                # rutas públicas (sin estado de usuario)
    ├── mocks/                 # ÚNICO lugar con librerías GraphQL (constitución II)
    │   ├── schema.js          # typeDefs = contracts/schema.graphql
    │   ├── catalogo.js        # catálogo fijo (el mismo de v1)
    │   ├── persistencia.js    # cargarReservas, guardarReservas (localStorage)
    │   ├── resolvers.js       # crearStore, crearResolvers (sin usuarios)
    │   └── navegador.js       # esquema + store + setupWorker con graphql.operation
    ├── lib/
    │   ├── api.js             # consultar(): fetch a `${BASE_URL}graphql`
    │   ├── calculos.js        # + calculos.test.js
    │   ├── validaciones.js    # + validaciones.test.js
    │   └── formatos.js
    ├── graphql/
    │   ├── destinos.js
    │   └── reservas.js        # sin usuarioId
    ├── components/
    │   ├── BarraNavegacion.jsx    # siempre muestra "Mis reservas"
    │   ├── MensajeError.jsx
    │   ├── TarjetaDestino.jsx
    │   ├── TarjetaVuelo.jsx
    │   ├── TarjetaHotel.jsx
    │   ├── TarjetaTour.jsx
    │   ├── SelectorServicios.jsx
    │   ├── FormularioReserva.jsx  # + FormularioReserva.test.jsx
    │   └── TarjetaReserva.jsx
    └── pages/
        ├── PaginaInicio.jsx
        ├── PaginaDestino.jsx
        ├── PaginaReservas.jsx
        └── PaginaReserva.jsx
```

Se eliminan respecto de v1: `server/` completo, `client/src/pages/PaginaLogin.jsx`,
`client/src/components/RutaProtegida.jsx` y `client/src/graphql/sesion.js`.

**Structure Decision**: es la estructura de la constitución v2.0.0 (§ Estructura de paquetes): una
app web estática en `client/`, con el mock aislado en `client/src/mocks/`. El mock se divide en
cinco módulos pequeños para separar datos, persistencia, resolvers y arranque del worker.

### Trazabilidad FR → archivos

| Requisitos | Archivos |
|---|---|
| FR-001 a FR-007, FR-016 (eliminados en v2) | Se borran `PaginaLogin`, `RutaProtegida`, `graphql/sesion.js`; se limpian `App.jsx`, `BarraNavegacion`, `PaginaDestino`, `graphql/reservas.js` y las páginas de reservas |
| FR-008 a FR-012 (exploración) | `PaginaInicio`, `PaginaDestino`, `TarjetaDestino`/`Vuelo`/`Hotel`/`Tour`, `MensajeError`, `graphql/destinos.js`, `mocks/catalogo.js` |
| FR-013 a FR-015 (crear) | `PaginaDestino`, `SelectorServicios`, `FormularioReserva`, resolver `crearReserva` |
| FR-017 (ver) | `PaginaReservas`, `TarjetaReserva`, resolver `reservas` |
| FR-018 (modificar) | `PaginaReserva`, `SelectorServicios`, `FormularioReserva`, resolvers `reserva` y `actualizarReserva` |
| FR-019 (eliminar) | `PaginaReservas`, `PaginaReserva`, resolver `eliminarReserva` |
| FR-020 a FR-023 (validaciones) | `validaciones.js`, `FormularioReserva` |
| FR-024 (errores) | `api.js`, `MensajeError` |
| FR-026 a FR-029 (cálculo y formato) | `calculos.js`, `formatos.js` |
| FR-030 (pruebas) | `calculos.test.js`, `validaciones.test.js`, `FormularioReserva.test.jsx` |
| FR-031 (localStorage) | `mocks/persistencia.js`, `mocks/resolvers.js` |
| FR-032 (mock en el navegador) | `mocks/navegador.js`, `mocks/schema.js`, `main.jsx`, `public/mockServiceWorker.js`, `api.js` |
| FR-033 (GitHub Pages) | `vite.config.js` (`base`), `main.jsx` (`basename`), script `build` (`404.html`), `public/.nojekyll`, rama `gh-pages` |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dependencias no nombradas en la constitución: `@graphql-tools/schema`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `jsdom`, `@testing-library/dom` | Son peers o plugins obligatorios de las librerías que la constitución fija (R2, R14) | Sin ellas no funcionan `addMocksToSchema`, Vite con JSX, Tailwind 4 ni Testing Library |

## Historial de versiones

| Versión | Constitución / Spec | Cambios |
|---|---|---|
| 1.0.0 | v1.1.0 / v1 | Plan inicial: cliente + servidor Apollo mock, login simulado |
| 1.0.1 | v1.1.0 / v1 | Agrega `@testing-library/dom` a las dependencias de soporte |
| 2.0.0 | v2.0.0 / v2 | Mock GraphQL en el navegador con MSW, sin servidor ni login, reservas en `localStorage`, base `/viajex/` y publicación en GitHub Pages (R14–R21) |
