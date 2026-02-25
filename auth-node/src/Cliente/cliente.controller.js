import { request, response } from "express";
import {createCliente} from "./cliente.service.js";
import {getCliente} from "./cliente.service.js";

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



