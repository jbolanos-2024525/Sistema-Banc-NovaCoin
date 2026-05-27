import React, { useState } from 'react';
import { useAdminAccount }   from '../hooks/useAdminAccount';
import { AdminAccounts }     from '../components/AdminAccounts';
import { AdminAccountModal } from '../components/AdminAccountModal';

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

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handleSubmit = async (formData) => {
        const result = selected
            ? await updateCuenta(selected._id, formData)
            : await createCuenta(formData);
        if (result.success) {
            closeModal();
            showSuccess(selected ? 'Cuenta actualizada correctamente' : 'Cuenta creada correctamente');
        }
    };

    // CORREGIDO: Recibe el objeto completo y extrae las propiedades de forma segura
    const handleDeleteClick = (cuenta) => {
        if (cuenta && cuenta._id) {
            setConfirm({ id: cuenta._id, numeroCuenta: cuenta.NumeroCuenta });
        } else {
            console.error("No se pudo obtener el ID de la cuenta para eliminar.");
        }
    };

    const handleConfirmDelete = async () => {
        if (confirm && confirm.id) {
            await deleteCuenta(confirm.id);
            setConfirm(null);
            showSuccess('Cuenta eliminada correctamente');
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

            {/* Mensaje de confirmación de eliminación */}
            {confirm && (
                <div style={{ backgroundColor: '#1a0f0f', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f3f4f6', fontSize: '14px' }}>
                        ¿Deseas eliminar la cuenta <strong style={{ color: '#ef4444' }}>{confirm.numeroCuenta}</strong>? Esta acción no se puede deshacer.
                    </span>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <button
                            onClick={() => setConfirm(null)}
                            style={{ padding: '7px 16px', backgroundColor: 'transparent', border: '1px solid #374151', borderRadius: '6px', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            style={{ padding: '7px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
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