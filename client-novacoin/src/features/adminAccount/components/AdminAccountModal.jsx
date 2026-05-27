import React, { useState, useEffect } from 'react';

const CREATE_FIELDS = [
    { label: 'ID del Usuario (UUID)', name: 'IdUsuario',          tag: 'input',  type: 'text',   placeholder: 'ej: 3fa85f64-5717-4562-b3fc-2c963f66afa6' },
    { label: 'Tipo de Cuenta',        name: 'TipoCuenta',         tag: 'select', options: ['AHORRO', 'MONETARIA', 'EMPRESARIAL'] },
    { label: 'Moneda',                name: 'Moneda',             tag: 'select', options: ['GTQ', 'USD'] },
    { label: 'Saldo Inicial',         name: 'Saldo',              tag: 'input',  type: 'number', placeholder: '0.00' },
    { label: 'Límite Retiro Diario',  name: 'LimiteRetiroDiario', tag: 'input',  type: 'number', placeholder: '5000' },
];

const EDIT_FIELDS = [
    { label: 'Tipo de Cuenta',       name: 'TipoCuenta',         tag: 'select', options: ['AHORRO', 'MONETARIA', 'EMPRESARIAL'] },
    { label: 'Moneda',               name: 'Moneda',             tag: 'select', options: ['GTQ', 'USD'] },
    { label: 'Saldo',                name: 'Saldo',              tag: 'input',  type: 'number', placeholder: '0.00' },
    { label: 'Límite Retiro Diario', name: 'LimiteRetiroDiario', tag: 'input',  type: 'number', placeholder: '5000' },
    { label: 'Estado Cuenta',        name: 'EstadoCuenta',       tag: 'select', options: ['ACTIVA', 'BLOQUEADA', 'CANCELADA'] },
];

const INITIAL = { IdUsuario: '', TipoCuenta: 'AHORRO', Moneda: 'GTQ', Saldo: 0, LimiteRetiroDiario: 5000 };

export const AdminAccountModal = ({ isOpen, onClose, selected, onSubmit, loading }) => {

    const [form, setForm] = useState(INITIAL);

    useEffect(() => {
        if (selected) {
            setForm({
                TipoCuenta:         selected.TipoCuenta         || 'AHORRO',
                Moneda:             selected.Moneda             || 'GTQ',
                Saldo:              selected.Saldo              ?? 0,
                LimiteRetiroDiario: selected.LimiteRetiroDiario ?? 5000,
                EstadoCuenta:       selected.EstadoCuenta       || 'ACTIVA',
            });
        } else {
            setForm(INITIAL);
        }
    }, [selected, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'Saldo' || name === 'LimiteRetiroDiario' ? parseFloat(value) || 0 : value
        }));
    };

    const inputStyle = { width: '100%', padding: '10px 12px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#f3f4f6', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
    const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' };

    const fields = selected ? EDIT_FIELDS : CREATE_FIELDS;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
                    <h2 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: '700' }}>
                        {selected ? 'Editar Cuenta' : 'Nueva Cuenta Bancaria'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                {selected && (
                    <div style={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#9ca3af' }}>
                        <strong style={{ color: '#00f2fe' }}>N°:</strong> {selected.NumeroCuenta}
                        <span style={{ margin: '0 12px', color: '#374151' }}>|</span>
                        <strong style={{ color: '#00f2fe' }}>Usuario:</strong> {selected.IdUsuario}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {fields.map(({ label, name, type, placeholder, tag, options }) => (
                            <div key={name}>
                                <label style={labelStyle}>{label}</label>
                                {tag === 'select' ? (
                                    <select name={name} value={form[name] || ''} onChange={handleChange} style={inputStyle}>
                                        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type={type} name={name} value={form[name] ?? ''} onChange={handleChange} placeholder={placeholder} style={inputStyle} required />
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #374151', borderRadius: '8px', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} style={{ padding: '10px 24px', backgroundColor: loading ? '#1f2937' : '#00f2fe', border: 'none', borderRadius: '8px', color: loading ? '#9ca3af' : '#0d1117', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700' }}>
                            {loading ? 'Guardando...' : selected ? 'Actualizar' : 'Crear Cuenta'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};