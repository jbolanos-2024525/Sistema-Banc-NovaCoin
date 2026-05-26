import React from 'react';
import { useAccount } from '../hooks/useAccount';
import { Account } from '../components/Account';

export const AccountPage = () => {
  const { user, datosBancarios, formatCurrency } = useAccount();

  return (
    <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>
      
      {/* Encabezado */}
      <div style={{
        marginBottom: '32px',
        borderBottom: '1px solid #1f2937',
        paddingBottom: '16px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
          Mi Cuenta Bancaria
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
          Gestiona tus credenciales y visualiza el estado financiero actual de tu perfil en{' '}
          <span style={{ color: '#00f2fe', fontWeight: '600' }}>NovaCoin</span>.
        </p>
      </div>

      {/* Componente cuenta */}
      <Account
        user={user}
        datosBancarios={datosBancarios}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};