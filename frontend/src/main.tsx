import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ModeProvider } from './context/ThemeContext.tsx'
import ThemeWrapper from './components/layout/ThemeWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModeProvider>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </ModeProvider>
  </StrictMode>,
)
