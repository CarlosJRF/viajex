import { Link } from 'react-router'

// Barra superior con el enlace al inicio
export default function BarraNavegacion() {
  return (
    <nav className="bg-sky-700 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">Viajex</Link>
      </div>
    </nav>
  )
}
