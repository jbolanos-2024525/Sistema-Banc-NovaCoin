import { Router } from 'express';
import {
  createEmpleado,
  getEmpleados,
  deleteEmpleadoSoft
} from './empleado.controller.js';

const router = Router();

// Crear empleado
router.post('/', createEmpleado);

// Obtener empleados activos
router.get('/', getEmpleados);

// Desactivar empleado (Soft Delete)
router.put('/:id', deleteEmpleadoSoft);

export default router;