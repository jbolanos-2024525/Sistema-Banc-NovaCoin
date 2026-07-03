import { catchAsync } from "../../utils/catchAsync.js";
import { extractUserId } from "../../utils/requestHelpers.js";

import {
    createTransaccion,
    getTransacciones,
    getTransaccionById,
    getTransaccionesByUsuario,
    getTransaccionesByCuenta,
    getTransaccionesByTipo,
    getTransaccionesByEstado,
    getTransaccionesByFecha,
    getTransaccionesByPrestamo,
    updateTransaccion,
    deleteTransaccion,
    cambiarEstadoTransaccion,
    getResumenTransacciones
} from "./transaccion.service.js";

export const create = catchAsync(
    async (req) => {
        const userId = extractUserId(req);
        return await createTransaccion({
            ...req.body,
            Usuario: userId,
            IP: req.ip,
            Dispositivo: req.get('user-agent')
        });
    },
    { successStatus: 201, errorStatus: 400, successMessage: "Transacción creada correctamente" }
);

export const getAll = catchAsync(
    async (req) => await getTransacciones(req.query || {}),
    { errorStatus: 500 }
);

export const getById = catchAsync(
    async (req) => await getTransaccionById(req.params.id),
    { errorStatus: 404 }
);

export const getByUsuario = catchAsync(
    async (req) => await getTransaccionesByUsuario(req.params.usuarioId),
    { errorStatus: 500 }
);

export const getMisTransacciones = catchAsync(
    async (req, res) => {
        const userId = extractUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No se pudo identificar al usuario desde el token de autenticación."
            });
        }
        return await getTransaccionesByUsuario(userId);
    },
    { errorStatus: 500 }
);

export const getByCuenta = catchAsync(
    async (req) => await getTransaccionesByCuenta(req.params.cuentaId),
    { errorStatus: 500 }
);

export const getByTipo = catchAsync(
    async (req) => await getTransaccionesByTipo(req.params.tipo),
    { errorStatus: 500 }
);

export const getByEstado = catchAsync(
    async (req) => await getTransaccionesByEstado(req.params.estado),
    { errorStatus: 500 }
);

export const getByFecha = catchAsync(
    async (req) => {
        const { fechaInicio, fechaFin } = req.query;
        return await getTransaccionesByFecha(fechaInicio, fechaFin);
    },
    { errorStatus: 500 }
);

export const getByPrestamo = catchAsync(
    async (req) => await getTransaccionesByPrestamo(req.params.prestamoId),
    { errorStatus: 500 }
);

export const getResumen = catchAsync(
    async (req, res) => {
        const userId = extractUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No se pudo identificar al usuario desde el token de autenticación."
            });
        }
        return await getResumenTransacciones(userId);
    },
    { errorStatus: 500 }
);

export const update = catchAsync(
    async (req) => await updateTransaccion(req.params.id, req.body),
    { errorStatus: 400, successMessage: "Transacción actualizada correctamente" }
);

export const remove = catchAsync(
    async (req) => await deleteTransaccion(req.params.id),
    { errorStatus: 500, successMessage: "Transacción eliminada correctamente" }
);

export const cambiarEstado = catchAsync(
    async (req) => {
        const { id } = req.params;
        const { estado } = req.body;
        return await cambiarEstadoTransaccion(id, estado);
    },
    { errorStatus: 400, successMessage: "Estado de transacción actualizado correctamente" }
);
