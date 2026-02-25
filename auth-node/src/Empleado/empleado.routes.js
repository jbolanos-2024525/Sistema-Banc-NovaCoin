import { Router } from 'express';
import { createEmpleado } from './empleado.controller.js';
import { getEmpleados } from './empleado.controller.js';

const router = Router();

router.post('/', createEmpleado);
router.get('/', getEmpleados);

export default router;








