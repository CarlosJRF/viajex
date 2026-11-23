import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { consultar } from '../lib/api.js'
import { DESTINO } from '../graphql/destinos.js'
import TarjetaVuelo from '../components/TarjetaVuelo.jsx'
import TarjetaHotel from '../components/TarjetaHotel.jsx'
import TarjetaTour from '../components/TarjetaTour.jsx'
import MensajeError from '../components/MensajeError.jsx'

// Sección con título y grilla de tarjetas
const Seccion = ({ titulo, children }) => (
  <section className="mt-6">
    <h2 className="mb-3 text-xl font-semibold">{titulo}</h2>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
)

// Detalle público de un destino con sus vuelos, hoteles y tours
export default function PaginaDestino() {
  const { id } = useParams()
  const [estado, setEstado] = useState({ cargando: true, error: null, destino: null })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    consultar(DESTINO, { id })
      .then(({ destino }) => setEstado({ cargando: false, error: null, destino }))
      .catch((error) => setEstado({ cargando: false, error: error.message, destino: null }))
  }, [id, intento])

  if (estado.cargando) return <p>Cargando destino…</p>
  if (estado.error) {
    return <MensajeError mensaje={estado.error} alReintentar={() => setIntento((n) => n + 1)} />
  }
  if (!estado.destino) {
    return (
      <MensajeError mensaje="No encontramos ese destino.">
        <Link to="/" className="underline">Volver a los destinos</Link>
      </MensajeError>
    )
  }

  const { destino } = estado
  return (
    <article>
      <header className="overflow-hidden rounded-lg bg-white shadow">
        <img src={destino.imagen} alt={destino.nombre} className="h-56 w-full object-cover" />
        <div className="p-4">
          <h1 className="text-2xl font-bold">{destino.nombre}</h1>
          <p className="text-slate-500">{destino.pais.nombre}</p>
        </div>
      </header>

      <Seccion titulo="Vuelos">
        {destino.vuelos.map((v) => <TarjetaVuelo key={v.id} vuelo={v} />)}
      </Seccion>
      <Seccion titulo="Hoteles">
        {destino.hoteles.map((h) => <TarjetaHotel key={h.id} hotel={h} />)}
      </Seccion>
      <Seccion titulo="Tours">
        {destino.tours.map((t) => <TarjetaTour key={t.id} tour={t} />)}
      </Seccion>
    </article>
  )
}
