import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { worker } from './mocks/browser.js'
import App from './App.jsx'
import './index.css'

const base = import.meta.env.BASE_URL

// La API mock debe estar activa antes de la primera petición
await worker.start({
  serviceWorker: { url: `${base}mockServiceWorker.js` },
  onUnhandledRequest: 'bypass',
  quiet: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
