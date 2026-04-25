import { Router } from 'express';
import { createEmpleado } from './empleado.controller.js';
import { getEmpleados }   from './empleado.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Empleado:
 *       type: object
 *       required:
 *         - Nombre
 *         - Apellido
 *         - DPI
 *         - Puesto
 *         - Salario
 *         - Rol
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         Nombre:
 *           type: string
 *           description: Nombre del empleado (2-100 caracteres)
 *         Apellido:
 *           type: string
 *           description: Apellido del empleado (2-100 caracteres)
 *         DPI:
 *           type: string
 *           description: DPI del empleado (exactamente 13 dígitos, único)
 *         Puesto:
 *           type: string
 *           description: Puesto o cargo del empleado
 *         Salario:
 *           type: number
 *           minimum: 0
 *           description: Salario del empleado
 *         Rol:
 *           type: string
 *           enum: [Asesor, Cajero, Gerente, Administrador]
 *           description: Rol del empleado dentro del sistema
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo del empleado
 *       example:
 *         Nombre: "María"
 *         Apellido: "López"
 *         DPI: "9876543210987"
 *         Puesto: "Asesor Bancario"
 *         Salario: 8500.00
 *         Rol: "Asesor"
 */

/**
 * @swagger
 * /empleados:
 *   post:
 *     summary: Registrar un nuevo empleado
 *     tags: [Empleado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       201:
 *         description: Empleado registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       400:
 *         description: Error de validación o DPI duplicado
 *       500:
 *         description: Error del servidor
 */
router.post('/', createEmpleado);

/**
 * @swagger
 * /empleados:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Empleado]
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empleado'
 *       500:
 *         description: Error del servidor
 */
router.get('/', getEmpleados);

export default router;