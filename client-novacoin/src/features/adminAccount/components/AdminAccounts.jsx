import React from 'react';

const ESTADO_BADGE = {
    ACTIVA:    { color: '#00f2fe', bg: 'rgba(0,242,254,0.1)'  },
    BLOQUEADA: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    CANCELADA: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
};

export const AdminAccounts = ({ cuentas, loading, onEdit, onDelete, formatCurrency }) => {

    if (loading) return <div style={{ textAlign: 'center', color: '#9ca3af', padding: '60px' }}>Cargando cuentas...</div>;

    if (!cuentas || cuentas.length === 0) return (
        <div style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '48px', textAlign: 'center', border: '1px solid #1f2937', color: '#9ca3af' }}>
            No hay cuentas registradas.
        </div>
    );

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e5e7eb', fontSize: '14px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #1f2937' }}>
                        {['N° Cuenta', 'Tipo', 'Moneda', 'Saldo', 'Estado', 'ID Usuario', 'Acciones'].map((h) => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cuentas.map((cuenta) => {
                        const badge = ESTADO_BADGE[cuenta.EstadoCuenta] || { color: '#9ca3af', bg: 'transparent' };
                        return (
                            <tr key={cuenta._id} style={{ borderBottom: '1px solid #1f2937' }}>
                                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#00f2fe' }}>{cuenta.NumeroCuenta}</td>
                                <td style={{ padding: '14px 16px' }}>{cuenta.TipoCuenta}</td>
                                <td style={{ padding: '14px 16px' }}>{cuenta.Moneda}</td>
                                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#00f2fe' }}>{formatCurrency(cuenta.Saldo, cuenta.Moneda)}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ padding: '4px 10px', backgroundColor: badge.bg, color: badge.color, borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                        {cuenta.EstadoCuenta}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#9ca3af', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {cuenta.IdUsuario}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => onEdit(cuenta)} style={{ padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #374151', borderRadius: '6px', color: '#e5e7eb', cursor: 'pointer', fontSize: '12px' }}>Editar</button>
                                        <button onClick={() => onDelete(cuenta._id)} style={{ padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};