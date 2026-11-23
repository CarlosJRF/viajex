# Research: Sistema de reserva de vuelos y hoteles

**Fecha**: 2026-11-23 | **Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

Decisiones técnicas tomadas para cumplir `spec.md` dentro del stack de `constitucion.md` v1.1.0.

## R1. Versiones del stack

- **Decision**: Node.js 20 LTS o superior. Cliente: React 19, Vite 7, React Router 7 (paquete
  `react-router`), Tailwind CSS 4 con `@tailwindcss/vite`. Servidor: `@apollo/server` 5,
  `@graphql-tools/mock` 9, `@graphql-tools/schema` 10, `graphql` 16. Pruebas: Vitest 3,
  `@testing-library/react` 16, `jsdom`. Raíz: `concurrently` 9.
- **Rationale**: versiones estables actuales. Con Tailwind 4 y su plugin de Vite no hacen falta
  `tailwind.config.js` ni PostCSS: menos configuración (principio I).
- **Alternatives considered**: Tailwind 3 (exige PostCSS y archivo de configuración); React
  Router 6 (sin ventaja para este alcance).

## R2. Dependencias de soporte (no nombradas en la constitución)

- **Decision**: se agregan solo las piezas que el stack exige para funcionar: `graphql` (peer de
  Apollo), `@graphql-tools/schema` (para `makeExecutableSchema`, que `addMocksToSchema` necesita),
  `@vitejs/plugin-react`, `@tailwindcss/vite` y `jsdom` (entorno DOM que Testing Library
  necesita en Vitest).
- **Rationale**: sin ellas, el stack de la constitución no se puede instalar ni probar. No aportan
  funcionalidad propia.
- **Alternatives considered**: ninguna; son dependencias obligatorias de las librerías elegidas.

## R3. Store mock con datos fijos

- **Decision**: `createMockStore({ schema })` en `server/src/mocks.js`. Al arrancar, el catálogo se
  carga con `store.set('Query', 'ROOT', 'destinos', [...])`. El store normaliza los objetos
  anidados usando `id` como clave, así que vuelos, hoteles, tours y actividades quedan como
  entidades. `addMocksToSchema({ schema, store, resolvers })` expone el esquema, y los
  resolvers propios leen y escriben en el store.
- **Rationale**: cumple "Base de datos: ninguna" y "createMockStore". Con datos fijos, la demo es
  repetible: los mocks aleatorios cambiarían nombres y precios en cada consulta.
- **Alternatives considered**: mocks aleatorios puros (datos inestables, imposibles de verificar);
  arreglos JS sin store (contradice la constitución).

## R4. Reservas en el store

- **Decision**: cada reserva se guarda como entidad `Reserva` (`store.set('Reserva', id, {...})`)
  y su referencia se agrega a `Query.ROOT.reservas`. Modificar actualiza la entidad; eliminar la
  quita de la lista. Los IDs se generan con `crypto.randomUUID()` (nativo de Node).
- **Rationale**: las reservas sobreviven a recargar el front y se pierden al reiniciar el servidor
  (FR-025), sin dependencias extra.

## R5. Identificar al usuario sin tokens

- **Decision**: `login` devuelve el `Usuario` (o `null` si las credenciales no coinciden). El
  cliente guarda ese usuario en `useState` y envía `usuarioId` como argumento en las operaciones
  de reservas.
- **Rationale**: la spec excluye tokens y autenticación real. Para una demo de un solo usuario, el
  argumento explícito es lo más simple.
- **Alternatives considered**: cabecera `Authorization` con token falso (contradice "sin tokens").

## R6. Dónde se calcula el total

- **Decision**: el total se calcula en el cliente con una función pura `calcularTotal` (FR-027),
  se muestra en vivo y se envía como campo `total` en las mutations de crear y modificar. El
  servidor lo guarda tal cual.
- **Rationale**: la lógica vive en un solo lugar, que además es el único que la constitución manda
  probar. Duplicarla en el servidor sería código repetido.
- **Alternatives considered**: resolver `Reserva.total` en el servidor (duplica la fórmula y
  quedaría sin pruebas).

## R7. Fechas y moneda

- **Decision**: las fechas viajan como `String` ISO `AAAA-MM-DD`. `calcularNoches` usa
  `Date.UTC` para evitar desfases por zona horaria. `formatearFecha` convierte `AAAA-MM-DD` en
  `dd/mm/aaaa` partiendo el texto, sin pasar por `Date`. `formatearCLP` usa
  `Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })`, que no muestra decimales.
- **Rationale**: no requiere librerías de fechas y evita errores de zona horaria.
- **Alternatives considered**: escalar `Date` personalizado (más código); `date-fns` (dependencia
  no solicitada).

## R8. Nombres de campos GraphQL

- **Decision**: identificadores en español y sin tildes ni `ñ` (`contrasena`, `categoria`,
  `pais`), porque GraphQL solo admite `[_A-Za-z][_0-9A-Za-z]*`.
- **Rationale**: respeta el principio IV dentro de las reglas del lenguaje.

## R9. Sesión, rutas protegidas y conservación de la selección

- **Decision**: `usuario` vive en `useState` en `App.jsx` y se pasa por props. Un componente
  `RutaProtegida` redirige a `/login` con `state: { desde }`. Si se confirma una reserva sin
  sesión, `PaginaDestino` navega a `/login` con `state: { desde, seleccion }`. Tras el login, el
  usuario vuelve a `desde` con la `seleccion`, y `PaginaDestino` la usa como estado inicial.
- **Rationale**: cumple FR-007 y FR-016 sin estado global (principio II). El estado de navegación
  de React Router alcanza.
- **Alternatives considered**: React Context (no lo prohíbe la constitución, pero no hace falta
  para tres niveles de props); `sessionStorage` (contradice "la sesión se pierde al recargar").

## R10. Comunicación cliente-servidor

- **Decision**: proxy de Vite `/graphql` → `http://localhost:4000/graphql`. `lib/api.js` exporta
  `consultar(query, variables)`, que hace `fetch` POST y, ante un fallo de red, una respuesta no
  OK o `errors` de GraphQL, lanza un `Error` con un mensaje amigable en español (FR-024).
- **Rationale**: un único punto de traducción de errores; el proxy evita configurar CORS.

## R11. Imágenes de destinos

- **Decision**: URLs públicas de marcador de posición
  (`https://picsum.photos/seed/<id>/600/400`) definidas en `mocks.js`.
- **Rationale**: no requieren dependencias ni archivos binarios en el repo.
- **Alternatives considered**: imágenes locales en `client/public` (requieren conseguir y versionar
  archivos). Si las prefieres, se cambia solo el valor en `mocks.js`.

## R12. Alcance de las pruebas

- **Decision**: Vitest para las funciones puras `calcularNoches`, `calcularTotal` y
  `validarReserva`. Testing Library para comprobar que `FormularioReserva` muestra el mensaje de
  validación y no confirma una reserva inválida. Las pruebas viven junto a cada archivo
  (`*.test.js` / `*.test.jsx`).
- **Rationale**: cubre exactamente FR-030 con las dos herramientas que fija la constitución.
- **Alternatives considered**: probar las páginas completas (fuera del alcance: sería E2E
  encubierto).

## R13. Confirmación al eliminar

- **Decision**: `window.confirm` nativo.
- **Rationale**: cumple el requisito sin crear un componente de diálogo (principio I).
