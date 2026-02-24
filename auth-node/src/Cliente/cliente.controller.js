import { request, response } from "express";
import {
    createCliente,
    getCliente,
    getClienteById,
    updateCliente,
    deleteCliente
} from "./cliente.service.js";

export const create = async (req = request, res = response) => {
    try {
        const cliente = await createCliente(req.body);
        return res.status(201).json(cliente);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAll = async (req = request, res = response) => {
    try {
        const cliente = await getCliente();
        return res.json(cliente);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getById = async (req = request, res = response) => {
    try {
        const cliente = await getClienteById(req.params.id);
        return res.json(cliente);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const update = async (req = request, res = response) => {
    try {
        const cliente = await updateCliente(req.params.id, req.body);
        return res.json(cliente);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const remove = async (req = request, res = response) => {
    try {
        const cliente = await deleteCliente(req.params.id);
        return res.json(cliente);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};