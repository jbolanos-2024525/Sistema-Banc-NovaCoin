import Empleado from './empleado.model.js';
import {
    createRecord,
    findById,
    findAll,
    updateRecord,
    softDelete,
    changeStatus
} from '../../utils/serviceHelpers.js';

const ENTITY = 'empleado';

export const createEmpleadoRecord = async (data) => {
    const empleado = await createRecord(Empleado, data, ENTITY);
    return empleado.toObject ? empleado.toObject() : empleado;
};

export const getEmpleadosRecord = (filters = {}) =>
    findAll(Empleado, filters, { activeField: 'isActive' });

export const getEmpleadoById = (id) => findById(Empleado, id, ENTITY);

export const getEmpleadoByDPI = async (dpi) => {
    if (!dpi) throw new Error('DPI es requerido');

    const empleado = await Empleado.findOne({ DPI: dpi }).lean();
    if (!empleado) throw new Error('Empleado no encontrado');

    return empleado;
};

export const getEmpleadoByCorreo = async (correo) => {
    if (!correo) throw new Error('Correo es requerido');

    const empleado = await Empleado.findOne({ Correo: correo.toLowerCase() }).lean();
    if (!empleado) throw new Error('Empleado no encontrado');

    return empleado;
};

export const getEmpleadosByRol = (rol) => {
    if (!rol) throw new Error('Rol es requerido');

    return findAll(Empleado, { Rol: rol }, { activeField: 'isActive' });
};

export const updateEmpleadoRecord = (id, data) =>
    updateRecord(Empleado, id, data, ['Nombre', 'Apellido', 'Telefono', 'Puesto', 'Salario', 'Rol', 'Estado'], ENTITY);

export const deleteEmpleadoSoft = (id) =>
    softDelete(Empleado, id, ENTITY, 'isActive');

export const deleteEmpleadoAbsolute = async (id) => {
    if (!id) throw new Error('ID de empleado es requerido');

    const empleado = await Empleado.findByIdAndDelete(id);
    if (!empleado) throw new Error('Empleado no encontrado');

    return empleado;
};

export const cambiarEstadoEmpleado = (id, nuevoEstado) =>
    changeStatus(Empleado, id, nuevoEstado, ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'], 'Estado', ENTITY);
