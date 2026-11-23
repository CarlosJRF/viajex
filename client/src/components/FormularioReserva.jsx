import { useState } from 'react'
import { calcularNoches, calcularTotal } from '../lib/calculos.js'
import { validarReserva } from '../lib/validaciones.js'
import { formatearCLP } from '../lib/formatos.js'

// Noches solo cuando las fechas son válidas; así el total en vivo nunca es negativo
const nochesValidas = ({ fechaSalida, fechaRegreso }) =>
  fechaSalida && fechaRegreso && fechaRegreso > fechaSalida
    ? calcularNoches(fechaSalida, fechaRegreso)
    : 0

// Total de la selección según los precios del destino
const totalDe = (destino, seleccion) =>
  calcularTotal({
    vuelo: destino.vuelos.find((v) => v.id === seleccion.vueloId),
    hotel: destino.hoteles.find((h) => h.id === seleccion.hotelId),
    tours: destino.tours.filter((t) => seleccion.tourIds.includes(t.id)),
    pasajeros: seleccion.pasajeros,
    noches: nochesValidas(seleccion),
  })

const claseCampo = 'mt-1 w-full rounded border border-slate-300 px-2 py-1'

// Pasajeros, fechas, total en vivo y confirmación con validación previa
export default function FormularioReserva({ destino, seleccion, alCambiar, alConfirmar, textoBoton }) {
  const [errores, setErrores] = useState([])
  const total = totalDe(destino, seleccion)

  // Cualquier cambio limpia los errores mostrados
  const cambiar = (campos) => {
    setErrores([])
    alCambiar({ ...seleccion, ...campos })
  }

  const confirmar = (evento) => {
    evento.preventDefault()
    const encontrados = validarReserva(seleccion)
    setErrores(encontrados)
    if (encontrados.length === 0) alConfirmar({ ...seleccion, total })
  }

  return (
    <form onSubmit={confirmar} className="mt-6 rounded-lg bg-white p-4 shadow">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          Pasajeros
          <input
            type="number"
            min="1"
            value={seleccion.pasajeros}
            onChange={(e) => cambiar({ pasajeros: parseInt(e.target.value, 10) || 0 })}
            className={claseCampo}
          />
        </label>
        <label className="block text-sm">
          Fecha de salida
          <input
            type="date"
            value={seleccion.fechaSalida}
            onChange={(e) => cambiar({ fechaSalida: e.target.value })}
            className={claseCampo}
          />
        </label>
        <label className="block text-sm">
          Fecha de regreso
          <input
            type="date"
            value={seleccion.fechaRegreso}
            onChange={(e) => cambiar({ fechaRegreso: e.target.value })}
            className={claseCampo}
          />
        </label>
      </div>

      {errores.length > 0 && (
        <ul className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {errores.map((mensaje) => <li key={mensaje}>{mensaje}</li>)}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg">
          Total: <strong>{formatearCLP(total)}</strong>
        </p>
        <button type="submit" className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
          {textoBoton}
        </button>
      </div>
    </form>
  )
}
