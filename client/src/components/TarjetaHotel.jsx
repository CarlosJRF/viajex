import { formatearCLP, formatearFecha } from '../lib/formatos.js'

// Hotel con categoría en estrellas; si recibe alAlternar se puede seleccionar
export default function TarjetaHotel({ hotel, seleccionado = false, alAlternar }) {
  const contenido = (
    <>
      <h3 className="font-semibold">{hotel.nombre}</h3>
      <p className="text-amber-500" aria-label={`${hotel.categoria} estrellas`}>
        {'★'.repeat(hotel.categoria)}
      </p>
      <p className="text-sm text-slate-500">
        Disponible del {formatearFecha(hotel.disponibleDesde)} al {formatearFecha(hotel.disponibleHasta)}
      </p>
      <p className="text-sm text-slate-500">{hotel.habitacionesDisponibles} habitaciones disponibles</p>
      <p className="mt-2 font-medium">{formatearCLP(hotel.precioNoche)} por noche</p>
    </>
  )
  if (!alAlternar) return <div className="rounded-lg border border-slate-200 bg-white p-4">{contenido}</div>
  return (
    <button
      type="button"
      aria-pressed={seleccionado}
      onClick={alAlternar}
      className={`w-full rounded-lg border bg-white p-4 text-left ${
        seleccionado ? 'border-sky-600 ring-2 ring-sky-600' : 'border-slate-200 hover:border-sky-400'
      }`}
    >
      {contenido}
    </button>
  )
}
