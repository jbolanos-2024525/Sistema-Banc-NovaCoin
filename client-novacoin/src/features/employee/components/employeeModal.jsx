import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const EmployeeModal = ({ isOpen, onClose, onSave, loading, employee }) => {
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

    // Limpieza estricta del DPI
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
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '12px' }}>
      <div style={{ backgroundColor: '#111827', color: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', width: '100%', maxWidth: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #1f2937' }}>
        
        <div style={{ padding: '20px 24px', background: 'linear-gradient(90deg, #b8860b 0%, #8B6914 100%)', color: 'white' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
            {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.85, margin: '4px 0 0' }}>Establece los parámetros requeridos para el perfil administrativo</p>
        </div>

        <form onSubmit={handleSubmit(submit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>Nombre</label>
              <input {...register('Nombre', { required: 'El nombre es obligatorio' })} type='text' style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              {errors.Nombre && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Nombre.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>Apellido</label>
              <input {...register('Apellido', { required: 'El apellido es obligatorio' })} type='text' style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              {errors.Apellido && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Apellido.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>DPI</label>
              <input {...register('DPI', { required: 'El DPI es obligatorio', minLength: { value: 13, message: 'Debe tener 13 dígitos' }, maxLength: { value: 13, message: 'Debe tener 13 dígitos' } })} type='text' style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              {errors.DPI && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.DPI.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>Correo</label>
              <input {...register('Correo', { required: 'El correo es obligatorio' })} type='email' style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              {errors.Correo && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Correo.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>Puesto</label>
              <input {...register('Puesto', { required: 'El puesto es obligatorio' })} type='text' style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              {errors.Puesto && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Puesto.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>Salario</label>
              <input {...register('Salario', { required: 'El salario es obligatorio', valueAsNumber: true })} type='number' step="0.01" style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
              {errors.Salario && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.Salario.message}</p>}
            </div>
          </div>

          {/* Ahora el Rol ocupa toda la fila ya que no tiene la contraseña a la par */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#9ca3af' }}>Rol</label>
              <select {...register('Rol')} style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}>
                <option value="Asesor">Asesor</option>
                <option value="Cajero">Cajero</option>
                <option value="Gerente">Gerente</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1f2937' }}>
            <button type='button' onClick={onClose} style={{ padding: '10px 18px', borderRadius: '8px', background: '#374151', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>Cancelar</button>
            <button type='submit' style={{ padding: '10px 22px', borderRadius: '8px', background: 'linear-gradient(90deg, #b8860b 0%, #8B6914 100%)', color: 'white', border: 'none', cursor: 'pointer' }}>
              {loading ? 'Procesando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};