
import { useEffect } from 'react';
import { useEmployee } from '../hooks/useEmployee';
import { EmployeeModal } from '../components/employeeModal';

export const EmployeePage = () => {
  const {
    employees,
    loading,
    isModalOpen,
    selectedEmployee,
    fetchEmployees,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
  } = useEmployee();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Empleados</h1>
        <button
          onClick={openCreateModal}
          style={{ padding: '10px 20px', background: 'linear-gradient(90deg, #b8860b 0%, #8B6914 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Nuevo Empleado
        </button>
      </div>

      {/* Tabla estilo NovaCoin */}
      <div style={{ backgroundColor: '#0b1320', borderRadius: '16px', padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f1f5f9', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              {['Nombre', 'Apellido', 'Puesto', 'Email', 'Rol', 'Acciones'].map((h) => (
                <th key={h} style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && employees.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Cargando...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No hay empleados registrados</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} style={{ borderBottom: '1px solid #131c2e' }}>
                  <td style={{ padding: '16px 20px' }}>{emp.Nombre}</td>
                  <td style={{ padding: '16px 20px' }}>{emp.Apellido}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{emp.Puesto}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{emp.Correo}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ backgroundColor: 'rgba(184, 134, 11, 0.15)', color: '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(184, 134, 11, 0.3)' }}>
                      {emp.Rol ? `${emp.Rol.toUpperCase()}_ROLE` : 'USER_ROLE'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(emp)} style={{ background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Editar</button>
                      <button onClick={() => handleDelete(emp._id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Eliminar</button>
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
        onSave={handleSave}
        loading={loading}
        employee={selectedEmployee}
      />
    </div>
  );
};