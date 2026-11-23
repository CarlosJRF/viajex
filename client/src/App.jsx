import { Route, Routes } from 'react-router'
import BarraNavegacion from './components/BarraNavegacion.jsx'
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaDestino from './pages/PaginaDestino.jsx'
import PaginaReservas from './pages/PaginaReservas.jsx'
import PaginaReserva from './pages/PaginaReserva.jsx'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada.jsx'

// Raíz de la app: todas las rutas son públicas
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <BarraNavegacion />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/destinos/:id" element={<PaginaDestino />} />
          <Route path="/reservas" element={<PaginaReservas />} />
          <Route path="/reservas/:id" element={<PaginaReserva />} />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Routes>
      </main>
    </div>
  )
}
