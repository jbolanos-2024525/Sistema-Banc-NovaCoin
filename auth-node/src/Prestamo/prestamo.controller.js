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

export const create = async (req = request, res = response) => {
    try {
        console.log("Datos recibidos:", req.body);
        console.log("Cliente ID:", req.cliente?.id);
        console.log("Empleado:", req.empleado?._id?.toString());

        const clienteId = req.body?.cliente || req.cliente?.id || req.empleado?._id?.toString();
        const empleadoId = req.empleado?._id?.toString() ?? null;

        if (!clienteId) {
            return res.status(400).json({
                success: false,
                message: "No fue posible crear el préstamo",
                error: "El ID del cliente es obligatorio"
            });
        }

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
        console.error("Error en create:", error);
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
        return res.status(500).json({
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
        let clienteId = req.params.clienteId;
        
        // Si no se proporciona clienteId en los parámetros, usar el del token
        if (!clienteId) {
            clienteId = req.cliente?.id || 
                       req.cliente?.Id ||
                       req.user?.uid || 
                       req.user?.id || 
                       req.usuario?.uid || 
                       req.usuario?.id;

            if (!clienteId) {
                return res.status(401).json({ 
                    success: false, 
                    message: "No se pudo identificar al usuario desde el token de autenticación." 
                });
            }
        }
        
        const prestamos = await getPrestamosByCliente(clienteId);
        return res.json({ 
            success: true, 
            data: prestamos,
            count: prestamos.length 
        });
    } catch (error) {
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const update = async (req = request, res = response) => {
    try {
        console.log("Update prestamo - ID:", req.params.id);
        console.log("Update prestamo - Body:", req.body);
        const prestamo = await updatePrestamo(req.params.id, req.body);
        console.log("Update prestamo - Resultado:", prestamo);
        
        // Convertir a objeto plano con _id como string
        const prestamoPlain = prestamo.toObject ? prestamo.toObject() : prestamo;
        if (prestamoPlain._id) {
            prestamoPlain._id = prestamoPlain._id.toString();
        }
        
        return res.json({
            success: true,
            message: "Préstamo actualizado correctamente",
            data: prestamoPlain
        });
    } catch (error) {
        console.error("Error en update:", error);
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