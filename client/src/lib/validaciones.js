// Reglas de una reserva en orden: [incumple, mensaje] (FR-020 a FR-022)
const reglas = [
  [
    (r) => !r.vueloId && !r.hotelId && r.tourIds.length === 0,
    'Selecciona al menos un servicio para crear la reserva',
  ],
  [(r) => !Number.isInteger(r.pasajeros) || r.pasajeros < 1, 'Indica al menos 1 pasajero'],
  [(r) => !r.fechaSalida || !r.fechaRegreso, 'Indica las fechas de salida y regreso'],
  [
    // Las fechas ISO se comparan bien como texto
    (r) => r.fechaSalida && r.fechaRegreso && r.fechaRegreso <= r.fechaSalida,
    'La fecha de regreso debe ser posterior a la de salida',
  ],
]

// Devuelve los mensajes de las reglas incumplidas; arreglo vacío si es válida
export const validarReserva = (reserva) =>
  reglas.filter(([incumple]) => incumple(reserva)).map(([, mensaje]) => mensaje)
