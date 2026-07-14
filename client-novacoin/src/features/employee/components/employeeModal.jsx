import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const inputStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '6px',
  padding: '10px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const labelStyle = { fontSize: '13px', color: '#9ca3af', fontWeight: '500' };

export const EmployeeModal = ({ isOpen, onClose, onSave, loading, employee }) => {
  const isEditing = !!employee;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        reset({
          Nombre: employee.Nombre,
          Apellido: employee.Apellido,
          DPI: employee.DPI,
          Correo: employee.Correo,
          Telefono: employee.Telefono || '',
          Puesto: employee.Puesto,
          Salario: employee.Salario,
          Rol: employee.Rol || 'Asesor'
        });
      } else {
        reset({
          Nombre: '', 
          Apellido: '', 
          DPI: '', 
          Correo: '',
          Telefono: '',
          Puesto: '', 
          Salario: '', 
          Rol: 'Asesor'
        });
      }
    }
  }, [isOpen, employee, reset]);

  if (!isOpen) return null;

  const submit = async (values) => {
    const payload = { ...values };

    if (payload.DPI) {
      payload.DPI = payload.DPI.trim();
    }

    if (!employee) {
      payload.isActive = true;
      payload.isVerified = true;
    }

    await onSave(payload);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: `1px solid ${isEditing ? '#f59e0b' : '#00f2fe'}`,
        borderRadius: '12px',
        width: '100%', maxWidth: '500px',
        padding: '28px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        <button onClick={onClose} type="button" style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none',
          color: '#9ca3af', fontSize: '18px', cursor: 'pointer'
        }}>✕</button>

        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '20px', fontWeight: '600' }}>
          {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h3>

        <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Nombre</label>
              <input {...register('Nombre', { required: 'El nombre es obligatorio' })} type='text' style={inputStyle} />
              {errors.Nombre && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Nombre.message}</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Apellido</label>
              <input {...register('Apellido', { required: 'El apellido es obligatorio' })} type='text' style={inputStyle} />
              {errors.Apellido && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Apellido.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>DPI</label>
              <input {...register('DPI', { required: 'El DPI es obligatorio', minLength: { value: 13, message: 'Debe tener 13 dígitos' }, maxLength: { value: 13, message: 'Debe tener 13 dígitos' } })} type='text' style={inputStyle} />
              {errors.DPI && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.DPI.message}</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Correo</label>
              <input {...register('Correo', { required: 'El correo es obligatorio' })} type='email' style={inputStyle} />
              {errors.Correo && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Correo.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Puesto</label>
              <select {...register('Puesto', { required: 'El puesto es obligatorio' })} style={inputStyle}>
                <option value="">Seleccionar...</option>
                <option value="Asesor">Asesor</option>
                <option value="Cajero">Cajero</option>
                <option value="Gerente">Gerente</option>
                <option value="Administrador">Administrador</option>
              </select>
              {errors.Puesto && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Puesto.message}</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Salario</label>
              <input {...register('Salario', { required: 'El salario es obligatorio', valueAsNumber: true })} type='number' step="0.01" style={inputStyle} />
              {errors.Salario && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Salario.message}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Teléfono</label>
            <input {...register('Telefono', { required: 'El teléfono es obligatorio', minLength: { value: 8, message: 'Debe tener 8 dígitos' }, maxLength: { value: 8, message: 'Debe tener 8 dígitos' } })} type='text' style={inputStyle} />
            {errors.Telefono && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Telefono.message}</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Rol</label>
            <select {...register('Rol')} style={inputStyle}>
              <option value="Asesor">Asesor</option>
              <option value="Cajero">Cajero</option>
              <option value="Gerente">Gerente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
            <button type='button' onClick={onClose} style={{
              backgroundColor: 'transparent',
              border: '1px solid #374151', borderRadius: '6px',
              padding: '10px 16px', color: '#9ca3af',
              fontSize: '14px', fontWeight: '500', cursor: 'pointer'
            }}>Cancelar</button>
            <button type='submit' style={{
              backgroundColor: isEditing ? '#f59e0b' : '#00f2fe',
              border: 'none', borderRadius: '6px',
              padding: '10px 20px',
              color: '#050c18', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              {loading ? 'Procesando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};