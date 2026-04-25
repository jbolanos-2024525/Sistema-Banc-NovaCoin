import { Router } from "express";
import { create }       from "./cuenta.controller.js";
import { getAll }       from "./cuenta.controller.js";
import { getById }      from "./cuenta.controller.js";
import { getByCliente } from "./cuenta.controller.js";
import { update }       from "./cuenta.controller.js";
import { remove }       from "./cuenta.controller.js";
import { validateCreateCuenta } from "../../middlewares/cuenta-validator.js";
import { validateUpdateCuenta } from "../../middlewares/cuenta-validator.js";
import { validateCuentaId }     from "../../middlewares/cuenta-validator.js";
import { validateClienteId }    from "../../middlewares/cuenta-validator.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cuenta:
 *       type: object
 *       required:
 *         - NumeroCuenta
 *         - TipoCuenta
 *         - Moneda
 *         - Saldo
 *         - LimiteRetiroDiario
 *         - IdCliente
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         NumeroCuenta:
 *           type: string
 *           description: Número de cuenta bancaria (único)
 *         TipoCuenta:
 *           type: string
 *           enum: [AHORRO, MONETARIA, EMPRESARIAL]
 *           description: Tipo de cuenta bancaria
 *         Moneda:
 *           type: string
 *           enum: [GTQ, USD]
 *           default: GTQ
 *           description: Moneda de la cuenta
 *         Saldo:
 *           type: number
 *           minimum: 0
 *           description: Saldo actual de la cuenta
 *         LimiteRetiroDiario:
 *           type: number
 *           description: Límite de retiro permitido por día
 *         EstadoCuenta:
 *           type: string
 *           enum: [ACTIVA, BLOQUEADA, CANCELADA]
 *           default: ACTIVA
 *           description: Estado actual de la cuenta
 *         IdCliente:
 *           type: string
 *           description: ID del cliente propietario de la cuenta
 *         Estado:
 *           type: boolean
 *           default: true
 *           description: Estado activo del registro
 *       example:
 *         NumeroCuenta: "GT001234567890"
 *         TipoCuenta: "AHORRO"
 *         Moneda: "GTQ"
 *         Saldo: 5000.00
 *         LimiteRetiroDiario: 2000.00
 *         IdCliente: "664f1a2b3c4d5e6f7a8b9c0d"
 */

/**
 * @swagger
 * /cuenta:
 *   post:
 *     summary: Crear una nueva cuenta bancaria
 *     tags: [Cuenta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuenta'
 *     responses:
 *       201:
 *         description: Cuenta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuenta'
 *       400:
 *         description: Error de validación o número de cuenta duplicado
 *       500:
 *         description: Error del servidor
 */
router.post("/", validateCreateCuenta, create);

/**
 * @swagger
 * /cuenta:
 *   get:
 *     summary: Obtener todas las cuentas bancarias
 *     tags: [Cuenta]
 *     responses:
 *       200:
 *         description: Lista de cuentas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cuenta'
 *       500:
 *         description: Error del servidor
 */
router.get("/", getAll);

/**
 * @swagger
 * /cuenta/cliente/{clienteId}:
 *   get:
 *     summary: Obtener todas las cuentas de un cliente
 *     tags: [Cuenta]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de cuentas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cuenta'
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/cliente/:clienteId", validateClienteId, getByCliente);

/**
 * @swagger
 * /cuenta/{id}:
 *   get:
 *     summary: Obtener una cuenta por ID
 *     tags: [Cuenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cuenta
 *     responses:
 *       200:
 *         description: Cuenta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuenta'
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", validateCuentaId, getById);

/**
 * @swagger
 * /cuenta/{id}:
 *   put:
 *     summary: Actualizar una cuenta bancaria
 *     tags: [Cuenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuenta'
 *     responses:
 *       200:
 *         description: Cuenta actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuenta'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", validateUpdateCuenta, update);

/**
 * @swagger
 * /cuenta/{id}:
 *   delete:
 *     summary: Eliminar una cuenta bancaria
 *     tags: [Cuenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cuenta
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", validateCuentaId, remove);

export default router;