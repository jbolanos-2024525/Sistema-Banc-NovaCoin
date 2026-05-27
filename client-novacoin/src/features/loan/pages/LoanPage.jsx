import React, { useEffect, useState } from 'react';
import { useLoanStore } from '../store/loanStore.jsx';
import { LoanModal } from '../components/LoanModal.jsx';
import { useAuthStore } from '../../auth/store/authStore';
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount ?? 0);

const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusStyle = (estado) => {
    const map = {
        ACTIVO:    { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', border: 'rgba(16,185,129,0.3)' },
        PENDIENTE: { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
        PAGADO:    { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
        VENCIDO:   { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'  },
        CANCELADO: { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: 'rgba(107,114,128,0.3)' },
    };
    return map[estado] || map['PENDIENTE'];
};

const tipoStyle = (tipo) => {
    const map = {
        PERSONAL:    { color: '#a78bfa' },
        HIPOTECARIO: { color: '#fb923c' },
        VEHICULAR:   { color: '#38bdf8' },
    };
    return map[tipo] || { color: '#9ca3af' };
};

export const LoanPage = () => {
    const { loans, loading, error, fetchLoans, requestLoan, updateLoan, cancelLoan, deleteLoan } = useLoanStore();
    const { user } = useAuthStore();

    const [isModalOpen,   setIsModalOpen]   = useState(false);
    const [loanToEdit,    setLoanToEdit]    = useState(null);
    const [confirmConfig, setConfirmConfig] = useState(null);

    const isAdmin = user?.role === 'ADMIN_ROLE';

    useEffect(() => { fetchLoans(); }, [fetchLoans]);

    const handleRequestLoan = async (dto) => {
        const result = await requestLoan(dto);
        if (result.success) { setIsModalOpen(false); fetchLoans(); }
    };

    const handleOpenEdit = (loan) => {
        setLoanToEdit(loan);
        setIsModalOpen(true);
    };

    const handleUpdateLoan = async (dto) => {
        const id = loanToEdit._id || loanToEdit.id;
        const result = await updateLoan(id, dto);
        if (result.success) { setIsModalOpen(false); setLoanToEdit(null); fetchLoans(); }
    };

    const handleCancel = (id) => {
        setConfirmConfig({
            title: 'Cancelar préstamo',
            message: 'El préstamo quedará marcado como cancelado y no podrá modificarse. ¿Deseas continuar?',
            confirmText: 'Sí, cancelar préstamo',
            confirmColor: '#ef4444',
            onConfirm: async () => {
                await cancelLoan(id);
                setConfirmConfig(null);
            }
        });
    };

    const handleDelete = (id) => {
        setConfirmConfig({
            title: 'Eliminar préstamo',
            message: 'Esta acción es permanente e irreversible. El préstamo y todos sus datos serán eliminados del sistema.',
            confirmText: 'Sí, eliminar',
            confirmColor: '#dc2626',
            onConfirm: async () => {
                await deleteLoan(id);
                setConfirmConfig(null);
            }
        });
    };

    const handleCloseModal = () => { setIsModalOpen(false); setLoanToEdit(null); };

    const headers = isAdmin
        ? ['Fecha', 'Tipo', 'Monto', 'Plazo', 'Cuota Mensual', 'Propósito', 'Estado', 'Acciones']
        : ['Fecha', 'Tipo', 'Monto', 'Plazo', 'Cuota Mensual', 'Propósito', 'Estado'];

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                        {isAdmin ? 'Préstamos' : 'Mis Préstamos'}
                    </h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                        {isAdmin ? 'Administra los préstamos del sistema.' : 'Gestiona y solicita préstamos desde tu cuenta NovaCoin.'}
                    </p>
                </div>
                <button
                    onClick={() => { setLoanToEdit(null); setIsModalOpen(true); }}
                    style={{ backgroundColor: '#00f2fe', color: '#050c18', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#00c8d4'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#00f2fe'}
                >
                    + Solicitar Préstamo
                </button>
            </div>

            {error && (
                <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '16px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #991b1b' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {loading && loans.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', color: '#00f2fe' }}>
                    <p>Cargando préstamos...</p>
                </div>
            ) : loans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#111827', borderRadius: '8px', border: '1px dashed #374151', color: '#9ca3af' }}>
                    <p style={{ margin: 0, fontSize: '16px' }}>No hay préstamos registrados.</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Solicita el primer préstamo con el botón de arriba.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: '#111827', borderRadius: '8px', border: '1px solid #1f2937', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}>
                                    {headers.map(h => (
                                        <th key={h} style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan, index) => {
                                    const estado    = loan.estadoPrestamo || loan.estado || 'PENDIENTE';
                                    const s         = statusStyle(estado);
                                    const t         = tipoStyle(loan.tipoPrestamo);
                                    const fecha     = loan.fechaSolicitud || loan.createdAt;
                                    const id        = loan._id || loan.id;
                                    const bloqueado = estado === 'CANCELADO' || estado === 'PAGADO';

                                    return (
                                        <tr key={id || index}
                                            style={{ borderBottom: '1px solid #1f2937', transition: 'background-color 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1f2937'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#e5e7eb' }}>{formatDate(fecha)}</td>
                                            <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: t.color }}>
                                                {loan.tipoPrestamo || '---'}
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '15px', fontWeight: '600', color: '#00f2fe' }}>{formatCurrency(loan.monto)}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#9ca3af' }}>{loan.plazoMeses} meses</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#34d399', fontWeight: '600' }}>{formatCurrency(loan.cuotaMensual)}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#9ca3af', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {loan.proposito || '---'}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                                                    {estado}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleOpenEdit(loan)}
                                                            disabled={bloqueado}
                                                            style={{
                                                                padding: '6px 14px', backgroundColor: 'transparent',
                                                                border: `1px solid ${bloqueado ? '#374151' : '#f59e0b'}`,
                                                                borderRadius: '6px', color: bloqueado ? '#4b5563' : '#f59e0b',
                                                                cursor: bloqueado ? 'not-allowed' : 'pointer', fontSize: '12px',
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(id)}
                                                            disabled={bloqueado}
                                                            style={{
                                                                padding: '6px 14px', backgroundColor: 'transparent',
                                                                border: `1px solid ${bloqueado ? '#374151' : '#ef4444'}`,
                                                                borderRadius: '6px', color: bloqueado ? '#4b5563' : '#ef4444',
                                                                cursor: bloqueado ? 'not-allowed' : 'pointer', fontSize: '12px',
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(id)}
                                                            style={{
                                                                padding: '6px 14px', backgroundColor: 'transparent',
                                                                border: '1px solid #6b7280', borderRadius: '6px',
                                                                color: '#6b7280', cursor: 'pointer', fontSize: '12px',
                                                            }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal crear/editar */}
            {isModalOpen && (
                <LoanModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={loanToEdit ? handleUpdateLoan : handleRequestLoan}
                    loanToEdit={loanToEdit}
                />
            )}

            {/* Modal confirmación */}
            {confirmConfig && (
                <ConfirmModal
                    isOpen={true}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmText={confirmConfig.confirmText}
                    confirmColor={confirmConfig.confirmColor}
                    onConfirm={confirmConfig.onConfirm}
                    onClose={() => setConfirmConfig(null)}
                />
            )}
        </div>
    );
};