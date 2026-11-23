import { randomUUID } from 'node:crypto'
import { GraphQLError } from 'graphql'
import { createMockStore } from '@graphql-tools/mock'

// Usuario fijo del login simulado; la contraseña nunca se expone en el esquema
export const usuarioMock = {
  id: 'u1',
  nombre: 'Usuario Demo',
  correo: 'demo@viajes.cl',
  contrasena: 'demo1234',
}

// Ayudantes para declarar el catálogo sin repetir nombres de campos
const actividad = (id, nombre) => ({ id, nombre })
const vuelo = (id, aerolinea, horarioIda, horarioVuelta, precio) =>
  ({ id, aerolinea, horarioIda, horarioVuelta, precio })
const hotel = (id, nombre, categoria, precioNoche) => ({ id, nombre, categoria, precioNoche })
const tour = (id, nombre, actividades, precio) => ({ id, nombre, actividades, precio })
const imagen = (id) => `https://picsum.photos/seed/${id}/600/400`

// Catálogo de solo lectura: 5 destinos de países distintos, precios en CLP
export const catalogo = [
  {
    id: 'd1',
    nombre: 'Cusco',
    imagen: imagen('d1'),
    pais: { id: 'p1', nombre: 'Perú' },
    actividadesPopulares: [
      actividad('a1', 'Visita a Machu Picchu'),
      actividad('a2', 'Recorrido por el Valle Sagrado'),
      actividad('a3', 'Caminata a la Montaña de Colores'),
    ],
    vuelos: [
      vuelo('v1', 'LATAM', '08:15', '17:40', 389000),
      vuelo('v2', 'Sky Airline', '06:30', '14:10', 312000),
    ],
    hoteles: [
      hotel('h1', 'Casa Andina Cusco', 3, 68000),
      hotel('h2', 'Palacio del Inka', 5, 210000),
      hotel('h3', 'Hostal Plaza de Armas', 2, 39000),
    ],
    tours: [
      tour('t1', 'Machu Picchu full day', [
        actividad('a1', 'Visita a Machu Picchu'),
        actividad('a4', 'Tren panorámico'),
      ], 245000),
      tour('t2', 'Valle Sagrado clásico', [
        actividad('a2', 'Recorrido por el Valle Sagrado'),
        actividad('a5', 'Mercado de Pisac'),
        actividad('a6', 'Salineras de Maras'),
      ], 89000),
    ],
  },
  {
    id: 'd2',
    nombre: 'Cancún',
    imagen: imagen('d2'),
    pais: { id: 'p2', nombre: 'México' },
    actividadesPopulares: [
      actividad('a7', 'Snorkel en arrecifes'),
      actividad('a8', 'Ruinas de Tulum'),
    ],
    vuelos: [
      vuelo('v3', 'Aeroméxico', '23:50', '13:20', 720000),
      vuelo('v4', 'LATAM', '10:05', '21:45', 815000),
      vuelo('v5', 'Copa Airlines', '05:40', '18:30', 655000),
    ],
    hoteles: [
      hotel('h4', 'Riu Caribe', 4, 145000),
      hotel('h5', 'Hotel Centro Cancún', 3, 72000),
    ],
    tours: [
      tour('t3', 'Tulum y cenotes', [
        actividad('a8', 'Ruinas de Tulum'),
        actividad('a9', 'Nado en cenote'),
      ], 98000),
      tour('t4', 'Isla Mujeres en catamarán', [
        actividad('a7', 'Snorkel en arrecifes'),
        actividad('a10', 'Paseo en catamarán'),
        actividad('a11', 'Almuerzo en la playa'),
      ], 115000),
    ],
  },
  {
    id: 'd3',
    nombre: 'Buenos Aires',
    imagen: imagen('d3'),
    pais: { id: 'p3', nombre: 'Argentina' },
    actividadesPopulares: [
      actividad('a12', 'Show de tango'),
      actividad('a13', 'Paseo por La Boca'),
      actividad('a14', 'Visita al Teatro Colón'),
    ],
    vuelos: [
      vuelo('v6', 'Aerolíneas Argentinas', '07:00', '19:15', 245000),
      vuelo('v7', 'JetSMART', '12:30', '22:05', 178000),
    ],
    hoteles: [
      hotel('h6', 'Alvear Palace', 5, 260000),
      hotel('h7', 'Hotel Palermo Soho', 3, 64000),
    ],
    tours: [
      tour('t5', 'Noche de tango', [
        actividad('a12', 'Show de tango'),
        actividad('a15', 'Cena típica'),
      ], 75000),
      tour('t6', 'Buenos Aires clásico', [
        actividad('a13', 'Paseo por La Boca'),
        actividad('a14', 'Visita al Teatro Colón'),
        actividad('a16', 'Recorrido por San Telmo'),
      ], 42000),
      tour('t7', 'Delta del Tigre', [
        actividad('a17', 'Paseo en lancha'),
        actividad('a18', 'Puerto de Frutos'),
      ], 58000),
    ],
  },
  {
    id: 'd4',
    nombre: 'Madrid',
    imagen: imagen('d4'),
    pais: { id: 'p4', nombre: 'España' },
    actividadesPopulares: [
      actividad('a19', 'Museo del Prado'),
      actividad('a20', 'Palacio Real'),
    ],
    vuelos: [
      vuelo('v8', 'Iberia', '13:45', '23:55', 1150000),
      vuelo('v9', 'LATAM', '16:20', '11:10', 1290000),
    ],
    hoteles: [
      hotel('h8', 'Hotel Gran Vía', 4, 135000),
      hotel('h9', 'Hostal Sol', 2, 58000),
      hotel('h10', 'Palacio de los Duques', 5, 240000),
    ],
    tours: [
      tour('t8', 'Madrid de los Austrias', [
        actividad('a20', 'Palacio Real'),
        actividad('a21', 'Plaza Mayor'),
      ], 36000),
      tour('t9', 'Arte en el Paseo del Prado', [
        actividad('a19', 'Museo del Prado'),
        actividad('a22', 'Museo Reina Sofía'),
        actividad('a23', 'Parque del Retiro'),
      ], 69000),
    ],
  },
  {
    id: 'd5',
    nombre: 'Río de Janeiro',
    imagen: imagen('d5'),
    pais: { id: 'p5', nombre: 'Brasil' },
    actividadesPopulares: [
      actividad('a24', 'Cristo Redentor'),
      actividad('a25', 'Pan de Azúcar'),
      actividad('a26', 'Playa de Copacabana'),
    ],
    vuelos: [
      vuelo('v10', 'GOL', '09:10', '18:50', 410000),
      vuelo('v11', 'LATAM', '14:35', '08:25', 465000),
    ],
    hoteles: [
      hotel('h11', 'Copacabana Palace', 5, 320000),
      hotel('h12', 'Ipanema Inn', 3, 85000),
    ],
    tours: [
      tour('t10', 'Cristo y Pan de Azúcar', [
        actividad('a24', 'Cristo Redentor'),
        actividad('a25', 'Pan de Azúcar'),
      ], 125000),
      tour('t11', 'Río playero', [
        actividad('a26', 'Playa de Copacabana'),
        actividad('a27', 'Atardecer en Arpoador'),
      ], 48000),
    ],
  },
]

// Crea el store en memoria y carga el catálogo; las reservas parten vacías
export const crearStore = (schema) => {
  const store = createMockStore({ schema })
  store.set('Query', 'ROOT', 'destinos', catalogo)
  store.set('Query', 'ROOT', 'reservas', [])
  return store
}

// Claves de una lista de referencias del store
const claves = (refs) => refs.map((ref) => ref.$ref.key)

// Verifica que vuelo, hotel y tours existan y pertenezcan al destino; si no, lanza error
const validarOpciones = (store, destinoId, { vueloId, hotelId, tourIds }) => {
  const pertenece = (campo, id) => claves(store.get('Destino', destinoId, campo)).includes(id)
  const validas =
    (!vueloId || pertenece('vuelos', vueloId)) &&
    (!hotelId || pertenece('hoteles', hotelId)) &&
    tourIds.every((id) => pertenece('tours', id))
  if (!validas) throw new GraphQLError('Opciones no válidas para el destino')
}

// Campos editables de una reserva, como referencias del store
const camposEditables = (store, { vueloId, hotelId, tourIds, pasajeros, fechaSalida, fechaRegreso, total }) => ({
  vuelo: vueloId ? store.get('Vuelo', vueloId) : null,
  hotel: hotelId ? store.get('Hotel', hotelId) : null,
  tours: tourIds.map((id) => store.get('Tour', id)),
  pasajeros,
  fechaSalida,
  fechaRegreso,
  total,
})

// Reserva vigente del usuario, o null si no existe, fue eliminada o pertenece a otro
const reservaDe = (store, id, usuarioId) =>
  store.get('Query', 'ROOT', 'reservas').find(
    (ref) => ref.$ref.key === id && store.get(ref, 'usuarioId') === usuarioId,
  ) ?? null

// Resolvers que leen y escriben en el store; se usa has() porque get() inventa datos
export const crearResolvers = (store) => ({
  Query: {
    destinos: () => store.get('Query', 'ROOT', 'destinos'),
    destino: (_, { id }) => (store.has('Destino', id) ? store.get('Destino', id) : null),
    reservas: (_, { usuarioId }) =>
      store.get('Query', 'ROOT', 'reservas').filter((ref) => store.get(ref, 'usuarioId') === usuarioId),
    reserva: (_, { id, usuarioId }) => reservaDe(store, id, usuarioId),
  },
  Mutation: {
    // Devuelve el usuario sin la contraseña, o null si las credenciales no coinciden
    login: (_, { correo, contrasena }) => {
      const { contrasena: clave, ...usuario } = usuarioMock
      return correo === usuarioMock.correo && contrasena === clave ? usuario : null
    },
    crearReserva: (_, { datos }) => {
      if (!store.has('Destino', datos.destinoId)) throw new GraphQLError('Destino inexistente')
      validarOpciones(store, datos.destinoId, datos)

      const id = randomUUID()
      store.set('Reserva', id, {
        id,
        usuarioId: datos.usuarioId,
        destino: store.get('Destino', datos.destinoId),
        ...camposEditables(store, datos),
      })
      const reserva = store.get('Reserva', id)
      store.set('Query', 'ROOT', 'reservas', [...store.get('Query', 'ROOT', 'reservas'), reserva])
      return reserva
    },
    // Reemplaza los campos editables; destino y usuario no cambian
    actualizarReserva: (_, { id, usuarioId, cambios }) => {
      const reserva = reservaDe(store, id, usuarioId)
      if (!reserva) throw new GraphQLError('Reserva inexistente')
      const destinoId = store.get(reserva, 'destino').$ref.key
      validarOpciones(store, destinoId, cambios)
      store.set('Reserva', id, camposEditables(store, cambios))
      return reserva
    },
    // Quita la reserva de la lista y devuelve su id
    eliminarReserva: (_, { id, usuarioId }) => {
      if (!reservaDe(store, id, usuarioId)) throw new GraphQLError('Reserva inexistente')
      const restantes = store.get('Query', 'ROOT', 'reservas').filter((ref) => ref.$ref.key !== id)
      store.set('Query', 'ROOT', 'reservas', restantes)
      return id
    },
  },
})
