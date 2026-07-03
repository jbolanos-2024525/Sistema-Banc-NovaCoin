import { catchAsync } from "../../utils/catchAsync.js";
import { extractUserId } from "../../utils/requestHelpers.js";

import {
    createCuenta,
    getCuentas,
    getCuentaById,
    getCuentaByNumero,
    getCuentasByUsuario,
    updateCuenta,
    deleteCuenta,
    depositar,
    retirar,
    transferir,
    cambiarEstadoCuenta
} from "./cuenta.service.js";

export const create = catchAsync(
    async (req) => await createCuenta(req.body),
    { successStatus: 201, errorStatus: 400, successMessage: "Cuenta creada correctamente" }
);

export const getAll = catchAsync(
    async (req) => await getCuentas(req.query || {}),
    { errorStatus: 500 }
);

export const getById = catchAsync(
    async (req) => await getCuentaById(req.params.id),
    { errorStatus: 404 }
);

export const getByNumero = catchAsync(
    async (req) => await getCuentaByNumero(req.params.numeroCuenta),
    { errorStatus: 404 }
);

export const getByUsuario = catchAsync(
    async (req) => await getCuentasByUsuario(req.params.usuarioId),
    { errorStatus: 500 }
);

export const getMisCuentas = catchAsync(
    async (req, res) => {
        const userId = extractUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No se pudo identificar al usuario desde el token de autenticación."
            });
        }
        return await getCuentasByUsuario(userId);
    },
    { errorStatus: 500 }
);

export const update = catchAsync(
    async (req) => await updateCuenta(req.params.id, req.body),
    { errorStatus: 400, successMessage: "Cuenta actualizada correctamente" }
);

export const remove = catchAsync(
    async (req) => await deleteCuenta(req.params.id),
    { errorStatus: 500, successMessage: "Cuenta eliminada correctamente" }
);

export const deposit = catchAsync(
    async (req) => {
        const { monto, descripcion } = req.body;
        return await depositar(req.params.cuentaId, monto, descripcion);
    },
    { errorStatus: 400, successMessage: "Depósito realizado correctamente" }
);

export const withdraw = catchAsync(
    async (req) => {
        const { monto, descripcion } = req.body;
        return await retirar(req.params.cuentaId, monto, descripcion);
    },
    { errorStatus: 400, successMessage: "Retiro realizado correctamente" }
);

export const transfer = catchAsync(
    async (req) => {
        const { cuentaOrigenId, cuentaDestinoId, monto, descripcion } = req.body;
        return await transferir(cuentaOrigenId, cuentaDestinoId, monto, descripcion);
    },
    { errorStatus: 400, successMessage: "Transferencia realizada correctamente" }
);

export const cambiarEstado = catchAsync(
    async (req) => {
        const { id } = req.params;
        const { estado } = req.body;
        return await cambiarEstadoCuenta(id, estado);
    },
    { errorStatus: 400, successMessage: "Estado de cuenta actualizado correctamente" }
);
