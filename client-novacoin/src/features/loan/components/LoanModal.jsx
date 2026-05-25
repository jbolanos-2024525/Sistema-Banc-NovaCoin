import React, { useState } from 'react';

export const LoanModal = ({ isOpen, onClose, onConfirm }) => {
    const [monto, setMonto] = useState('');
    const [plazo, setPlazo] = useState('12');
    const [proposito, setProposito] = useState('');
    const [localError, setLocalError] = useState('');

    if (!isOpen) return null;

    const tasaAnual = 0.15;
    const tasaMensual = tasaAnual / 12;
    const cuota = monto && plazo
        ? (parseFloat(monto) * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -parseInt(plazo)))
        : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError('');

        if (!monto || parseFloat(monto) <= 0) {
            setLocalError('El monto debe ser mayor a cero.');
            return;
        }
        if (!proposito.trim()) {
            setLocalError('El propósito del préstamo es obligatorio.');
            return;
        }

        const dto = {
            monto: parseFloat(monto),
            plazoMeses: parseInt(plazo),
            proposito: proposito.trim(),
            tasaInteres: tasaAnual,
        };

        if (onConfirm && typeof onConfirm === 'function') {
            onConfirm(dto);
        }
    };

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

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: '#111827',
                border: '1px solid #00f2fe',
                borderRadius: '12px',
                width: '100%', maxWidth: '500px',
                padding: '28px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                position: 'relative'
            }}>
                {/* Cerrar */}
                <button onClick={onClose} type="button" style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'none', border: 'none',
                    color: '#9ca3af', fontSize: '18px', cursor: 'pointer'
                }}>✕</button>

                <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '20px', fontWeight: '600' }}>
                    Solicitar Préstamo
                </h3>

                {localError && (
                    <div style={{
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        border: '1px solid #ef4444',
                        color: '#f87171', padding: '10px',
                        borderRadius: '6px', fontSize: '13px', marginBottom: '16px'
                    }}>
                        {localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Monto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Monto a Solicitar (GTQ)</label>
                        <input type="number" step="0.01" placeholder="0.00"
                            value={monto} onChange={(e) => setMonto(e.target.value)}
                            required style={inputStyle} />
                    </div>

                    {/* Plazo */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Plazo</label>
                        <select value={plazo} onChange={(e) => setPlazo(e.target.value)} style={inputStyle}>
                            <option value="6">6 meses</option>
                            <option value="12">12 meses</option>
                            <option value="24">24 meses</option>
                            <option value="36">36 meses</option>
                            <option value="48">48 meses</option>
                            <option value="60">60 meses</option>
                        </select>
                    </div>

                    {/* Propósito */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Propósito del Préstamo</label>
                        <input type="text" placeholder="Ej. Compra de vehículo, negocio, estudios..."
                            value={proposito} onChange={(e) => setProposito(e.target.value)}
                            required style={inputStyle} />
                    </div>

                    {/* Simulación de cuota */}
                    {monto && parseFloat(monto) > 0 && (
                        <div style={{
                            backgroundColor: 'rgba(0,242,254,0.05)',
                            border: '1px solid rgba(0,242,254,0.2)',
                            borderRadius: '8px', padding: '14px',
                        }}>
                            <p style={{ margin: '0 0 6px 0', color: '#9ca3af', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
                                ESTIMADO MENSUAL
                            </p>
                            <p style={{ margin: 0, color: '#00f2fe', fontSize: '24px', fontWeight: '700' }}>
                                Q {cuota.toFixed(2)}
                            </p>
                            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                                Tasa anual: 15% · {plazo} cuotas
                            </p>
                        </div>
                    )}

                    {/* Botones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                        <button type="button" onClick={onClose} style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #374151',
                            borderRadius: '6px', padding: '10px 16px',
                            color: '#9ca3af', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
                        }}>Cancelar</button>
                        <button type="submit" style={{
                            backgroundColor: '#00f2fe',
                            border: 'none', borderRadius: '6px',
                            padding: '10px 20px',
                            color: '#050c18', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                        }}>Solicitar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};