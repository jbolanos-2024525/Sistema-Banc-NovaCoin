import Empleado from './empleado.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { transporter } from '../../utils/mailer.js';

// Crear empleado
export const createEmpleadoRecord = async (
    empleadoData
) => {

    const empleado =
        new Empleado(empleadoData);

    const savedEmpleado =
        await empleado.save();

    // TOKEN DE VERIFICACIÓN
    const verifyToken = jwt.sign(

        {
            id: savedEmpleado._id
        },

        process.env.JWT_SECRET,

        {
            expiresIn: '1d'
        }

    );

    // LINK DE VERIFICACIÓN
    const verifyURL =
        `http://localhost:${process.env.PORT}/NovaCoin/Admin/v1/empleados/verify/${verifyToken}`;

    // ENVIAR CORREO
    await transporter.sendMail({

        from: process.env.MAIL_USER,

        to: savedEmpleado.Correo,

        subject: 'Verifica tu cuenta NovaCoin',

        html: `
            <h1>Bienvenido a NovaCoin</h1>

            <p>
                Haz click en el botón para
                verificar tu cuenta:
            </p>

            <a href="${verifyURL}">
                Verificar Cuenta
            </a>
        `
    });

    // ELIMINAR PASSWORD
    const empleadoSinPassword =
        savedEmpleado.toObject();

    delete empleadoSinPassword.Password;

    return empleadoSinPassword;
};

// Obtener empleados
export const getEmpleadosRecord =
async () => {

    return await Empleado.find({
        isActive: true
    });

};

// Login
export const loginEmpleadoRecord =
async (
    Correo,
    Password
) => {

    const empleado =
        await Empleado
            .findOne({ Correo })
            .select('+Password');

    if (!empleado) {

        throw new Error(
            'Correo no encontrado'
        );

    }

    // VALIDAR VERIFICACIÓN
    if (!empleado.isVerified) {

        throw new Error(
            'Debes verificar tu correo'
        );

    }

    const isMatch =
        await bcrypt.compare(
            Password,
            empleado.Password
        );

    if (!isMatch) {

        throw new Error(
            'Contraseña incorrecta'
        );

    }

    const token = jwt.sign(

        {
            id: empleado._id,
            rol: empleado.Rol
        },

        process.env.JWT_SECRET,

        {
            expiresIn: '2h'
        }

    );

    const empleadoSinPassword =
        empleado.toObject();

    delete empleadoSinPassword.Password;

    return {

        token,

        empleado:
            empleadoSinPassword

    };

};

// Verificar correo
export const verifyEmpleadoEmail =
async (token) => {

    const decoded = jwt.verify(

        token,

        process.env.JWT_SECRET

    );

    const empleado =
        await Empleado.findById(
            decoded.id
        );

    if (!empleado) {

        throw new Error(
            'Empleado no encontrado'
        );

    }

    empleado.isVerified = true;

    await empleado.save();

    return empleado;
};