# Feature Specification: Sistema de reserva de vuelos y hoteles

**Feature Branch**: `spec` (directorio de la feature: raíz del proyecto, según `constitucion.md`)

**Constitución**: v2.0.0

**Created**: 2026-11-23

**Status**: Draft (versión 2)

**Input**: Descripción del usuario: "Especificación: Sistema de reserva de vuelos y hoteles. Deriva de
`constitucion.md` (v1.0.1). Describe el qué; el cómo va en `plan.md`." Versión 2: "Eliminar el login
para la demo, usar una API GraphQL mock que funcione en GitHub Pages y conservar las reservas con
localStorage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar destinos y sus opciones (F2 + F3) (Priority: P1)

Como visitante quiero ver los destinos disponibles y, al elegir uno, ver sus vuelos, hoteles y
tours para planificar mi viaje.

**Why this priority**: es la puerta de entrada al sistema y la base de cualquier reserva. Por sí
sola ya entrega valor: permite planificar un viaje.

**Independent Test**: abrir la página de inicio, elegir un destino y comprobar que se ven solo sus
vuelos, hoteles y tours.

**Acceptance Scenarios**:

1. **Given** un visitante, **When** abre la página de inicio (`/`), **Then** ve todos los destinos
   con nombre, imagen, país y actividades populares.
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

### User Story 2 - Crear una reserva (F4) (Priority: P2)

Como visitante quiero armar una reserva para un destino, eligiendo vuelo, hotel y/o tours,
pasajeros y fechas, viendo el total en vivo.

**Why this priority**: es la acción central del negocio; depende de la exploración (P1).

**Independent Test**: armar una reserva en un destino, confirmar y verificar que aparece en "Mis
reservas" con el total correcto.

**Acceptance Scenarios**:

1. **Given** la página de un destino, **When** elige un vuelo, un hotel y/o varios tours, indica
   pasajeros y fechas, **Then** ve el total calculado según las reglas de cálculo, actualizado
   en vivo.
2. **Given** una selección válida, **When** confirma, **Then** la reserva se crea y el visitante
   llega a "Mis reservas" (`/reservas`), donde aparece la nueva reserva.
3. **Given** una selección inválida (ver FR-020 a FR-022), **When** intenta confirmar, **Then** ve
   el mensaje de validación correspondiente y la reserva no se envía.

---

### User Story 3 - Ver mis reservas (F5) (Priority: P3)

Como visitante quiero ver las reservas que hice en este navegador para revisar lo que contraté.

**Why this priority**: permite comprobar el resultado de crear reservas y es la base para
modificarlas o eliminarlas.

**Independent Test**: con al menos una reserva creada, abrir "Mis reservas", verificar sus datos,
recargar la página y comprobar que la reserva sigue ahí.

**Acceptance Scenarios**:

1. **Given** reservas creadas, **When** abre `/reservas`, **Then** ve cada reserva con destino,
   fechas, pasajeros, ítems incluidos y total.
2. **Given** que no hay reservas, **When** abre `/reservas`, **Then** ve un mensaje que lo invita
   a explorar destinos.
3. **Given** reservas creadas, **When** recarga la página o vuelve otro día en el mismo navegador,
   **Then** las reservas siguen disponibles.

---

### User Story 4 - Modificar una reserva (F6) (Priority: P4)

Como visitante quiero modificar una reserva para ajustarla a mis necesidades.

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
   nuevo total, y el cambio se conserva al recargar.
5. **Given** cambios que dejan la reserva inválida, **When** intenta guardar, **Then** ve el
   mensaje de validación y no se guarda.

---

### User Story 5 - Eliminar una reserva (F7) (Priority: P5)

Como visitante quiero eliminar una reserva que ya no necesito.

**Why this priority**: completa el ciclo de vida de la reserva; es independiente de modificar.

**Independent Test**: eliminar una reserva desde la lista, confirmar y verificar que desaparece,
también después de recargar.

**Acceptance Scenarios**:

1. **Given** una reserva en `/reservas` o `/reservas/:id`, **When** elige eliminarla, **Then** se
   le pide confirmación.
2. **Given** la confirmación, **When** acepta, **Then** la reserva se borra, desaparece de la lista
   y no vuelve al recargar.
3. **Given** la confirmación, **When** la rechaza, **Then** la reserva se mantiene sin cambios.

---

### User Story 6 - Usar la demo publicada (F9) (Priority: P6)

Como visitante quiero abrir la demo desde su dirección pública en GitHub Pages y usarla completa,
sin instalar nada.

**Why this priority**: es la forma de compartir la demo; depende de que P1–P5 funcionen.

**Independent Test**: abrir la URL publicada, recorrer explorar, crear, ver, modificar y eliminar,
y recargar una página interna sin error.

**Acceptance Scenarios**:

1. **Given** la demo publicada, **When** un visitante la abre, **Then** ve los destinos sin
   depender de ningún servidor propio.
2. **Given** la demo publicada, **When** recarga directamente una ruta interna (por ejemplo
   `/destinos/d1` o `/reservas`), **Then** la página carga correctamente.

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
- Fallo al consultar la API mock en cualquier carga o envío: mensaje amigable, nunca texto técnico
  ni trazas.
- Recarga de la página: las reservas se conservan.
- Datos guardados ilegibles o almacenamiento del navegador no disponible (por ejemplo, navegación
  privada estricta): la app funciona igual, partiendo sin reservas guardadas.
- Otro navegador u otro dispositivo: no ve las reservas de este navegador.

## Requirements *(mandatory)*

### Functional Requirements

**Sesión (F1)** — *eliminada en v2*

- **FR-001 a FR-007**: *Eliminados en v2.* No hay inicio ni cierre de sesión, ni páginas
  protegidas: toda la aplicación es pública (constitución v2.0.0).

**Exploración (F2, F3)**

- **FR-008**: La página de inicio (`/`) DEBE listar todos los destinos con nombre, imagen, país y
  actividades populares, en el orden del catálogo. El catálogo es de solo lectura y sale de los
  datos del mock.
- **FR-009**: Cada destino DEBE enlazar a su página de detalle (`/destinos/:id`).
- **FR-010**: La página de un destino DEBE mostrar el destino con su país y sus vuelos (aerolínea,
  horarios, precio por pasajero), hoteles (nombre, categoría, precio por noche) y tours (nombre,
  actividades incluidas, precio por persona), solo los de ese destino.
- **FR-011**: Ante un destino inexistente, el sistema DEBE mostrar un mensaje amigable y un enlace
  a la página de inicio.
- **FR-012**: Si la carga de destinos falla, el sistema DEBE mostrar un mensaje amigable con una
  opción de reintentar.

**Reservas (F4–F7)**

- **FR-013**: Un visitante DEBE poder armar una reserva para un único destino eligiendo como máximo
  un vuelo, como máximo un hotel y cero o más tours, más el número de pasajeros y las fechas de
  salida y regreso.
- **FR-014**: El sistema DEBE calcular y mostrar el total en vivo según las reglas de cálculo
  (FR-026 a FR-029), recalculándolo cada vez que cambie un ítem, los pasajeros o las fechas.
- **FR-015**: Al confirmar una reserva válida, el sistema DEBE guardarla con una mutation GraphQL
  de creación y llevar al visitante a `/reservas`, donde aparece la nueva reserva.
- **FR-016**: *Eliminado en v2* (ya no hay que iniciar sesión para confirmar).
- **FR-017**: "Mis reservas" (`/reservas`) DEBE listar las reservas de este navegador con destino,
  fechas, pasajeros, ítems incluidos y total; si no hay, DEBE mostrar un mensaje que invite a
  explorar destinos.
- **FR-018**: El visitante DEBE poder modificar una reserva en `/reservas/:id`: cambiar el vuelo o
  el hotel, agregar o quitar tours, ajustar los pasajeros y cambiar las fechas de salida y
  regreso. El destino NO DEBE poder cambiarse. Los cambios se guardan con una mutation GraphQL de
  actualización y luego se muestra la reserva con su nuevo total.
- **FR-019**: El visitante DEBE poder eliminar una reserva desde la lista o desde su detalle, previa
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
- **FR-025**: *Reemplazado en v2 por FR-031.*

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
  salida). No se prueban el mock ni flujos de extremo a extremo.

**Persistencia, mock y publicación (F9)** — *nuevos en v2*

- **FR-031**: Las reservas DEBEN guardarse en el store de `createMockStore` y respaldarse en el
  `localStorage` del navegador tras cada creación, modificación o eliminación. Al abrir la app,
  las reservas guardadas se recuperan. Si el almacenamiento no está disponible o sus datos son
  ilegibles, la app DEBE funcionar igual, partiendo sin reservas.
- **FR-032**: La API GraphQL mock DEBE funcionar dentro del navegador, atendiendo las peticiones
  `fetch` a `/graphql` sin ningún servidor propio.
- **FR-033**: La demo DEBE publicarse como sitio estático en GitHub Pages, y cualquier ruta interna
  DEBE cargar correctamente al abrirla o recargarla directamente.

### Key Entities *(include if feature involves data)*

- **País**: país al que pertenece un destino.
- **Destino**: lugar de viaje con nombre, imagen, país y actividades populares.
- **Actividad**: experiencia puntual; forma parte de las actividades populares de un destino y de
  los tours.
- **Vuelo**: opción de ida y vuelta hacia un destino, con aerolínea, horarios y precio por
  pasajero.
- **Hotel**: alojamiento en un destino, con nombre, categoría y precio por noche.
- **Tour**: paquete de un destino que agrupa actividades, con nombre y precio por persona.
- **Reserva**: pertenece a un único destino y al navegador que la creó; agrupa como máximo un
  vuelo, como máximo un hotel y cero o más tours (al menos un ítem en total), con número de
  pasajeros, fechas de salida y regreso, y total.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante llega desde la página de inicio a las opciones de un destino en un solo
  clic.
- **SC-002**: Un visitante crea una reserva completa (vuelo, hotel y un tour) en menos de
  2 minutos.
- **SC-003**: El total mostrado coincide con la fórmula de FR-027 en el 100 % de los casos de
  prueba definidos (con todos los ítems, sin alguno, y con distintos pasajeros y noches).
- **SC-004**: El 100 % de los intentos de enviar una reserva inválida se bloquean con un mensaje
  comprensible antes del envío.
- **SC-005**: Ningún mensaje visible para el usuario contiene texto técnico, códigos de error ni
  trazas.
- **SC-006**: El total se actualiza de forma perceptiblemente inmediata (menos de 1 segundo) tras
  cada cambio en la selección.
- **SC-007**: El 100 % de las reservas creadas, modificadas o eliminadas conservan su último estado
  tras recargar la página en el mismo navegador.
- **SC-008**: La demo publicada permite completar el ciclo explorar → crear → ver → modificar →
  eliminar sin instalar nada ni depender de un servidor propio.

## Assumptions

- **Rutas**: `/` (explorar), `/destinos/:id` (detalle y armado), `/reservas` y `/reservas/:id`.
  Todas públicas.
- **Dirección pública**: la demo se publica en la dirección de GitHub Pages del repositorio
  `viajex`, por lo que las rutas cuelgan de `/viajex/`.
- **Catálogo de ejemplo**: al menos 5 destinos de países distintos; cada uno con 2 o 3 vuelos, 2 o
  3 hoteles y 2 o 3 tours; cada tour con 2 o 3 actividades. Precios en CLP definidos en los datos
  del mock (los mismos de la versión 1).
- **Reservas por navegador**: cada navegador tiene sus propias reservas; borrar los datos del sitio
  las elimina.
- **Detalles de interfaz añadidos por esta spec**: la confirmación antes de eliminar, para evitar
  pérdidas accidentales.

### Fuera de alcance

- **Pasarela de pago**: reservar no implica cobrar; no hay formularios de tarjeta ni pagos.
- **Autenticación**: no hay login, registro, usuarios, roles ni tokens (v2).
- **Sincronización entre dispositivos**: las reservas no se comparten entre navegadores (v2).
- **Impresión de reservas**: no hay vista de impresión, exportación a PDF ni comprobantes.
- **Cambio de destino**: para otro destino se elimina la reserva y se crea una nueva.
- **Control de disponibilidad**: no hay cupos ni detección de sobreventa; toda reserva válida se
  acepta.
- **Cancelaciones con reglas**: eliminar solo borra; no hay penalidades, reembolsos ni estados como
  "cancelada".
- **Búsqueda, filtros y ordenamiento**: listados completos en el orden del catálogo.
- **Administración del catálogo**: destinos, vuelos, hoteles y tours son de solo lectura.
- **Pruebas del mock y pruebas de extremo a extremo.**

## Historial de versiones

| Versión | Constitución | Cambios |
|---|---|---|
| 1 | v1.1.0 | Versión inicial: login simulado, servidor Apollo mock y reservas en memoria del servidor |
| 2 | v2.0.0 | Se elimina el login (FR-001 a FR-007 y FR-016). FR-025 se reemplaza por FR-031 (`localStorage`). Se agregan FR-032 (mock en el navegador), FR-033 (GitHub Pages), US6, SC-007 y SC-008 |
