import { Transaccion } from './transaccion.model.js';
import {
    createRecord,
    findById,
    findAll,
    updateRecord,
    softDelete,
    changeStatus
} from '../../utils/serviceHelpers.js';

const ENTITY = 'transacción';
const POPULATE = ["Empleado", "Nombre Apellido Rol"];
const SORT_FIELD = 'FechaTransaccion';

export const createTransaccion = (data) => createRecord(Transaccion, data, ENTITY);

export const getTransacciones = (filters = {}) =>
    findAll(Transaccion, filters, { populateOpts: POPULATE, sortField: SORT_FIELD });

export const getTransaccionById = async (id) => {
    if (!id) throw new Error('ID de transacción es requerido');

    const transaccion = await Transaccion.findById(id)
        .populate("Empleado", "Nombre Apellido Rol");

    if (!transaccion) throw new Error('Transacción no encontrada');

    return transaccion;
};

export const getTransaccionesByUsuario = (usuarioId) => {
    if (!usuarioId) throw new Error('ID de usuario es requerido');
    return findAll(Transaccion, { Usuario: String(usuarioId) }, { populateOpts: POPULATE, sortField: SORT_FIELD });
};

export const getTransaccionesByCuenta = async (cuentaId) => {
    if (!cuentaId) throw new Error('ID de cuenta es requerido');

    return await Transaccion.find({
        $or: [
            { CuentaOrigen: cuentaId },
            { CuentaDestino: cuentaId }
        ],
        Estado: true
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const getTransaccionesByTipo = (tipo) => {
    if (!tipo) throw new Error('Tipo de transacción es requerido');
    return findAll(Transaccion, { TipoTransaccion: tipo }, { populateOpts: POPULATE, sortField: SORT_FIELD });
};

export const getTransaccionesByEstado = (estado) => {
    if (!estado) throw new Error('Estado es requerido');
    return findAll(Transaccion, { EstadoTransaccion: estado }, { populateOpts: POPULATE, sortField: SORT_FIELD });
};

export const getTransaccionesByFecha = async (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) {
        throw new Error('Fechas de inicio y fin son requeridas');
    }

    return findAll(Transaccion, {
        FechaTransaccion: {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin)
        }
    }, { populateOpts: POPULATE, sortField: SORT_FIELD });
};

export const getTransaccionesByPrestamo = (prestamoId) => {
    if (!prestamoId) throw new Error('ID de préstamo es requerido');
    return findAll(Transaccion, { PrestamoId: prestamoId }, { populateOpts: POPULATE, sortField: SORT_FIELD });
};

export const updateTransaccion = (id, data) =>
    updateRecord(Transaccion, id, data, ['Descripcion', 'Referencia', 'EstadoTransaccion'], ENTITY);

export const deleteTransaccion = (id) => softDelete(Transaccion, id, ENTITY);

export const cambiarEstadoTransaccion = (id, nuevoEstado) =>
    changeStatus(Transaccion, id, nuevoEstado, ['COMPLETADA', 'PENDIENTE', 'FALLIDA', 'CANCELADA'], 'EstadoTransaccion', ENTITY);

export const getResumenTransacciones = async (usuarioId) => {
    if (!usuarioId) throw new Error('ID de usuario es requerido');

    const transacciones = await Transaccion.find({
        Usuario: String(usuarioId),
        Estado: true,
        EstadoTransaccion: 'COMPLETADA'
    }).lean();

    const resumen = {
        totalTransacciones: transacciones.length,
        depositos: 0,
        retiros: 0,
        transferenciasEnviadas: 0,
        transferenciasRecibidas: 0,
        pagosPrestamo: 0,
        montoTotalDepositos: 0,
        montoTotalRetiros: 0,
        montoTotalTransferenciasEnviadas: 0,
        montoTotalTransferenciasRecibidas: 0,
        montoTotalPagosPrestamo: 0
    };

    transacciones.forEach(t => {
        switch(t.TipoTransaccion) {
            case 'DEPOSITO':
                resumen.depositos++;
                resumen.montoTotalDepositos += t.Monto;
                break;
            case 'RETIRO':
                resumen.retiros++;
                resumen.montoTotalRetiros += t.Monto;
                break;
            case 'TRANSFERENCIA':
                resumen.transferenciasEnviadas++;
                resumen.montoTotalTransferenciasEnviadas += t.Monto;
                break;
            case 'TRANSFERENCIA_RECIBIDA':
                resumen.transferenciasRecibidas++;
                resumen.montoTotalTransferenciasRecibidas += t.Monto;
                break;
            case 'PAGO_PRESTAMO':
                resumen.pagosPrestamo++;
                resumen.montoTotalPagosPrestamo += t.Monto;
                break;
        }
    });

    return resumen;
};
