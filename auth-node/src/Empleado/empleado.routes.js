import { Router } from 'express';
import {
  createEmpleado,
  getEmpleados,
  getEmpleado,
  getEmpleadoByDPIController,
  getEmpleadoByCorreoController,
  getEmpleadosByRolController,
  updateEmpleado,
  deleteEmpleado,
  deleteEmpleadoHard,
  cambiarEstado
} from './empleado.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin } from '../../middlewares/validate-role.js';

const router = Router();

// Crear empleado
router.post('/', validateJWT, isAdmin, createEmpleado);

// Obtener todos los empleados
router.get('/', validateJWT, isAdmin, getEmpleados);

// Obtener empleado por ID
router.get('/:id', validateJWT, isAdmin, getEmpleado);

// Obtener empleado por DPI
router.get('/dpi/:dpi', validateJWT, isAdmin, getEmpleadoByDPIController);

// Obtener empleado por correo
router.get('/correo/:correo', validateJWT, isAdmin, getEmpleadoByCorreoController);

// Obtener empleados por rol
router.get('/rol/:rol', validateJWT, isAdmin, getEmpleadosByRolController);

// Actualizar empleado
router.put('/:id', validateJWT, isAdmin, updateEmpleado);

// Desactivar empleado (Soft Delete)
router.delete('/:id', validateJWT, isAdmin, deleteEmpleado);

// Eliminar empleado permanentemente (Hard Delete)
router.delete('/hard/:id', validateJWT, isAdmin, deleteEmpleadoHard);

// Cambiar estado de empleado
router.patch('/estado/:id', validateJWT, isAdmin, cambiarEstado);

export default router;