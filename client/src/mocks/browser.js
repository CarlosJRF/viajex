import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

// Service worker que atiende la API mock dentro del navegador (convención de MSW)
export const worker = setupWorker(...handlers)
