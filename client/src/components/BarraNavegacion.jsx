import { Link } from 'react-router'

// Barra superior: inicio y, según la sesión, acceso a reservas o al login
export default function BarraNavegacion({ usuario, alCerrarSesion }) {
  return (
    <nav className="bg-sky-700 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">Viajex</Link>
        {usuario ? (
          <div className="flex items-center gap-4 text-sm">
            <span>{usuario.nombre}</span>
            <Link to="/reservas" className="hover:underline">Mis reservas</Link>
            <button type="button" onClick={alCerrarSesion} className="rounded bg-sky-900 px-3 py-1">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm hover:underline">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  )
}
