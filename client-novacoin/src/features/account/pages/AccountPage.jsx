import React from 'react';
import { useAccount } from '../hooks/useAccount';
import { Account }    from '../components/Account';

export const AccountPage = () => {

    const { user, cuentas, loading, error, formatCurrency, refetch } = useAccount();

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>

            <div style={{ marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Mi Cuenta Bancaria</h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                        Visualiza el estado financiero de tu perfil en <span style={{ color: '#00f2fe', fontWeight: '600' }}>NovaCoin</span>.
                    </p>
                </div>
                <button onClick={refetch} disabled={loading} style={{ background: 'transparent', border: '1px solid #1f2937', color: '#9ca3af', borderRadius: '8px', padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
                    {loading ? 'Cargando...' : '↻ Actualizar'}
                </button>
            </div>

            {error && (
                <div style={{ backgroundColor: '#1f1010', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px 16px', color: '#ef4444', fontSize: '14px', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            {loading && !error && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '48px' }}>Cargando tus cuentas...</div>
            )}

            {!loading && <Account user={user} cuentas={cuentas} formatCurrency={formatCurrency} />}

        </div>
    );
};