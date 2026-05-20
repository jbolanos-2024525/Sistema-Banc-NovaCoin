import jwt from 'jsonwebtoken';

import Empleado from '../src/Empleado/empleado.model.js';
import { Cliente } from '../src/Cliente/cliente.model.js';

export const validateJWT = async (req, res, next) => {

    try {

        const token = req.header('Authorization');

        if (!token) {

            return res.status(401).json({
                success: false,
                message: 'Token requerido'
            });

        }

        const cleanToken = token.replace(
            'Bearer ',
            ''
        );

        const decoded = jwt.verify(
            cleanToken,
            process.env.JWT_SECRET
        );

        // BUSCAR EMPLEADO
        let empleado = await Empleado.findById(
            decoded.id
        );

        // SI NO ES EMPLEADO → BUSCAR CLIENTE
        if (!empleado) {

            const cliente = await Cliente.findById(
                decoded.id
            );

            if (!cliente) {

                return res.status(401).json({
                    success: false,
                    message: 'Usuario no existe'
                });

            }

            req.cliente = cliente;

            return next();

        }

        req.empleado = empleado;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });

    }

};