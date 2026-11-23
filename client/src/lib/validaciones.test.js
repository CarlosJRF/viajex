import { describe, expect, it } from 'vitest'
import { validarReserva } from './validaciones.js'

const valida = {
  vueloId: 'v1',
  hotelId: null,
  tourIds: [],
  pasajeros: 1,
  fechaSalida: '2026-12-01',
  fechaRegreso: '2026-12-05',
}

describe('validarReserva', () => {
  it('acepta una reserva válida', () => {
    expect(validarReserva(valida)).toEqual([])
  })

  it('exige al menos un servicio', () => {
    const sinItems = { ...valida, vueloId: null, hotelId: null, tourIds: [] }
    expect(validarReserva(sinItems)).toContain(
      'Selecciona al menos un servicio para crear la reserva',
    )
  })

  it('exige al menos 1 pasajero', () => {
    expect(validarReserva({ ...valida, pasajeros: 0 })).toContain('Indica al menos 1 pasajero')
  })

  it('exige ambas fechas', () => {
    expect(validarReserva({ ...valida, fechaSalida: '', fechaRegreso: '' })).toContain(
      'Indica las fechas de salida y regreso',
    )
  })

  it('exige regreso posterior a la salida', () => {
    const mensaje = 'La fecha de regreso debe ser posterior a la de salida'
    expect(validarReserva({ ...valida, fechaRegreso: '2026-12-01' })).toContain(mensaje)
    expect(validarReserva({ ...valida, fechaRegreso: '2026-11-28' })).toContain(mensaje)
  })
})
