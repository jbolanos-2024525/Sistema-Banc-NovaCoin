import React from 'react';

export const Account = ({ user, datosBancarios, formatCurrency }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      width: '100%',
      alignItems: 'start'
    }}>

      {/* Tarjeta Bancaria */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #050c18 100%)',
        borderRadius: '12px',
        padding: '28px',
        color: '#fff',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '220px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #1f2937'
      }}>
        {/* Decoración de fondo */}
        <div style={{
          position: 'absolute', right: '-30px', bottom: '-30px',
          width: '160px', height: '160px',
          background: 'rgba(0,242,254,0.05)',
          borderRadius: '50%', filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        {/* Top: tipo y número */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontSize: '10px', textTransform: 'uppercase',
              letterSpacing: '0.2em', color: '#00f2fe',
              fontWeight: '600', margin: 0
            }}>
              {datosBancarios?.tipoCuenta || 'Cuenta Corriente'}
            </p>
            <h2 style={{
              fontSize: '17px', fontFamily: 'monospace',
              marginTop: '10px', letterSpacing: '0.15em',
              color: '#e5e7eb', fontWeight: '500', margin: '8px 0 0 0'
            }}>
              {datosBancarios?.numeroCuenta}
            </h2>
          </div>
          <span style={{
            fontSize: '16px', fontWeight: '700',
            color: 'rgba(255,255,255,0.3)', letterSpacing: '-0.5px'
          }}>
            NovaCoin
          </span>
        </div>

        {/* Saldo */}
        <div>
          <p style={{
            fontSize: '10px', textTransform: 'uppercase',
            letterSpacing: '0.2em', color: '#9ca3af',
            fontWeight: '500', margin: '0 0 6px 0'
          }}>
            Saldo Disponible
          </p>
          <p style={{
            fontSize: '36px', fontWeight: '700',
            color: '#00f2fe', margin: 0, letterSpacing: '-0.5px'
          }}>
            {formatCurrency(datosBancarios?.saldoSimulado)}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: '11px',
          paddingTop: '12px', borderTop: '1px solid #1f2937',
          color: '#6b7280'
        }}>
          <span>
            Estado:{' '}
            <strong style={{ color: '#00f2fe', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}>
              {datosBancarios?.estado}
            </strong>
          </span>
          <span>Desde: {datosBancarios?.fechaApertura}</span>
        </div>
      </div>

      {/* Panel de Datos Oficiales */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
        border: '1px solid #1f2937'
      }}>
        {/* Título panel */}
        <h3 style={{
          fontSize: '12px', fontWeight: '600',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#9ca3af', borderBottom: '1px solid #1f2937',
          paddingBottom: '16px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 24px 0'
        }}>
          <span style={{ width: '3px', height: '14px', backgroundColor: '#00f2fe', borderRadius: '2px', display: 'inline-block' }} />
          Información Oficial del Titular
        </h3>

        {/* Campos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px 40px'
        }}>
          {[
            { label: 'Nombres',               value: user?.Nombre,        mono: false },
            { label: 'Apellidos',             value: user?.Apellido,      mono: false },
            { label: 'Nombre de Usuario',     value: `@${user?.NombreUsuario || 'Sin usuario'}`, mono: true, accent: true },
            { label: 'Número de Teléfono',    value: user?.Telefono,      mono: true  },
          ].map(({ label, value, mono, accent }) => (
            <div key={label}>
              <label style={{
                fontSize: '10px', fontWeight: '600',
                color: '#6b7280', display: 'block',
                textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '6px'
              }}>
                {label}
              </label>
              <p style={{
                fontSize: '16px',
                fontWeight: mono ? '500' : '600',
                fontFamily: mono ? 'monospace' : 'inherit',
                color: accent ? '#00f2fe' : '#e5e7eb',
                borderBottom: '1px solid #1f2937',
                paddingBottom: '8px', margin: 0
              }}>
                {value || 'No asignado'}
              </p>
            </div>
          ))}

          {/* Email span completo */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              fontSize: '10px', fontWeight: '600',
              color: '#6b7280', display: 'block',
              textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '6px'
            }}>
              Correo Electrónico Vinculado
            </label>
            <p style={{
              fontSize: '16px', fontWeight: '500',
              fontFamily: 'monospace', color: '#e5e7eb',
              borderBottom: '1px solid #1f2937',
              paddingBottom: '8px', margin: 0
            }}>
              {user?.Email || 'No asignado'}
            </p>
          </div>
        </div>

        {/* Footer panel */}
        <div style={{
          marginTop: '32px', paddingTop: '16px',
          borderTop: '1px solid #1f2937',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: '10px', color: '#4b5563'
        }}>
          <p style={{ margin: 0, letterSpacing: '0.05em' }}>
            © 2026 NovaCoin Bancaria S.A. — Canales Digitales Protegidos.
          </p>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#00f2fe', fontWeight: '600',
            letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '9px'
          }}>
            <span style={{
              width: '6px', height: '6px',
              backgroundColor: '#00f2fe', borderRadius: '50%'
            }} />
            Canal Seguro
          </span>
        </div>
      </div>

    </div>
  );
};