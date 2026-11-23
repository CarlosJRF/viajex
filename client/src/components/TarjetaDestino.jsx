import { Link } from 'react-router'

// Tarjeta del listado de destinos; enlaza al detalle
export default function TarjetaDestino({ destino }) {
  return (
    <Link
      to={`/destinos/${destino.id}`}
      className="block overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <img src={destino.imagen} alt={destino.nombre} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{destino.nombre}</h2>
        <p className="text-sm text-slate-500">{destino.pais.nombre}</p>
        <ul className="mt-2 flex flex-wrap gap-1">
          {destino.actividadesPopulares.map((a) => (
            <li key={a.id} className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
              {a.nombre}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
