import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import logo from '../../../assets/img/logoNovacoin.png';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleFinish = useCallback(() => {
    setTimeout(() => navigate('/login'), 2000);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const displayMessage =
    status === 'loading' ? 'Verificando correo, por favor espera...' : message;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', padding: '0 16px' }}>
      <img src={logo} alt='Novacoin' style={{ width: '112px', height: '112px', objectFit: 'contain', marginBottom: '16px' }} />
      <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151', textAlign: 'center', maxWidth: '512px' }} aria-live='polite'>
        {displayMessage}
      </p>
    </div>
  );
};