import { request, response } from "express";
import { createCuenta, getCuentas, updateCuenta, deleteCuenta } from "./cuenta.service.js";

export const create = async (req = request, res = response) => {
    try {
        const cuenta = await createCuenta(req.body);
        return res.status(201).json(cuenta);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAll = async (req = request, res = response) => {
    try {
        const cuentas = await getCuentas();
        return res.json(cuentas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const update = async (req = request, res = response) => {
    try {
        const { id } = req.params; 
        const cuenta = await updateCuenta(id, req.body);
        return res.json(cuenta);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        await deleteCuenta(id);
        return res.json({ message: "Cuenta eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};