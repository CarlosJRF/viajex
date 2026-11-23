import { formatearCLP } from '../lib/formatos.js'

// Vuelo de ida y vuelta; si recibe alAlternar se puede seleccionar
export default function TarjetaVuelo({ vuelo, seleccionado = false, alAlternar }) {
  const contenido = (
    <>
      <h3 className="font-semibold">{vuelo.aerolinea}</h3>
      <p className="text-sm text-slate-500">Ida {vuelo.horarioIda} · Vuelta {vuelo.horarioVuelta}</p>
      <p className="mt-2 font-medium">{formatearCLP(vuelo.precio)} por pasajero</p>
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
