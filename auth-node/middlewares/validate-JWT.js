import jwt from 'jsonwebtoken';
import Empleado from '../src/Empleado/empleado.model.js';

export const validateJWT = async (req, res, next) => {

    try {

        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token requerido'
            });
        }

        const cleanToken = token.replace('Bearer ', '');

        const decoded = jwt.verify(
            cleanToken,
            process.env.JWT_SECRET
        );

        console.log("Token decodificado completo:", JSON.stringify(decoded, null, 2));

        const userId = decoded.sub || decoded.id || decoded.Id;

        const isMongoId = /^[a-f\d]{24}$/i.test(userId);

        if (isMongoId) {
            const empleado = await Empleado.findById(userId);
            if (empleado) {
                req.empleado = empleado;
                req.cliente  = empleado;
                return next();
            }
        }

        req.cliente = {
            id:       userId,
            email:    decoded.email    || decoded.Email,
            username: decoded.username || decoded.Username,
            role:     decoded.role     || decoded.Role,
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });

    }

};