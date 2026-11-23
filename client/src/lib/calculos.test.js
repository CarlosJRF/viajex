import { describe, expect, it } from 'vitest'
import { calcularNoches, calcularTotal } from './calculos.js'

const vuelo = { precio: 300000 }
const hotel = { precioNoche: 50000 }
const tours = [{ precio: 20000 }, { precio: 15000 }]

describe('calcularNoches', () => {
  it('cuenta los días entre salida y regreso', () => {
    expect(calcularNoches('2026-12-01', '2026-12-04')).toBe(3)
  })
})

describe('calcularTotal', () => {
  it('suma vuelo y tours por pasajero y hotel por noche', () => {
    const total = calcularTotal({ vuelo, hotel, tours, pasajeros: 2, noches: 3 })
    expect(total).toBe(300000 * 2 + 50000 * 3 + (20000 + 15000) * 2)
  })

  it('los ítems no elegidos suman 0', () => {
    expect(calcularTotal({ vuelo: null, hotel, tours: [], pasajeros: 2, noches: 3 })).toBe(150000)
    expect(calcularTotal({ vuelo, hotel: null, tours: [], pasajeros: 2, noches: 3 })).toBe(600000)
    expect(calcularTotal({ vuelo: null, hotel: null, tours, pasajeros: 2, noches: 3 })).toBe(70000)
  })

  it('el hotel no se multiplica por pasajeros', () => {
    const conUno = calcularTotal({ vuelo: null, hotel, tours: [], pasajeros: 1, noches: 2 })
    const conCuatro = calcularTotal({ vuelo: null, hotel, tours: [], pasajeros: 4, noches: 2 })
    expect(conUno).toBe(100000)
    expect(conCuatro).toBe(100000)
  })

  it('vuelo y tours escalan con los pasajeros', () => {
    expect(calcularTotal({ vuelo, hotel: null, tours, pasajeros: 1, noches: 2 })).toBe(335000)
    expect(calcularTotal({ vuelo, hotel: null, tours, pasajeros: 4, noches: 2 })).toBe(1340000)
  })
})
