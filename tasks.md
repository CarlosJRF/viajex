---

description: "Lista de tareas para implementar el sistema de reserva de vuelos y hoteles"
---

# Tasks: Sistema de reserva de vuelos y hoteles

**Input**: Documentos de diseño en la raíz: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/`, `quickstart.md`. Constitución: `constitucion.md` v1.1.0.

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: solo los que exige FR-030: cálculo del total y validaciones, con Vitest + Testing
Library y únicamente en el cliente. No hay pruebas del servidor mock ni E2E.

**Organization**: las tareas se agrupan por historia de usuario (US1–US6 = P1–P6 de `spec.md`).

**Versión 2** (constitución v2.0.0, spec v2, plan v2.0.0): las fases 1–8 (T001–T054) son la
implementación v1 ya completada y se conservan para la trazabilidad. Las fases 9–13 (T055–T075)
migran a la v2: mock en el navegador, sin login, `localStorage` y GitHub Pages.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `client/src/` (React) y `server/src/` (Apollo + mocks), según `plan.md`.
- Reglas para todo el código (constitución IV): identificadores en español; programación
  funcional; comentarios breves en español de 100 caracteres como máximo; JavaScript sin
  TypeScript; estilos solo con clases de Tailwind.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Crear `package.json` en la raíz (`"private": true`) con devDependency `concurrently@^9`
  y los scripts `"dev": "concurrently -n server,client \"npm run dev --prefix server\" \"npm run dev --prefix client\""`
  y `"test": "npm test --prefix client"`. Crear `.gitignore` en la raíz con `node_modules/` y
  `dist/`.
- [X] T002 [P] Crear `server/package.json` con `"type": "module"`, scripts
  `"dev": "node --watch src/index.js"` y `"start": "node src/index.js"`, y dependencies
  `@apollo/server@^5`, `@graphql-tools/mock@^9`, `@graphql-tools/schema@^10`, `graphql@^16`.
- [X] T003 [P] Crear `client/package.json` con `"type": "module"` y scripts `"dev": "vite"`,
  `"build": "vite build"` y `"test": "vitest run"`.
  - dependencies: `react@^19`, `react-dom@^19`, `react-router@^7`.
  - devDependencies: `vite@^7`, `@vitejs/plugin-react`, `tailwindcss@^4`, `@tailwindcss/vite@^4`,
    `vitest@^3`, `@testing-library/react@^16`, `@testing-library/dom` (peer obligatorio de la
    anterior) y `jsdom`.
- [X] T004 Crear `client/vite.config.js` con:
  - plugins `react()` y `tailwindcss()`;
  - `server.proxy: { '/graphql': 'http://localhost:4000' }`;
  - `test: { environment: 'jsdom' }`.
- [X] T005 [P] Crear `client/index.html` (`lang="es"`, título "Viajex", `<div id="root">`, script
  `/src/main.jsx`), `client/src/index.css` (solo `@import "tailwindcss";`) y
  `client/src/main.jsx` (monta `<App />` dentro de `<BrowserRouter>` de `react-router` e importa
  `./index.css`).
- [X] T006 Ejecutar `npm install` en la raíz, en `server/` y en `client/`, y verificar que
  terminen sin errores.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Crear `server/src/schema.js`, que exporta `typeDefs`: un template string con el
  contenido íntegro de `contracts/schema.graphql`, sin agregar ni quitar tipos ni campos.
- [X] T008 [P] Crear `server/src/mocks.js` con los datos fijos (research R3, R11) y el store:
  - **Usuario**: exportar `usuarioMock = { id: 'u1', nombre: 'Usuario Demo', correo: 'demo@viajes.cl', contrasena: 'demo1234' }`.
  - **Catálogo**: un arreglo `catalogo` con 5 destinos de países distintos: Cusco (Perú), Cancún
    (México), Buenos Aires (Argentina), Madrid (España) y Río de Janeiro (Brasil).
    - Cada destino tiene `id` (`d1`…`d5`), `nombre`, `imagen` (`https://picsum.photos/seed/<id>/600/400`),
      `pais { id, nombre }` y `actividadesPopulares` (2–3 `{ id, nombre }`).
    - Cada destino tiene 2–3 `vuelos { id, aerolinea, horarioIda 'HH:MM', horarioVuelta 'HH:MM', precio }`
      ("CLP por pasajero, ida y vuelta").
    - Cada destino tiene 2–3 `hoteles { id, nombre, categoria, precioNoche }` (`categoria` "Estrellas,
      de 1 a 5"; `precioNoche` "CLP por noche").
    - Cada destino tiene 2–3 `tours { id, nombre, actividades (2–3), precio }` ("CLP por persona").
    - Los ids son únicos en todo el catálogo (por ejemplo `v1`, `h1`, `t1`, `a1`). Los precios son
      enteros CLP verosímiles.
  - **Store**: exportar `crearStore(schema)`, que llama a `createMockStore({ schema })`, ejecuta
    `store.set('Query', 'ROOT', 'destinos', catalogo)` y
    `store.set('Query', 'ROOT', 'reservas', [])`, y devuelve el store.
- [X] T009 En `server/src/mocks.js`, exportar también `crearResolvers(store)`:
  - `Query.destinos`: devuelve `store.get('Query', 'ROOT', 'destinos')`.
  - `Query.destino(id)`: devuelve `null` si `!store.has('Destino', id)`; si existe, devuelve
    `store.get('Destino', id)`.
  - Usar siempre `store.has` antes de `store.get` con ids recibidos, porque `get` crea mocks
    aleatorios si la clave no existe.
- [X] T010 Crear `server/src/index.js`:
  - `makeExecutableSchema({ typeDefs })`, luego `crearStore(schema)` y
    `addMocksToSchema({ schema, store, resolvers: crearResolvers(store) })`.
  - `new ApolloServer({ schema })` y `startStandaloneServer(servidor, { listen: { port: 4000 } })`.
  - Registrar la URL en consola.
- [X] T011 [P] Crear `client/src/lib/api.js`, que exporta `consultar(query, variables = {})`:
  - Hace `fetch('/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })`
    y devuelve `data`.
  - Ante un fallo de red o una respuesta no OK, lanza `Error('No pudimos conectar con el servidor. Inténtalo nuevamente.')`.
  - Ante `errors` de GraphQL, lanza `Error('Ocurrió un problema al procesar tu solicitud.')`.
  - Nunca propaga texto técnico (FR-024).
- [X] T012 [P] Crear `client/src/lib/formatos.js`:
  - `formatearCLP(monto)` con `Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })`
    (ejemplo `$1.250.000`).
  - `formatearFecha('AAAA-MM-DD')` → `'dd/mm/aaaa'`, partiendo el texto sin usar `Date` (R7).
- [X] T013 [P] Crear `client/src/components/MensajeError.jsx` con props `mensaje`, `alReintentar`
  (opcional: si existe, muestra el botón "Reintentar") y `children` (enlaces opcionales).
- [X] T014 [P] Crear `client/src/components/BarraNavegacion.jsx` con un enlace "Viajex" a `/`.
  US2 le agrega la sesión.
- [X] T015 Crear `client/src/App.jsx`:
  - `const [usuario, setUsuario] = useState(null)`.
  - Renderiza `<BarraNavegacion />` y un `<Routes>` vacío, dentro de un contenedor Tailwind
    centrado. Las rutas se agregan en cada historia.

**Checkpoint**: `npm run dev` levanta el servidor en `:4000` y el cliente en `:5173`. La consulta
`{ destinos { nombre } }` en `http://localhost:4000` devuelve los 5 destinos fijos.

---

## Phase 3: User Story 1 - Explorar destinos y sus opciones (Priority: P1) 🎯 MVP

**Goal**: sin sesión, ver todos los destinos y, al elegir uno, sus vuelos, hoteles y tours
(FR-008 a FR-012).

**Independent Test**: sin sesión, abrir `/`, elegir un destino y comprobar que se ven solo sus
vuelos, hoteles y tours (quickstart 1–4).

### Implementation for User Story 1

- [X] T016 [P] [US1] Crear `client/src/graphql/destinos.js`, que exporta:
  - `DESTINOS`: consulta `destinos { id nombre imagen pais { nombre } actividadesPopulares { id nombre } }`.
  - `DESTINO`: consulta `destino(id: $id)` con `id nombre imagen pais { nombre }`, `vuelos`,
    `hoteles` y `tours { id nombre precio actividades { id nombre } }`, con todos sus campos.
- [X] T017 [P] [US1] Crear `client/src/components/TarjetaDestino.jsx`. Muestra imagen, nombre,
  país y actividades populares, y enlaza a `/destinos/:id` con `Link`.
- [X] T018 [P] [US1] Crear `client/src/components/TarjetaVuelo.jsx`. Muestra aerolínea, horarios
  de ida y vuelta y `formatearCLP(precio)` + " por pasajero". Props opcionales `seleccionado`
  y `alAlternar`: si existe `alAlternar`, la tarjeta es clicable y resalta cuando está
  seleccionada.
- [X] T019 [P] [US1] Crear `client/src/components/TarjetaHotel.jsx`. Muestra nombre, `categoria`
  como estrellas y `formatearCLP(precioNoche)` + " por noche". Mismas props opcionales que T018.
- [X] T020 [P] [US1] Crear `client/src/components/TarjetaTour.jsx`. Muestra nombre, lista de
  actividades y `formatearCLP(precio)` + " por persona". Mismas props opcionales que T018.
- [X] T021 [US1] Crear `client/src/pages/PaginaInicio.jsx`:
  - `useEffect` + `consultar(DESTINOS)`, con estados `cargando`, `error` y `destinos`.
  - Muestra una grilla de `TarjetaDestino` en el orden del catálogo.
  - Si falla, muestra `MensajeError` con `alReintentar`, que repite la carga (FR-012).
- [X] T022 [US1] Crear `client/src/pages/PaginaDestino.jsx`:
  - Lee `id` con `useParams` y consulta `DESTINO`.
  - Muestra el encabezado (imagen, nombre, país) y tres secciones: "Vuelos", "Hoteles" y "Tours",
    con sus tarjetas.
  - Si `destino` es `null`, muestra `MensajeError` "No encontramos ese destino." con un enlace a
    `/` (FR-011).
  - Si la carga falla, muestra `MensajeError` con reintentar.
- [X] T023 [US1] En `client/src/App.jsx`, agregar las rutas `/` → `PaginaInicio` y
  `/destinos/:id` → `PaginaDestino`.

**Checkpoint**: quickstart 1–4 pasan sin sesión.

---

## Phase 4: User Story 2 - Iniciar sesión y crear una reserva (Priority: P2)

**Goal**: login simulado, armado de la reserva con el total en vivo, validaciones y creación
(FR-001 a FR-006, FR-013 a FR-016, FR-020 a FR-023, FR-026 a FR-030).

**Independent Test**: iniciar sesión, armar una reserva, confirmar y verificar que aparece en
"Mis reservas" con el total correcto (quickstart 5–10). La vista "Mis reservas" llega en US3: ver
Dependencies.

### Tests for User Story 2 (FR-030) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US2] Crear `client/src/lib/calculos.test.js` (Vitest) con estos casos:
  - `calcularNoches('2026-12-01', '2026-12-04') === 3`.
  - `calcularTotal` con vuelo, hotel y 2 tours, 2 pasajeros y 3 noches: vuelo×2 + hotel×3 +
    (tour1 + tour2)×2.
  - Sin vuelo, sin hotel y sin tours: cada ítem ausente suma 0.
  - Con 1 y con 4 pasajeros, comprobando que el hotel no se multiplica por pasajeros.
- [X] T025 [P] [US2] Crear `client/src/lib/validaciones.test.js` (Vitest) con estos casos:
  - Una reserva sin vuelo, sin hotel y con `tourIds` vacío devuelve "Selecciona al menos un
    servicio para crear la reserva".
  - `pasajeros` 0 devuelve "Indica al menos 1 pasajero".
  - Con fechas vacías devuelve "Indica las fechas de salida y regreso".
  - Con regreso igual y con regreso anterior a la salida devuelve "La fecha de regreso debe ser
    posterior a la de salida".
  - Una reserva válida devuelve `[]`.
- [X] T026 [P] [US2] Crear `client/src/components/FormularioReserva.test.jsx` (Testing Library).
  - Renderiza `FormularioReserva` con una selección sin servicios y hace clic en confirmar.
  - Verifica que aparece "Selecciona al menos un servicio para crear la reserva" y que
    `alConfirmar` no se llamó.

### Implementation for User Story 2

- [X] T027 [P] [US2] Crear `client/src/lib/calculos.js`:
  - `calcularNoches(fechaSalida, fechaRegreso)`: días entre las dos fechas, usando `Date.UTC` (R7).
  - `calcularTotal({ vuelo, hotel, tours, pasajeros, noches })`, con la fórmula
    `(vuelo?.precio ?? 0) × pasajeros + (hotel?.precioNoche ?? 0) × noches + Σ tour.precio × pasajeros`.
  - Solo funciones puras.
- [X] T028 [P] [US2] Crear `client/src/lib/validaciones.js` con
  `validarReserva({ vueloId, hotelId, tourIds, pasajeros, fechaSalida, fechaRegreso })`. Devuelve
  un arreglo de mensajes, vacío si la reserva es válida, con estas reglas en este orden:
  1. "`vuelo` o `hotel` o `tours.length > 0`" → "Selecciona al menos un servicio para crear la
     reserva".
  2. "`pasajeros >= 1` (entero)" → "Indica al menos 1 pasajero".
  3. "`fechaSalida` y `fechaRegreso` informadas" → "Indica las fechas de salida y regreso".
  4. "`fechaRegreso > fechaSalida`" → "La fecha de regreso debe ser posterior a la de salida".
- [X] T029 [P] [US2] Crear `client/src/graphql/sesion.js`, que exporta `LOGIN`: mutation
  `login(correo: $correo, contrasena: $contrasena) { id nombre correo }`.
- [X] T030 [US2] En `server/src/mocks.js`, agregar:
  - `Mutation.login`: devuelve `{ id, nombre, correo }` de `usuarioMock` si el correo y la
    contraseña coinciden; si no, `null`.
  - `Mutation.crearReserva(datos)`:
    - Valida con `store.has` que existan el destino, el vuelo, el hotel y los tours, y que
      pertenezcan al destino; si no, lanza `GraphQLError`.
    - Genera `id = crypto.randomUUID()` y ejecuta `store.set('Reserva', id, { id, usuarioId, destino: store.get('Destino', destinoId), vuelo: vueloId ? store.get('Vuelo', vueloId) : null, hotel: …, tours: tourIds.map(…), pasajeros, fechaSalida, fechaRegreso, total })`.
    - Agrega `store.get('Reserva', id)` a `Query.ROOT.reservas` y la devuelve (R4).
- [X] T031 [US2] Crear `client/src/graphql/reservas.js` con la mutation `CREAR_RESERVA`:
  `crearReserva(datos: $datos) { id }`.
- [X] T032 [US2] Crear `client/src/pages/PaginaLogin.jsx`:
  - Formulario con correo y contraseña que llama a `consultar(LOGIN)`.
  - Si `login` es `null`, muestra "Correo o contraseña incorrectos.".
  - Si hay error, muestra el mensaje de `consultar`.
  - Si funciona, llama a la prop `alIniciarSesion(usuario)` y navega a `location.state?.desde ?? '/'`,
    pasando `{ seleccion: location.state?.seleccion }` como `state` (FR-007, FR-016).
- [X] T033 [US2] En `client/src/components/BarraNavegacion.jsx`:
  - Agregar las props `usuario` y `alCerrarSesion`.
  - Con sesión, muestra `usuario.nombre`, un enlace "Mis reservas" y el botón "Cerrar sesión".
  - Sin sesión, muestra un enlace "Iniciar sesión".
- [X] T034 [US2] En `client/src/App.jsx`:
  - Definir `cerrarSesion`, que pone `usuario` en `null` y navega a `/` (FR-005).
  - Pasar `usuario` y `cerrarSesion` a `BarraNavegacion`.
  - Agregar la ruta `/login` → `PaginaLogin alIniciarSesion={setUsuario}`.
  - Pasar `usuario` a `PaginaDestino`.
- [X] T035 [US2] Crear `client/src/components/SelectorServicios.jsx`:
  - Props: `destino`, `seleccion` y `alCambiar`.
  - Renderiza las tarjetas de T018–T020 en modo seleccionable:
    - vuelo: uno como máximo; un clic en el seleccionado lo quita;
    - hotel: uno como máximo; mismo comportamiento;
    - tours: alterna la presencia del tour en `tourIds`.
  - Llama a `alCambiar` con la nueva selección, sin mutarla.
- [X] T036 [US2] Crear `client/src/components/FormularioReserva.jsx`:
  - Props: `destino`, `seleccion`, `alCambiar`, `alConfirmar` y `textoBoton`.
  - Campos: pasajeros (número, mínimo 1), fecha de salida y fecha de regreso (inputs `date`, ISO).
  - Muestra el total en vivo con `formatearCLP(calcularTotal(...))` (FR-014).
  - Al confirmar, ejecuta `validarReserva`. Si hay errores, los muestra y no llama a
    `alConfirmar`. Si no, llama a `alConfirmar({ ...seleccion, total })`.
- [X] T037 [US2] En `client/src/pages/PaginaDestino.jsx`:
  - Estado `seleccion` con valor inicial
    `location.state?.seleccion ?? { vueloId: null, hotelId: null, tourIds: [], pasajeros: 1, fechaSalida: '', fechaRegreso: '' }`.
  - Renderizar `SelectorServicios` y `FormularioReserva` (`textoBoton` "Confirmar reserva").
  - Al confirmar sin `usuario`: `navigate('/login', { state: { desde: location.pathname, seleccion } })`.
  - Al confirmar con `usuario`: `consultar(CREAR_RESERVA, { datos: { usuarioId: usuario.id, destinoId: id, ...seleccion, total } })`
    y luego `navigate('/reservas')`. Si falla, muestra el mensaje amigable.

**Checkpoint**: `npm test --prefix client` pasa (T024–T026). Quickstart 5, 6, 8, 9 y 10 pasan.

---

## Phase 5: User Story 3 - Ver mis reservas (Priority: P3)

**Goal**: listar las reservas del usuario y proteger las rutas de reservas (FR-007, FR-017,
FR-025).

**Independent Test**: con una reserva creada, abrir `/reservas` y verificar sus datos. Recargar,
volver a ingresar y verificar que sigue ahí (quickstart 7, 11, 12, 17).

### Implementation for User Story 3

- [X] T038 [US3] En `server/src/mocks.js`, agregar:
  - `Query.reservas(usuarioId)`: filtra `Query.ROOT.reservas` por
    `store.get(ref, 'usuarioId') === usuarioId`.
  - `Query.reserva(id, usuarioId)`: devuelve `null` si `!store.has('Reserva', id)` o si la reserva
    pertenece a otro usuario.
- [X] T039 [US3] En `client/src/graphql/reservas.js`, agregar `RESERVAS`:
  `reservas(usuarioId: $usuarioId) { id pasajeros fechaSalida fechaRegreso total destino { id nombre } vuelo { aerolinea } hotel { nombre } tours { id nombre } }`.
- [X] T040 [P] [US3] Crear `client/src/components/RutaProtegida.jsx` con props `usuario` y
  `children`. Sin `usuario`, devuelve
  `<Navigate to="/login" replace state={{ desde: location.pathname }} />`.
- [X] T041 [P] [US3] Crear `client/src/components/TarjetaReserva.jsx`:
  - Muestra destino, `formatearFecha` de salida y regreso, pasajeros, ítems incluidos (aerolínea,
    hotel y tours) y `formatearCLP(total)`.
  - Enlace "Ver / modificar" a `/reservas/:id`.
  - Prop opcional `alEliminar`: si existe, muestra el botón "Eliminar".
- [X] T042 [US3] Crear `client/src/pages/PaginaReservas.jsx`:
  - Prop `usuario`; consulta `RESERVAS` con `usuario.id`.
  - Muestra la lista de `TarjetaReserva`.
  - Sin reservas, muestra "Aún no tienes reservas. ¡Explora destinos para planificar tu viaje!"
    con un enlace a `/`.
  - Si hay error, muestra `MensajeError` con reintentar.
- [X] T043 [US3] En `client/src/App.jsx`, agregar la ruta `/reservas` → `PaginaReservas`,
  envuelta en `RutaProtegida`.

**Checkpoint**: quickstart 7, 11, 12 y 17 pasan.

---

## Phase 6: User Story 4 - Modificar una reserva (Priority: P4)

**Goal**: cambiar vuelo, hotel, tours, pasajeros y fechas, sin cambiar el destino (FR-018,
constitución v1.1.0).

**Independent Test**: abrir una reserva, cambiar el hotel, los pasajeros y la fecha de regreso,
guardar y verificar el nuevo total (quickstart 13 y 14).

### Implementation for User Story 4

- [X] T044 [US4] En `server/src/mocks.js`, agregar `Mutation.actualizarReserva(id, usuarioId, cambios)`:
  - Lanza `GraphQLError` si la reserva no existe o es de otro usuario.
  - Valida que el vuelo, el hotel y los tours pertenezcan al destino de la reserva.
  - Reemplaza con `store.set('Reserva', id, {...})` `vuelo`, `hotel`, `tours`, `pasajeros`,
    `fechaSalida`, `fechaRegreso` y `total`.
  - **No** modifica `destino` ni `usuarioId`. Devuelve la reserva.
- [X] T045 [US4] En `client/src/graphql/reservas.js`, agregar:
  - `RESERVA`: `reserva(id: $id, usuarioId: $usuarioId)` con todos sus campos, `vuelo { id }`,
    `hotel { id }`, `tours { id }` y el destino completo, igual que en `DESTINO`.
  - `ACTUALIZAR_RESERVA`: `actualizarReserva(id, usuarioId, cambios)`, que devuelve los mismos
    campos que `RESERVA`.
- [X] T046 [US4] Crear `client/src/pages/PaginaReserva.jsx`:
  - Prop `usuario`; consulta `RESERVA` e inicializa `seleccion` desde la reserva (`vueloId`,
    `hotelId`, `tourIds`, `pasajeros`, `fechaSalida`, `fechaRegreso`).
  - Muestra el destino como texto fijo, sin control para cambiarlo, y renderiza
    `SelectorServicios` y `FormularioReserva` (`textoBoton` "Guardar cambios").
  - Al confirmar, llama a `ACTUALIZAR_RESERVA` y muestra la reserva actualizada con su nuevo total.
  - Si la reserva no existe, muestra `MensajeError` "No encontramos esa reserva." con un enlace a
    `/reservas`.
- [X] T047 [US4] En `client/src/App.jsx`, agregar la ruta `/reservas/:id` → `PaginaReserva`,
  envuelta en `RutaProtegida`.

**Checkpoint**: quickstart 13 y 14 pasan.

---

## Phase 7: User Story 5 - Eliminar una reserva (Priority: P5)

**Goal**: eliminar una reserva previa confirmación, desde la lista o desde el detalle (FR-019).

**Independent Test**: eliminar una reserva, primero cancelando y luego aceptando la confirmación
(quickstart 15 y 16).

### Implementation for User Story 5

- [X] T048 [US5] En `server/src/mocks.js`, agregar `Mutation.eliminarReserva(id, usuarioId)`:
  - Lanza `GraphQLError` si la reserva no existe o es de otro usuario.
  - Quita su referencia de `Query.ROOT.reservas` y devuelve `id`.
- [X] T049 [US5] En `client/src/graphql/reservas.js`, agregar `ELIMINAR_RESERVA`:
  `eliminarReserva(id: $id, usuarioId: $usuarioId)`.
- [X] T050 [US5] En `client/src/pages/PaginaReservas.jsx`:
  - Pasar `alEliminar` a cada `TarjetaReserva`.
  - `alEliminar` pide `window.confirm('¿Eliminar esta reserva?')`. Si se acepta, llama a
    `ELIMINAR_RESERVA` y quita la reserva del estado (R13).
- [X] T051 [US5] En `client/src/pages/PaginaReserva.jsx`, agregar el botón "Eliminar reserva".
  Pide la misma confirmación, llama a `ELIMINAR_RESERVA` y navega a `/reservas`.

**Checkpoint**: quickstart 15 y 16 pasan.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T052 Revisar `client/src` y `server/src` contra la constitución IV:
  - identificadores en español;
  - comentarios en español de 100 caracteres como máximo;
  - sin código repetido entre `PaginaDestino` y `PaginaReserva` (ambas usan `SelectorServicios` y
    `FormularioReserva`);
  - ningún mensaje visible con texto técnico (FR-024, SC-005).
- [X] T053 Ejecutar `npm test` en la raíz y confirmar que pasan todas las pruebas de FR-030.
- [X] T054 Recorrer los escenarios 1–17 de `quickstart.md` y registrar cualquier fallo.

---

---

## Phase 9: Setup v2 (Shared Infrastructure)

**Purpose**: dejar el proyecto como una app estática sin servidor (plan v2, R14, R17, R18)

- [ ] T055 En `client/package.json`, agregar a `dependencies`: `msw@^2`, `graphql@^16`,
  `@graphql-tools/mock@^9` y `@graphql-tools/schema@^10`. Cambiar el script `build` a
  `"vite build && cp dist/index.html dist/404.html"` (R18) y agregar `"preview": "vite preview"`.
  Ejecutar `npm install` en `client/`.
- [ ] T056 Ejecutar `npx msw init public --save` dentro de `client/`. Debe generar
  `client/public/mockServiceWorker.js` y agregar `"msw": { "workerDirectory": ["public"] }` en
  `client/package.json`. Crear `client/public/.nojekyll` vacío (R18).
- [ ] T057 En `client/vite.config.js`: agregar `base: '/viajex/'`, eliminar `server.proxy` y
  conservar los plugins y `test: { environment: 'jsdom' }` (R17).
- [ ] T058 En el `package.json` raíz: eliminar `concurrently` y dejar los scripts
  `"dev": "npm run dev --prefix client"`, `"build": "npm run build --prefix client"`,
  `"preview": "npm run preview --prefix client"` y `"test": "npm test --prefix client"`. Ejecutar
  `npm install` en la raíz para actualizar `package-lock.json`.
- [ ] T059 Eliminar el directorio `server/` completo (R14). Su catálogo se mueve en T061.

---

## Phase 10: Foundational v2 — API GraphQL mock en el navegador

**Purpose**: FR-031 y FR-032. ⚠️ Bloquea las fases 11 y 12.

- [ ] T060 [P] Crear `client/src/mocks/schema.js`, que exporta `typeDefs`: un template string con el
  contenido íntegro de `contracts/schema.graphql` v2 (sin `Usuario`, `login` ni `usuarioId`).
- [ ] T061 [P] Crear `client/src/mocks/catalogo.js` con el arreglo `catalogo` y sus ayudantes
  (`actividad`, `vuelo`, `hotel`, `tour`, `imagen`), copiados sin cambios de los datos de
  `server/src/mocks.js` de v1 (mismos ids y precios). No incluye `usuarioMock`.
- [ ] T062 [P] Crear `client/src/mocks/persistencia.js` (R16):
  - Constante `CLAVE = 'viajex:reservas'`.
  - `cargarReservas()`: lee y parsea la clave; devuelve el arreglo, o `[]` si no existe, no es un
    arreglo o lanza cualquier error.
  - `guardarReservas(lista)`: `localStorage.setItem(CLAVE, JSON.stringify(lista))` dentro de
    `try/catch`, ignorando errores.
  - Formato de cada elemento: `{ id, destinoId, vueloId, hotelId, tourIds, pasajeros,
    fechaSalida, fechaRegreso, total }`.
- [ ] T063 Crear `client/src/mocks/resolvers.js`, adaptando los resolvers de `server/src/mocks.js`
  de v1:
  - `crearStore(schema)`: `createMockStore({ schema })`; carga `catalogo` en `Query.ROOT.destinos`
    y `[]` en `Query.ROOT.reservas`; luego inserta cada reserva de `cargarReservas()` cuyas
    opciones sean válidas para su destino, conservando su `id` (si no son válidas, la omite).
  - `crearResolvers(store)`:
    - `Query.destinos`, `Query.destino(id)`, `Query.reservas` (todas las de la lista) y
      `Query.reserva(id)` (`null` si no está en la lista).
    - `Mutation.crearReserva(datos)`, `Mutation.actualizarReserva(id, cambios)` y
      `Mutation.eliminarReserva(id)`, con las mismas validaciones de v1 (`GraphQLError` si el
      destino, las opciones o la reserva no existen), sin `usuarioId` ni `login`.
    - Después de cada mutation exitosa: `guardarReservas(serializar(store))`, donde `serializar`
      convierte la lista `Query.ROOT.reservas` al formato de T062.
  - Usar `crypto.randomUUID()` del navegador (sin importar `node:crypto`).
- [ ] T064 Crear `client/src/mocks/navegador.js` (R15):
  - `esquema = addMocksToSchema({ schema: makeExecutableSchema({ typeDefs }), store, resolvers })`,
    con `store = crearStore(...)` sobre el esquema base.
  - Exporta `worker = setupWorker(graphql.operation(async ({ query, variables }) =>
    HttpResponse.json(await graphqlEjecutar({ schema: esquema, source: query, variableValues:
    variables }))))`, donde `graphqlEjecutar` es `graphql` de la librería `graphql` importado con
    ese alias.
- [ ] T065 En `client/src/main.jsx`:
  - Antes de renderizar, `await worker.start({ serviceWorker: { url:
    `${import.meta.env.BASE_URL}mockServiceWorker.js` }, onUnhandledRequest: 'bypass', quiet: true })`.
  - Pasar `basename={import.meta.env.BASE_URL}` a `BrowserRouter` (R17).
- [ ] T066 En `client/src/lib/api.js`, cambiar la URL de `fetch` a
  `` `${import.meta.env.BASE_URL}graphql` `` (R17). Los mensajes amigables no cambian.

**Checkpoint**: `npm run dev` y abrir `http://localhost:5173/viajex/` muestra los 5 destinos sin
servidor; las pruebas siguen en verde.

---

## Phase 11: Eliminar el login (FR-001 a FR-007 y FR-016 eliminados en v2)

**Purpose**: dejar toda la app pública (constitución v2.0.0, § Sesión; R20)

- [ ] T067 Eliminar `client/src/pages/PaginaLogin.jsx`, `client/src/components/RutaProtegida.jsx` y
  `client/src/graphql/sesion.js`.
- [ ] T068 En `client/src/graphql/reservas.js`, quitar `$usuarioId` y `usuarioId` de `RESERVAS`,
  `RESERVA`, `ACTUALIZAR_RESERVA` y `ELIMINAR_RESERVA`, según `contracts/schema.graphql` v2.
- [ ] T069 En `client/src/App.jsx`: quitar el estado `usuario`, `cerrarSesion`, `useNavigate`, la ruta
  `/login` y los envoltorios `RutaProtegida`; las rutas `/reservas` y `/reservas/:id` quedan
  públicas, y las páginas ya no reciben `usuario`.
- [ ] T070 [P] En `client/src/components/BarraNavegacion.jsx`: sin props; muestra el enlace "Viajex"
  a `/` y, siempre, el enlace "Mis reservas" a `/reservas`.
- [ ] T071 [P] En `client/src/pages/PaginaDestino.jsx`: quitar la prop `usuario`, la redirección
  al login y el estado inicial desde `location.state` (`seleccion` parte de `seleccionVacia`).
  `confirmar` siempre llama a `CREAR_RESERVA` con `{ destinoId: id, ...datos, total }` y navega a
  `/reservas` (FR-015).
- [ ] T072 [P] En `client/src/pages/PaginaReservas.jsx` y `client/src/pages/PaginaReserva.jsx`: quitar
  la prop `usuario` y el argumento `usuarioId` de todas las operaciones.

**Checkpoint**: no queda ninguna referencia a `usuario`, `login` ni `RutaProtegida` en `client/src`.

---

## Phase 12: Validación v2

**Purpose**: comprobar FR-030 a FR-033 antes de publicar

- [ ] T073 Ejecutar `npm test` en la raíz: deben pasar los 11 casos de FR-030, sin cambios en las
  pruebas.
- [ ] T074 Recorrer los escenarios 1–18 de `quickstart.md` v2 en Chrome: los escenarios 1–17 con
  `npm run dev` y el 18 con `npm run build` + `npm run preview`. Registrar cualquier fallo.

---

## Phase 13: Publicación (US6, FR-033)

**Purpose**: publicar la demo en GitHub Pages (R19)

- [ ] T075 [US6] Publicar `client/dist/` en la rama huérfana `gh-pages` con los comandos de
  `quickstart.md` ("Publicación en GitHub Pages"). Activar Pages con origen `gh-pages` / root
  (en Settings, o con `gh api repos/<dueño>/viajex/pages` previa confirmación del autor). Verificar
  el escenario 19 en la URL publicada.

---

## Dependencies & Execution Order

### Phase Dependencies (v2)

- **Fases 1–8**: completadas en v1.
- **Phase 9 (Setup v2)** → **Phase 10 (mock en el navegador)** → **Phase 11 (sin login)** →
  **Phase 12 (validación)** → **Phase 13 (publicación)**.
- Archivos compartidos en orden secuencial: `client/package.json` (T055 → T056) y
  `client/src/App.jsx` (T069).
- Paralelizables: T060, T061 y T062; luego T070, T071 y T072 (archivos distintos, tras T068 y T069).

### Phase Dependencies (v1)

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–7)**: dependen de Foundational y se recomienda hacerlas en orden
  P1 → P5.
- **Polish (Phase 8)**: depende de todas las historias.

### User Story Dependencies

- **US1 (P1)**: solo depende de Foundational.
- **US2 (P2)**: usa `PaginaDestino` y las tarjetas de US1. Navega a `/reservas`, que se completa
  en US3; hasta entonces, la creación se verifica en la respuesta de la mutation.
- **US3 (P3)**: depende de US2 para que existan reservas (FR-017).
- **US4 (P4)**: depende de US3 (la ruta protegida y la lista desde donde se entra) y reutiliza
  `SelectorServicios` y `FormularioReserva` de US2.
- **US5 (P5)**: depende de US3 (lista) y de US4 (botón en el detalle, T051).

### Within Each User Story

- Las pruebas de US2 (T024–T026) se escriben antes que `calculos.js`, `validaciones.js` y
  `FormularioReserva.jsx`, y fallan al principio.
- Archivos compartidos en orden secuencial: `server/src/mocks.js` (T009 → T030 → T038 →
  T044 → T048), `client/src/graphql/reservas.js` (T031 → T039 → T045 → T049) y
  `client/src/App.jsx` (T015 → T023 → T034 → T043 → T047).

### Parallel Opportunities

- Setup: T002, T003 y T005.
- Foundational: T007 y T008 en el servidor; T011, T012, T013 y T014 en el cliente.
- US1: T016 a T020.
- US2: T024, T025 y T026 (pruebas); luego T027, T028 y T029.
- US3: T040 y T041.

---

## Parallel Example: User Story 1

```bash
Task: "Crear client/src/graphql/destinos.js (T016)"
Task: "Crear client/src/components/TarjetaDestino.jsx (T017)"
Task: "Crear client/src/components/TarjetaVuelo.jsx (T018)"
Task: "Crear client/src/components/TarjetaHotel.jsx (T019)"
Task: "Crear client/src/components/TarjetaTour.jsx (T020)"
```

## Parallel Example: User Story 2

```bash
Task: "Crear client/src/lib/calculos.test.js (T024)"
Task: "Crear client/src/lib/validaciones.test.js (T025)"
Task: "Crear client/src/components/FormularioReserva.test.jsx (T026)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (Setup) y Phase 2 (Foundational).
2. Phase 3 (US1): catálogo navegable sin sesión.
3. **Detenerse y validar** con quickstart 1–4.

### Incremental Delivery

1. Setup + Foundational → servidor y cliente arrancan.
2. US1 → explorar (MVP).
3. US2 → login y crear reserva, con pruebas de FR-030 en verde.
4. US3 → ver reservas y rutas protegidas.
5. US4 → modificar (incluidas las fechas).
6. US5 → eliminar.
7. Polish → revisión de la constitución, `npm test` y quickstart completo.

---

## Notes

- [P] = archivos distintos y sin dependencias pendientes.
- Cada tarea se rastrea hasta un FR (ver la trazabilidad de `plan.md`). No se agregan
  características, dependencias ni pruebas fuera de esta lista (constitución VI).
- Hacer commit por tarea o por grupo lógico.
- Ante una ambigüedad durante la implementación: detenerse y preguntar.
