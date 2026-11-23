const MS_POR_DIA = 24 * 60 * 60 * 1000

// Convierte 'AAAA-MM-DD' a milisegundos UTC para evitar desfases de zona horaria
const aUTC = (iso) => {
  const [anio, mes, dia] = iso.split('-').map(Number)
  return Date.UTC(anio, mes - 1, dia)
}

// Noches = días entre la fecha de salida y la de regreso (FR-026)
export const calcularNoches = (fechaSalida, fechaRegreso) =>
  Math.round((aUTC(fechaRegreso) - aUTC(fechaSalida)) / MS_POR_DIA)

// Total = vuelo × pasajeros + hotel × noches + Σ tours × pasajeros (FR-027, FR-028)
export const calcularTotal = ({ vuelo, hotel, tours = [], pasajeros, noches }) =>
  (vuelo?.precio ?? 0) * pasajeros +
  (hotel?.precioNoche ?? 0) * noches +
  tours.reduce((suma, tour) => suma + tour.precio, 0) * pasajeros
