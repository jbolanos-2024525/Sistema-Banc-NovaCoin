import { Cuenta } from './cuenta.model.js';

export const createCuenta = async (accountData) => {
    try {
        const cuenta = new Cuenta(accountData);
        await cuenta.save();
        return cuenta;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Ya existe una cuenta con estos datos');
        }
        throw error;
    }
};

const sanitizeFilters = (filters) => {
    const clean = {};
    const allowed = ['TipoCuenta', 'Moneda', 'EstadoCuenta', 'IdUsuario'];
    for (const key of allowed) {
        if (filters[key] !== undefined && typeof filters[key] === 'string') {
            clean[key] = filters[key];
        }
    }
    return clean;
};

export const getCuentas = async (filters = {}) => {
    const query = { Estado: true, ...sanitizeFilters(filters) };
    return await Cuenta.find(query)
        .sort({ createdAt: -1 })
        .lean();
};

export const getCuentaById = async (id) => {
    if (!id) throw new Error('ID de cuenta es requerido');
    
    const cuenta = await Cuenta.findById(id).lean();
    if (!cuenta) throw new Error('Cuenta no encontrada');
    
    return cuenta;
};

export const getCuentaByNumero = async (numeroCuenta) => {
    if (!numeroCuenta) throw new Error('Número de cuenta es requerido');
    
    const cuenta = await Cuenta.findOne({ NumeroCuenta: numeroCuenta }).lean();
    if (!cuenta) throw new Error('Cuenta no encontrada');
    
    return cuenta;
};

export const getCuentasByUsuario = async (usuarioId) => {
    if (!usuarioId) throw new Error('ID de usuario es requerido');
    
    return await Cuenta.find({ 
        IdUsuario: String(usuarioId), 
        Estado: true 
    })
    .sort({ createdAt: -1 })
    .lean();
};

export const updateCuenta = async (id, accountData) => {
    if (!id) throw new Error('ID de cuenta es requerido');
    
    const allowedUpdates = ['TipoCuenta', 'Moneda', 'LimiteRetiroDiario', 'EstadoCuenta'];
    const updates = {};
    
    for (const key of allowedUpdates) {
        if (accountData[key] !== undefined) {
            updates[key] = accountData[key];
        }
    }
    
    if (Object.keys(updates).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
    }
    
    const cuenta = await Cuenta.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
    );
    
    if (!cuenta) throw new Error('Cuenta no encontrada');
    
    return cuenta;
};

export const deleteCuenta = async (id) => {
    if (!id) throw new Error('ID de cuenta es requerido');
    
    const cuenta = await Cuenta.findByIdAndUpdate(
        id, 
        { Estado: false }, 
        { new: true }
    );
    
    if (!cuenta) throw new Error('Cuenta no encontrada');
    
    return cuenta;
};

export const depositar = async (cuentaId, monto, descripcion = 'Depósito') => {
    if (!cuentaId) throw new Error('ID de cuenta es requerido');
    if (!monto || monto <= 0) throw new Error('Monto inválido');
    
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) throw new Error('Cuenta no encontrada');
    if (cuenta.EstadoCuenta !== 'ACTIVA') throw new Error('La cuenta no está activa');
    
    cuenta.Saldo += monto;
    await cuenta.save();
    
    return cuenta;
};

export const retirar = async (cuentaId, monto, descripcion = 'Retiro') => {
    if (!cuentaId) throw new Error('ID de cuenta es requerido');
    if (!monto || monto <= 0) throw new Error('Monto inválido');
    
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) throw new Error('Cuenta no encontrada');
    if (cuenta.EstadoCuenta !== 'ACTIVA') throw new Error('La cuenta no está activa');
    if (monto > cuenta.Saldo) throw new Error('Saldo insuficiente');
    if (monto > cuenta.LimiteRetiroDiario) throw new Error('Monto excede el límite de retiro diario');
    
    cuenta.Saldo -= monto;
    await cuenta.save();
    
    return cuenta;
};

export const transferir = async (cuentaOrigenId, cuentaDestinoId, monto, descripcion = 'Transferencia') => {
    if (!cuentaOrigenId || !cuentaDestinoId) throw new Error('IDs de cuentas son requeridos');
    if (!monto || monto <= 0) throw new Error('Monto inválido');
    if (cuentaOrigenId === cuentaDestinoId) throw new Error('No se puede transferir a la misma cuenta');
    
    const origen = await Cuenta.findById(cuentaOrigenId);
    const destino = await Cuenta.findById(cuentaDestinoId);
    
    if (!origen || !destino) throw new Error('Cuenta no encontrada');
    if (origen.EstadoCuenta !== 'ACTIVA') throw new Error('La cuenta de origen no está activa');
    if (destino.EstadoCuenta !== 'ACTIVA') throw new Error('La cuenta de destino no está activa');
    if (origen.Saldo < monto) throw new Error('Saldo insuficiente');
    if (monto > origen.LimiteRetiroDiario) throw new Error('Monto excede el límite de retiro diario');
    
    origen.Saldo -= monto;
    destino.Saldo += monto;
    
    await origen.save();
    await destino.save();
    
    return { origen, destino };
};

export const cambiarEstadoCuenta = async (id, nuevoEstado) => {
    if (!id) throw new Error('ID de cuenta es requerido');
    if (!['ACTIVA', 'BLOQUEADA', 'CANCELADA'].includes(nuevoEstado)) {
        throw new Error('Estado no válido');
    }
    
    const cuenta = await Cuenta.findByIdAndUpdate(
        id,
        { EstadoCuenta: nuevoEstado },
        { new: true, runValidators: true }
    );
    
    if (!cuenta) throw new Error('Cuenta no encontrada');
    
    return cuenta;
};