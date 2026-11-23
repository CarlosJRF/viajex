import { CAMPOS_OPCIONES } from './destinos.js'

// Operaciones de reservas como texto GraphQL

export const RESERVAS = `
  query Reservas {
    reservas {
      id
      pasajeros
      fechaSalida
      fechaRegreso
      total
      destino { id nombre }
      vuelo { aerolinea }
      hotel { nombre }
      tours { id nombre }
    }
  }
`

export const CREAR_RESERVA = `
  mutation CrearReserva($datos: ReservaNueva!) {
    crearReserva(datos: $datos) { id }
  }
`

// Campos completos de una reserva, con las opciones de su destino para editarla
const CAMPOS_RESERVA = `
  id
  pasajeros
  fechaSalida
  fechaRegreso
  total
  vuelo { id }
  hotel { id }
  tours { id }
  destino {
    id
    nombre
    imagen
    pais { nombre }
    ${CAMPOS_OPCIONES}
  }
`

export const RESERVA = `
  query Reserva($id: ID!) {
    reserva(id: $id) { ${CAMPOS_RESERVA} }
  }
`

export const ACTUALIZAR_RESERVA = `
  mutation ActualizarReserva($id: ID!, $cambios: ReservaCambios!) {
    actualizarReserva(id: $id, cambios: $cambios) { ${CAMPOS_RESERVA} }
  }
`

export const ELIMINAR_RESERVA = `
  mutation EliminarReserva($id: ID!) {
    eliminarReserva(id: $id)
  }
`
