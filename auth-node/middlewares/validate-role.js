export const isAdmin = (req, res, next) => {

    if (!req.empleado) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado'
        });
    }

    if (req.empleado.Rol !== 'Administrador') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado'
        });
    }

    next();

};

export const hasRole = (...roles) => {

    return (req, res, next) => {

        if (!req.empleado) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!roles.includes(req.empleado.Rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos'
            });
        }

        next();

    };

};