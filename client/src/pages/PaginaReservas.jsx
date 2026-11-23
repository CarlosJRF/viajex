import { useState } from 'react'
import { Link } from 'react-router'
import { consultar } from '../lib/api.js'
import { useConsulta } from '../lib/useConsulta.js'
import { ELIMINAR_RESERVA, RESERVAS } from '../graphql/reservas.js'
import TarjetaReserva from '../components/TarjetaReserva.jsx'
import MensajeError from '../components/MensajeError.jsx'

// Lista de reservas guardadas en este navegador
export default function PaginaReservas() {
  const { cargando, error, datos: reservas, setDatos, reintentar } = useConsulta(
    (signal) => consultar(RESERVAS, {}, { signal }).then((d) => d.reservas),
    [],
  )
  const [errorEnvio, setErrorEnvio] = useState(null)

  // Pide confirmación, elimina la reserva y la quita de la lista
  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return
    try {
      setErrorEnvio(null)
      await consultar(ELIMINAR_RESERVA, { id })
      setDatos((previas) => previas.filter((r) => r.id !== id))
    } catch (e) {
      setErrorEnvio(e.message)
    }
  }

  if (cargando) return <p role="status">Cargando reservas…</p>
  if (error) return <MensajeError mensaje={error} alReintentar={reintentar} />

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Mis reservas</h1>
      {errorEnvio && <MensajeError mensaje={errorEnvio} />}
      {reservas.length === 0 ? (
        <p>
          Aún no tienes reservas. ¡Explora destinos para planificar tu viaje!{' '}
          <Link to="/" className="text-sky-700 underline">Ver destinos</Link>
        </p>
      ) : (
        <div className="grid gap-4">
          {reservas.map((r) => (
            <TarjetaReserva key={r.id} reserva={r} alEliminar={() => eliminar(r.id)} />
          ))}
        </div>
      )}
    </section>
  )
}
