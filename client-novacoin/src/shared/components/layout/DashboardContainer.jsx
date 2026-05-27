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
            padding: '0',
            overflowY: 'auto',
            backgroundColor: '#0d1117',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,0,0,0.1) transparent'
        }}>
            {children}
        </main>
      </div>
    </div>
  );
};