import { request, response } from "express";

import {

    getTransacciones,
    getTransaccionById,
    getTransaccionesByCuenta,
    deleteTransaccion

} from "./transaccion.service.js";

// OBTENER TODAS
export const getAll = async (
    req = request,
    res = response
) => {

    try {

        const transacciones =
            await getTransacciones();

        return res.status(200).json({

            success: true,
            transacciones

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

        const transaccion =
            await getTransaccionById(id);

        return res.status(200).json({

            success: true,
            transaccion

        });

    } catch (error) {

        return res.status(404).json({

            success: false,
            message: error.message

        });

    }

};

// OBTENER POR CUENTA
export const getByCuenta = async (
    req = request,
    res = response
) => {

    try {

        const { cuentaId } = req.params;

        const transacciones =
            await getTransaccionesByCuenta(
                cuentaId
            );

        return res.status(200).json({

            success: true,
            transacciones

        });

    } catch (error) {

        return res.status(500).json({

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

        await deleteTransaccion(id);

        return res.status(200).json({

            success: true,
            message:
                "Transacción eliminada correctamente"

        });

    } catch (error) {

        return res.status(404).json({

            success: false,
            message: error.message

        });

    }

};