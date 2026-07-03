import { Transaccion } from './transaccion.model.js';

export const createTransaccion = async (transaccionData) => {
    try {
        const transaccion = new Transaccion(transaccionData);
        await transaccion.save();
        return transaccion;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Ya existe una transacción con estos datos');
        }
        throw error;
    }
};

const sanitizeFilters = (filters) => {
    const clean = {};
    const allowed = ['TipoTransaccion', 'EstadoTransaccion', 'Moneda', 'Usuario'];
    for (const key of allowed) {
        if (filters[key] !== undefined && typeof filters[key] === 'string') {
            clean[key] = filters[key];
        }
    }
    return clean;
};

export const getTransacciones = async (filters = {}) => {
    const query = { Estado: true, ...sanitizeFilters(filters) };
    return await Transaccion.find(query)
        .populate("Empleado", "Nombre Apellido Rol")
        .sort({ FechaTransaccion: -1 })
        .lean();
};

export const getTransaccionById = async (id) => {
    if (!id) throw new Error('ID de transacción es requerido');
    
    const transaccion = await Transaccion.findById(id)
        .populate("Empleado", "Nombre Apellido Rol");
    
    if (!transaccion) throw new Error('Transacción no encontrada');
    
    return transaccion;
};

export const getTransaccionesByUsuario = async (usuarioId) => {
    if (!usuarioId) throw new Error('ID de usuario es requerido');
    
    return await Transaccion.find({ 
        Usuario: String(usuarioId), 
        Estado: true 
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const getTransaccionesByCuenta = async (cuentaId) => {
    if (!cuentaId) throw new Error('ID de cuenta es requerido');
    
    return await Transaccion.find({ 
        $or: [
            { CuentaOrigen: cuentaId },
            { CuentaDestino: cuentaId }
        ],
        Estado: true 
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const getTransaccionesByTipo = async (tipo) => {
    if (!tipo) throw new Error('Tipo de transacción es requerido');
    
    return await Transaccion.find({ 
        TipoTransaccion: tipo, 
        Estado: true 
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const getTransaccionesByEstado = async (estado) => {
    if (!estado) throw new Error('Estado es requerido');
    
    return await Transaccion.find({ 
        EstadoTransaccion: estado, 
        Estado: true 
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const getTransaccionesByFecha = async (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) {
        throw new Error('Fechas de inicio y fin son requeridas');
    }
    
    return await Transaccion.find({ 
        FechaTransaccion: {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin)
        },
        Estado: true 
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const getTransaccionesByPrestamo = async (prestamoId) => {
    if (!prestamoId) throw new Error('ID de préstamo es requerido');
    
    return await Transaccion.find({ 
        PrestamoId: prestamoId, 
        Estado: true 
    })
    .populate("Empleado", "Nombre Apellido Rol")
    .sort({ FechaTransaccion: -1 })
    .lean();
};

export const updateTransaccion = async (id, updateData) => {
    if (!id) throw new Error('ID de transacción es requerido');
    
    const allowedUpdates = ['Descripcion', 'Referencia', 'EstadoTransaccion'];
    const updates = {};
    
    for (const key of allowedUpdates) {
        if (updateData[key] !== undefined) {
            updates[key] = updateData[key];
        }
    }
    
    if (Object.keys(updates).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
    }
    
    const transaccion = await Transaccion.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );
    
    if (!transaccion) throw new Error('Transacción no encontrada');
    
    return transaccion;
};

export const deleteTransaccion = async (id) => {
    if (!id) throw new Error('ID de transacción es requerido');
    
    const transaccion = await Transaccion.findByIdAndUpdate(
        id,
        { Estado: false },
        { new: true }
    );
    
    if (!transaccion) throw new Error('Transacción no encontrada');
    
    return transaccion;
};

export const cambiarEstadoTransaccion = async (id, nuevoEstado) => {
    if (!id) throw new Error('ID de transacción es requerido');
    if (!['COMPLETADA', 'PENDIENTE', 'FALLIDA', 'CANCELADA'].includes(nuevoEstado)) {
        throw new Error('Estado no válido');
    }
    
    const transaccion = await Transaccion.findByIdAndUpdate(
        id,
        { EstadoTransaccion: nuevoEstado },
        { new: true, runValidators: true }
    );
    
    if (!transaccion) throw new Error('Transacción no encontrada');
    
    return transaccion;
};

export const getResumenTransacciones = async (usuarioId) => {
    if (!usuarioId) throw new Error('ID de usuario es requerido');
    
    const transacciones = await Transaccion.find({ 
        Usuario: String(usuarioId), 
        Estado: true,
        EstadoTransaccion: 'COMPLETADA'
    }).lean();
    
    const resumen = {
        totalTransacciones: transacciones.length,
        depositos: 0,
        retiros: 0,
        transferenciasEnviadas: 0,
        transferenciasRecibidas: 0,
        pagosPrestamo: 0,
        montoTotalDepositos: 0,
        montoTotalRetiros: 0,
        montoTotalTransferenciasEnviadas: 0,
        montoTotalTransferenciasRecibidas: 0,
        montoTotalPagosPrestamo: 0
    };
    
    transacciones.forEach(t => {
        switch(t.TipoTransaccion) {
            case 'DEPOSITO':
                resumen.depositos++;
                resumen.montoTotalDepositos += t.Monto;
                break;
            case 'RETIRO':
                resumen.retiros++;
                resumen.montoTotalRetiros += t.Monto;
                break;
            case 'TRANSFERENCIA':
                resumen.transferenciasEnviadas++;
                resumen.montoTotalTransferenciasEnviadas += t.Monto;
                break;
            case 'TRANSFERENCIA_RECIBIDA':
                resumen.transferenciasRecibidas++;
                resumen.montoTotalTransferenciasRecibidas += t.Monto;
                break;
            case 'PAGO_PRESTAMO':
                resumen.pagosPrestamo++;
                resumen.montoTotalPagosPrestamo += t.Monto;
                break;
        }
    });
    
    return resumen;
};
