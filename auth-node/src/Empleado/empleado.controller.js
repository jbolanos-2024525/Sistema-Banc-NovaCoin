import { catchAsync } from "../../utils/catchAsync.js";

import {
    createEmpleadoRecord,
    getEmpleadosRecord,
    getEmpleadoById,
    getEmpleadoByDPI,
    getEmpleadoByCorreo,
    getEmpleadosByRol,
    updateEmpleadoRecord,
    deleteEmpleadoSoft,
    deleteEmpleadoAbsolute,
    cambiarEstadoEmpleado
} from './empleado.service.js';

export const createEmpleado = catchAsync(
    async (req) => await createEmpleadoRecord(req.body),
    { successStatus: 201, errorStatus: 400, successMessage: "Empleado registrado con éxito." }
);

export const getEmpleados = catchAsync(
    async (req) => await getEmpleadosRecord(req.query || {}),
    { errorStatus: 500 }
);

export const getEmpleado = catchAsync(
    async (req) => await getEmpleadoById(req.params.id),
    { errorStatus: 404 }
);

export const getEmpleadoByDPIController = catchAsync(
    async (req) => await getEmpleadoByDPI(req.params.dpi),
    { errorStatus: 404 }
);

export const getEmpleadoByCorreoController = catchAsync(
    async (req) => await getEmpleadoByCorreo(req.params.correo),
    { errorStatus: 404 }
);

export const getEmpleadosByRolController = catchAsync(
    async (req) => await getEmpleadosByRol(req.params.rol),
    { errorStatus: 500 }
);

export const updateEmpleado = catchAsync(
    async (req) => await updateEmpleadoRecord(req.params.id, req.body),
    { errorStatus: 400, successMessage: "Empleado actualizado con éxito." }
);

export const deleteEmpleado = catchAsync(
    async (req) => await deleteEmpleadoSoft(req.params.id),
    { errorStatus: 500, successMessage: "Empleado desactivado correctamente" }
);

export const deleteEmpleadoHard = catchAsync(
    async (req) => await deleteEmpleadoAbsolute(req.params.id),
    { errorStatus: 500, successMessage: "Empleado eliminado permanentemente de la base de datos" }
);

export const cambiarEstado = catchAsync(
    async (req) => {
        const { id } = req.params;
        const { estado } = req.body;
        return await cambiarEstadoEmpleado(id, estado);
    },
    { errorStatus: 400, successMessage: "Estado de empleado actualizado correctamente" }
);
