// Operaciones de reservas como texto GraphQL

export const CREAR_RESERVA = `
  mutation CrearReserva($datos: ReservaNueva!) {
    crearReserva(datos: $datos) { id }
  }
`
