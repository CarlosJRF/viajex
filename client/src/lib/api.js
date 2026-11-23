// Mensajes amigables: nunca se muestra texto técnico al usuario (FR-024)
const ERROR_CONEXION = 'No pudimos conectar con el servidor. Inténtalo nuevamente.'
const ERROR_GRAPHQL = 'Ocurrió un problema al procesar tu solicitud.'

// Envía una operación GraphQL con fetch y devuelve data o lanza un error amigable
export const consultar = async (query, variables = {}) => {
  let respuesta
  try {
    respuesta = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new Error(ERROR_CONEXION)
  }
  if (!respuesta.ok) throw new Error(ERROR_CONEXION)

  const { data, errors } = await respuesta.json()
  if (errors?.length) throw new Error(ERROR_GRAPHQL)
  return data
}
