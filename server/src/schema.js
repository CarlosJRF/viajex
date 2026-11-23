// typeDefs de todas las entidades; copia fiel de contracts/schema.graphql
export const typeDefs = /* GraphQL */ `
# Contrato GraphQL entre client/ y server/ (fuente para server/src/schema.js).
# Montos: Int en CLP sin decimales. Fechas: String ISO AAAA-MM-DD.

type Usuario {
  id: ID!
  nombre: String!
  correo: String!
}

type Pais {
  id: ID!
  nombre: String!
}

type Actividad {
  id: ID!
  nombre: String!
}

type Vuelo {
  id: ID!
  aerolinea: String!
  horarioIda: String!
  horarioVuelta: String!
  "CLP por pasajero, ida y vuelta"
  precio: Int!
}

type Hotel {
  id: ID!
  nombre: String!
  "Estrellas de 1 a 5"
  categoria: Int!
  "CLP por noche"
  precioNoche: Int!
}

type Tour {
  id: ID!
  nombre: String!
  actividades: [Actividad!]!
  "CLP por persona"
  precio: Int!
}

type Destino {
  id: ID!
  nombre: String!
  imagen: String!
  pais: Pais!
  actividadesPopulares: [Actividad!]!
  vuelos: [Vuelo!]!
  hoteles: [Hotel!]!
  tours: [Tour!]!
}

type Reserva {
  id: ID!
  usuarioId: ID!
  destino: Destino!
  vuelo: Vuelo
  hotel: Hotel
  tours: [Tour!]!
  pasajeros: Int!
  fechaSalida: String!
  fechaRegreso: String!
  total: Int!
}

"Datos para crear una reserva; el total lo calcula el cliente"
input ReservaNueva {
  usuarioId: ID!
  destinoId: ID!
  vueloId: ID
  hotelId: ID
  tourIds: [ID!]!
  pasajeros: Int!
  fechaSalida: String!
  fechaRegreso: String!
  total: Int!
}

"Reemplaza los campos editables; el destino no se puede cambiar"
input ReservaCambios {
  vueloId: ID
  hotelId: ID
  tourIds: [ID!]!
  pasajeros: Int!
  fechaSalida: String!
  fechaRegreso: String!
  total: Int!
}

type Query {
  "Catálogo completo en orden del catálogo (público)"
  destinos: [Destino!]!
  "null si el destino no existe (público)"
  destino(id: ID!): Destino
  "Reservas del usuario"
  reservas(usuarioId: ID!): [Reserva!]!
  "null si no existe o no pertenece al usuario"
  reserva(id: ID!, usuarioId: ID!): Reserva
}

type Mutation {
  "Devuelve el usuario mock o null si las credenciales no coinciden"
  login(correo: String!, contrasena: String!): Usuario
  crearReserva(datos: ReservaNueva!): Reserva!
  "Error GraphQL si la reserva no existe o no pertenece al usuario"
  actualizarReserva(id: ID!, usuarioId: ID!, cambios: ReservaCambios!): Reserva!
  "Devuelve el id eliminado; error GraphQL si no existe o no pertenece al usuario"
  eliminarReserva(id: ID!, usuarioId: ID!): ID!
}
`
