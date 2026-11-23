import TarjetaVuelo from './TarjetaVuelo.jsx'
import TarjetaHotel from './TarjetaHotel.jsx'
import TarjetaTour from './TarjetaTour.jsx'

// Agrega o quita un id de la lista sin mutarla
const alternarEnLista = (lista, id) =>
  lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]

// Elegir el mismo vuelo u hotel otra vez lo deselecciona
const alternarUnico = (actual, id) => (actual === id ? null : id)

// Sección con título y grilla de tarjetas
const Seccion = ({ titulo, children }) => (
  <section className="mt-6">
    <h2 className="mb-3 text-xl font-semibold">{titulo}</h2>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
)

// Vuelos, hoteles y tours seleccionables de un destino
export default function SelectorServicios({ destino, seleccion, alCambiar }) {
  const cambiar = (campos) => alCambiar({ ...seleccion, ...campos })

  return (
    <>
      <Seccion titulo="Vuelos">
        {destino.vuelos.map((v) => (
          <TarjetaVuelo
            key={v.id}
            vuelo={v}
            seleccionado={seleccion.vueloId === v.id}
            alAlternar={() => cambiar({ vueloId: alternarUnico(seleccion.vueloId, v.id) })}
          />
        ))}
      </Seccion>
      <Seccion titulo="Hoteles">
        {destino.hoteles.map((h) => (
          <TarjetaHotel
            key={h.id}
            hotel={h}
            seleccionado={seleccion.hotelId === h.id}
            alAlternar={() => cambiar({ hotelId: alternarUnico(seleccion.hotelId, h.id) })}
          />
        ))}
      </Seccion>
      <Seccion titulo="Tours">
        {destino.tours.map((t) => (
          <TarjetaTour
            key={t.id}
            tour={t}
            seleccionado={seleccion.tourIds.includes(t.id)}
            alAlternar={() => cambiar({ tourIds: alternarEnLista(seleccion.tourIds, t.id) })}
          />
        ))}
      </Seccion>
    </>
  )
}
