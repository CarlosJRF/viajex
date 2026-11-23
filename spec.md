# Feature Specification: Sistema de reserva de vuelos y hoteles

**Feature Branch**: `spec` (directorio de la feature: raíz del proyecto, según `constitucion.md`)

**Constitución**: v1.1.0

**Created**: 2026-11-23

**Status**: Draft (borrador 1)

**Input**: Descripción del usuario: "Especificación: Sistema de reserva de vuelos y hoteles. Deriva de
`constitucion.md` (v1.0.1). Describe el qué; el cómo va en `plan.md`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar destinos y sus opciones (F2 + F3) (Priority: P1)

Como visitante, sin iniciar sesión, quiero ver los destinos disponibles y, al elegir uno, ver sus
vuelos, hoteles y tours para planificar mi viaje.

**Why this priority**: es la puerta de entrada al sistema y la base de cualquier reserva. Por sí
sola ya entrega valor: permite planificar un viaje.

**Independent Test**: sin sesión, abrir la página de inicio, elegir un destino y comprobar que se
ven solo sus vuelos, hoteles y tours.

**Acceptance Scenarios**:

1. **Given** un visitante sin sesión, **When** abre la página de inicio (`/`), **Then** ve todos
   los destinos con nombre, imagen, país y actividades populares.
2. **Given** la lista de destinos, **When** elige un destino, **Then** llega a su página
   (`/destinos/:id`) y ve el destino con su país y tres secciones: vuelos, hoteles y tours.
3. **Given** la página de un destino, **When** revisa las secciones, **Then** cada vuelo muestra
   aerolínea, horarios y precio por pasajero; cada hotel, nombre, categoría y precio por noche; y
   cada tour, nombre, actividades incluidas y precio por persona.
4. **Given** la página de un destino, **When** revisa las opciones, **Then** solo aparecen las que
   pertenecen a ese destino.
5. **Given** un identificador de destino inexistente, **When** se abre su página, **Then** se
   muestra un mensaje amigable y un enlace a la página de inicio.
6. **Given** que la carga de destinos falla, **When** se abre la página de inicio, **Then** se
   muestra un mensaje amigable con una opción de reintentar.

---

### User Story 2 - Iniciar sesión y crear una reserva (F1 + F4) (Priority: P2)

Como usuario, quiero iniciar sesión con las credenciales del usuario de demostración y armar una
reserva para un destino, eligiendo vuelo, hotel y/o tours, pasajeros y fechas, viendo el total en
vivo.

**Why this priority**: es la acción central del negocio; depende de la exploración (P1).

**Independent Test**: iniciar sesión, armar una reserva en un destino, confirmar y verificar que
aparece en "Mis reservas" con el total correcto.

**Acceptance Scenarios**:

1. **Given** la página de inicio de sesión (`/login`), **When** el usuario ingresa el correo y la
   contraseña del usuario de demostración, **Then** la sesión se inicia y su nombre aparece en la
   barra de navegación.
2. **Given** la página de inicio de sesión, **When** ingresa credenciales incorrectas, **Then** ve
   un mensaje amigable y no se inicia sesión.
3. **Given** un usuario con sesión, **When** elige cerrar sesión, **Then** la sesión termina y
   vuelve a la página de inicio.
4. **Given** un usuario con sesión, **When** recarga la página, **Then** la sesión se pierde.
5. **Given** la página de un destino, **When** elige un vuelo, un hotel y/o varios tours, indica
   pasajeros y fechas, **Then** ve el total calculado según las reglas de cálculo, actualizado
   en vivo.
6. **Given** una selección válida y sesión iniciada, **When** confirma, **Then** la reserva se
   crea y el usuario llega a "Mis reservas" (`/reservas`), donde aparece la nueva reserva.
7. **Given** una selección válida sin sesión, **When** confirma, **Then** se le lleva a
   `/login` y, tras iniciar sesión, vuelve al destino con su selección conservada.
8. **Given** una selección inválida (ver FR-020 a FR-022), **When** intenta confirmar, **Then**
   ve el mensaje de validación correspondiente y la reserva no se envía.

---

### User Story 3 - Ver mis reservas (F5) (Priority: P3)

Como usuario con sesión, quiero ver mis reservas para revisar lo que contraté.

**Why this priority**: permite comprobar el resultado de crear reservas y es la base para
modificarlas o eliminarlas.

**Independent Test**: con al menos una reserva creada, abrir "Mis reservas" y verificar sus datos;
recargar la interfaz, volver a iniciar sesión y comprobar que la reserva sigue ahí.

**Acceptance Scenarios**:

1. **Given** un usuario con reservas, **When** abre `/reservas`, **Then** ve cada reserva con
   destino, fechas, pasajeros, ítems incluidos y total.
2. **Given** un usuario sin reservas, **When** abre `/reservas`, **Then** ve un mensaje que lo
   invita a explorar destinos.
3. **Given** reservas creadas, **When** recarga la interfaz e inicia sesión de nuevo, **Then** las
   reservas siguen disponibles mientras el servidor de demostración siga activo.
4. **Given** un usuario sin sesión, **When** entra a `/reservas` o `/reservas/:id`, **Then** se le
   redirige a `/login` y, al iniciar sesión, vuelve a la página que buscaba.

---

### User Story 4 - Modificar una reserva (F6) (Priority: P4)

Como usuario con sesión, quiero modificar una reserva para ajustarla a mis necesidades.

**Why this priority**: mejora una reserva existente; requiere que P2 y P3 funcionen.

**Independent Test**: abrir una reserva existente, cambiar el hotel y los pasajeros, guardar y
verificar el nuevo total.

**Acceptance Scenarios**:

1. **Given** una reserva en `/reservas/:id`, **When** cambia el vuelo o el hotel, agrega o quita
   tours o ajusta el número de pasajeros, **Then** el total se recalcula en vivo.
2. **Given** una reserva en edición, **When** busca cambiar el destino, **Then** no existe esa
   opción.
3. **Given** una reserva en edición, **When** cambia la fecha de salida o la de regreso, **Then**
   las noches y el costo del hotel se recalculan y el total se actualiza en vivo.
4. **Given** cambios válidos, **When** guarda, **Then** se muestra la reserva actualizada con su
   nuevo total.
5. **Given** cambios que dejan la reserva inválida, **When** intenta guardar, **Then** ve el
   mensaje de validación y no se guarda.

---

### User Story 5 - Eliminar una reserva (F7) (Priority: P5)

Como usuario con sesión, quiero eliminar una reserva que ya no necesito.

**Why this priority**: completa el ciclo de vida de la reserva; es independiente de modificar.

**Independent Test**: eliminar una reserva desde la lista, confirmar y verificar que desaparece.

**Acceptance Scenarios**:

1. **Given** una reserva en `/reservas` o `/reservas/:id`, **When** elige eliminarla, **Then** se
   le pide confirmación.
2. **Given** la confirmación, **When** acepta, **Then** la reserva se borra y desaparece de la
   lista.
3. **Given** la confirmación, **When** la rechaza, **Then** la reserva se mantiene sin cambios.

---

### Edge Cases

- Reserva sin ítems: se muestra "Selecciona al menos un servicio para crear la reserva" y no se
  envía.
- Pasajeros en 0 o negativo: se rechaza; el mínimo es 1.
- Fecha de regreso igual o anterior a la de salida: se rechaza (las noches serían 0 o negativas),
  tanto al crear como al modificar las fechas de una reserva.
- Reserva solo con tours o solo con vuelo: es válida; los ítems no elegidos suman 0.
- Destino o reserva inexistente (identificador inválido en la URL): mensaje amigable con enlace de
  regreso.
- Fallo de red o del servidor en cualquier carga o envío: mensaje amigable, nunca texto técnico ni
  trazas.
- Reinicio del servidor de demostración: las reservas se pierden; la lista vuelve a estar vacía.
- Recarga de la página: la sesión se pierde; las reservas se conservan.
- El usuario sin sesión confirma una reserva: su selección se conserva tras iniciar sesión.

## Requirements *(mandatory)*

### Functional Requirements

**Sesión (F1)**

- **FR-001**: El sistema DEBE ofrecer una página de inicio de sesión (`/login`) que pida correo y
  contraseña y los valide con la mutation GraphQL `login`.
- **FR-002**: El sistema DEBE aceptar únicamente las credenciales fijas del usuario mock
  (`demo@viajes.cl` / `demo1234`); no hay registro de usuarios.
- **FR-003**: Con credenciales válidas, el sistema DEBE iniciar la sesión y mostrar el nombre del
  usuario en la barra de navegación.
- **FR-004**: Con credenciales incorrectas, el sistema DEBE mostrar un mensaje amigable y no
  iniciar sesión.
- **FR-005**: El usuario DEBE poder cerrar sesión; al hacerlo vuelve a la página de inicio.
- **FR-006**: La sesión DEBE vivir en `useState` y perderse al recargar la página.
- **FR-007**: Las páginas de reservas (`/reservas`, `/reservas/:id`) DEBEN exigir sesión; sin
  ella, el sistema DEBE redirigir a `/login` y, tras iniciarla, volver a la página solicitada.

**Exploración (F2, F3)**

- **FR-008**: La página de inicio (`/`) DEBE listar todos los destinos con nombre, imagen, país y
  actividades populares, en el orden del catálogo, sin requerir sesión. El catálogo es de solo
  lectura y sale de `mocks.js`.
- **FR-009**: Cada destino DEBE enlazar a su página de detalle (`/destinos/:id`).
- **FR-010**: La página de un destino DEBE mostrar el destino con su país y sus vuelos (aerolínea,
  horarios, precio por pasajero), hoteles (nombre, categoría, precio por noche) y tours (nombre,
  actividades incluidas, precio por persona), solo los de ese destino.
- **FR-011**: Ante un destino inexistente, el sistema DEBE mostrar un mensaje amigable y un enlace
  a la página de inicio.
- **FR-012**: Si la carga de destinos falla, el sistema DEBE mostrar un mensaje amigable con una
  opción de reintentar.

**Reservas (F4–F7)**

- **FR-013**: Un usuario DEBE poder armar una reserva para un único destino eligiendo como máximo
  un vuelo, como máximo un hotel y cero o más tours, más el número de pasajeros y las fechas de
  salida y regreso.
- **FR-014**: El sistema DEBE calcular y mostrar el total en vivo según las reglas de cálculo
  (FR-026 a FR-029), recalculándolo cada vez que cambie un ítem, los pasajeros o las fechas.
- **FR-015**: Al confirmar una reserva válida con sesión, el sistema DEBE guardarla con una
  mutation GraphQL de creación y llevar al usuario a `/reservas`, donde aparece la nueva reserva.
- **FR-016**: Si el usuario confirma sin sesión, el sistema DEBE llevarlo al inicio de sesión y
  conservar su selección al volver.
- **FR-017**: "Mis reservas" DEBE listar las reservas del usuario con destino, fechas, pasajeros,
  ítems incluidos y total; si no hay, DEBE mostrar un mensaje que invite a explorar destinos.
- **FR-018**: El usuario DEBE poder modificar una reserva en `/reservas/:id`: cambiar el vuelo o
  el hotel, agregar o quitar tours, ajustar los pasajeros y cambiar las fechas de salida y
  regreso. El destino NO DEBE poder cambiarse. Los cambios se guardan con una mutation GraphQL de
  actualización y luego se muestra la reserva con su nuevo total.
- **FR-019**: El usuario DEBE poder eliminar una reserva desde la lista o desde su detalle, previa
  confirmación, mediante una mutation GraphQL de eliminación; tras eliminarla, desaparece de la
  lista.

**Validaciones y errores (F8)**

- **FR-020**: Una reserva DEBE tener al menos un ítem; si no, se muestra "Selecciona al menos un
  servicio para crear la reserva".
- **FR-021**: El número de pasajeros DEBE ser mayor o igual a 1.
- **FR-022**: La fecha de regreso DEBE ser posterior a la de salida.
- **FR-023**: Las validaciones FR-020 a FR-022 DEBEN aplicarse en el cliente antes de enviar la
  mutation, al crear y al modificar una reserva.
- **FR-024**: Los errores de red o de GraphQL NUNCA DEBEN mostrar texto crudo ni trazas; DEBEN
  traducirse a mensajes amigables.
- **FR-025**: Las reservas DEBEN guardarse en el store de `createMockStore`: se conservan al
  recargar el front mientras el servidor mock siga activo y se pierden al reiniciarlo.

**Reglas de cálculo y formato**

- **FR-026**: Noches = fecha de regreso − fecha de salida, en días.
- **FR-027**: Total = (precio del vuelo × pasajeros) + (precio por noche del hotel × noches) +
  suma de (precio de cada tour × pasajeros). El vuelo es de ida y vuelta y su precio es por
  pasajero; el hotel se cobra por noche sin multiplicar por pasajeros; cada tour se cobra por
  persona.
- **FR-028**: Los ítems no elegidos NO DEBEN sumar al total.
- **FR-029**: Los montos DEBEN mostrarse en CLP sin decimales con formato `es-CL` (por ejemplo,
  `$1.250.000`). Las fechas DEBEN viajar en formato ISO (`AAAA-MM-DD`) en la API y mostrarse como
  `dd/mm/aaaa` en la interfaz.

**Pruebas**

- **FR-030**: DEBEN existir pruebas con Vitest + Testing Library, solo en el cliente, para el
  cálculo del total (con vuelo, hotel y tours; sin algún ítem; con distintos pasajeros y noches)
  y para las validaciones de F8 (sin ítems, pasajeros menores a 1, regreso no posterior a la
  salida). No se prueban el servidor mock ni flujos de extremo a extremo.

### Key Entities *(include if feature involves data)*

- **Usuario**: persona de demostración con correo, contraseña fija y nombre visible.
- **País**: país al que pertenece un destino.
- **Destino**: lugar de viaje con nombre, imagen, país y actividades populares.
- **Actividad**: experiencia puntual; forma parte de las actividades populares de un destino y de
  los tours.
- **Vuelo**: opción de ida y vuelta hacia un destino, con aerolínea, horarios y precio por
  pasajero.
- **Hotel**: alojamiento en un destino, con nombre, categoría y precio por noche.
- **Tour**: paquete de un destino que agrupa actividades, con nombre y precio por persona.
- **Reserva**: pertenece a un usuario y a un único destino; agrupa como máximo un vuelo, como
  máximo un hotel y cero o más tours (al menos un ítem en total), con número de pasajeros, fechas
  de salida y regreso, y total.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante sin sesión llega desde la página de inicio a las opciones de un destino
  en un solo clic.
- **SC-002**: Un usuario con sesión crea una reserva completa (vuelo, hotel y un tour) en menos de
  2 minutos.
- **SC-003**: El total mostrado coincide con la fórmula de FR-027 en el 100 % de los casos de
  prueba definidos (con todos los ítems, sin alguno, y con distintos pasajeros y noches).
- **SC-004**: El 100 % de los intentos de enviar una reserva inválida se bloquean con un mensaje
  comprensible antes del envío.
- **SC-005**: Ningún mensaje visible para el usuario contiene texto técnico, códigos de error ni
  trazas.
- **SC-006**: El total se actualiza de forma perceptiblemente inmediata (menos de 1 segundo) tras
  cada cambio en la selección.

## Assumptions

- **Rutas propuestas**: `/` (explorar, público), `/destinos/:id` (detalle y armado; ver es
  público, reservar exige sesión), `/login` (público), `/reservas` y `/reservas/:id` (requieren
  sesión).
- **Usuario mock**: el nombre visible del usuario de FR-002 se define en `mocks.js`.
- **Catálogo de ejemplo** (propuesta): al menos 5 destinos de países distintos; cada uno con 2 o 3
  vuelos, 2 o 3 hoteles y 2 o 3 tours; cada tour con 2 o 3 actividades. Precios en CLP definidos
  en los datos de ejemplo.
- **Detalles de interfaz añadidos por esta spec**: la confirmación antes de eliminar y la
  conservación de la selección tras iniciar sesión, para evitar pérdidas accidentales.

### Fuera de alcance

- **Pasarela de pago**: reservar no implica cobrar; no hay formularios de tarjeta ni pagos.
- **Autenticación real**: no hay registro, recuperación de contraseña, roles ni tokens.
- **Impresión de reservas**: no hay vista de impresión, exportación a PDF ni comprobantes.
- **Cambio de destino**: para otro destino se elimina la reserva y se crea una nueva.
- **Control de disponibilidad**: no hay cupos ni detección de sobreventa; toda reserva válida se
  acepta.
- **Cancelaciones con reglas**: eliminar solo borra; no hay penalidades, reembolsos ni estados como
  "cancelada".
- **Búsqueda, filtros y ordenamiento**: listados completos en el orden del catálogo.
- **Administración del catálogo**: destinos, vuelos, hoteles y tours son de solo lectura.
- **Pruebas del servidor de demostración y pruebas de extremo a extremo.**
