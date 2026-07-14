import React, { useState } from 'react';
import { useAdminAccount }   from '../hooks/useAdminAccount';
import { AdminAccounts }     from '../components/AdminAccounts';
import { AdminAccountModal } from '../components/AdminAccountModal';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';

export const AdminAccountPage = () => {

    const {
        cuentas, loading, error,
        selected, showModal,
        openCreate, openEdit, closeModal,
        createCuenta, updateCuenta, deleteCuenta,
        fetchCuentas,
        filterUsuarioId, setFilterUsuarioId,
        handleFilterByUsuario, handleClearFilter,
        formatCurrency, clearError
    } = useAdminAccount();

    const [confirm, setConfirm] = useState(null); // Estado para confirmación: { id, numeroCuenta }
    const [successMsg, setSuccessMsg] = useState(null);
    const [pendingAccountData, setPendingAccountData] = useState(null);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handleSubmit = async (formData) => {
        setPendingAccountData(formData);
        if (selected) {
            setConfirm({
                title: 'Confirmar Actualización de Cuenta',
                message: '¿Estás seguro de actualizar los datos de esta cuenta?',
                confirmText: 'Sí, Actualizar',
                confirmColor: '#f59e0b',
                onConfirm: async () => {
                    const result = await updateCuenta(selected._id, formData);
                    if (result.success) {
                        closeModal();
                        showSuccess('Cuenta actualizada correctamente');
                    }
                    setConfirm(null);
                    setPendingAccountData(null);
                },
                onClose: () => setConfirm(null)
            });
        } else {
            setConfirm({
                title: 'Confirmar Creación de Cuenta',
                message: `¿Estás seguro de crear una cuenta ${formData.TipoCuenta} con saldo inicial de ${formData.Saldo}?`,
                confirmText: 'Sí, Crear',
                confirmColor: '#00f2fe',
                onConfirm: async () => {
                    const result = await createCuenta(formData);
                    if (result.success) {
                        closeModal();
                        showSuccess('Cuenta creada correctamente');
                    }
                    setConfirm(null);
                    setPendingAccountData(null);
                },
                onClose: () => setConfirm(null)
            });
        }
    };

    // CORREGIDO: Recibe el objeto completo y extrae las propiedades de forma segura
    const handleDeleteClick = (cuenta) => {
        if (cuenta && cuenta._id) {
            setConfirm({
                title: 'Eliminar Cuenta',
                message: `¿Estás seguro de eliminar la cuenta ${cuenta.NumeroCuenta}? Esta acción es permanente e irreversible.`,
                confirmText: 'Sí, Eliminar',
                confirmColor: '#dc2626',
                onConfirm: async () => {
                    await deleteCuenta(cuenta._id);
                    setConfirm(null);
                    showSuccess('Cuenta eliminada correctamente');
                },
                onClose: () => setConfirm(null)
            });
        } else {
            console.error("No se pudo obtener el ID de la cuenta para eliminar.");
        }
    };

    const inputStyle = { flex: 1, minWidth: '260px', padding: '8px 12px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#f3f4f6', fontSize: '13px', outline: 'none' };
    const btnStyle   = (color = '#374151') => ({ padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${color}`, borderRadius: '6px', color: color === '#374151' ? '#e5e7eb' : color, cursor: 'pointer', fontSize: '13px' });

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>

            {/* Encabezado */}
            <div style={{ marginBottom: '24px', borderBottom: '1px solid #1f2937', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Gestión de Cuentas</h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Crear, editar y administrar cuentas bancarias de los usuarios.</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', backgroundColor: '#00f2fe', border: 'none', borderRadius: '8px', color: '#0d1117', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                    + Nueva Cuenta
                </button>
            </div>

            {/* Mensaje de éxito */}
            {successMsg && (
                <div style={{ backgroundColor: 'rgba(0,242,254,0.1)', border: '1px solid #00f2fe', borderRadius: '8px', padding: '12px 16px', color: '#00f2fe', fontSize: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    ✓ {successMsg}
                </div>
            )}

            {/* Modal confirmación */}
            {confirm && (
                <ConfirmModal
                    isOpen={true}
                    title={confirm.title}
                    message={confirm.message}
                    confirmText={confirm.confirmText}
                    confirmColor={confirm.confirmColor}
                    onConfirm={confirm.onConfirm}
                    onClose={confirm.onClose}
                />
            )}

            {/* Filtro por Usuario */}
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Filtrar por ID de Usuario:
                </label>
                <input
                    type="text"
                    placeholder="UUID del usuario..."
                    value={filterUsuarioId}
                    onChange={(e) => setFilterUsuarioId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterByUsuario()}
                    style={inputStyle}
                />
                <button onClick={handleFilterByUsuario} style={{ ...btnStyle(), backgroundColor: '#374151' }}>Buscar</button>
                <button onClick={handleClearFilter}     style={btnStyle()}>Limpiar</button>
                <button onClick={fetchCuentas}          style={btnStyle()}>↻</button>
            </div>

            {/* Error */}
            {error && (
                <div style={{ backgroundColor: '#1f1010', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px 16px', color: '#ef4444', fontSize: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {error}
                    <button onClick={clearError} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                </div>
            )}

            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                {loading ? 'Cargando...' : `${cuentas.length} cuenta(s) encontrada(s)`}
            </div>

            {/* Tabla */}
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
                <AdminAccounts
                    cuentas={cuentas}
                    loading={loading}
                    onEdit={openEdit}
                    onDelete={handleDeleteClick}
                    formatCurrency={formatCurrency}
                />
            </div>

            {/* Modal */}
            <AdminAccountModal isOpen={showModal} onClose={closeModal} selected={selected} onSubmit={handleSubmit} loading={loading} />

        </div>
    );
};