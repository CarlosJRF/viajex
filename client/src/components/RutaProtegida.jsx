import { Navigate, useLocation } from 'react-router'

// Sin sesión redirige al login recordando la página pedida
export default function RutaProtegida({ usuario, children }) {
  const location = useLocation()
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  return children
}
