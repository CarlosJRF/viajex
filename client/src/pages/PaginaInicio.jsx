import { useEffect, useState } from 'react'
import { consultar } from '../lib/api.js'
import { DESTINOS } from '../graphql/destinos.js'
import TarjetaDestino from '../components/TarjetaDestino.jsx'
import MensajeError from '../components/MensajeError.jsx'

// Lista pública de destinos en el orden del catálogo
export default function PaginaInicio() {
  const [estado, setEstado] = useState({ cargando: true, error: null, destinos: [] })
  const [intento, setIntento] = useState(0)

  // Carga (o recarga al reintentar) el catálogo
  useEffect(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    consultar(DESTINOS)
      .then(({ destinos }) => setEstado({ cargando: false, error: null, destinos }))
      .catch((error) => setEstado({ cargando: false, error: error.message, destinos: [] }))
  }, [intento])

  if (estado.cargando) return <p>Cargando destinos…</p>
  if (estado.error) {
    return <MensajeError mensaje={estado.error} alReintentar={() => setIntento((n) => n + 1)} />
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Explora destinos</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {estado.destinos.map((destino) => <TarjetaDestino key={destino.id} destino={destino} />)}
      </div>
    </section>
  )
}
