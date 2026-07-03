import Prestamo from "./prestamo.model.js";
import {
    createRecord,
    findById,
    findAll,
    updateRecord,
    softDelete,
    changeStatus
} from '../../utils/serviceHelpers.js';

const ENTITY = 'préstamo';
const POPULATE = ["empleado", "Nombre Apellido Rol"];

const calcularCuota = (monto, interesAnual, plazoMeses) => {
    if (!monto || !interesAnual || !plazoMeses) {
        throw new Error("Datos insuficientes para calcular cuota");
    }

    const i = interesAnual / 100 / 12;
    const cuota = monto * (i * Math.pow(1 + i, plazoMeses)) / (Math.pow(1 + i, plazoMeses) - 1);
    return Number(cuota.toFixed(2));
};

export const createPrestamo = async (data) => {
    if (!data.monto || !data.plazoMeses) {
        throw new Error("Datos obligatorios incompletos: monto y plazoMeses son requeridos");
    }
    if (!data.cliente) {
        throw new Error("El ID del cliente es obligatorio");
    }

    const tasa = data.tasaInteres ?? 12;
    const cuota = calcularCuota(data.monto, tasa, data.plazoMeses);

    return await createRecord(Prestamo, {
        ...data,
        tasaInteres: tasa,
        cuotaMensual: cuota,
        montoPendiente: data.monto,
        estadoPrestamo: data.estadoPrestamo || "ACTIVO"
    }, ENTITY);
};

export const getPrestamos = (filters = {}) =>
    findAll(Prestamo, filters, { populateOpts: POPULATE });

export const getPrestamoById = async (id) => {
    if (!id) throw new Error("ID de préstamo es requerido");

    const prestamo = await Prestamo.findById(id)
        .populate("empleado", "Nombre Apellido Rol");

    if (!prestamo) throw new Error("Préstamo no encontrado");

    return prestamo;
};

export const getPrestamosByCliente = (clienteId) => {
    if (!clienteId) throw new Error("ID de cliente es requerido");
    return findAll(Prestamo, { cliente: String(clienteId) }, { populateOpts: POPULATE });
};

export const getPrestamosByEstado = (estado) => {
    if (!estado) throw new Error("Estado es requerido");
    return findAll(Prestamo, { estadoPrestamo: estado }, { populateOpts: POPULATE });
};

export const getPrestamosByEmpleado = (empleadoId) => {
    if (!empleadoId) throw new Error("ID de empleado es requerido");
    return findAll(Prestamo, { empleado: empleadoId }, { populateOpts: POPULATE });
};

export const updatePrestamo = async (id, data) => {
    if (!id) throw new Error("ID de préstamo es requerido");

    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error("Préstamo no encontrado");

    if (prestamo.estadoPrestamo === "CANCELADO" || prestamo.estadoPrestamo === "PAGADO") {
        throw new Error("No se puede editar un préstamo cancelado o pagado");
    }

    return await updateRecord(Prestamo, id, data, ['proposito', 'estadoPrestamo', 'cuentaId'], ENTITY);
};

export const pagarCuota = async (id, montoPago) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    if (!montoPago || montoPago <= 0) throw new Error("Monto de pago inválido");

    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error("Préstamo no encontrado");

    if (prestamo.estadoPrestamo !== "ACTIVO") {
        throw new Error("Solo se pueden pagar cuotas de préstamos activos");
    }

    if (montoPago > prestamo.montoPendiente) {
        throw new Error("El monto del pago excede el saldo pendiente");
    }

    prestamo.montoPendiente -= montoPago;
    prestamo.totalPagado += montoPago;
    prestamo.numeroCuotasPagadas += 1;

    if (prestamo.montoPendiente <= 0) {
        prestamo.montoPendiente = 0;
        prestamo.estadoPrestamo = "PAGADO";
    }

    await prestamo.save();
    return prestamo;
};

export const cancelarPrestamo = async (id) => {
    if (!id) throw new Error("ID de préstamo es requerido");

    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error("Préstamo no encontrado");

    if (prestamo.estadoPrestamo === "CANCELADO") {
        throw new Error("El préstamo ya está cancelado");
    }

    if (prestamo.estadoPrestamo === "PAGADO") {
        throw new Error("No se puede cancelar un préstamo ya pagado");
    }

    prestamo.estadoPrestamo = "CANCELADO";
    await prestamo.save();

    return prestamo;
};

export const deletePrestamo = (id) => softDelete(Prestamo, id, ENTITY);

export const cambiarEstadoPrestamo = (id, nuevoEstado) =>
    changeStatus(Prestamo, id, nuevoEstado, ['ACTIVO', 'PAGADO', 'VENCIDO', 'CANCELADO', 'RECHAZADO'], 'estadoPrestamo', ENTITY);
