import {
  createEmpleadoRecord,
  getEmpleadosRecord,
  getEmpleadoById,
  getEmpleadoByDPI,
  getEmpleadoByCorreo,
  getEmpleadosByRol,
  updateEmpleadoRecord,
  deleteEmpleadoSoft,
  deleteEmpleadoAbsolute,
  cambiarEstadoEmpleado
} from './empleado.service.js';

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

export const getEmpleados = async (req, res) => {
  try {
    const filters = req.query || {};
    const empleados = await getEmpleadosRecord(filters);
    res.status(200).json({
      success: true,
      data: empleados,
      count: empleados.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleados',
      error: err.message,
    });
  }
};

export const getEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await getEmpleadoById(id);
    res.status(200).json({
      success: true,
      data: empleado,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmpleadoByDPIController = async (req, res) => {
  try {
    const { dpi } = req.params;
    const empleado = await getEmpleadoByDPI(dpi);
    res.status(200).json({
      success: true,
      data: empleado,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmpleadoByCorreoController = async (req, res) => {
  try {
    const { correo } = req.params;
    const empleado = await getEmpleadoByCorreo(correo);
    res.status(200).json({
      success: true,
      data: empleado,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmpleadosByRolController = async (req, res) => {
  try {
    const { rol } = req.params;
    const empleados = await getEmpleadosByRol(rol);
    res.status(200).json({
      success: true,
      data: empleados,
      count: empleados.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await updateEmpleadoRecord(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Empleado actualizado con éxito.',
      data: empleado,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el empleado',
      error: err.message,
    });
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await deleteEmpleadoSoft(id);
    res.status(200).json({
      success: true,
      message: 'Empleado desactivado correctamente',
      data: empleado
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al desactivar el empleado',
      error: err.message,
    });
  }
};

export const deleteEmpleadoHard = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await deleteEmpleadoAbsolute(id);
    res.status(200).json({
      success: true,
      message: 'Empleado eliminado permanentemente de la base de datos',
      data: empleado
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el empleado',
      error: err.message,
    });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const empleado = await cambiarEstadoEmpleado(id, estado);
    res.status(200).json({
      success: true,
      message: 'Estado de empleado actualizado correctamente',
      data: empleado
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el estado del empleado',
      error: err.message,
    });
  }
};