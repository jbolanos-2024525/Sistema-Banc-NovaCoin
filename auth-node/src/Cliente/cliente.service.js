import { Cliente } from "./cliente.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { transporter } from "../../utils/mailer.js";

// REGISTRAR CLIENTE
export const createCliente = async (clienteData) => {

    const cliente = new Cliente(clienteData);

    const savedCliente = await cliente.save();

    // TOKEN VERIFICACIÓN
    const verifyToken = jwt.sign(
        {
            id: savedCliente._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
    );

    // LINK
    const verifyLink =
        `http://localhost:${process.env.PORT}/NovaCoin/Admin/v1/cliente/verify/${verifyToken}`;

    // ENVIAR CORREO
    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: savedCliente.Correo,

        subject: "Verifica tu cuenta NovaCoin",

        html: `
            <h1>Bienvenido a NovaCoin</h1>

            <p>Verifica tu cuenta:</p>

            <a href="${verifyLink}">
                Verificar Cuenta
            </a>
        `
    });

    return savedCliente;
};

// LOGIN CLIENTE
export const loginCliente = async (
    Correo,
    Password
) => {

    const cliente = await Cliente.findOne({
        Correo
    }).select("+Password");

    if (!cliente) {
        throw new Error("Correo no encontrado");
    }

    if (!cliente.isVerified) {
        throw new Error("Debes verificar tu correo");
    }

    const validPassword = await bcrypt.compare(
        Password,
        cliente.Password
    );

    if (!validPassword) {
        throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
        {
            id: cliente._id,
            rol: cliente.Rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    const clienteObject = cliente.toObject();

    delete clienteObject.Password;

    return {
        cliente: clienteObject,
        token
    };
};

// VERIFICAR CORREO
export const verifyClienteEmail = async (token) => {

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const cliente = await Cliente.findById(
        decoded.id
    );

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    cliente.isVerified = true;

    await cliente.save();

    return cliente;
};

// OBTENER CLIENTES
export const getCliente = async () => {

    return await Cliente.find({
        Estado: true
    }).sort({
        createdAt: -1
    });

};

// OBTENER POR ID
export const getClienteById = async (id) => {

    const cliente = await Cliente.findById(id);

    if (!cliente || !cliente.Estado) {
        throw new Error("Cliente no encontrado");
    }

    return cliente;

};

// ACTUALIZAR
export const updateCliente = async (
    id,
    clienteData
) => {

    const cliente = await Cliente.findById(id);

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    if (!cliente.Estado) {
        throw new Error("El cliente está inactivo");
    }

    delete clienteData.dpi;

    return await Cliente.findByIdAndUpdate(
        id,
        clienteData,
        {
            new: true,
            runValidators: true
        }
    );

};

// ELIMINAR
export const deleteCliente = async (id) => {

    const cliente = await Cliente.findById(id);

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    return await Cliente.findByIdAndUpdate(
        id,
        {
            Estado: false
        },
        {
            new: true
        }
    );

};