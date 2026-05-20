import { Router } from 'express';

import {
  createEmpleado,
  getEmpleados,
  loginEmpleado,
  verifyEmail
} from './empleado.controller.js';

import { isAdmin } from '../../middlewares/validate-role.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

// Crear empleado
router.post('/', createEmpleado);

// Login
router.post('/login', loginEmpleado);

// Verificar email
router.get('/verify/:token', verifyEmail);

// Obtener empleados
router.get('/', validateJWT, isAdmin, getEmpleados);

// Ruta protegida
router.get('/profile', validateJWT, (req, res) => {

  res.json({
    success: true,
    empleado: req.empleado
  });

});

export default router;