import { useEffect, useState } from 'react'

// Carga datos con cancelación: al salir o cambiar dependencias se aborta la petición (FR-039)
export const useConsulta = (cargar, dependencias) => {
  const [estado, setEstado] = useState({ cargando: true, error: null, datos: null })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const control = new AbortController()
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    cargar(control.signal)
      .then((datos) => {
        if (!control.signal.aborted) setEstado({ cargando: false, error: null, datos })
      })
      .catch((error) => {
        // Una cancelación no es un error para el usuario
        if (error.name === 'AbortError' || control.signal.aborted) return
        setEstado({ cargando: false, error: error.message, datos: null })
      })
    return () => control.abort()
  }, [...dependencias, intento])

  // Reemplaza los datos (valor o función del valor previo) sin volver a cargar
  const setDatos = (cambio) =>
    setEstado((previo) => ({
      ...previo,
      datos: typeof cambio === 'function' ? cambio(previo.datos) : cambio,
    }))

  return { ...estado, setDatos, reintentar: () => setIntento((n) => n + 1) }
}
