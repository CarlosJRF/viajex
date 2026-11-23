import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { consultar } from '../lib/api.js'
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

// Detalle público de un destino y armado de la reserva (confirmar exige sesión)
export default function PaginaDestino({ usuario }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [estado, setEstado] = useState({ cargando: true, error: null, destino: null })
  const [intento, setIntento] = useState(0)
  // Si vuelve del login, recupera la selección que traía
  const [seleccion, setSeleccion] = useState(location.state?.seleccion ?? seleccionVacia)
  const [errorEnvio, setErrorEnvio] = useState(null)

  useEffect(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    consultar(DESTINO, { id })
      .then(({ destino }) => setEstado({ cargando: false, error: null, destino }))
      .catch((error) => setEstado({ cargando: false, error: error.message, destino: null }))
  }, [id, intento])

  // Sin sesión: al login con la selección; con sesión: crea la reserva
  const confirmar = async ({ total, ...datos }) => {
    if (!usuario) {
      return navigate('/login', { state: { desde: location.pathname, seleccion: datos } })
    }
    try {
      setErrorEnvio(null)
      await consultar(CREAR_RESERVA, {
        datos: { usuarioId: usuario.id, destinoId: id, ...datos, total },
      })
      navigate('/reservas')
    } catch (e) {
      setErrorEnvio(e.message)
    }
  }

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
