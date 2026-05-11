import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=d4af37&color=020817&bold=true&name=';

export const AvatarUser = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const name = user?.fullName || user?.username || user?.email || 'Admin';
  const avatarSrc = user?.profilePicture?.trim()
    ? user.profilePicture
    : `${DEFAULT_AVATAR}${encodeURIComponent(name)}`;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <img
        onClick={toggleMenu}
        src={avatarSrc}
        alt={name}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #d4af37',
          cursor: 'pointer',
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `${DEFAULT_AVATAR}${encodeURIComponent(name)}`;
        }}
      />

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: '8px',
          width: '200px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 50,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(212,175,55,0.2)',
          }}>
            <p style={{ fontWeight: 700, color: '#f1f5f9', margin: 0, fontSize: '14px' }}>{name}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>

          <ul style={{ listStyle: 'none', padding: '8px', margin: 0 }}>
            <li>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#f87171',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarUser;