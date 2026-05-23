import React, { useState } from 'react';

// Agregamos variantes comunes de props en la destructuración para que no falle jamás
export const TransactionsModal = ({ isOpen, onClose, onConfirm, onSave, onSubmit }) => {
  const [tipoTransaccion, setTipoTransaccion] = useState('TRANSFERENCIA');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('GTQ');
  const [descripcion, setDescripcion] = useState('');
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    // Validación: Si es transferencia, el UUID de destino es obligatorio
    if (tipoTransaccion === 'TRANSFERENCIA' && !cuentaDestino.trim()) {
      setLocalError('El UUID de la cuenta destino es obligatorio.');
      return;
    }

    if (parseFloat(monto) <= 0 || !monto) {
      setLocalError('El monto debe ser mayor a cero.');
      return;
    }

    // Estructura limpia que espera el backend en C#
    const dto = {
      tipoTransaccion,
      monto: parseFloat(monto),
      moneda,
      descripcion,
      cuentaDestino: tipoTransaccion === 'TRANSFERENCIA' ? cuentaDestino.trim() : null,
      cuentaOrigen: null 
    };

    // 💡 Detector inteligente de funciones pasadas por el componente padre
    const handleSaveAction = onConfirm || onSave || onSubmit;

    if (handleSaveAction && typeof handleSaveAction === 'function') {
      handleSaveAction(dto);
    } else {
      console.error("No se detectó ninguna función de envío válida pasada desde la vista principal.");
      setLocalError("Error interno: No se pudo enlazar la acción de guardado.");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #10b981',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '480px',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        
        {/* Botón Cerrar (X) */}
        <button 
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '20px', fontWeight: '600' }}>
          Nueva Operación
        </h3>

        {localError && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Tipo de Transacción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>Tipo de Transacción</label>
            <select 
              value={tipoTransaccion} 
              onChange={(e) => setTipoTransaccion(e.target.value)}
              style={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              <option value="DEPOSITO">DEPOSITO</option>
              <option value="RETIRO">RETIRO</option>
            </select>
          </div>

          {/* UUID Cuenta Destino */}
          {tipoTransaccion === 'TRANSFERENCIA' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>UUID Cuenta Destino</label>
              <input 
                type="text" 
                placeholder="00000000-0000-0000-0000-000000000002"
                value={cuentaDestino}
                onChange={(e) => setCuentaDestino(e.target.value)}
                required
                style={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Fila de Monto y Moneda */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>Monto</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
                style={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>Moneda</label>
              <select 
                value={moneda} 
                onChange={(e) => setMoneda(e.target.value)}
                style={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="GTQ">GTQ (Q)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>Descripción / Concepto</label>
            <input 
              type="text" 
              placeholder="Ej. Pago de servicios locales"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
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
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                color: '#030712',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Confirmar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};