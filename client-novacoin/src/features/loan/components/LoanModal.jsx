import React, { useState, useEffect } from 'react';

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

export const LoanModal = ({ isOpen, onClose, onConfirm, loanToEdit = null }) => {
    const isEditing = !!loanToEdit;

    const [monto,        setMonto]        = useState('');
    const [plazo,        setPlazo]        = useState('12');
    const [proposito,    setProposito]    = useState('');
    const [tipoPrestamo, setTipoPrestamo] = useState('PERSONAL');
    const [localError,   setLocalError]   = useState('');

    useEffect(() => {
        if (loanToEdit) {
            setMonto(loanToEdit.monto?.toString() || '');
            setPlazo(loanToEdit.plazoMeses?.toString() || '12');
            setProposito(loanToEdit.proposito || '');
            setTipoPrestamo(loanToEdit.tipoPrestamo || 'PERSONAL');
        } else {
            setMonto(''); setPlazo('12'); setProposito(''); setTipoPrestamo('PERSONAL');
        }
    }, [loanToEdit]);

    if (!isOpen) return null;

    const tasaAnual   = (loanToEdit?.tasaInteres ?? 15) / 100;
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
            tipoPrestamo,
            monto:      parseFloat(monto),
            plazoMeses: parseInt(plazo),
            proposito:  proposito.trim(),
        };

        // Solo enviar tasaInteres al crear, no al editar
        if (!isEditing) dto.tasaInteres = 15;

        if (onConfirm && typeof onConfirm === 'function') onConfirm(dto);
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
                    {isEditing ? 'Editar Préstamo' : 'Solicitar Préstamo'}
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

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Tipo de Préstamo</label>
                        <select value={tipoPrestamo} onChange={e => setTipoPrestamo(e.target.value)} style={inputStyle}>
                            <option value="PERSONAL">Personal</option>
                            <option value="HIPOTECARIO">Hipotecario</option>
                            <option value="VEHICULAR">Vehicular</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Monto (GTQ)</label>
                        <input type="number" step="0.01" placeholder="0.00"
                            value={monto} onChange={e => setMonto(e.target.value)}
                            style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Plazo</label>
                        <select value={plazo} onChange={e => setPlazo(e.target.value)} style={inputStyle}>
                            {['6','12','24','36','48','60'].map(m => (
                                <option key={m} value={m}>{m} meses</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Propósito del Préstamo</label>
                        <input type="text" placeholder="Ej. Compra de vehículo, negocio, estudios..."
                            value={proposito} onChange={e => setProposito(e.target.value)}
                            style={inputStyle} />
                    </div>

                    {monto && parseFloat(monto) > 0 && (
                        <div style={{
                            backgroundColor: `rgba(${isEditing ? '245,158,11' : '0,242,254'},0.05)`,
                            border: `1px solid rgba(${isEditing ? '245,158,11' : '0,242,254'},0.2)`,
                            borderRadius: '8px', padding: '14px',
                        }}>
                            <p style={{ margin: '0 0 6px 0', color: '#9ca3af', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
                                ESTIMADO MENSUAL
                            </p>
                            <p style={{ margin: 0, color: isEditing ? '#fbbf24' : '#00f2fe', fontSize: '24px', fontWeight: '700' }}>
                                Q {cuota.toFixed(2)}
                            </p>
                            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                                Tasa anual: {loanToEdit?.tasaInteres ?? 15}% · {plazo} cuotas
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                        <button type="button" onClick={onClose} style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #374151', borderRadius: '6px',
                            padding: '10px 16px', color: '#9ca3af',
                            fontSize: '14px', fontWeight: '500', cursor: 'pointer'
                        }}>Cancelar</button>
                        <button type="submit" style={{
                            backgroundColor: isEditing ? '#f59e0b' : '#00f2fe',
                            border: 'none', borderRadius: '6px',
                            padding: '10px 20px',
                            color: '#050c18', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                        }}>
                            {isEditing ? 'Guardar cambios' : 'Solicitar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};