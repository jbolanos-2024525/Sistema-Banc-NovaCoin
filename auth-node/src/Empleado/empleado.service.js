import Empleado from './empleado.model.js';

// Crear empleado (Simplificado sin contraseñas ni correos)
export const createEmpleadoRecord = async (empleadoData) => {
    // Crea la instancia directamente con los datos limpios del formulario
    const empleado = new Empleado(empleadoData);

    // Guarda el registro en MongoDB aplicando los valores por defecto
    const savedEmpleado = await empleado.save();

    // Retorna el objeto puro de JavaScript listo para el controlador
    return savedEmpleado.toObject();
};

// Obtener TODOS los empleados (Sin filtros porque ya no quedan ocultos)
export const getEmpleadosRecord = async () => {
    return await Empleado.find();
};

// Hard Delete - Eliminar empleado definitivamente de MongoDB
export const deleteEmpleadoAbsoluteRecord = async (id) => {
    // Remueve el documento físicamente de la colección por su ID
    return await Empleado.findByIdAndDelete(id);
};