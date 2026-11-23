# Implementation Plan: Sistema de reserva de vuelos y hoteles

**Branch**: `plan` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Especificación de la feature en `spec.md` (raíz), con `constitucion.md` v1.1.0

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Demo académica de reservas de viaje. El visitante explora destinos y sus vuelos, hoteles y tours
sin iniciar sesión. Con el login simulado puede crear, ver, modificar (incluidas las fechas) y
eliminar reservas.

Enfoque técnico:
- Un cliente React + Vite + Tailwind consume con `fetch` una API GraphQL mock (Apollo Server +
  `@graphql-tools/mock`).
- El catálogo se carga con datos fijos en `createMockStore`, y las reservas se guardan en ese
  mismo store.
- El total y las validaciones son funciones puras del cliente, las únicas piezas con pruebas.

Detalle de las decisiones en [research.md](research.md).

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos ES) sobre Node.js 20+; JSX en el cliente

**Primary Dependencies**:
- Cliente: React 19, Vite 7, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`).
- Servidor: `@apollo/server` 5, `@graphql-tools/mock` 9, `@graphql-tools/schema` 10, `graphql` 16.
- Raíz: `concurrently` 9.
- Dependencias de soporte: ver [research.md](research.md) R2.

**Storage**: ninguno. Todo vive en memoria, en `createMockStore`, y se pierde al reiniciar el
servidor

**Testing**: Vitest 3 + Testing Library (`@testing-library/react`, `jsdom`), solo en el cliente

**Target Platform**: navegador de escritorio moderno; servidor Node local en `:4000`; cliente
Vite en `:5173`

**Project Type**: aplicación web (cliente SPA + servidor GraphQL mock)

**Performance Goals**: el total se actualiza en menos de 1 s tras cada cambio (SC-006)

**Constraints**:
- `fetch` nativo, sin cliente GraphQL.
- Solo `useState` y `useEffect`, sin estado global.
- Sin TypeScript.
- Identificadores en español.
- Comentarios de 100 caracteres como máximo.

**Scale/Scope**: 1 usuario mock, 5 destinos o más, 5 páginas, unos 10 componentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Verificación | Estado |
|---|---|---|
| I. Demo académica y simplicidad | Dos paquetes y un script raíz; sin capas de servicios ni abstracciones extra; `window.confirm` en lugar de un diálogo propio | ✅ |
| II. Stack tecnológico cerrado | React + Vite + Tailwind, React Router, `fetch`, `useState`/`useEffect`, Apollo Server + `@graphql-tools/mock` + `createMockStore`, JS, Vitest + Testing Library solo en el cliente. Las dependencias de soporte se justifican en R2 | ✅ (ver Complexity Tracking) |
| III. Reglas de dominio inmutables | Un destino por reserva, inmutable al editar; vuelo, hotel y tours opcionales con al menos uno; pasajeros y fechas obligatorios; fechas editables (v1.1.0); eliminar borra; login con la mutation `login`; sesión en `useState`; CLP sin decimales; ISO en la API y `dd/mm/aaaa` en la UI | ✅ |
| IV. Código funcional, modular y en español | Funciones puras para cálculo, validación y formato; componentes reutilizables (`SelectorServicios` lo comparten crear y editar); nombres en español sin tildes en GraphQL (R8) | ✅ |
| V. Errores amigables y validación en el cliente | `consultar()` traduce todos los errores; `validarReserva()` se ejecuta antes de cada mutation; mensajes en [contracts/ui-rutas.md](contracts/ui-rutas.md) | ✅ |
| VI. Cero código sombra y flujo SDD | Cada pieza se rastrea hasta un FR (ver tabla de trazabilidad); documentos en la raíz | ✅ |

**Re-evaluación tras la Fase 1**: el diseño (data-model, contratos, quickstart) no agrega
entidades, rutas ni dependencias fuera de lo anterior. ✅

## Project Structure

### Documentation (this feature)

```text
./                       # raíz (constitucion.md v1.1.0: documentos SDD en la raíz)
├── constitucion.md
├── spec.md
├── checklists/requirements.md
├── plan.md              # este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/           # Fase 1
│   ├── schema.graphql
│   └── ui-rutas.md
└── tasks.md             # Fase 2 (/speckit-tasks, no lo crea /speckit-plan)
```

### Source Code (repository root)

```text
package.json                   # scripts raíz: dev (concurrently), test
client/
├── package.json
├── vite.config.js             # plugins react + tailwind, proxy /graphql, test: jsdom
├── index.html
└── src/
    ├── main.jsx
    ├── index.css              # @import "tailwindcss"
    ├── App.jsx                # rutas + estado usuario (useState)
    ├── lib/
    │   ├── api.js             # consultar(query, variables) + traducción de errores
    │   ├── calculos.js        # calcularNoches, calcularTotal
    │   ├── calculos.test.js
    │   ├── validaciones.js    # validarReserva
    │   ├── validaciones.test.js
    │   └── formatos.js        # formatearCLP, formatearFecha
    ├── graphql/
    │   ├── destinos.js        # DESTINOS, DESTINO
    │   ├── reservas.js        # RESERVAS, RESERVA, CREAR/ACTUALIZAR/ELIMINAR_RESERVA
    │   └── sesion.js          # LOGIN
    ├── components/
    │   ├── BarraNavegacion.jsx
    │   ├── RutaProtegida.jsx
    │   ├── MensajeError.jsx       # mensaje + botón reintentar opcional
    │   ├── TarjetaDestino.jsx
    │   ├── TarjetaVuelo.jsx
    │   ├── TarjetaHotel.jsx
    │   ├── TarjetaTour.jsx
    │   ├── SelectorServicios.jsx  # vuelos, hoteles y tours seleccionables
    │   ├── FormularioReserva.jsx  # pasajeros, fechas, total, errores, confirmar
    │   ├── FormularioReserva.test.jsx
    │   └── TarjetaReserva.jsx
    └── pages/
        ├── PaginaInicio.jsx
        ├── PaginaDestino.jsx
        ├── PaginaLogin.jsx
        ├── PaginaReservas.jsx
        └── PaginaReserva.jsx
server/
├── package.json               # "type": "module"
└── src/
    ├── index.js               # startStandaloneServer en :4000
    ├── schema.js              # typeDefs = contracts/schema.graphql
    └── mocks.js               # usuario, catálogo, createMockStore y resolvers
```

**Structure Decision**: es la estructura sugerida en la constitución (§ Estructura de paquetes)
como aplicación web de dos paquetes. Se agregan los archivos que esa estructura implica:
- `App.jsx`, `main.jsx`, `index.html` e `index.css` son el mínimo de Vite y Tailwind.
- `calculos.js`, `validaciones.js` y `formatos.js` son la lógica pura que FR-026 a FR-030 exigen.
Las pruebas van junto al archivo que prueban.

### Trazabilidad FR → archivos

| Requisitos | Archivos |
|---|---|
| FR-001 a FR-007 (sesión) | `PaginaLogin`, `BarraNavegacion`, `RutaProtegida`, `App.jsx`, `graphql/sesion.js`, resolver `login` |
| FR-008 a FR-012 (exploración) | `PaginaInicio`, `PaginaDestino`, `TarjetaDestino`/`Vuelo`/`Hotel`/`Tour`, `MensajeError`, `graphql/destinos.js`, catálogo en `mocks.js` |
| FR-013 a FR-016 (crear) | `PaginaDestino`, `SelectorServicios`, `FormularioReserva`, resolver `crearReserva` |
| FR-017 (ver) | `PaginaReservas`, `TarjetaReserva`, resolver `reservas` |
| FR-018 (modificar) | `PaginaReserva`, `SelectorServicios`, `FormularioReserva`, resolvers `reserva` y `actualizarReserva` |
| FR-019 (eliminar) | `PaginaReservas`, `PaginaReserva`, resolver `eliminarReserva` |
| FR-020 a FR-023 (validaciones) | `validaciones.js`, `FormularioReserva` |
| FR-024 (errores) | `api.js`, `MensajeError` |
| FR-025 (persistencia) | `createMockStore` en `mocks.js` |
| FR-026 a FR-029 (cálculo y formato) | `calculos.js`, `formatos.js` |
| FR-030 (pruebas) | `calculos.test.js`, `validaciones.test.js`, `FormularioReserva.test.jsx` |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dependencias no nombradas en la constitución: `graphql`, `@graphql-tools/schema`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `jsdom` | Son peers o plugins obligatorios de las librerías que la constitución fija (R2) | Sin ellas, Apollo, `addMocksToSchema`, Vite con JSX, Tailwind 4 y Testing Library no funcionan |
