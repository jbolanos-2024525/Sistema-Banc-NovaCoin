import { Cuenta } from './cuenta.model.js';

import {
    registrarDeposito,
    registrarRetiro,
    registrarTransferencia
} from '../Transaccion/transaccion.service.js';

export const createCuenta = async (accountData) => {
    const cuenta = new Cuenta(accountData);
    await cuenta.save();
    return cuenta;
};

export const getCuentas = async () => {
    return await Cuenta.find({ Estado: true }).sort({ createdAt: -1 });
};

export const getCuentaById = async (id) => {
    const cuenta = await Cuenta.findById(id);
    if (!cuenta) throw new Error('Cuenta no encontrada');
    return cuenta;
};

export const getCuentasByUsuario = async (usuarioId) => {
    return await Cuenta.find({ 
        IdUsuario: String(usuarioId), 
        Estado: true 
    }).sort({ createdAt: -1 });
};

export const updateCuenta = async (id, accountData) => {
    delete accountData.NumeroCuenta;
    delete accountData.IdUsuario;
    return await Cuenta.findByIdAndUpdate(id, accountData, { new: true });
};

export const deleteCuenta = async (id) => {
    return await Cuenta.findByIdAndUpdate(id, { Estado: false }, { new: true });
};

export const depositar = async (cuentaId, monto) => {

    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) throw new Error('Cuenta no encontrada');
    if (monto <= 0) throw new Error('Monto inválido');

    cuenta.Saldo += monto;
    await cuenta.save();
    await registrarDeposito(cuenta._id, monto, cuenta.Moneda);

    return cuenta;
};

export const retirar = async (cuentaId, monto) => {

    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta) throw new Error('Cuenta no encontrada');
    if (monto <= 0) throw new Error('Monto inválido');
    if (monto > cuenta.Saldo) throw new Error('Saldo insuficiente');

    cuenta.Saldo -= monto;
    await cuenta.save();
    await registrarRetiro(cuenta._id, monto, cuenta.Moneda);

    return cuenta;
};

export const transferir = async (cuentaOrigenId, cuentaDestinoId, monto) => {

    const origen  = await Cuenta.findById(cuentaOrigenId);
    const destino = await Cuenta.findById(cuentaDestinoId);

    if (!origen || !destino) throw new Error('Cuenta no encontrada');
    if (monto <= 0) throw new Error('Monto inválido');
    if (origen.Saldo < monto) throw new Error('Saldo insuficiente');

    origen.Saldo  -= monto;
    destino.Saldo += monto;

    await origen.save();
    await destino.save();
    await registrarTransferencia(origen._id, destino._id, monto, origen.Moneda);

    return { origen, destino };
};  