# Constitución de Viajex: Sistema de reserva de vuelos y hoteles

## Principios Fundamentales

### I. Demo académica y simplicidad

Este proyecto es una demo de uso académico para practicar desarrollo front-end con React y la
simulación de un back-end mediante una API GraphQL mock. Su dominio es un sistema de reserva de
vuelos y hoteles.

- La estructura DEBE ser simple; NO DEBE haber sobreingeniería (capas, abstracciones o
  configuraciones que el alcance no exija).
- Toda decisión técnica DEBE justificarse por el objetivo didáctico, no por escalabilidad o
  producción.

**Razón:** el valor del proyecto está en el aprendizaje; la complejidad innecesaria lo oscurece.

### II. Stack tecnológico cerrado

El stack es fijo y NO DEBE ampliarse sin enmendar esta constitución:

- **Frontend / UI:** React con Vite. Estilos con Tailwind CSS.
- **Navegación:** React Router.
- **Consumo de la API:** `fetch` nativo hacia el endpoint GraphQL del servidor mock. NO DEBE
  usarse Apollo Client ni otra librería GraphQL en el cliente.
- **Manejo de estado:** `useState` y `useEffect`, con actualización fluida de la interfaz. NO
  DEBEN usarse librerías de estado global.
- **Backend:** API GraphQL mock con `@apollo/server` + `@graphql-tools/mock`. Expone destinos
  (con país y actividades populares), vuelos, hoteles, tours, reservas y el login simulado.
- **Base de datos:** ninguna. Se usa `createMockStore`; los datos viven en memoria y se pierden
  al reiniciar el servidor.
- **Lenguaje:** JavaScript (sin TypeScript), HTML y CSS con Tailwind.
- **Pruebas:** Vitest + Testing Library, solo en el cliente y solo para la lógica clave: cálculo
  del total de la reserva y validaciones. NO DEBEN probarse el servidor mock ni flujos de
  extremo a extremo.

**Razón:** un stack acotado mantiene el foco en React y en el contrato GraphQL.

### III. Reglas de dominio inmutables

Las reglas de la sección "Reglas de Dominio y Lógica de Negocio" son inmutables. El agente de IA
DEBE respetarlas estrictamente y NO DEBE reinterpretarlas, relajarlas ni extenderlas. Cualquier
cambio exige enmendar esta constitución.

**Razón:** el dominio es el contrato común entre spec, plan, tareas y código.

### IV. Código funcional, modular y en español

- Se DEBE priorizar la programación funcional y evitar el código repetitivo.
- Los comentarios DEBEN ser breves (máximo 100 caracteres), en español y explicar el código,
  manteniendo un estilo visualmente limpio y de fácil lectura.
- Los identificadores (tipos, campos, funciones y componentes) DEBEN estar en español, por
  ejemplo `Destino`, `crearReserva`, `TarjetaVuelo`. Se exceptúan los nombres propios de React
  y de las librerías (`useState`, `props`, etc.).
- El código DEBE organizarse en componentes reutilizables, con estructura clara y modular.

**Razón:** coherencia lingüística con el dominio y legibilidad para fines académicos.

### V. Errores amigables y validación en el cliente

- La UI NUNCA DEBE exponer errores crudos ni *stack traces*. Todo error técnico (de red o de
  GraphQL) DEBE traducirse a un mensaje amigable.
- Las validaciones de reserva DEBEN ejecutarse en el cliente antes de enviar la mutation:
  - debe haber al menos un ítem;
  - el número de pasajeros debe ser mayor o igual a 1;
  - la fecha de regreso debe ser posterior a la de salida.
- Ejemplo de mensaje: "Selecciona al menos un servicio para crear la reserva".

**Razón:** la experiencia de usuario no debe depender de la robustez del servidor mock.

### VI. Cero código sombra y flujo SDD

- **Flujo:** constitución → `spec.md` → `plan.md` → `tasks.md` → código. Cada documento DEBE
  aprobarse antes de pasar al siguiente. Ante una contradicción, prevalece el de mayor jerarquía
  en ese mismo orden.
- **Cero código sombra:** se DEBE construir estrictamente lo documentado en `spec.md`, `plan.md`
  y `tasks.md`. NO DEBEN agregarse características, dependencias ni pruebas no solicitadas.
- **Ante una ambigüedad:** el agente DEBE preguntar; NO DEBE suponer.
- **Fuente de la verdad:** si una instrucción del usuario contradice esta constitución o se
  detecta una falla lógica, el agente DEBE detenerse, advertir del problema y solicitar
  actualizar `spec.md` (o esta constitución, según corresponda) antes de tocar el código fuente.

**Razón:** la trazabilidad documento → código es el objetivo de la práctica SDD.

## Reglas de Dominio y Lógica de Negocio

### Entidades

Usuario, Destino, País, Actividad, Vuelo, Hotel, Tour y Reserva. Un Tour agrupa Actividades y
pertenece a un Destino. Todos los datos se simulan con mocks.

### Exploración y selección de destino

- Los usuarios pueden explorar opciones de viaje, incluidos vuelos, hoteles y tours con
  actividades.
- Los usuarios DEBEN poder elegir un destino y, a continuación, ver los vuelos y hoteles
  correspondientes (y sus tours) para una experiencia completa de planificación de viaje.
- Explorar es público: NO requiere iniciar sesión.

### Reservas

- Una reserva pertenece a un único destino y agrupa un vuelo, un hotel y/o tours. Todos los
  ítems son opcionales, pero DEBE haber al menos uno.
- Una reserva incluye el número de pasajeros y las fechas de salida y regreso.
- **Precio:** el total es la suma de los precios de sus ítems y se recalcula al modificarla. La
  regla exacta de cálculo (por ejemplo, si el precio se multiplica por pasajero) se define en
  `spec.md`.
- **Modificar:** se puede cambiar el vuelo u hotel elegido, agregar o quitar tours, ajustar el
  número de pasajeros y cambiar las fechas de salida y regreso. El destino NO se puede cambiar.
- **Eliminar:** el usuario puede eliminar una reserva.
- **Persistencia:** crear, modificar y eliminar reservas se hace con mutations GraphQL sobre el
  store mock. Las reservas sobreviven a recargar el front, pero se pierden al reiniciar el
  servidor.

### Sesión

- Login simulado con credenciales fijas de un usuario mock, validadas por una mutation `login`.
  No hay registro de usuarios.
- La sesión vive en `useState` y se pierde al recargar la página.
- Solo las reservas (crear, ver, modificar y eliminar) requieren sesión.

### Formatos

- **Moneda:** CLP, sin decimales.
- **Fechas:** formato ISO (`AAAA-MM-DD`) en la API y `dd/mm/aaaa` en la interfaz.

## Estructura del Proyecto y Flujo de Desarrollo

### Estructura de paquetes sugerida

```text
proyecto/
├── package.json              # solo scripts raíz (concurrently)
├── constitucion.md
├── spec.md
├── plan.md
├── tasks.md
├── client/                   # React + Tailwind
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── graphql/          # queries y mutations como texto (destinos.js)
│       └── lib/api.js        # función de apoyo con fetch hacia el servidor
└── server/                   # Apollo + mocks
    ├── package.json          # "type": "module"
    └── src/
        ├── index.js          # arranca Apollo Server
        ├── schema.js         # typeDefs de todas las entidades
        └── mocks.js          # datos de ejemplo y createMockStore
```

Las pruebas se ubican junto al archivo que prueban (`*.test.js`).

### Ubicación de los documentos SDD

- `constitucion.md`, `spec.md`, `plan.md` y `tasks.md` DEBEN vivir en la raíz del proyecto; esa
  es su ubicación canónica.
- `.specify/memory/constitution.md` es un enlace simbólico a `constitucion.md`, para que Spec Kit
  lea siempre la misma fuente.

### Puertas de calidad

- Cada `plan.md` DEBE incluir una verificación explícita contra los principios I–VI.
- Las pruebas se limitan al alcance del principio II; agregar otras requiere enmienda.
- Ninguna tarea de `tasks.md` puede introducir dependencias fuera del stack del principio II.

## Gobernanza

- Esta constitución prevalece sobre `spec.md`, `plan.md`, `tasks.md` y cualquier instrucción
  puntual. Ante un conflicto, se aplica el principio VI.
- **Enmiendas:** toda modificación DEBE proponerse explícitamente, aprobarse por el autor del
  proyecto y registrarse con un nuevo número de versión y fecha de enmienda. Los documentos
  derivados afectados DEBEN revisarse tras cada enmienda.
- **Versionado semántico:**
  - MAJOR: eliminación o redefinición incompatible de principios o reglas de dominio.
  - MINOR: nuevo principio o sección, o ampliación material de una guía existente.
  - PATCH: aclaraciones, redacción o correcciones sin efecto semántico.
- **Revisión de cumplimiento:** cada fase del flujo SDD (spec, plan, tasks, implementación) DEBE
  verificar el cumplimiento de esta constitución antes de aprobarse.

**Version**: 1.1.0 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
