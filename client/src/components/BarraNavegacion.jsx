import { Link, NavLink } from 'react-router'

// Estilo del enlace según si su sección está activa (FR-037)
const estiloEnlace = ({ isActive }) =>
  `rounded px-3 py-1 text-sm ${isActive ? 'bg-sky-900 font-semibold' : 'hover:underline'}`

// Barra superior: inicio y acceso a las reservas de este navegador
export default function BarraNavegacion() {
  return (
    <nav className="bg-sky-700 text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="text-xl font-bold">Viajex</Link>
        <NavLink to="/reservas" className={estiloEnlace}>Mis reservas</NavLink>
      </div>
    </nav>
  )
}
