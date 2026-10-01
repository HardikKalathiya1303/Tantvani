import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

// Disable browser's native scroll restoration — let ScrollToTop handle it
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Karla, sans-serif',
              fontSize: '14px',
              background: 'hsl(35, 71%, 95%)',
              color: 'hsl(354, 42%, 18%)',
              border: '1px solid hsl(36, 30%, 84%)',
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
