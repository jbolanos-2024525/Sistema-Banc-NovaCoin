import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';
import { BrowserRouter } from 'react-router-dom';
import '../styles/index.css';
import App from '../app/App.jsx';
import { useAuthStore } from '../features/auth/store/authStore';

// Inicializar autenticación al cargar la aplicación
useAuthStore.getState().checkAuth();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
