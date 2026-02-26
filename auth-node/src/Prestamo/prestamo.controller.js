import { request, response } from "express";

import {createPrestamo, getPrestamos, getPrestamoById, updatePrestamo, cancelarPrestamo} from "./prestamo.service.js";

export const create = async (req = request, res = response) => {
    try{
        const prestamo = await createPrestamo(req.body);
        return res.status(201).json({
            ok: true,
            message: "Prestamo creado correctamente",
            data: prestamo
        });
    }
    catch (error){
        return res.status(400).json({
            ok: false,
            message: "No fue posible crear el prestamo",
            error: error.message
        });
    }
};

export const getAll = async (req = request, res = response) => {
    try {
        const prestamos = await getPrestamos();
        return res.json({ ok: true, data: prestamos });
    }
    catch (error){
        return res.status(500).json({
            ok: false,
            message: "Error al obtener prestamos",
            error: error.message
        });
    }
};

export const getById = async (req = request, res = response) => {
    try {
        const prestamo = await getPrestamoById(req.params.id);
        return res.json({ ok: true, data: prestamo });
    }
    catch (error){
        return res.status(404).json({
            ok: false,
            message: "Prestamo no encontrado",
            error: error.message
        });
    }
};

export const update = async (req = request, res = response) => {
    try{
        const prestamo = await updatePrestamo(req.params.id, req.body);
        return res.json({
            ok: true,
            message: "Prestamo actualizado correctamente",
            data: prestamo
        });
    }
    catch (error){
        return res.status(400).json({
            ok: false,
            message: "No se pudo actualizar el prestamo",
            error: error.message
        });
    }
};

export const cancelar = async (req = request, res = response) =>{
    try{
        const prestamo = await cancelarPrestamo(req.params.id);
        return res.json({
            ok: true,
            message: "Prestamo cancelado correctamente",
            data: prestamo
        });
    }
    catch (error){
        return res.status(400).json({
            ok: false,
            message: "No se pudo cancelar el prestamo",
            error: error.message
        });
    }
};