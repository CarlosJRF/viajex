# Implementation Plan: Sistema de reserva de vuelos y hoteles

**Branch**: `plan` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Especificación de la feature en `spec.md` v3 (raíz), con `constitucion.md` v2.1.0

**Versión del plan**: 3.0.0 (ver Historial de versiones)

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Demo académica de reservas de viaje, publicada como sitio estático en GitHub Pages. El visitante
explora destinos y sus vuelos, hoteles y tours, y crea, ve, modifica (incluidas las fechas) y
elimina reservas, sin login.

Enfoque técnico v3:
- El cliente React + Vite + Tailwind consume con `fetch` nativo un endpoint REST
  (`GET /api/destinos`, listado) y un endpoint GraphQL (`/graphql`, detalle y reservas).
- Ambos los simula **en el navegador** Mock Service Worker (`mocks/handlers.js` y
  `mocks/browser.js`). GraphQL se ejecuta con `@graphql-tools/mock` y `createMockStore` (mismo
  catálogo de v1, más fechas y disponibilidad informativas), sin usuarios.
- Las reservas se respaldan en `localStorage`.
- El hook `useConsulta` (con `AbortController`) unifica la carga de datos de las cuatro páginas.
- Se agregan la página 404, el enlace activo, roles de accesibilidad y la revisión responsiva.
- Un workflow de GitHub Actions prueba, compila y sube el sitio a la rama `gh-pages`.
- El total y las validaciones siguen siendo funciones puras del cliente, las únicas piezas con
  pruebas.

Detalle de las decisiones en [research.md](research.md) (R14–R21 para v2 y R22–R32 para v3).

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos ES) en el navegador; Node.js 20+ solo para
desarrollo y build; JSX en el cliente

**Primary Dependencies**:
- Cliente: React 19, Vite 7, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`).
- Mock en el navegador (REST + GraphQL): `msw` 2, `graphql` 16, `@graphql-tools/mock` 9,
  `@graphql-tools/schema` 10.
- CI: GitHub Actions con `actions/checkout@v4` y `actions/setup-node@v4` (no son dependencias npm).
- Se eliminan `server/` (`@apollo/server`) y `concurrently` (R14).
- Dependencias de soporte: ver [research.md](research.md) R2 y R14.

**Storage**: store en memoria de `createMockStore`, respaldado en `localStorage`
(`viajex:reservas`)

**Testing**: Vitest 3 + Testing Library (`@testing-library/react`, `@testing-library/dom`, `jsdom`),
solo en el cliente

**Target Platform**: navegador de escritorio moderno con soporte de service workers; sitio estático
en GitHub Pages bajo `/viajex/` (`VITE_BASE_PATH`); en local, Vite en `:5173/`; navegadores
objetivo: Chrome, Firefox, Edge, Safari y móvil

**Project Type**: aplicación web estática (SPA con API GraphQL mock en el navegador)

**Performance Goals**: el total se actualiza en menos de 1 s tras cada cambio (SC-006)

**Constraints**:
- `fetch` nativo en el código de la app; librerías GraphQL y MSW solo dentro de
  `client/src/mocks/`.
- Sin latencia simulada ni botones para forzar errores (fuera de alcance en spec v3).
- Solo `useState` y `useEffect`, sin estado global.
- Sin TypeScript.
- Identificadores en español.
- Comentarios de 100 caracteres como máximo.
- Sin servidor propio: todo debe funcionar como archivos estáticos.

**Scale/Scope**: 5 destinos o más, 5 páginas (incluida la 404), unos 10 componentes, reservas por
navegador

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Verificación | Estado |
|---|---|---|
| I. Demo académica y simplicidad | Un solo paquete de app (`client/`); sin servidor; workflow de un solo job sin acciones de terceros (R30); `404.html` copiado en el build; un hook para la carga de datos | ✅ |
| II. Stack tecnológico cerrado | React + Vite + Tailwind, React Router (`NavLink`, ruta `*`), `fetch` a REST y GraphQL, `useState`/`useEffect` (también dentro de `useConsulta`), MSW + `graphql` + `@graphql-tools/mock` + `createMockStore`, `localStorage`, Actions → `gh-pages`, JS, Vitest + Testing Library. Las librerías de mock solo viven en `client/src/mocks/` | ✅ (ver Complexity Tracking) |
| III. Reglas de dominio inmutables | Un destino por reserva, inmutable al editar; vuelo, hotel y tours opcionales con al menos uno; pasajeros y fechas obligatorios y editables; fechas del vuelo rellenan la reserva y la disponibilidad es solo informativa (v2.1.0); eliminar borra; sin login; reservas en `localStorage`; CLP sin decimales; ISO en la API y `dd/mm/aaaa` en la UI | ✅ |
| IV. Código funcional, modular y en español | Funciones puras para cálculo, validación, formato y persistencia; `useConsulta` elimina el patrón de carga repetido; `SelectorServicios` y `FormularioReserva` compartidos; `browser.js`/`handlers.js` como excepción por convención de MSW (v2.1.0) | ✅ |
| V. Errores amigables y validación en el cliente | `solicitar()` traduce los errores de REST y GraphQL; las cancelaciones no se muestran; `validarReserva()` antes de cada mutation; la persistencia nunca lanza errores hacia la UI | ✅ |
| VI. Cero código sombra y flujo SDD | Cada cambio se rastrea hasta un FR (FR-031–FR-042 en v2/v3; ver trazabilidad); el punto 10 (latencia y errores forzados) queda fuera por decisión del autor | ✅ |

**Re-evaluación tras la Fase 1**: el diseño v3 (data-model, contratos, quickstart) no agrega
entidades, rutas ni dependencias fuera de lo anterior. ✅

## Project Structure

### Documentation (this feature)

```text
./                       # raíz (documentos SDD en la raíz)
├── constitucion.md      # v2.1.0
├── spec.md              # v3
├── checklists/requirements.md
├── plan.md              # este archivo (v3.0.0)
├── research.md          # R1–R13 (v1) + R14–R21 (v2) + R22–R32 (v3)
├── data-model.md        # v3: fechas y disponibilidad informativas
├── quickstart.md        # v3: escenarios 1–27 y publicación con Actions
├── contracts/
│   ├── rest.md          # v3: GET /api/destinos
│   ├── schema.graphql   # v3: sin Query.destinos; Vuelo y Hotel con fechas y disponibilidad
│   └── ui-rutas.md      # v3: rutas públicas, ruta *, NavLink
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
package.json                   # scripts raíz que delegan en client/ (sin concurrently)
README.md                      # descripción, enlace, instalación, scripts, estructura, capturas, matriz
.github/workflows/publicar.yml # prueba, compila y sube client/dist a gh-pages (R30)
client/
├── package.json               # + msw, graphql, @graphql-tools/mock, @graphql-tools/schema
├── vite.config.js             # base desde VITE_BASE_PATH, plugins react + tailwind, test: jsdom
├── index.html
├── public/
│   ├── mockServiceWorker.js   # generado por `npx msw init public --save`
│   └── .nojekyll              # Pages sin Jekyll (R18)
└── src/
    ├── main.jsx               # arranca el worker de MSW y luego monta <App> con basename
    ├── index.css
    ├── App.jsx                # rutas públicas + ruta * (sin estado de usuario)
    ├── mocks/                 # ÚNICO lugar con MSW y librerías GraphQL (constitución II)
    │   ├── schema.js          # typeDefs = contracts/schema.graphql
    │   ├── catalogo.js        # catálogo fijo de v1 + fechas y disponibilidad
    │   ├── persistencia.js    # cargarReservas, guardarReservas (localStorage)
    │   ├── resolvers.js       # crearStore, crearResolvers (sin usuarios)
    │   ├── handlers.js        # http.get('*/api/destinos') + graphql.operation (convención MSW)
    │   └── browser.js         # worker = setupWorker(...handlers) (convención MSW)
    ├── lib/
    │   ├── api.js             # solicitar(), consultar() (GraphQL) y obtenerJSON() (REST) con signal
    │   ├── useConsulta.js     # hook de carga con AbortController (R25)
    │   ├── calculos.js        # + calculos.test.js
    │   ├── validaciones.js    # + validaciones.test.js
    │   └── formatos.js
    ├── graphql/
    │   ├── destinos.js        # DESTINO y CAMPOS_OPCIONES (sin DESTINOS en v3)
    │   └── reservas.js        # sin usuarioId
    ├── components/
    │   ├── BarraNavegacion.jsx    # NavLink activo a "Mis reservas"
    │   ├── MensajeError.jsx       # role="alert"
    │   ├── TarjetaDestino.jsx
    │   ├── TarjetaVuelo.jsx       # + fechas de ida/vuelta y cupos
    │   ├── TarjetaHotel.jsx       # + rango de fechas y habitaciones
    │   ├── TarjetaTour.jsx
    │   ├── SelectorServicios.jsx  # al elegir un vuelo, rellena las fechas (FR-034)
    │   ├── FormularioReserva.jsx  # + FormularioReserva.test.jsx
    │   └── TarjetaReserva.jsx
    └── pages/
        ├── PaginaInicio.jsx
        ├── PaginaDestino.jsx
        ├── PaginaReservas.jsx
        ├── PaginaReserva.jsx
        └── PaginaNoEncontrada.jsx # ruta * (FR-036)
```

Se eliminan respecto de v1: `server/` completo, `client/src/pages/PaginaLogin.jsx`,
`client/src/components/RutaProtegida.jsx` y `client/src/graphql/sesion.js`.

**Structure Decision**: es la estructura de la constitución v2.1.0 (§ Estructura de paquetes): una
app web estática en `client/`, con el mock aislado en `client/src/mocks/` y el workflow en
`.github/workflows/`. El mock se divide en seis módulos pequeños: datos, esquema, persistencia,
resolvers, endpoints (`handlers.js`) y arranque del worker (`browser.js`).

### Trazabilidad FR → archivos

| Requisitos | Archivos |
|---|---|
| FR-001 a FR-007, FR-016 (eliminados en v2) | Se borran `PaginaLogin`, `RutaProtegida`, `graphql/sesion.js`; se limpian `App.jsx`, `BarraNavegacion`, `PaginaDestino`, `graphql/reservas.js` y las páginas de reservas |
| FR-008 a FR-012 (exploración) | `PaginaInicio` (REST), `PaginaDestino`, `TarjetaDestino`/`Vuelo`/`Hotel`/`Tour`, `MensajeError`, `graphql/destinos.js`, `mocks/catalogo.js`, `mocks/handlers.js` |
| FR-013 a FR-015 (crear) | `PaginaDestino`, `SelectorServicios`, `FormularioReserva`, resolver `crearReserva` |
| FR-017 (ver) | `PaginaReservas`, `TarjetaReserva`, resolver `reservas` |
| FR-018 (modificar) | `PaginaReserva`, `SelectorServicios`, `FormularioReserva`, resolvers `reserva` y `actualizarReserva` |
| FR-019 (eliminar) | `PaginaReservas`, `PaginaReserva`, resolver `eliminarReserva` |
| FR-020 a FR-023 (validaciones) | `validaciones.js`, `FormularioReserva` |
| FR-024 (errores) | `api.js`, `MensajeError` |
| FR-026 a FR-029 (cálculo y formato) | `calculos.js`, `formatos.js` |
| FR-030 (pruebas) | `calculos.test.js`, `validaciones.test.js`, `FormularioReserva.test.jsx` |
| FR-031 (localStorage) | `mocks/persistencia.js`, `mocks/resolvers.js` |
| FR-032 (mock en el navegador) | `mocks/handlers.js`, `mocks/browser.js`, `mocks/schema.js`, `main.jsx`, `public/mockServiceWorker.js`, `api.js` |
| FR-033 (GitHub Pages) | `vite.config.js` (`VITE_BASE_PATH`), `main.jsx` (`basename`), script `build` (`404.html`), `public/.nojekyll`, `.github/workflows/publicar.yml`, rama `gh-pages` |
| FR-034, FR-035 (fechas y disponibilidad) | `mocks/catalogo.js`, `mocks/schema.js`, `graphql/destinos.js`, `TarjetaVuelo`, `TarjetaHotel`, `SelectorServicios` |
| FR-036, FR-037 (404 y enlace activo) | `PaginaNoEncontrada`, `App.jsx`, `BarraNavegacion` |
| FR-038 (accesibilidad) | `MensajeError`, `FormularioReserva`, textos de carga de las 4 páginas |
| FR-039 (cancelación) | `lib/useConsulta.js`, `lib/api.js` |
| FR-040 (responsividad) | `BarraNavegacion`, `SelectorServicios`, `FormularioReserva` (clases Tailwind) |
| FR-041, FR-042 (README y navegadores) | `README.md` |

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
| 3.0.0 | v2.1.0 / v3 | REST `GET /api/destinos`, `browser.js`/`handlers.js`, fechas y disponibilidad informativas, `useConsulta` con `AbortController`, 404, `NavLink`, roles de accesibilidad, responsividad, `VITE_BASE_PATH`, Actions → `gh-pages`, README y matriz de navegadores (R22–R32) |
