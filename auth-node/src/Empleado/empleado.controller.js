import {
  createEmpleadoRecord,
  getEmpleadosRecord,
  deleteEmpleadoAbsoluteRecord // 👈 Importamos la nueva función de eliminación física
} from './empleado.service.js';

// Crear empleado
export const createEmpleado = async (req, res) => {
  try {
    const empleado = await createEmpleadoRecord(req.body);

    res.status(201).json({
      success: true,
      message: 'Empleado registrado con éxito.',
      data: empleado,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar el empleado',
      error: err.message,
    });
  }
};

// Obtener empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await getEmpleadosRecord();

    res.status(200).json({
      success: true,
      data: empleados,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleados',
      error: err.message,
    });
  }
};

// Eliminar empleado (Hard Delete - Borrado Físico de Mongo)
export const deleteEmpleadoSoft = async (req, res) => {
  try {
    const { id } = req.params;

    // Ejecuta la destrucción del documento directo en MongoDB
    const empleadoEliminado = await deleteEmpleadoAbsoluteRecord(id);

    if (!empleadoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el empleado para eliminar'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Empleado eliminado por completo de la base de datos',
      data: empleadoEliminado
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al intentar eliminar al empleado',
      error: err.message,
    });
  }
};