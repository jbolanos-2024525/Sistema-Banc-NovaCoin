import React from 'react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', confirmColor = '#ef4444' }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '12px',
                width: '100%', maxWidth: '420px',
                padding: '28px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
            }}>
                {/* Icono */}
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px', fontSize: '22px'
                }}>
                    ⚠️
                </div>

                <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                    {title}
                </h3>
                <p style={{ margin: '0 0 24px 0', color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }}>
                    {message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #374151', borderRadius: '6px',
                            padding: '10px 20px', color: '#9ca3af',
                            fontSize: '14px', fontWeight: '500', cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.target.style.borderColor = '#6b7280'}
                        onMouseLeave={e => e.target.style.borderColor = '#374151'}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: confirmColor,
                            border: 'none', borderRadius: '6px',
                            padding: '10px 20px', color: '#fff',
                            fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.85'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};