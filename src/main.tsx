import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './providers/ModalProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <ModalProvider>
        <App />
      </ModalProvider>
    </StrictMode>
  </BrowserRouter>
)
