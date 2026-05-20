import {
  createEmpleadoRecord,
  getEmpleadosRecord,
  loginEmpleadoRecord,
  verifyEmpleadoEmail
} from './empleado.service.js';

// Crear empleado
export const createEmpleado = async (req, res) => {

  try {

    const empleado = await createEmpleadoRecord(req.body);

    res.status(201).json({
      success: true,
      message: 'Empleado registrado. Revisa tu correo.',
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

// Login
export const loginEmpleado = async (req, res) => {

  try {

    const { Correo, Password } = req.body;

    const result = await loginEmpleadoRecord(
      Correo,
      Password
    );

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token: result.token,
      empleado: result.empleado,
    });

  } catch (err) {

    res.status(401).json({
      success: false,
      message: err.message,
    });

  }

};

// VERIFICAR EMAIL
export const verifyEmail = async (req, res) => {

  try {

    const { token } = req.params;

    await verifyEmpleadoEmail(token);

    res.json({
      success: true,
      message: 'Correo verificado correctamente'
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};