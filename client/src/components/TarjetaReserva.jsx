import { Link } from 'react-router'
import { formatearCLP, formatearFecha } from '../lib/formatos.js'

// Resumen de una reserva con acceso al detalle y eliminación opcional
export default function TarjetaReserva({ reserva, alEliminar }) {
  // Ítems incluidos en texto legible
  const items = [
    reserva.vuelo && `Vuelo ${reserva.vuelo.aerolinea}`,
    reserva.hotel && `Hotel ${reserva.hotel.nombre}`,
    ...reserva.tours.map((t) => `Tour ${t.nombre}`),
  ].filter(Boolean)

  return (
    <article className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{reserva.destino.nombre}</h2>
          <p className="text-sm text-slate-500">
            {formatearFecha(reserva.fechaSalida)} al {formatearFecha(reserva.fechaRegreso)} ·{' '}
            {reserva.pasajeros} {reserva.pasajeros === 1 ? 'pasajero' : 'pasajeros'}
          </p>
        </div>
        <p className="text-lg font-bold">{formatearCLP(reserva.total)}</p>
      </div>
      <ul className="mt-2 list-inside list-disc text-sm">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <div className="mt-3 flex gap-4 text-sm">
        <Link to={`/reservas/${reserva.id}`} className="text-sky-700 hover:underline">
          Ver / modificar
        </Link>
        {alEliminar && (
          <button type="button" onClick={alEliminar} className="text-red-700 hover:underline">
            Eliminar
          </button>
        )}
      </div>
    </article>
  )
}
