import { Cuenta } from './cuenta.model.js';
import {
    createRecord,
    findById,
    findAll,
    updateRecord,
    softDelete,
    changeStatus
} from '../../utils/serviceHelpers.js';

const ENTITY = 'cuenta';

export const createCuenta = (data) => createRecord(Cuenta, data, ENTITY);

export const getCuentas = (filters = {}) => findAll(Cuenta, filters);

export const getCuentaById = (id) => findById(Cuenta, id, ENTITY);

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

export const updateCuenta = (id, data) =>
    updateRecord(Cuenta, id, data, ['TipoCuenta', 'Moneda', 'LimiteRetiroDiario', 'EstadoCuenta'], ENTITY);

export const deleteCuenta = (id) => softDelete(Cuenta, id, ENTITY);

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

export const cambiarEstadoCuenta = (id, nuevoEstado) =>
    changeStatus(Cuenta, id, nuevoEstado, ['ACTIVA', 'BLOQUEADA', 'CANCELADA'], 'EstadoCuenta', ENTITY);
