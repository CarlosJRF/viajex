import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import BarraNavegacion from './components/BarraNavegacion.jsx'
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaDestino from './pages/PaginaDestino.jsx'
import PaginaLogin from './pages/PaginaLogin.jsx'

// Raíz de la app: la sesión vive solo en memoria y se pierde al recargar
export default function App() {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  const cerrarSesion = () => {
    setUsuario(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <BarraNavegacion usuario={usuario} alCerrarSesion={cerrarSesion} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/destinos/:id" element={<PaginaDestino usuario={usuario} />} />
          <Route path="/login" element={<PaginaLogin alIniciarSesion={setUsuario} />} />
        </Routes>
      </main>
    </div>
  )
}
