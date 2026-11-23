import { Link } from 'react-router'

// Página para cualquier ruta inexistente (FR-036)
export default function PaginaNoEncontrada() {
  return (
    <section className="py-10 text-center">
      <p className="mb-4 text-lg">No encontramos esta página.</p>
      <Link to="/" className="text-sky-700 underline">Volver al inicio</Link>
    </section>
  )
}
