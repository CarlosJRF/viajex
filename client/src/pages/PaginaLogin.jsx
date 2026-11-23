import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { consultar } from '../lib/api.js'
import { LOGIN } from '../graphql/sesion.js'

const claseCampo = 'mt-1 w-full rounded border border-slate-300 px-2 py-1'

// Login simulado; al entrar vuelve a la página pedida conservando la selección
export default function PaginaLogin({ alIniciarSesion }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [credenciales, setCredenciales] = useState({ correo: '', contrasena: '' })
  const [error, setError] = useState(null)

  const cambiar = (campo) => (e) => setCredenciales({ ...credenciales, [campo]: e.target.value })

  const ingresar = async (evento) => {
    evento.preventDefault()
    setError(null)
    try {
      const { login } = await consultar(LOGIN, credenciales)
      if (!login) return setError('Correo o contraseña incorrectos.')
      alIniciarSesion(login)
      navigate(location.state?.desde ?? '/', { state: { seleccion: location.state?.seleccion } })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <form onSubmit={ingresar} className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Iniciar sesión</h1>
      <label className="block text-sm">
        Correo
        <input type="email" required value={credenciales.correo} onChange={cambiar('correo')} className={claseCampo} />
      </label>
      <label className="mt-3 block text-sm">
        Contraseña
        <input
          type="password"
          required
          value={credenciales.contrasena}
          onChange={cambiar('contrasena')}
          className={claseCampo}
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <button type="submit" className="mt-4 w-full rounded bg-sky-600 py-2 text-white hover:bg-sky-700">
        Ingresar
      </button>
    </form>
  )
}
