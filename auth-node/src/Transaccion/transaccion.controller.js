import { request, response } from "express";
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

export const create = async (req = request, res = response) => {
    try {
        console.log('Body recibido:', req.body);
        console.log('Usuario del token:', req.user);

        const userId = req.user?.uid ||
                       req.user?.id ||
                       req.usuario?.uid ||
                       req.usuario?.id ||
                       req.cliente?.id ||
                       req.cliente?._id?.toString();

        console.log('UserId extraído:', userId);

        const transaccion = await createTransaccion({
            ...req.body,
            Usuario: userId,
            IP: req.ip,
            Dispositivo: req.get('user-agent')
        });

        return res.status(201).json({
            success: true,
            message: "Transacción creada correctamente",
            data: transaccion
        });
    } catch (error) {
        console.error('Error al crear transacción:', error);
        return res.status(400).json({
            success: false,
            message: "No fue posible crear la transacción",
            error: error.message
        });
    }
};

export const getAll = async (req = request, res = response) => {
    try {
        const filters = req.query || {};
        const transacciones = await getTransacciones(filters);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener transacciones",
            error: error.message
        });
    }
};

export const getById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const transaccion = await getTransaccionById(id);
        return res.json({
            success: true,
            data: transaccion
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const getByUsuario = async (req = request, res = response) => {
    try {
        const { usuarioId } = req.params;
        const transacciones = await getTransaccionesByUsuario(usuarioId);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMisTransacciones = async (req = request, res = response) => {
    try {
        const userId = req.user?.uid || 
                       req.user?.id || 
                       req.usuario?.uid || 
                       req.usuario?.id || 
                       req.cliente?.id || 
                       req.cliente?._id?.toString();

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No se pudo identificar al usuario desde el token de autenticación."
            });
        }

        const transacciones = await getTransaccionesByUsuario(userId);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getByCuenta = async (req = request, res = response) => {
    try {
        const { cuentaId } = req.params;
        const transacciones = await getTransaccionesByCuenta(cuentaId);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getByTipo = async (req = request, res = response) => {
    try {
        const { tipo } = req.params;
        const transacciones = await getTransaccionesByTipo(tipo);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
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
        const transacciones = await getTransaccionesByEstado(estado);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getByFecha = async (req = request, res = response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const transacciones = await getTransaccionesByFecha(fechaInicio, fechaFin);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getByPrestamo = async (req = request, res = response) => {
    try {
        const { prestamoId } = req.params;
        const transacciones = await getTransaccionesByPrestamo(prestamoId);
        return res.json({
            success: true,
            data: transacciones,
            count: transacciones.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getResumen = async (req = request, res = response) => {
    try {
        const userId = req.user?.uid || 
                       req.user?.id || 
                       req.usuario?.uid || 
                       req.usuario?.id || 
                       req.cliente?.id || 
                       req.cliente?._id?.toString();

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No se pudo identificar al usuario desde el token de autenticación."
            });
        }

        const resumen = await getResumenTransacciones(userId);
        return res.json({
            success: true,
            data: resumen
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
        const { id } = req.params;
        const transaccion = await updateTransaccion(id, req.body);
        return res.json({
            success: true,
            message: "Transacción actualizada correctamente",
            data: transaccion
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se pudo actualizar la transacción",
            error: error.message
        });
    }
};

export const remove = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const transaccion = await deleteTransaccion(id);
        return res.json({
            success: true,
            message: "Transacción eliminada correctamente",
            data: transaccion
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cambiarEstado = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const transaccion = await cambiarEstadoTransaccion(id, estado);
        return res.json({
            success: true,
            message: "Estado de transacción actualizado correctamente",
            data: transaccion
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se pudo actualizar el estado de la transacción",
            error: error.message
        });
    }
};
