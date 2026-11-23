import { formatearCLP } from '../lib/formatos.js'

// Tour con sus actividades; si recibe alAlternar se puede seleccionar
export default function TarjetaTour({ tour, seleccionado = false, alAlternar }) {
  const contenido = (
    <>
      <h3 className="font-semibold">{tour.nombre}</h3>
      <ul className="list-inside list-disc text-sm text-slate-500">
        {tour.actividades.map((a) => <li key={a.id}>{a.nombre}</li>)}
      </ul>
      <p className="mt-2 font-medium">{formatearCLP(tour.precio)} por persona</p>
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
