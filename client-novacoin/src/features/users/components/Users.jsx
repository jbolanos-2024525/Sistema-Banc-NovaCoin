import { useEffect, useState } from 'react';
import { useUserManagementStore } from '../store/useUserManagementStore';
import { useAdminStore } from '../store/adminStore';
import { CreateuserModal } from './CreateuserModal';
import toast from 'react-hot-toast';

export const Users = () => {
  const { users, loading: loadingUsers, fetchUsers } = useUserManagementStore();
  const { loading: loadingCreate, error, createUser } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (formData) => {
    const result = await createUser(formData);
    console.log('RESULTADO:', result);
    if (result.success) {
      if (result.emailVerificationRequired) {
        toast.success('Usuario creado. Se envió un correo de verificación.');
      } else {
        toast.success('Usuario creado exitosamente.');
      }
      fetchUsers();
      return true;
    } else {
      toast.error(result.error || 'Error al crear usuario');
      return false;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Usuarios</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '8px 18px', background: 'linear-gradient(90deg, var(--dorado-principal, #b8860b) 0%, #8B6914 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          + Nuevo Usuario
        </button>
      </div>

      {loadingUsers ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Nombre', 'Apellido', 'Username', 'Email', 'Teléfono', 'Rol'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No hay usuarios registrados</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id || u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>{u.name}</td>
                    <td style={{ padding: '12px 16px' }}>{u.surname}</td>
                    <td style={{ padding: '12px 16px' }}>{u.username}</td>
                    <td style={{ padding: '12px 16px' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>{u.phone}</td>
                    <td style={{ padding: '12px 16px' }}>{u.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <CreateuserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        loading={loadingCreate}
        error={error}
      />
    </div>
  );
};