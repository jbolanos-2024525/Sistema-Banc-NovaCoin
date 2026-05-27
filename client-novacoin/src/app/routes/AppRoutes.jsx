import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../../assets/img/N.novacoin.png';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import {
  FiUser, FiCreditCard, FiRepeat, FiHome, FiLogOut,
  FiMail, FiPhone,
} from 'react-icons/fi';

const menuItems = [
  { label: 'Home', to: '/user', icon: <FiHome />, exact: true },

  { isHeader: true, label: 'MI CUENTA' },
  { label: 'Cuenta',        to: '/user/account',      icon: <FiUser /> },
  { label: 'Préstamos',     to: '/user/loans',         icon: <FiCreditCard /> },
  { label: 'Transacciones', to: '/user/transactions',  icon: <FiRepeat /> },

];

export const UserSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isActive = (to, exact) =>
    exact
      ? location.pathname === to
      : location.pathname.startsWith(to) && to !== '/user';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const name = user?.fullName || user?.username || user?.email || 'Usuario';

  return (
    <aside style={{
      width: '245px',
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #0a1a2f 0%, #050c18 45%, #082d33 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        height: '64px',
        padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <img src={logoImg} alt="NovaCoin" style={{ height: '36px', width: 'auto' }} />
        <span style={{
          color: '#fff',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '1.2px',
          fontFamily: 'Poppins, sans-serif',
        }}>NOVACOIN</span>
      </div>

      {/* Navegación */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px 0' }}>
        {menuItems.map((item, index) => {
          if (item.isHeader) {
            return (
              <p key={index} style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                padding: '20px 24px 8px',
                margin: 0,
                fontFamily: 'Poppins, sans-serif',
              }}>
                {item.label}
              </p>
            );
          }

          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 24px',
                textDecoration: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                backgroundColor: active ? 'rgba(0,242,254,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #00f2fe' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{
                fontSize: '17px',
                color: active ? '#00f2fe' : 'rgba(255,255,255,0.3)',
                display: 'flex',
              }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Hexágono decorativo */}
        <div style={{
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.3,
          marginTop: '20px',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, transparent 100%)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '28px', fontWeight: '900', color: '#00f2fe' }}>N</span>
          </div>
        </div>
      </div>

      {/* Contáctanos */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(0,0,0,0.15)',
      }}>
        <p style={{
          margin: '0 0 10px 0',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          fontFamily: 'Poppins, sans-serif',
        }}>CONTÁCTANOS</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
          <FiMail style={{ color: '#00f2fe', fontSize: '13px', flexShrink: 0 }} />
          <span style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>NovaCoin@gmail.com</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPhone style={{ color: '#00f2fe', fontSize: '13px', flexShrink: 0 }} />
          <span style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
          }}>+502 4521-8763</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#050c18',
          fontWeight: 700,
          fontSize: '13px',
          flexShrink: 0,
        }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{
            margin: 0,
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </p>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
            Usuario
          </p>
        </div>
        <FiLogOut
          onClick={handleLogout}
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}
        />
      </div>
    </aside>
  );
};