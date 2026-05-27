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

  // ── Estilos reutilizables ────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#9ca3af',
    marginBottom: '6px',
  };

  const fieldErrorStyle = {
    color: '#f87171',
    fontSize: '12px',
    marginTop: '4px',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
      padding: '0 12px',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #10b981',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '672px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '18px',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Encabezado */}
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
            Nuevo Usuario
          </h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 20px' }}>
            Completa la información para registrar un nuevo usuario
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(submit)}
          style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}
        >

          {/* Nombre / Apellido */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                {...register('name', { required: 'El nombre es obligatorio' })}
                type="text"
                style={inputStyle}
              />
              {errors.name && <p style={fieldErrorStyle}>{errors.name.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input
                {...register('surname', { required: 'El apellido es obligatorio' })}
                type="text"
                style={inputStyle}
              />
              {errors.surname && <p style={fieldErrorStyle}>{errors.surname.message}</p>}
            </div>
          </div>

          {/* Username / Teléfono */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombre de Usuario</label>
              <input
                {...register('username', { required: 'El username es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                type="text"
                style={inputStyle}
              />
              {errors.username && <p style={fieldErrorStyle}>{errors.username.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                {...register('phone', { required: 'El teléfono es obligatorio', pattern: { value: /^[0-9]{8}$/, message: 'Debe ser 8 dígitos' } })}
                type="tel"
                style={inputStyle}
              />
              {errors.phone && <p style={fieldErrorStyle}>{errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              {...register('email', { required: 'El email es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' } })}
              type="email"
              style={inputStyle}
            />
            {errors.email && <p style={fieldErrorStyle}>{errors.email.message}</p>}
          </div>

          {/* Contraseñas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })}
                type="password"
                style={inputStyle}
              />
              {errors.password && <p style={fieldErrorStyle}>{errors.password.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input
                {...register('confirmPassword', { required: 'Confirma la contraseña', validate: { match: (v) => v === getValues('password') || 'Las contraseñas no coinciden' } })}
                type="password"
                style={inputStyle}
              />
              {errors.confirmPassword && <p style={fieldErrorStyle}>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          

          {/* Error global */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid #ef4444',
              color: '#f87171',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          {/* Botones */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '12px',
            paddingTop: '16px', borderTop: '1px solid #1f2937',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px 16px',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                color: '#030712',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};