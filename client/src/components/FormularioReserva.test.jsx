import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import FormularioReserva from './FormularioReserva.jsx'

const destino = { vuelos: [], hoteles: [], tours: [] }
const sinServicios = {
  vueloId: null,
  hotelId: null,
  tourIds: [],
  pasajeros: 1,
  fechaSalida: '2026-12-01',
  fechaRegreso: '2026-12-04',
}

describe('FormularioReserva', () => {
  it('muestra la validación y no confirma una reserva sin servicios', () => {
    const alConfirmar = vi.fn()
    render(
      <FormularioReserva
        destino={destino}
        seleccion={sinServicios}
        alCambiar={() => {}}
        alConfirmar={alConfirmar}
        textoBoton="Confirmar reserva"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(screen.getByText('Selecciona al menos un servicio para crear la reserva')).toBeTruthy()
    expect(alConfirmar).not.toHaveBeenCalled()
  })
})
