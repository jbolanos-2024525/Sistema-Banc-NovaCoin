import React from 'react';

export const TransactionsList = ({ transactions, isAdmin = false, onEdit, onDelete, onCancel }) => {
  
  // Función para dar formato de moneda local de Guatemala (Q0.00)
  const formatCurrency = (amount, currency = 'GTQ') => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Función para formatear cualquier variante de string de fecha válida
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return 'Fecha inválida';

    return date.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px',
        backgroundColor: '#111827',
        borderRadius: '8px',
        border: '1px dashed #374151',
        color: '#9ca3af'
      }}>
        <p style={{ margin: 0, fontSize: '16px' }}>No se encontraron transacciones registradas.</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
          Las operaciones que realices aparecerán en esta sección.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#111827',
      borderRadius: '8px',
      border: '1px solid #1f2937',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>Fecha y Hora</th>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>Tipo</th>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>No. de Cuenta</th>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>Descripción</th>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>Moneda</th>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Monto</th>
              <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>Estado</th>
              {isAdmin && <th style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600', fontSize: '14px' }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              // Extracción flexible de propiedades (PascalCase y minúsculas)
              const tipoTransaccion = tx.TipoTransaccion || tx.tipoTransaccion;
              const isTransferencia = tipoTransaccion === 'TRANSFERENCIA';
              const isRetiro = tipoTransaccion === 'RETIRO';
              
              const realDate = tx.fecha || tx.Fecha || tx.fechaCreacion || tx.FechaCreacion || tx.createdAt || tx.CreatedAt;
              const numeroCuenta = tx.CuentaDestino || tx.cuentaDestino || tx.CuentaOrigen || tx.cuentaOrigen || tx.NumeroCuenta || tx.numeroCuenta || null;
              const descripcion = tx.Descripcion || tx.descripcion || 'Sin descripción';
              const moneda = tx.Moneda || tx.moneda || 'GTQ';
              const monto = tx.Monto || tx.monto;
              const estado = tx.EstadoTransaccion || tx.estadoTransaccion || 'COMPLETADA';
              
              const estadoStyle = {
                COMPLETADA: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
                PENDIENTE: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
                FALLIDA: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
                CANCELADA: { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', border: 'rgba(107, 114, 128, 0.3)' }
              };
              const s = estadoStyle[estado] || estadoStyle.COMPLETADA;

              return (
                <tr 
                  key={tx.id || index} 
                  style={{ 
                    borderBottom: '1px solid #1f2937',
                    transition: 'background-color 0.15s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px', fontSize: '14px', color: '#e5e7eb' }}>
                    {formatDate(realDate)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: isTransferencia ? 'rgba(59, 130, 246, 0.15)' : isRetiro ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: isTransferencia ? '#60a5fa' : isRetiro ? '#f87171' : '#34d399',
                      border: isTransferencia ? '1px solid rgba(59, 130, 246, 0.3)' : isRetiro ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      {tipoTransaccion}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', fontFamily: 'monospace', color: '#a5b4fc', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {numeroCuenta
                      ? <span style={{
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          borderRadius: '6px',
                          padding: '2px 8px'
                        }}>{numeroCuenta}</span>
                      : <span style={{ color: '#4b5563' }}>---</span>
                    }
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#9ca3af', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {descripcion}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#9ca3af' }}>
                    {moneda}
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    textAlign: 'right',
                    color: (isTransferencia || isRetiro) ? '#f87171' : '#34d399'
                  }}>
                    {(isTransferencia || isRetiro) ? '- ' : '+ '}
                    {formatCurrency(monto, moneda)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      backgroundColor: s.bg, 
                      color: s.color, 
                      border: `1px solid ${s.border}` 
                    }}>
                      {estado}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => onEdit && onEdit(tx)}
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
                        <button
                          onClick={() => onCancel && onCancel(tx._id || tx.id)}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: 'transparent',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(tx._id || tx.id)}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: 'transparent',
                            border: '1px solid #6b7280',
                            borderRadius: '6px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};