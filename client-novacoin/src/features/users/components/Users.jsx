import { useEffect, useState } from 'react';
import { useUserManagementStore } from '../store/useUserManagementStore';
import { useAdminStore }          from '../store/adminStore';
import { CreateuserModal }        from './CreateuserModal';
import { ConfirmModal }           from '../../../shared/components/ConfirmModal';
import toast from 'react-hot-toast';

export const Users = () => {

    const { users, loading: loadingUsers, fetchUsers } = useUserManagementStore();
    const { loading: loadingCreate, error, createUser } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState(null);
    const [pendingUserData, setPendingUserData] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreate = async (formData) => {
        setPendingUserData(formData);
        setConfirmConfig({
            title: 'Confirmar Registro de Usuario',
            message: `¿Estás seguro de registrar al usuario ${formData.name} ${formData.surname} con email ${formData.email}?`,
            confirmText: 'Sí, Registrar',
            confirmColor: '#00f2fe',
            onConfirm: async () => {
                const result = await createUser(formData);
                if (result.success) {
                    if (result.emailVerificationRequired) {
                        toast.success('Usuario creado. Se envió un correo de verificación.');
                    } else {
                        toast.success('Usuario creado exitosamente.');
                    }
                    fetchUsers();
                    setIsModalOpen(false);
                } else {
                    toast.error(result.error || 'Error al crear usuario');
                }
                setConfirmConfig(null);
                setPendingUserData(null);
            },
            onClose: () => setConfirmConfig(null)
        });
    };

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>

            {/* Encabezado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Usuarios</h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                        Administra los usuarios registrados en NovaCoin.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: '#00f2fe', color: '#050c18', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,242,254,0.2)' }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#00c8d4'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#00f2fe'}
                >
                    + Nuevo Usuario
                </button>
            </div>

            {/* Tabla */}
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e5e7eb', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1f2937' }}>
                            {['Nombre', 'Apellido', 'Username', 'Email', 'Teléfono', 'Rol'].map((h) => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loadingUsers ? (
                            <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Cargando usuarios...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No hay usuarios registrados</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id || u.id} style={{ borderBottom: '1px solid #1f2937' }}>
                                    <td style={{ padding: '14px 16px' }}>{u.name}</td>
                                    <td style={{ padding: '14px 16px' }}>{u.surname}</td>
                                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#00f2fe' }}>{u.username}</td>
                                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{u.email}</td>
                                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{u.phone}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '4px 10px', backgroundColor: 'rgba(0,242,254,0.1)', color: '#00f2fe', borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CreateuserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
                loading={loadingCreate}
                error={error}
            />

            {/* Modal confirmación */}
            {confirmConfig && (
                <ConfirmModal
                    isOpen={true}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmText={confirmConfig.confirmText}
                    confirmColor={confirmConfig.confirmColor}
                    onConfirm={confirmConfig.onConfirm}
                    onClose={confirmConfig.onClose}
                />
            )}
        </div>
    );
};