import { Router } from 'express';
import Empleado from './empleado.model.js'; 

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'Healthy',
        module: 'Empleado',
        timeStamp: new Date().toISOString()
    });
});

router.get('/', async (req, res, next) => {
    try {
        const empleados = await Empleado.find();
        res.json(empleados);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const empleado = await Empleado.findOne({ IdEmpleado: req.params.id });

        if (!empleado) {
            return res.status(404).json({
                success: false,
                message: 'Empleado no encontrado'
            });
        }

        res.json(empleado);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const nuevoEmpleado = new Empleado(req.body);
        const empleadoGuardado = await nuevoEmpleado.save();
        res.status(201).json(empleadoGuardado);
    } catch (error) {
        next(error);
    }
});

export default router;