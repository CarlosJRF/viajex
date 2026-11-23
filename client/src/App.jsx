import { useState } from 'react'
import { Routes } from 'react-router'
import BarraNavegacion from './components/BarraNavegacion.jsx'

// Raíz de la app: la sesión vive solo en memoria y se pierde al recargar
export default function App() {
  const [usuario, setUsuario] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <BarraNavegacion />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes></Routes>
      </main>
    </div>
  )
}
