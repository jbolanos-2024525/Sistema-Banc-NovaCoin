import { request, response } from "express";
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

const getErrorStatusCode = (error) => {
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('no encontrad') || msg.includes('not found')) return 404;
    if (msg.includes('requerido') || msg.includes('inválid') || msg.includes('no válid') || msg.includes('no hay campos') || msg.includes('incompletos')) return 400;
    if (msg.includes('ya está') || msg.includes('no se puede') || msg.includes('solo se pueden') || msg.includes('excede')) return 400;
    if (msg.includes('ya existe')) return 409;
    return 500;
};

export const create = async (req = request, res = response) => {
    try {
        const clienteId = req.user?.uid || 
                         req.user?.id || 
                         req.usuario?.uid || 
                         req.usuario?.id || 
                         req.cliente?.id || 
                         req.cliente?._id?.toString();

        const empleadoId = req.empleado?._id?.toString() ?? null;

        const prestamo = await createPrestamo({
            ...req.body,
            cliente: clienteId,
            empleado: empleadoId
        });

        return res.status(201).json({
            success: true,
            message: "Préstamo creado correctamente",
            data: prestamo
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No fue posible crear el préstamo",
            error: error.message
        });
    }
};

export const getAll = async (req = request, res = response) => {
    try {
        const filters = req.query || {};
        const prestamos = await getPrestamos(filters);
        return res.json({ 
            success: true, 
            data: prestamos,
            count: prestamos.length 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({
            success: false,
            message: "Error al obtener préstamos",
            error: error.message
        });
    }
};

export const getById = async (req = request, res = response) => {
    try {
        const prestamo = await getPrestamoById(req.params.id);
        return res.json({ 
            success: true, 
            data: prestamo 
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Préstamo no encontrado",
            error: error.message
        });
    }
};

export const getByCliente = async (req = request, res = response) => {
    try {
        const { clienteId } = req.params;
        const prestamos = await getPrestamosByCliente(clienteId);
        return res.json({ 
            success: true, 
            data: prestamos,
            count: prestamos.length 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({
            success: false,
            message: error.message
        });
    }
};

export const getByEstado = async (req = request, res = response) => {
    try {
        const { estado } = req.params;
        const prestamos = await getPrestamosByEstado(estado);
        return res.json({ 
            success: true, 
            data: prestamos,
            count: prestamos.length 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({
            success: false,
            message: error.message
        });
    }
};

export const getByEmpleado = async (req = request, res = response) => {
    try {
        const { empleadoId } = req.params;
        const prestamos = await getPrestamosByEmpleado(empleadoId);
        return res.json({ 
            success: true, 
            data: prestamos,
            count: prestamos.length 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({
            success: false,
            message: error.message
        });
    }
};

export const update = async (req = request, res = response) => {
    try {
        const prestamo = await updatePrestamo(req.params.id, req.body);
        return res.json({
            success: true,
            message: "Préstamo actualizado correctamente",
            data: prestamo
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se pudo actualizar el préstamo",
            error: error.message
        });
    }
};

export const pagar = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { monto } = req.body;
        const prestamo = await pagarCuota(id, monto);
        return res.json({
            success: true,
            message: "Pago de cuota realizado correctamente",
            data: prestamo
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se pudo realizar el pago",
            error: error.message
        });
    }
};

export const cancelar = async (req = request, res = response) => {
    try {
        const prestamo = await cancelarPrestamo(req.params.id);
        return res.json({
            success: true,
            message: "Préstamo cancelado correctamente",
            data: prestamo
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se pudo cancelar el préstamo",
            error: error.message
        });
    }
};

export const remove = async (req = request, res = response) => {
    try {
        const prestamo = await deletePrestamo(req.params.id);
        return res.json({
            success: true,
            message: "Préstamo eliminado correctamente",
            data: prestamo
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "No se pudo eliminar el préstamo",
            error: error.message
        });
    }
};

export const cambiarEstado = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const prestamo = await cambiarEstadoPrestamo(id, estado);
        return res.json({
            success: true,
            message: "Estado de préstamo actualizado correctamente",
            data: prestamo
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se pudo actualizar el estado del préstamo",
            error: error.message
        });
    }
};