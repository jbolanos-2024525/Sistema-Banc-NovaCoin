import { Transaccion } from "./transaccion.model.js";

// CREAR TRANSACCIÓN
export const createTransaccion = async (
    transaccionData
) => {

    const transaccion = new Transaccion(
        transaccionData
    );

    await transaccion.save();

    return transaccion;

};

// OBTENER TODAS LAS TRANSACCIONES
export const getTransacciones = async () => {

    return await Transaccion.find()

    .populate("CuentaOrigen")
    .populate("CuentaDestino")

    .sort({
        createdAt: -1
    });

};

// OBTENER TRANSACCIÓN POR ID
export const getTransaccionById = async (
    id
) => {

    const transaccion =
        await Transaccion.findById(id)

    .populate("CuentaOrigen")
    .populate("CuentaDestino");

    if (!transaccion) {

        throw new Error(
            "Transacción no encontrada"
        );

    }

    return transaccion;

};

// OBTENER TRANSACCIONES DE UNA CUENTA
export const getTransaccionesByCuenta =
async (cuentaId) => {

    return await Transaccion.find({

        $or: [

            { CuentaOrigen: cuentaId },

            { CuentaDestino: cuentaId }

        ]

    })

    .populate("CuentaOrigen")
    .populate("CuentaDestino")

    .sort({

        createdAt: -1

    });

};

// ELIMINAR TRANSACCIÓN
export const deleteTransaccion = async (
    id
) => {

    const transaccion =
        await Transaccion.findByIdAndDelete(id);

    if (!transaccion) {

        throw new Error(
            "Transacción no encontrada"
        );

    }

    return transaccion;

};

// REGISTRAR DEPÓSITO
export const registrarDeposito = async (

    cuentaDestino,
    monto,
    moneda = "GTQ"

) => {

    const transaccion =
        new Transaccion({

            TipoTransaccion: "DEPOSITO",

            CuentaDestino: cuentaDestino,

            Monto: monto,

            Moneda: moneda,

            Descripcion:
                "Depósito realizado",

            Estado: "COMPLETADA"

        });

    await transaccion.save();

    return transaccion;

};

// REGISTRAR RETIRO
export const registrarRetiro = async (

    cuentaOrigen,
    monto,
    moneda = "GTQ"

) => {

    const transaccion =
        new Transaccion({

            TipoTransaccion: "RETIRO",

            CuentaOrigen: cuentaOrigen,

            Monto: monto,

            Moneda: moneda,

            Descripcion:
                "Retiro realizado",

            Estado: "COMPLETADA"

        });

    await transaccion.save();

    return transaccion;

};

// REGISTRAR TRANSFERENCIA
export const registrarTransferencia = async (

    cuentaOrigen,
    cuentaDestino,
    monto,
    moneda = "GTQ"

) => {

    const transaccion =
        new Transaccion({

            TipoTransaccion:
                "TRANSFERENCIA",

            CuentaOrigen: cuentaOrigen,

            CuentaDestino: cuentaDestino,

            Monto: monto,

            Moneda: moneda,

            Descripcion:
                "Transferencia bancaria",

            Estado: "COMPLETADA"

        });

    await transaccion.save();

    return transaccion;

};