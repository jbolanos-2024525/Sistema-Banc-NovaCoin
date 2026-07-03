import { request, response } from "express";

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

const getErrorStatusCode = (error) => {
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('no encontrad') || msg.includes('not found')) return 404;
    if (msg.includes('requerido') || msg.includes('inválid') || msg.includes('no válid') || msg.includes('no hay campos')) return 400;
    if (msg.includes('insuficiente') || msg.includes('excede') || msg.includes('no está activa') || msg.includes('misma cuenta')) return 400;
    if (msg.includes('ya existe')) return 409;
    return 500;
};

export const create = async (req = request, res = response) => {
    try {
        const cuenta = await createCuenta(req.body);
        return res.status(201).json({ 
            success: true, 
            message: "Cuenta creada correctamente", 
            data: cuenta 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getAll = async (req = request, res = response) => {
    try {
        const filters = req.query || {};
        const cuentas = await getCuentas(filters);
        return res.status(200).json({ 
            success: true, 
            data: cuentas,
            count: cuentas.length 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const cuenta = await getCuentaById(id);
        return res.status(200).json({ 
            success: true, 
            data: cuenta 
        });
    } catch (error) {
        return res.status(404).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getByNumero = async (req = request, res = response) => {
    try {
        const { numeroCuenta } = req.params;
        const cuenta = await getCuentaByNumero(numeroCuenta);
        return res.status(200).json({ 
            success: true, 
            data: cuenta 
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
        const cuentas = await getCuentasByUsuario(usuarioId);
        return res.status(200).json({ 
            success: true, 
            data: cuentas,
            count: cuentas.length 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getMisCuentas = async (req = request, res = response) => {
    try {
        const userId = req.user?.uid || 
                       req.user?.id || 
                       req.usuario?.uid || 
                       req.usuario?.id || 
                       req.cliente?.id || 
                       req.cliente?.Id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "No se pudo identificar al usuario desde el token de autenticación." 
            });
        }

        const cuentas = await getCuentasByUsuario(userId);
        
        return res.status(200).json({ 
            success: true, 
            data: cuentas,
            count: cuentas.length 
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
        const { id } = req.params;
        const cuenta = await updateCuenta(id, req.body);
        return res.status(200).json({ 
            success: true, 
            message: "Cuenta actualizada correctamente", 
            data: cuenta 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const remove = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const cuenta = await deleteCuenta(id);
        return res.status(200).json({ 
            success: true, 
            message: "Cuenta eliminada correctamente",
            data: cuenta 
        });
    } catch (error) {
        return res.status(getErrorStatusCode(error)).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const deposit = async (req = request, res = response) => {
    try {
        const { cuentaId } = req.params;
        const { monto, descripcion } = req.body;
        const cuenta = await depositar(cuentaId, monto, descripcion);
        return res.status(200).json({ 
            success: true, 
            message: "Depósito realizado correctamente", 
            data: cuenta 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const withdraw = async (req = request, res = response) => {
    try {
        const { cuentaId } = req.params;
        const { monto, descripcion } = req.body;
        const cuenta = await retirar(cuentaId, monto, descripcion);
        return res.status(200).json({ 
            success: true, 
            message: "Retiro realizado correctamente", 
            data: cuenta 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const transfer = async (req = request, res = response) => {
    try {
        const { cuentaOrigenId, cuentaDestinoId, monto, descripcion } = req.body;
        const resultado = await transferir(cuentaOrigenId, cuentaDestinoId, monto, descripcion);
        return res.status(200).json({ 
            success: true, 
            message: "Transferencia realizada correctamente", 
            data: resultado 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const cambiarEstado = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const cuenta = await cambiarEstadoCuenta(id, estado);
        return res.status(200).json({ 
            success: true, 
            message: "Estado de cuenta actualizado correctamente", 
            data: cuenta 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};