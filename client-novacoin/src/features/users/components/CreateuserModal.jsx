import { useForm } from 'react-hook-form';

export const CreateuserModal = ({ isOpen, onClose, onCreate, loading, error }) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  if (!isOpen) return null;

  const submit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('surname', values.surname);
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('phone', values.phone);
    if (values.profilePicture?.[0]) {
      formData.append('profilePicture', values.profilePicture[0]);
    }

    const ok = await onCreate(formData);
    if (ok) {
      reset();
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '0 12px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '672px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <div style={{ padding: '20px 24px', background: 'linear-gradient(90deg, var(--dorado-principal, #b8860b) 0%, #8B6914 100%)', color: 'white' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Nuevo Usuario</h2>
          <p style={{ fontSize: '13px', opacity: 0.85, margin: '4px 0 0' }}>Completa la información para registrar un nuevo usuario</p>
        </div>

        <form onSubmit={handleSubmit(submit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Nombre</label>
              <input {...register('name', { required: 'El nombre es obligatorio' })} type='text' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
              {errors.name && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.name.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Apellido</label>
              <input {...register('surname', { required: 'El apellido es obligatorio' })} type='text' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
              {errors.surname && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.surname.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Nombre de Usuario</label>
              <input {...register('username', { required: 'El username es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} type='text' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
              {errors.username && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.username.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Teléfono</label>
              <input {...register('phone', { required: 'El teléfono es obligatorio', pattern: { value: /^[0-9]{8}$/, message: 'Debe ser 8 dígitos' } })} type='tel' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
              {errors.phone && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Email</label>
            <input {...register('email', { required: 'El email es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' } })} type='email' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
            {errors.email && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Contraseña</label>
              <input {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} type='password' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
              {errors.password && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Confirmar contraseña</label>
              <input {...register('confirmPassword', { required: 'Confirma la contraseña', validate: { match: (v) => v === getValues('password') || 'Las contraseñas no coinciden' } })} type='password' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
              {errors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Foto de Perfil</label>
            <input {...register('profilePicture')} type='file' accept='image/*' style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <button type='button' onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f3f4f6', border: 'none', cursor: 'pointer', color: '#4b5563' }}>
              Cancelar
            </button>
            <button type='submit' disabled={loading} style={{ padding: '8px 20px', borderRadius: '8px', background: 'linear-gradient(90deg, var(--dorado-principal, #b8860b) 0%, #8B6914 100%)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontWeight: 500 }}>
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};