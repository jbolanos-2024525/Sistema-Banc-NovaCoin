import React from 'react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount);

const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusStyle = (estado) => {
    const map = {
        ACTIVO:    { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
        PENDIENTE: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
        PAGADO:    { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
        VENCIDO:   { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', border: 'rgba(239,68,68,0.3)'  },
    };
    return map[estado] || map['PENDIENTE'];
};

export const LoanList = ({ loans }) => {
    if (!loans || loans.length === 0) {
        return (
            <div style={{
                textAlign: 'center', padding: '48px',
                backgroundColor: '#111827', borderRadius: '8px',
                border: '1px dashed #374151', color: '#9ca3af'
            }}>
                <p style={{ margin: 0, fontSize: '16px' }}>No tienes préstamos registrados.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    Solicita tu primer préstamo con el botón de arriba.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#111827', borderRadius: '8px',
            border: '1px solid #1f2937', overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}>
                            {['Fecha', 'Monto', 'Plazo', 'Cuota Mensual', 'Propósito', 'Estado'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => {
                            const s = statusStyle(loan.estado || loan.Estado || 'PENDIENTE');
                            const fecha = loan.fechaSolicitud || loan.FechaSolicitud || loan.createdAt;
                            const estado = loan.estado || loan.Estado || 'PENDIENTE';
                            return (
                                <tr key={loan.id || index}
                                    style={{ borderBottom: '1px solid #1f2937', transition: 'background-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1f2937'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#e5e7eb' }}>{formatDate(fecha)}</td>
                                    <td style={{ padding: '16px', fontSize: '15px', fontWeight: '600', color: '#00f2fe' }}>{formatCurrency(loan.monto || loan.Monto)}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#9ca3af' }}>{loan.plazoMeses || loan.PlazoMeses} meses</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#34d399', fontWeight: '600' }}>{formatCurrency(loan.cuotaMensual || loan.CuotaMensual || 0)}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#9ca3af', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.proposito || loan.Proposito || '---'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            display: 'inline-block', padding: '4px 10px',
                                            borderRadius: '9999px', fontSize: '12px', fontWeight: '600',
                                            backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`
                                        }}>{estado}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};