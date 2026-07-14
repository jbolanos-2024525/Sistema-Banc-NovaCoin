export const isAdmin = (req, res, next) => {

    const role = req.cliente?.role || req.cliente?.Role || req.empleado?.Rol;

    const adminRoles = ['ADMIN_ROLE', 'ADMIN', 'Administrador', 'admin', 'administrator'];

    if (adminRoles.includes(role)) {
        return next();
    }

    if (!req.cliente && !req.empleado) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado'
        });
    }

    return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
    });

};

export const hasRole = (...roles) => {

    return (req, res, next) => {

        const role = req.cliente?.role || req.cliente?.Role || req.empleado?.Rol;

        if (!role) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!roles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos'
            });
        }

        next();

    };

};