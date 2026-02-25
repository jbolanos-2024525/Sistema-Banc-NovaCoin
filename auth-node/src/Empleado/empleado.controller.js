import { createEmpleadoRecord } from './empleado.service.js';
import { getEmpleadosRecord } from './empleado.service.js';

export const createEmpleado = async (req, res) => {
  try {
    const empleado = await createEmpleadoRecord({
      empleadoData: req.body,
    });
    res.status(201).json({
      success: true,
      message: 'Empleado registrado correctamente',
      data: empleado,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar el empleado',
      error: err.message,
    });
  }
};

export const getEmpleados = async (req, res) => {
  try {
    const empleados = await getEmpleadosRecord();
    res.status(200).json({
      success: true,
      message: 'Empleados obtenidos correctamente',
      total: empleados.length,
      data: empleados,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los empleados',
      error: err.message,
    });
  }
};