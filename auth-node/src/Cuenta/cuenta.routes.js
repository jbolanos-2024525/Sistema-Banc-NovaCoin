import { Router } from "express";

import { create }       from "./cuenta.controller.js";
import { getAll }       from "./cuenta.controller.js";
import { getById }      from "./cuenta.controller.js";
import { getByCliente } from "./cuenta.controller.js";
import { update }       from "./cuenta.controller.js";
import { remove }       from "./cuenta.controller.js";

import { deposit }      from "./cuenta.controller.js";
import { withdraw }     from "./cuenta.controller.js";
import { transfer }     from "./cuenta.controller.js";

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
 *         - TipoCuenta
 *         - IdCliente
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *
 *         NumeroCuenta:
 *           type: string
 *           description: Número de cuenta bancaria
 *
 *         TipoCuenta:
 *           type: string
 *           enum: [AHORRO, MONETARIA, EMPRESARIAL]
 *           description: Tipo de cuenta bancaria
 *
 *         Moneda:
 *           type: string
 *           enum: [GTQ, USD]
 *           default: GTQ
 *
 *         Saldo:
 *           type: number
 *           minimum: 0
 *
 *         LimiteRetiroDiario:
 *           type: number
 *
 *         EstadoCuenta:
 *           type: string
 *           enum: [ACTIVA, BLOQUEADA, CANCELADA]
 *
 *         IdCliente:
 *           type: string
 *           description: ID del cliente propietario
 *
 *         Estado:
 *           type: boolean
 *           default: true
 *
 *       example:
 *         TipoCuenta: "AHORRO"
 *         Moneda: "GTQ"
 *         Saldo: 5000
 *         LimiteRetiroDiario: 2000
 *         IdCliente: "664f1a2b3c4d5e6f7a8b9c0d"
 */

/**
 * @swagger
 * /cuenta:
 *   post:
 *     summary: Crear una nueva cuenta bancaria
 *     tags: [Cuenta]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuenta'
 *
 *     responses:
 *       201:
 *         description: Cuenta creada correctamente
 *
 *       400:
 *         description: Error de validación
 */
router.post(
  "/",
  validateCreateCuenta,
  create
);

/**
 * @swagger
 * /cuenta:
 *   get:
 *     summary: Obtener todas las cuentas bancarias
 *     tags: [Cuenta]
 *
 *     responses:
 *       200:
 *         description: Lista de cuentas
 */
router.get(
  "/",
  getAll
);

/**
 * @swagger
 * /cuenta/cliente/{clienteId}:
 *   get:
 *     summary: Obtener cuentas de un cliente
 *     tags: [Cuenta]
 *
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Lista de cuentas
 */
router.get(
  "/cliente/:clienteId",
  validateClienteId,
  getByCliente
);

/**
 * @swagger
 * /cuenta/{id}:
 *   get:
 *     summary: Obtener cuenta por ID
 *     tags: [Cuenta]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Cuenta encontrada
 */
router.get(
  "/:id",
  validateCuentaId,
  getById
);

/**
 * @swagger
 * /cuenta/{id}:
 *   put:
 *     summary: Actualizar cuenta bancaria
 *     tags: [Cuenta]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuenta'
 *
 *     responses:
 *       200:
 *         description: Cuenta actualizada correctamente
 */
router.put(
  "/:id",
  validateUpdateCuenta,
  update
);

/**
 * @swagger
 * /cuenta/{id}:
 *   delete:
 *     summary: Eliminar cuenta bancaria
 *     tags: [Cuenta]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 */
router.delete(
  "/:id",
  validateCuentaId,
  remove
);

/**
 * @swagger
 * /cuenta/deposit/{cuentaId}:
 *   patch:
 *     summary: Realizar depósito a una cuenta
 *     tags: [Cuenta]
 *
 *     parameters:
 *       - in: path
 *         name: cuentaId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               monto:
 *                 type: number
 *
 *     responses:
 *       200:
 *         description: Depósito realizado correctamente
 */
router.patch(
  "/deposit/:cuentaId",
  deposit
);

/**
 * @swagger
 * /cuenta/withdraw/{cuentaId}:
 *   patch:
 *     summary: Realizar retiro de una cuenta
 *     tags: [Cuenta]
 *
 *     parameters:
 *       - in: path
 *         name: cuentaId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               monto:
 *                 type: number
 *
 *     responses:
 *       200:
 *         description: Retiro realizado correctamente
 */
router.patch(
  "/withdraw/:cuentaId",
  withdraw
);

/**
 * @swagger
 * /cuenta/transfer:
 *   post:
 *     summary: Transferencia entre cuentas
 *     tags: [Cuenta]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               cuentaOrigenId:
 *                 type: string
 *
 *               cuentaDestinoId:
 *                 type: string
 *
 *               monto:
 *                 type: number
 *
 *     responses:
 *       200:
 *         description: Transferencia realizada correctamente
 */
router.post(
  "/transfer",
  transfer
);

export default router;