import { useEffect, useState } from 'react';
import { useEmployee }      from '../hooks/useEmployee';
import { EmployeeModal }    from '../components/employeeModal';
import { ConfirmModal }     from '../../../shared/components/ConfirmModal.jsx';

export const EmployeePage = () => {

    const { employees, loading, isModalOpen, selectedEmployee, fetchEmployees, openCreateModal, openEditModal, closeModal, handleSave, handleDelete } = useEmployee();

    const [confirmConfig, setConfirmConfig] = useState(null);
    const [pendingEmployeeData, setPendingEmployeeData] = useState(null);

    useEffect(() => { fetchEmployees(); }, []);

    const handleDeleteConfirm = (id) => {
        setConfirmConfig({
            title: 'Eliminar empleado',
            message: 'Esta acción es permanente e irreversible. El empleado será eliminado del sistema y no podrá recuperarse.',
            confirmText: 'Sí, eliminar',
            confirmColor: '#dc2626',
            onConfirm: async () => {
                await handleDelete(id);
                setConfirmConfig(null);
            },
            onClose: () => setConfirmConfig(null)
        });
    };

    const handleSaveConfirm = async (data) => {
        setPendingEmployeeData(data);
        if (selectedEmployee) {
            setConfirmConfig({
                title: 'Confirmar Actualización de Empleado',
                message: `¿Estás seguro de actualizar los datos del empleado ${data.Nombre} ${data.Apellido}?`,
                confirmText: 'Sí, Actualizar',
                confirmColor: '#f59e0b',
                onConfirm: async () => {
                    const result = await handleSave(data);
                    if (result) {
                        fetchEmployees();
                        setConfirmConfig(null);
                        setPendingEmployeeData(null);
                    }
                },
                onClose: () => setConfirmConfig(null)
            });
        } else {
            setConfirmConfig({
                title: 'Confirmar Registro de Empleado',
                message: `¿Estás seguro de registrar al empleado ${data.Nombre} ${data.Apellido} como ${data.Puesto}?`,
                confirmText: 'Sí, Registrar',
                confirmColor: '#00f2fe',
                onConfirm: async () => {
                    const result = await handleSave(data);
                    if (result) {
                        fetchEmployees();
                        setConfirmConfig(null);
                        setPendingEmployeeData(null);
                    }
                },
                onClose: () => setConfirmConfig(null)
            });
        }
    };

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Empleados</h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                        Administra el equipo de trabajo de NovaCoin.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    style={{ backgroundColor: '#00f2fe', color: '#050c18', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#00c8d4'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#00f2fe'}
                >
                    + Nuevo Empleado
                </button>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e5e7eb', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1f2937' }}>
                            {['Nombre', 'Apellido', 'Puesto', 'Email', 'Rol', 'Acciones'].map((h) => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && employees.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Cargando empleados...</td></tr>
                        ) : employees.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No hay empleados registrados</td></tr>
                        ) : (
                            employees.map((emp) => (
                                <tr key={emp._id} style={{ borderBottom: '1px solid #1f2937' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1f2937'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '14px 16px' }}>{emp.Nombre}</td>
                                    <td style={{ padding: '14px 16px' }}>{emp.Apellido}</td>
                                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{emp.Puesto}</td>
                                    <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{emp.Correo}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '4px 10px', backgroundColor: 'rgba(0,242,254,0.1)', color: '#00f2fe', borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                            {emp.Rol ? `${emp.Rol.toUpperCase()}_ROLE` : 'USER_ROLE'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>

                                            {/* Editar */}
                                            <button
                                                onClick={() => openEditModal(emp)}
                                                style={{
                                                    padding: '6px 14px',
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #f59e0b',
                                                    borderRadius: '6px',
                                                    color: '#f59e0b',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                Editar
                                            </button>


                                            {/* Eliminar */}
                                            <button
                                                onClick={() => handleDeleteConfirm(emp._id)}
                                                style={{
                                                    padding: '6px 14px',
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #dc2626',
                                                    borderRadius: '6px',
                                                    color: '#dc2626',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => {
                                                    e.target.style.backgroundColor = 'rgba(220,38,38,0.1)';
                                                    e.target.style.color = '#f87171';
                                                }}
                                                onMouseLeave={e => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = '#dc2626';
                                                }}
                                            >
                                                Eliminar
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveConfirm}
                loading={loading}
                employee={selectedEmployee}
            />

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