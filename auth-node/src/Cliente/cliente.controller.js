import { request, response } from "express";
import { createCliente } from "./cliente.service.js";
import { getCliente } from "./cliente.service.js";
import { getClienteById } from "./cliente.service.js";
import { updateCliente } from "./cliente.service.js";
import { deleteCliente } from "./cliente.service.js";

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
        const clientes = await getCliente();
        return res.json(clientes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const cliente = await getClienteById(id);
        return res.json(cliente);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const update = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const cliente = await updateCliente(id, req.body);
        return res.json(cliente);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        await deleteCliente(id);
        return res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};