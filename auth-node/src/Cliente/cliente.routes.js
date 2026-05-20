import { Router } from "express";

import {

  create,
  getAll,
  getById,
  update,
  remove,

  login,
  verifyEmail

} from "./cliente.controller.js";

import {

  validateCreateCliente,
  validateClienteId

} from "../../middlewares/cliente-validator.js";

import { validateJWT } from "../../middlewares/validate-jwt.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - Nombre
 *         - Apellido
 *         - dpi
 *         - Telefono
 *         - Correo
 *         - Password
 *         - Direccion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *
 *         Nombre:
 *           type: string
 *           description: Nombre del cliente
 *
 *         Apellido:
 *           type: string
 *           description: Apellido del cliente
 *
 *         dpi:
 *           type: string
 *           description: DPI del cliente
 *
 *         Telefono:
 *           type: string
 *           description: Número de teléfono
 *
 *         Correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico único
 *
 *         Password:
 *           type: string
 *           description: Contraseña del cliente
 *
 *         Rol:
 *           type: string
 *           default: Cliente
 *
 *         isVerified:
 *           type: boolean
 *           default: false
 *
 *         Direccion:
 *           type: string
 *           description: Dirección del cliente
 *
 *         Estado:
 *           type: boolean
 *           default: true
 *
 *       example:
 *         Nombre: "Carlos"
 *         Apellido: "Lopez"
 *         dpi: "1234567891234"
 *         Telefono: "55554444"
 *         Correo: "carlos@gmail.com"
 *         Password: "123456"
 *         Direccion: "Zona 1"
 */

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     tags: [Cliente]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *
 *     responses:
 *       201:
 *         description: Cliente registrado correctamente
 *
 *       400:
 *         description: Error de validación
 */
router.post(
  "/",
  validateCreateCliente,
  create
);

/**
 * @swagger
 * /cliente/login:
 *   post:
 *     summary: Login de cliente
 *     tags: [Cliente]
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
 *               Correo:
 *                 type: string
 *
 *               Password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Login exitoso
 *
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  "/login",
  login
);

/**
 * @swagger
 * /cliente/verify/{token}:
 *   get:
 *     summary: Verificar correo del cliente
 *     tags: [Cliente]
 *
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Correo verificado correctamente
 *
 *       400:
 *         description: Token inválido
 */
router.get(
  "/verify/:token",
  verifyEmail
);

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Cliente]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de clientes
 *
 *       401:
 *         description: Token inválido
 */
router.get(
  "/",
  validateJWT,
  getAll
);

/**
 * @swagger
 * /cliente/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Cliente]
 *
 *     security:
 *       - bearerAuth: []
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
 *         description: Cliente encontrado
 *
 *       404:
 *         description: Cliente no encontrado
 */
router.get(
  "/:id",
  validateJWT,
  validateClienteId,
  getById
);

/**
 * @swagger
 * /cliente/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Cliente]
 *
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Cliente'
 *
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *
 *       400:
 *         description: Error de validación
 */
router.put(
  "/:id",
  validateJWT,
  validateClienteId,
  update
);

/**
 * @swagger
 * /cliente/{id}:
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Cliente]
 *
 *     security:
 *       - bearerAuth: []
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
 *         description: Cliente eliminado correctamente
 *
 *       404:
 *         description: Cliente no encontrado
 */
router.delete(
  "/:id",
  validateJWT,
  validateClienteId,
  remove
);

/**
 * @swagger
 * /cliente/profile/me:
 *   get:
 *     summary: Obtener perfil del cliente autenticado
 *     tags: [Cliente]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 */
router.get(
  "/profile/me",

  validateJWT,

  (req, res) => {

    res.status(200).json({

      success: true,

      cliente: req.cliente || req.empleado

    });

  }
);

export default router;