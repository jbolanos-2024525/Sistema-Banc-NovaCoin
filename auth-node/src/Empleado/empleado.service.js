import Empleado from './empleado.model.js';

export const createEmpleadoRecord = async (empleadoData) => {
    try {
        const empleado = new Empleado(empleadoData);
        await empleado.save();
        return empleado.toObject();
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Ya existe un empleado con estos datos (DPI o correo)');
        }
        throw error;
    }
};

export const getEmpleadosRecord = async (filters = {}) => {
    const query = { ...filters };
    return await Empleado.find(query)
        .sort({ createdAt: -1 })
        .lean();
};

export const getEmpleadoById = async (id) => {
    if (!id) throw new Error('ID de empleado es requerido');
    
    const empleado = await Empleado.findById(id).lean();
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};

export const getEmpleadoByDPI = async (dpi) => {
    if (!dpi) throw new Error('DPI es requerido');
    
    const empleado = await Empleado.findOne({ DPI: dpi }).lean();
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};

export const getEmpleadoByCorreo = async (correo) => {
    if (!correo) throw new Error('Correo es requerido');
    
    const empleado = await Empleado.findOne({ Correo: correo.toLowerCase() }).lean();
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};

export const getEmpleadosByRol = async (rol) => {
    if (!rol) throw new Error('Rol es requerido');
    
    return await Empleado.find({ 
        Rol: rol, 
        isActive: true 
    })
    .sort({ createdAt: -1 })
    .lean();
};

export const updateEmpleadoRecord = async (id, updateData) => {
    if (!id) throw new Error('ID de empleado es requerido');
    
    const allowedUpdates = ['Nombre', 'Apellido', 'DPI', 'Correo', 'Telefono', 'Puesto', 'Salario', 'Rol', 'Estado'];
    const updates = {};
    
    for (const key of allowedUpdates) {
        if (updateData[key] !== undefined) {
            updates[key] = updateData[key];
        }
    }
    
    if (Object.keys(updates).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
    }
    
    const empleado = await Empleado.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true, context: 'query' }
    );
    
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};

export const deleteEmpleadoSoft = async (id) => {
    if (!id) throw new Error('ID de empleado es requerido');
    
    const empleado = await Empleado.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
    
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};

export const deleteEmpleadoAbsolute = async (id) => {
    if (!id) throw new Error('ID de empleado es requerido');
    
    const empleado = await Empleado.findByIdAndDelete(id);
    
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};

export const cambiarEstadoEmpleado = async (id, nuevoEstado) => {
    if (!id) throw new Error('ID de empleado es requerido');
    if (!['ACTIVO', 'INACTIVO', 'SUSPENDIDO'].includes(nuevoEstado)) {
        throw new Error('Estado no válido');
    }
    
    const empleado = await Empleado.findByIdAndUpdate(
        id,
        { Estado: nuevoEstado },
        { new: true, runValidators: true }
    );
    
    if (!empleado) throw new Error('Empleado no encontrado');
    
    return empleado;
};