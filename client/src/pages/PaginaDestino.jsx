import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { consultar } from '../lib/api.js'
import { useConsulta } from '../lib/useConsulta.js'
import { DESTINO } from '../graphql/destinos.js'
import { CREAR_RESERVA } from '../graphql/reservas.js'
import SelectorServicios from '../components/SelectorServicios.jsx'
import FormularioReserva from '../components/FormularioReserva.jsx'
import MensajeError from '../components/MensajeError.jsx'

const seleccionVacia = {
  vueloId: null,
  hotelId: null,
  tourIds: [],
  pasajeros: 1,
  fechaSalida: '',
  fechaRegreso: '',
}

// Detalle público de un destino y armado de la reserva
export default function PaginaDestino() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cargando, error, datos: destino, reintentar } = useConsulta(
    (signal) => consultar(DESTINO, { id }, { signal }).then((d) => d.destino),
    [id],
  )
  const [seleccion, setSeleccion] = useState(seleccionVacia)
  const [errorEnvio, setErrorEnvio] = useState(null)

  // Crea la reserva y lleva a la lista
  const confirmar = async ({ total, ...datos }) => {
    try {
      setErrorEnvio(null)
      await consultar(CREAR_RESERVA, { datos: { destinoId: id, ...datos, total } })
      navigate('/reservas')
    } catch (e) {
      setErrorEnvio(e.message)
    }
  }

  if (cargando) return <p role="status">Cargando destino…</p>
  if (error) return <MensajeError mensaje={error} alReintentar={reintentar} />
  if (!destino) {
    return (
      <MensajeError mensaje="No encontramos ese destino.">
        <Link to="/" className="underline">Volver a los destinos</Link>
      </MensajeError>
    )
  }

  return (
    <article>
      <header className="overflow-hidden rounded-lg bg-white shadow">
        <img src={destino.imagen} alt={destino.nombre} className="h-56 w-full object-cover" />
        <div className="p-4">
          <h1 className="text-2xl font-bold">{destino.nombre}</h1>
          <p className="text-slate-500">{destino.pais.nombre}</p>
        </div>
      </header>

      <SelectorServicios destino={destino} seleccion={seleccion} alCambiar={setSeleccion} />
      <FormularioReserva
        destino={destino}
        seleccion={seleccion}
        alCambiar={setSeleccion}
        alConfirmar={confirmar}
        textoBoton="Confirmar reserva"
      />
      {errorEnvio && <MensajeError mensaje={errorEnvio} />}
    </article>
  )
}
