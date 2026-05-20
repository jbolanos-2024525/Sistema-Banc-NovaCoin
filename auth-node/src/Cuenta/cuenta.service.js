import { Cuenta } from './cuenta.model.js';

import { Cliente } from '../Cliente/cliente.model.js';

import {

    registrarDeposito,
    registrarRetiro,
    registrarTransferencia

} from '../Transaccion/transaccion.service.js';

// GENERAR NÚMERO DE CUENTA
const generarNumeroCuenta = async () => {

    const hoy = new Date();

    const fecha = `${hoy.getFullYear()}${String(
        hoy.getMonth() + 1
    ).padStart(2, '0')}${String(
        hoy.getDate()
    ).padStart(2, '0')}`;

    let numeroCuenta;
    let existe = true;

    while (existe) {

        const aleatorio = Math.floor(
            100000 + Math.random() * 900000
        );

        numeroCuenta = `NC-${fecha}-${aleatorio}`;

        existe = await Cuenta.findOne({
            NumeroCuenta: numeroCuenta
        });

    }

    return numeroCuenta;

};

// CREAR CUENTA
export const createCuenta = async (
    accountData
) => {

    const cliente = await Cliente.findById(
        accountData.IdCliente
    );

    if (!cliente) {
        throw new Error('Cliente no existe');
    }

    if (!accountData.NumeroCuenta) {

        accountData.NumeroCuenta =
            await generarNumeroCuenta();

    }

    const cuenta = new Cuenta(accountData);

    await cuenta.save();

    return cuenta;

};

// OBTENER TODAS
export const getCuentas = async () => {

    return await Cuenta.find({
        Estado: true
    })

    .populate('IdCliente')

    .sort({
        createdAt: -1
    });

};

// OBTENER POR ID
export const getCuentaById = async (
    id
) => {

    const cuenta = await Cuenta.findById(id)

    .populate('IdCliente');

    if (!cuenta) {
        throw new Error('Cuenta no encontrada');
    }

    return cuenta;

};

// OBTENER CUENTAS CLIENTE
export const getCuentasByCliente = async (
    clienteId
) => {

    return await Cuenta.find({

        IdCliente: clienteId,
        Estado: true

    }).sort({

        createdAt: -1

    });

};

// ACTUALIZAR
export const updateCuenta = async (
    id,
    accountData
) => {

    delete accountData.NumeroCuenta;

    return await Cuenta.findByIdAndUpdate(
        id,
        accountData,
        {
            new: true
        }
    );

};

// ELIMINAR
export const deleteCuenta = async (
    id
) => {

    return await Cuenta.findByIdAndUpdate(

        id,

        {
            Estado: false
        },

        {
            new: true
        }

    );

};

// DEPÓSITO
export const depositar = async (
    cuentaId,
    monto
) => {

    const cuenta = await Cuenta.findById(
        cuentaId
    );

    if (!cuenta) {
        throw new Error(
            'Cuenta no encontrada'
        );
    }

    if (monto <= 0) {
        throw new Error(
            'Monto inválido'
        );
    }

    cuenta.Saldo += monto;

    await cuenta.save();

    // REGISTRAR TRANSACCIÓN
    await registrarDeposito(

        cuenta._id,
        monto,
        cuenta.Moneda

    );

    return cuenta;

};

// RETIRO
export const retirar = async (
    cuentaId,
    monto
) => {

    const cuenta = await Cuenta.findById(
        cuentaId
    );

    if (!cuenta) {
        throw new Error(
            'Cuenta no encontrada'
        );
    }

    if (monto <= 0) {
        throw new Error(
            'Monto inválido'
        );
    }

    if (monto > cuenta.Saldo) {
        throw new Error(
            'Saldo insuficiente'
        );
    }

    cuenta.Saldo -= monto;

    await cuenta.save();

    // REGISTRAR TRANSACCIÓN
    await registrarRetiro(

        cuenta._id,
        monto,
        cuenta.Moneda

    );

    return cuenta;

};

// TRANSFERENCIA
export const transferir = async (

    cuentaOrigenId,
    cuentaDestinoId,
    monto

) => {

    const origen = await Cuenta.findById(
        cuentaOrigenId
    );

    const destino = await Cuenta.findById(
        cuentaDestinoId
    );

    if (!origen || !destino) {
        throw new Error(
            'Cuenta no encontrada'
        );
    }

    if (monto <= 0) {
        throw new Error(
            'Monto inválido'
        );
    }

    if (origen.Saldo < monto) {
        throw new Error(
            'Saldo insuficiente'
        );
    }

    origen.Saldo -= monto;

    destino.Saldo += monto;

    await origen.save();

    await destino.save();

    // REGISTRAR TRANSACCIÓN
    await registrarTransferencia(

        origen._id,
        destino._id,
        monto,
        origen.Moneda

    );

    return {

        origen,
        destino

    };

};