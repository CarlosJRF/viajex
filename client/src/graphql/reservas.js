// Operaciones de reservas como texto GraphQL

export const RESERVAS = `
  query Reservas($usuarioId: ID!) {
    reservas(usuarioId: $usuarioId) {
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
