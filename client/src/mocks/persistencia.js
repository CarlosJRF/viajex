// Respaldo de las reservas en el localStorage del navegador
const CLAVE = 'viajex:reservas'

// Devuelve las reservas guardadas, o [] si no hay datos válidos
export const cargarReservas = () => {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE))
    return Array.isArray(lista) ? lista : []
  } catch {
    return []
  }
}

// Guarda las reservas; si el almacenamiento falla, la app sigue funcionando en memoria
export const guardarReservas = (lista) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista))
  } catch {
    // Sin espacio o almacenamiento bloqueado: se ignora
  }
}
