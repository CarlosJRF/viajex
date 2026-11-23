import { createMockStore } from '@graphql-tools/mock'
import { GraphQLError } from 'graphql'
import { catalogo } from './catalogo.js'
import { cargarReservas, guardarReservas } from './persistencia.js'

// Listado público para el endpoint REST (contracts/rest.md)
export const listadoDestinos = () =>
  catalogo.map(({ id, nombre, imagen, pais, actividadesPopulares }) =>
    ({ id, nombre, imagen, pais, actividadesPopulares }))

// Claves de una lista de referencias del store
const claves = (refs) => refs.map((ref) => ref.$ref.key)

// Indica si vuelo, hotel y tours existen y pertenecen al destino
const opcionesValidas = (store, destinoId, { vueloId, hotelId, tourIds }) => {
  const pertenece = (campo, id) => claves(store.get('Destino', destinoId, campo)).includes(id)
  return (
    (!vueloId || pertenece('vuelos', vueloId)) &&
    (!hotelId || pertenece('hoteles', hotelId)) &&
    tourIds.every((id) => pertenece('tours', id))
  )
}

// Lanza un error GraphQL si las opciones no son del destino
const validarOpciones = (store, destinoId, datos) => {
  if (!opcionesValidas(store, destinoId, datos)) {
    throw new GraphQLError('Opciones no válidas para el destino')
  }
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

// Lista de referencias de las reservas vigentes
const reservasDe = (store) => store.get('Query', 'ROOT', 'reservas')

// Reserva vigente, o null si no existe o fue eliminada
const reservaDe = (store, id) => reservasDe(store).find((ref) => ref.$ref.key === id) ?? null

// Inserta una reserva plana en el store y la agrega a la lista
const insertar = (store, { id, destinoId, ...datos }) => {
  store.set('Reserva', id, { id, destino: store.get('Destino', destinoId), ...camposEditables(store, datos) })
  const reserva = store.get('Reserva', id)
  store.set('Query', 'ROOT', 'reservas', [...reservasDe(store), reserva])
  return reserva
}

// Convierte las reservas del store al formato plano de localStorage
const serializar = (store) =>
  reservasDe(store).map((ref) => {
    const id = (campo) => store.get(ref, campo)?.$ref.key ?? null
    return {
      id: ref.$ref.key,
      destinoId: id('destino'),
      vueloId: id('vuelo'),
      hotelId: id('hotel'),
      tourIds: claves(store.get(ref, 'tours')),
      ...Object.fromEntries(
        ['pasajeros', 'fechaSalida', 'fechaRegreso', 'total'].map((c) => [c, store.get(ref, c)]),
      ),
    }
  })

// Crea el store con el catálogo y las reservas guardadas que sigan siendo válidas
export const crearStore = (schema) => {
  const store = createMockStore({ schema })
  catalogo.forEach((destino) => store.set('Destino', destino.id, destino))
  store.set('Query', 'ROOT', 'reservas', [])
  cargarReservas()
    .filter((r) => store.has('Destino', r.destinoId) && opcionesValidas(store, r.destinoId, r))
    .forEach((r) => insertar(store, r))
  return store
}

// Resolvers que leen y escriben en el store; se usa has() porque get() inventa datos
export const crearResolvers = (store) => {
  const guardar = () => guardarReservas(serializar(store))
  return {
    Query: {
      destino: (_, { id }) => (store.has('Destino', id) ? store.get('Destino', id) : null),
      reservas: () => reservasDe(store),
      reserva: (_, { id }) => reservaDe(store, id),
    },
    Mutation: {
      crearReserva: (_, { datos }) => {
        if (!store.has('Destino', datos.destinoId)) throw new GraphQLError('Destino inexistente')
        validarOpciones(store, datos.destinoId, datos)
        const reserva = insertar(store, { id: crypto.randomUUID(), ...datos })
        guardar()
        return reserva
      },
      // Reemplaza los campos editables; el destino no cambia
      actualizarReserva: (_, { id, cambios }) => {
        const reserva = reservaDe(store, id)
        if (!reserva) throw new GraphQLError('Reserva inexistente')
        validarOpciones(store, store.get(reserva, 'destino').$ref.key, cambios)
        store.set('Reserva', id, camposEditables(store, cambios))
        guardar()
        return reserva
      },
      // Quita la reserva de la lista y devuelve su id
      eliminarReserva: (_, { id }) => {
        if (!reservaDe(store, id)) throw new GraphQLError('Reserva inexistente')
        store.set('Query', 'ROOT', 'reservas', reservasDe(store).filter((ref) => ref.$ref.key !== id))
        guardar()
        return id
      },
    },
  }
}
