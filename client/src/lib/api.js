// Mensajes amigables: nunca se muestra texto técnico al usuario (FR-024)
const ERROR_CONEXION = 'No pudimos conectar con el servidor. Inténtalo nuevamente.'
const ERROR_GRAPHQL = 'Ocurrió un problema al procesar tu solicitud.'

// fetch relativo a la base de la app; una cancelación se relanza tal cual para ignorarla
const solicitar = async (ruta, opciones) => {
  let respuesta
  try {
    respuesta = await fetch(`${import.meta.env.BASE_URL}${ruta}`, opciones)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error(ERROR_CONEXION)
  }
  if (!respuesta.ok) throw new Error(ERROR_CONEXION)
  return respuesta.json()
}

// Envía una operación GraphQL y devuelve data o lanza un error amigable
export const consultar = async (query, variables = {}, { signal } = {}) => {
  const { data, errors } = await solicitar('graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  })
  if (errors?.length) throw new Error(ERROR_GRAPHQL)
  return data
}

// Obtiene un recurso REST en JSON
export const obtenerJSON = (ruta, { signal } = {}) => solicitar(ruta, { signal })
