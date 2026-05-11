// Archivo: src/components/layout/Navbar.jsx
import { useState } from 'react';
import { AvatarUser } from '../ui/AvatarUser.jsx';
import { FiBell, FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

// Mapeo de rutas a títulos legibles (No cambia)
const pageTitles = {
  '/dashboard':'Home',
  '/dashboard/auth':'Auth',
  '/dashboard/accounts':'Clientes',
  '/dashboard/customers':'Customers',
  '/dashboard/employees':'Employees',
  '/dashboard/loans':'Loans',
  '/dashboard/transactions':'Transactions',
  '/dashboard/users':'Users',
  '/dashboard/reports':'Reports',
  '/dashboard/settings':'Settings',
};

export const Navbar = () => {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard';

  return (
  <nav style={{
  background: 'linear-gradient(180deg, #0a1a2f 0%, #050c18 100%)',
  boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)', // Brillo neón hacia abajo
  position: 'sticky',
  top: 0,
  zIndex: 30,
  flexShrink: 0,
}}>
      <div style={{
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>

        {/* Título de la página actual */}
        <span style={{
          color: '#fff',
          fontWeight: 700,
          fontSize: '18px', // Ligeramente más grande
          fontFamily: 'Poppins, sans-serif',
          letterSpacing: '0.4px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {pageTitle}
        </span>

        {/* Barra de búsqueda */}
        <div style={{
          flex: 1,
          maxWidth: '420px',
          position: 'relative',
        }}>
          <FiSearch style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            // --- AJUSTE DE COLOR DEL ICONO ---
            color: 'rgba(255,255,255,0.6)', // Más suave
            fontSize: '16px',
            pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Buscar clientes, préstamos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px', // Ligeramente más padding
              // --- AJUSTE DE ESTILO DEL INPUT ---
              backgroundColor: 'rgba(255,255,255,0.07)', // Más transparente
              border: '1px solid rgba(255,255,255,0.15)', // Borde más sutil
              borderRadius: '8px', // Bordes más suaves
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'background-color 0.2s', // Transición suave
            }}
            // Efecto Hover/Focus
            onFocus={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.12)'}
            onBlur={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.07)'}
          />
        </div>

        {/* Espaciador */}
        <div style={{ flex: 1 }} />

        {/* Sección Derecha: Campana + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <FiBell style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '22px',
              display: 'block',
            }} />
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-2px',
              width: '9px',
              height: '9px',
              // --- CAMBIO DE COLOR DE ALERTA ---
              // Cambiado a '#00f2fe' (cian neón) para que resalte
              backgroundColor: '#00f2fe',
              borderRadius: '50%',
              border: '1.5px solid #081324', // Borde del color del navbar
            }} />
          </div>
          <AvatarUser />
        </div>

      </div>
    </nav>
  );
};