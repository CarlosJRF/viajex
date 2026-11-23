const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

// Monto entero en pesos chilenos, sin decimales (ej. $1.250.000)
export const formatearCLP = (monto) => formatoCLP.format(monto)

// Convierte 'AAAA-MM-DD' en 'dd/mm/aaaa' sin pasar por Date
export const formatearFecha = (iso) => {
  if (!iso) return ''
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}
