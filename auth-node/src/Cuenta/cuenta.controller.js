import { request, response } from "express";

import {

    createCuenta,
    getCuentas,
    getCuentaById,
    getCuentasByCliente,
    updateCuenta,
    deleteCuenta,

    depositar,
    retirar,
    transferir

} from "./cuenta.service.js";

// CREAR CUENTA
export const create = async (
    req = request,
    res = response
) => {

    try {

        const cuenta = await createCuenta(
            req.body
        );

        return res.status(201).json({

            success: true,
            message: "Cuenta creada correctamente",
            cuenta

        });

    } catch (error) {

        return res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

// OBTENER TODAS
export const getAll = async (
    req = request,
    res = response
) => {

    try {

        const cuentas = await getCuentas();

        return res.status(200).json({

            success: true,
            cuentas

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// OBTENER POR ID
export const getById = async (
    req = request,
    res = response
) => {

    try {

        const { id } = req.params;

        const cuenta = await getCuentaById(id);

        return res.status(200).json({

            success: true,
            cuenta

        });

    } catch (error) {

        return res.status(404).json({

            success: false,
            message: error.message

        });

    }

};

// OBTENER CUENTAS CLIENTE
export const getByCliente = async (
    req = request,
    res = response
) => {

    try {

        const { clienteId } = req.params;

        const cuentas =
            await getCuentasByCliente(
                clienteId
            );

        return res.status(200).json({

            success: true,
            cuentas

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ACTUALIZAR
export const update = async (
    req = request,
    res = response
) => {

    try {

        const { id } = req.params;

        const cuenta = await updateCuenta(
            id,
            req.body
        );

        return res.status(200).json({

            success: true,
            message: "Cuenta actualizada correctamente",
            cuenta

        });

    } catch (error) {

        return res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

// ELIMINAR
export const remove = async (
    req = request,
    res = response
) => {

    try {

        const { id } = req.params;

        await deleteCuenta(id);

        return res.status(200).json({

            success: true,
            message: "Cuenta eliminada correctamente"

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// DEPÓSITO
export const deposit = async (
    req = request,
    res = response
) => {

    try {

        const { cuentaId } = req.params;

        const { monto } = req.body;

        const cuenta = await depositar(
            cuentaId,
            monto
        );

        return res.status(200).json({

            success: true,
            message: "Depósito realizado correctamente",
            cuenta

        });

    } catch (error) {

        return res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

// RETIRO
export const withdraw = async (
    req = request,
    res = response
) => {

    try {

        const { cuentaId } = req.params;

        const { monto } = req.body;

        const cuenta = await retirar(
            cuentaId,
            monto
        );

        return res.status(200).json({

            success: true,
            message: "Retiro realizado correctamente",
            cuenta

        });

    } catch (error) {

        return res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

// TRANSFERENCIA
export const transfer = async (
    req = request,
    res = response
) => {

    try {

        const {

            cuentaOrigenId,
            cuentaDestinoId,
            monto

        } = req.body;

        const resultado = await transferir(

            cuentaOrigenId,
            cuentaDestinoId,
            monto

        );

        return res.status(200).json({

            success: true,
            message: "Transferencia realizada correctamente",
            resultado

        });

    } catch (error) {

        return res.status(400).json({

            success: false,
            message: error.message

        });

    }

};