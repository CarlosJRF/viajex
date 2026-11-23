import { obtenerJSON } from '../lib/api.js'
import { useConsulta } from '../lib/useConsulta.js'
import TarjetaDestino from '../components/TarjetaDestino.jsx'
import MensajeError from '../components/MensajeError.jsx'

// Lista pública de destinos, obtenida por REST, en el orden del catálogo
export default function PaginaInicio() {
  const { cargando, error, datos, reintentar } = useConsulta(
    (signal) => obtenerJSON('api/destinos', { signal }),
    [],
  )

  if (cargando) return <p role="status">Cargando destinos…</p>
  if (error) return <MensajeError mensaje={error} alReintentar={reintentar} />

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Explora destinos</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {datos.map((destino) => <TarjetaDestino key={destino.id} destino={destino} />)}
      </div>
    </section>
  )
}
