import { catchAsync } from "../../utils/catchAsync.js";
import { extractUserId } from "../../utils/requestHelpers.js";

import { 
    createPrestamo, 
    getPrestamos, 
    getPrestamoById, 
    getPrestamosByCliente,
    getPrestamosByEstado,
    getPrestamosByEmpleado,
    updatePrestamo, 
    pagarCuota,
    cancelarPrestamo, 
    deletePrestamo,
    cambiarEstadoPrestamo
} from "./prestamo.service.js";

export const create = catchAsync(
    async (req) => {
        const clienteId = extractUserId(req);
        const empleadoId = req.empleado?._id?.toString() ?? null;
        return await createPrestamo({
            ...req.body,
            cliente: clienteId,
            empleado: empleadoId
        });
    },
    { successStatus: 201, errorStatus: 400, successMessage: "Préstamo creado correctamente" }
);

export const getAll = catchAsync(
    async (req) => await getPrestamos(req.query || {}),
    { errorStatus: 500 }
);

export const getById = catchAsync(
    async (req) => await getPrestamoById(req.params.id),
    { errorStatus: 404 }
);

export const getByCliente = catchAsync(
    async (req) => await getPrestamosByCliente(req.params.clienteId),
    { errorStatus: 500 }
);

export const getByEstado = catchAsync(
    async (req) => await getPrestamosByEstado(req.params.estado),
    { errorStatus: 500 }
);

export const getByEmpleado = catchAsync(
    async (req) => await getPrestamosByEmpleado(req.params.empleadoId),
    { errorStatus: 500 }
);

export const update = catchAsync(
    async (req) => await updatePrestamo(req.params.id, req.body),
    { errorStatus: 400, successMessage: "Préstamo actualizado correctamente" }
);

export const pagar = catchAsync(
    async (req) => {
        const { id } = req.params;
        const { monto } = req.body;
        return await pagarCuota(id, monto);
    },
    { errorStatus: 400, successMessage: "Pago de cuota realizado correctamente" }
);

export const cancelar = catchAsync(
    async (req) => await cancelarPrestamo(req.params.id),
    { errorStatus: 400, successMessage: "Préstamo cancelado correctamente" }
);

export const remove = catchAsync(
    async (req) => await deletePrestamo(req.params.id),
    { errorStatus: 404, successMessage: "Préstamo eliminado correctamente" }
);

export const cambiarEstado = catchAsync(
    async (req) => {
        const { id } = req.params;
        const { estado } = req.body;
        return await cambiarEstadoPrestamo(id, estado);
    },
    { errorStatus: 400, successMessage: "Estado de préstamo actualizado correctamente" }
);
