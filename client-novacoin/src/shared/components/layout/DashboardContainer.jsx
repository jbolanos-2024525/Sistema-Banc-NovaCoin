// Archivo: src/components/layout/DashboardContainer.jsx
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';

export const DashboardContainer = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden', // Asegurar que nada sobresalga
    }}>
      {/* Sidebar siempre visible, fijo a la izquierda */}
      <Sidebar />

      {/* Columna derecha: navbar oscuro + contenido */}
      <div style={{
        display: 'flex',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        {/* Navbar con fondo oscuro azul petróleo */}
        <Navbar />

        {/* Área de Contenido Principal */}
        <main style={{
          flex: 1,
          padding: '32px', // Un poco más de padding
          overflowY: 'auto',
          // --- CAMBIO DE COLOR DE FONDO ---
          // Cambiado de '#f0f4f8' a '#f4f7fc' (gris azulado ultra suave)
          backgroundColor: '#f4f7fc',
          scrollbarWidth: 'thin', // Scrollbar fino para el contenido
          scrollbarColor: 'rgba(0,0,0,0.1) transparent'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};