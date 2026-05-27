import React from 'react';

const ESTADO_COLOR = {
    ACTIVA:    '#00f2fe',
    BLOQUEADA: '#f59e0b',
    CANCELADA: '#ef4444'
};

export const AccountCard = ({ cuenta, formatCurrency }) => {
    const colorEstado = ESTADO_COLOR[cuenta?.EstadoCuenta] || '#9ca3af';

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #050c18 100%)',
            borderRadius: '12px', padding: '28px', color: '#fff',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: '220px', position: 'relative', overflow: 'hidden',
            border: '1px solid #1f2937'
        }}>
            <div style={{
                position: 'absolute', right: '-30px', bottom: '-30px',
                width: '160px', height: '160px',
                background: 'rgba(0,242,254,0.05)', borderRadius: '50%',
                filter: 'blur(30px)', pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#00f2fe', fontWeight: '600', margin: 0 }}>
                        {cuenta?.TipoCuenta || 'Cuenta Bancaria'}
                    </p>
                    <h2 style={{ fontSize: '17px', fontFamily: 'monospace', letterSpacing: '0.15em', color: '#e5e7eb', fontWeight: '500', margin: '8px 0 0 0' }}>
                        {cuenta?.NumeroCuenta}
                    </h2>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.3)' }}>NovaCoin</span>
            </div>

            <div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af', fontWeight: '500', margin: '0 0 6px 0' }}>
                    Saldo Disponible
                </p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#00f2fe', margin: 0 }}>
                    {formatCurrency(cuenta?.Saldo, cuenta?.Moneda)}
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingTop: '12px', borderTop: '1px solid #1f2937', color: '#6b7280' }}>
                <span>
                    Estado:{' '}
                    <strong style={{ color: colorEstado, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}>
                        {cuenta?.EstadoCuenta}
                    </strong>
                </span>
                <span>Moneda: {cuenta?.Moneda}</span>
            </div>
        </div>
    );
};

export const Account = ({ user, cuentas, formatCurrency }) => {

    if (!cuentas || cuentas.length === 0) {
        return (
            <div style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '48px', textAlign: 'center', border: '1px solid #1f2937', color: '#9ca3af' }}>
                <p style={{ fontSize: '16px', margin: 0 }}>No tienes cuentas bancarias registradas.</p>
                <p style={{ fontSize: '13px', marginTop: '8px', color: '#6b7280' }}>Contacta a tu asesor NovaCoin para crear una cuenta.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {cuentas.map((cuenta) => (
                    <AccountCard key={cuenta._id} cuenta={cuenta} formatCurrency={formatCurrency} />
                ))}
            </div>

            <div style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '28px', border: '1px solid #1f2937' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #1f2937', paddingBottom: '16px', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '3px', height: '14px', backgroundColor: '#00f2fe', borderRadius: '2px', display: 'inline-block' }} />
                    Información Oficial del Titular
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px 40px' }}>
                    {[
                        { label: 'Nombres',           value: user?.firstName || user?.Nombre },
                        { label: 'Apellidos',          value: user?.lastName  || user?.Apellido },
                        { label: 'Nombre de Usuario',  value: `@${user?.username || user?.NombreUsuario || 'Sin usuario'}`, mono: true, accent: true },
                        { label: 'Correo Electrónico', value: user?.email     || user?.Email, mono: true },
                    ].map(({ label, value, mono, accent }) => (
                        <div key={label}>
                            <label style={{ fontSize: '10px', fontWeight: '600', color: '#6b7280', display: 'block', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '6px' }}>
                                {label}
                            </label>
                            <p style={{ fontSize: '16px', fontWeight: mono ? '500' : '600', fontFamily: mono ? 'monospace' : 'inherit', color: accent ? '#00f2fe' : '#e5e7eb', borderBottom: '1px solid #1f2937', paddingBottom: '8px', margin: 0 }}>
                                {value || 'No asignado'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};