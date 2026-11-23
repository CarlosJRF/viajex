import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { consultar } from '../lib/api.js'
import { ELIMINAR_RESERVA, RESERVAS } from '../graphql/reservas.js'
import TarjetaReserva from '../components/TarjetaReserva.jsx'
import MensajeError from '../components/MensajeError.jsx'

// Lista de reservas del usuario con sesión
export default function PaginaReservas({ usuario }) {
  const [estado, setEstado] = useState({ cargando: true, error: null, reservas: [] })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    consultar(RESERVAS, { usuarioId: usuario.id })
      .then(({ reservas }) => setEstado({ cargando: false, error: null, reservas }))
      .catch((error) => setEstado({ cargando: false, error: error.message, reservas: [] }))
  }, [usuario.id, intento])

  // Pide confirmación, elimina en el servidor y la quita de la lista
  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return
    try {
      await consultar(ELIMINAR_RESERVA, { id, usuarioId: usuario.id })
      setEstado((previo) => ({ ...previo, reservas: previo.reservas.filter((r) => r.id !== id) }))
    } catch (error) {
      setEstado((previo) => ({ ...previo, error: error.message }))
    }
  }

  if (estado.cargando) return <p>Cargando reservas…</p>
  if (estado.error) {
    return <MensajeError mensaje={estado.error} alReintentar={() => setIntento((n) => n + 1)} />
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Mis reservas</h1>
      {estado.reservas.length === 0 ? (
        <p>
          Aún no tienes reservas. ¡Explora destinos para planificar tu viaje!{' '}
          <Link to="/" className="text-sky-700 underline">Ver destinos</Link>
        </p>
      ) : (
        <div className="grid gap-4">
          {estado.reservas.map((r) => (
            <TarjetaReserva key={r.id} reserva={r} alEliminar={() => eliminar(r.id)} />
          ))}
        </div>
      )}
    </section>
  )
}
