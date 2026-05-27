// Archivo: src/components/layout/Navbar.jsx
import { useLocation } from 'react-router-dom';
import { AvatarUser } from '../ui/AvatarUser.jsx';
import { SearchBar } from '../ui/SearchBar.jsx';   // ← importa el nuevo componente
import { FiBell } from 'react-icons/fi';

const pageTitles = {
  '/dashboard':              'Home',
  '/dashboard/auth':         'Auth',
  '/dashboard/accounts':     'Clientes',
  '/dashboard/customers':    'Customers',
  '/dashboard/employees':    'Employees',
  '/dashboard/loans':        'Loans',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/users':        'Users',
  '/dashboard/reports':      'Reports',
  '/dashboard/settings':     'Settings',
};

export const Navbar = () => {
  const location  = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard';

  return (
    <nav style={{
      background:    'linear-gradient(180deg, #0a1a2f 0%, #050c18 100%)',
      boxShadow:     '0 0 15px rgba(0, 242, 254, 0.2)',
      position:      'sticky',
      top:           0,
      zIndex:        30,
      flexShrink:    0,
    }}>
      <div style={{
        padding:     '0 24px',
        height:      '64px',
        display:     'flex',
        alignItems:  'center',
        gap:         '20px',
      }}>

        {/* Título de la página actual */}
        <span style={{
          color:       '#fff',
          fontWeight:  700,
          fontSize:    '18px',
          fontFamily:  'Poppins, sans-serif',
          letterSpacing: '0.4px',
          whiteSpace:  'nowrap',
          flexShrink:  0,
        }}>
          {pageTitle}
        </span>

        {/* ── Barra de búsqueda inteligente ── */}
        <SearchBar />

        {/* Espaciador */}
        <div style={{ flex: 1 }} />

        {/* Sección Derecha: Campana + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <FiBell style={{
              color:     'rgba(255,255,255,0.85)',
              fontSize:  '22px',
              display:   'block',
            }} />
            <span style={{
              position:        'absolute',
              top:             '-3px',
              right:           '-2px',
              width:           '9px',
              height:          '9px',
              backgroundColor: '#00f2fe',
              borderRadius:    '50%',
              border:          '1.5px solid #081324',
            }} />
          </div>
          <AvatarUser />
        </div>

      </div>
    </nav>
  );
};