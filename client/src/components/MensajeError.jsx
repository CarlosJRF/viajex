// Mensaje amigable con botón de reintento opcional y enlaces de apoyo
export default function MensajeError({ mensaje, alReintentar, children }) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <p>{mensaje}</p>
      <div className="mt-3 flex gap-4">
        {alReintentar && (
          <button
            type="button"
            onClick={alReintentar}
            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
