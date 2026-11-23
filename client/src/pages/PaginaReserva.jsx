import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { consultar } from '../lib/api.js'
import { formatearCLP } from '../lib/formatos.js'
import { ACTUALIZAR_RESERVA, ELIMINAR_RESERVA, RESERVA } from '../graphql/reservas.js'
import SelectorServicios from '../components/SelectorServicios.jsx'
import FormularioReserva from '../components/FormularioReserva.jsx'
import MensajeError from '../components/MensajeError.jsx'

// Selección editable a partir de una reserva guardada
const seleccionDe = (reserva) => ({
  vueloId: reserva.vuelo?.id ?? null,
  hotelId: reserva.hotel?.id ?? null,
  tourIds: reserva.tours.map((t) => t.id),
  pasajeros: reserva.pasajeros,
  fechaSalida: reserva.fechaSalida,
  fechaRegreso: reserva.fechaRegreso,
})

// Detalle y edición de una reserva; el destino se muestra pero no se puede cambiar
export default function PaginaReserva({ usuario }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [estado, setEstado] = useState({ cargando: true, error: null, reserva: null })
  const [intento, setIntento] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [errorEnvio, setErrorEnvio] = useState(null)

  // Muestra la reserva recibida y reinicia la selección desde ella
  const mostrar = (reserva) => {
    setEstado({ cargando: false, error: null, reserva })
    if (reserva) setSeleccion(seleccionDe(reserva))
  }

  useEffect(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    consultar(RESERVA, { id, usuarioId: usuario.id })
      .then(({ reserva }) => mostrar(reserva))
      .catch((error) => setEstado({ cargando: false, error: error.message, reserva: null }))
  }, [id, usuario.id, intento])

  const guardar = async (cambios) => {
    try {
      setErrorEnvio(null)
      const { actualizarReserva } = await consultar(ACTUALIZAR_RESERVA, {
        id,
        usuarioId: usuario.id,
        cambios,
      })
      mostrar(actualizarReserva)
      setAviso(`Reserva actualizada. Nuevo total: ${formatearCLP(actualizarReserva.total)}`)
    } catch (e) {
      setErrorEnvio(e.message)
    }
  }

  const eliminar = async () => {
    if (!window.confirm('¿Eliminar esta reserva?')) return
    try {
      await consultar(ELIMINAR_RESERVA, { id, usuarioId: usuario.id })
      navigate('/reservas')
    } catch (e) {
      setErrorEnvio(e.message)
    }
  }

  // Cualquier cambio oculta el aviso de guardado anterior
  const cambiar = (nueva) => {
    setAviso(null)
    setSeleccion(nueva)
  }

  if (estado.cargando) return <p>Cargando reserva…</p>
  if (estado.error) {
    return <MensajeError mensaje={estado.error} alReintentar={() => setIntento((n) => n + 1)} />
  }
  if (!estado.reserva) {
    return (
      <MensajeError mensaje="No encontramos esa reserva.">
        <Link to="/reservas" className="underline">Volver a mis reservas</Link>
      </MensajeError>
    )
  }

  const { destino } = estado.reserva
  return (
    <article>
      <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
        <div>
          <p className="text-sm text-slate-500">Reserva para</p>
          <h1 className="text-2xl font-bold">{destino.nombre}</h1>
          <p className="text-slate-500">{destino.pais.nombre}</p>
        </div>
        <button type="button" onClick={eliminar} className="rounded border border-red-600 px-3 py-1 text-red-700">
          Eliminar reserva
        </button>
      </header>

      {aviso && <p className="mt-4 rounded bg-green-50 p-3 text-green-800">{aviso}</p>}

      <SelectorServicios destino={destino} seleccion={seleccion} alCambiar={cambiar} />
      <FormularioReserva
        destino={destino}
        seleccion={seleccion}
        alCambiar={cambiar}
        alConfirmar={guardar}
        textoBoton="Guardar cambios"
      />
      {errorEnvio && <MensajeError mensaje={errorEnvio} />}
    </article>
  )
}
