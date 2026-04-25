import { Router } from "express";
import { create }  from "./cliente.controller.js";
import { getAll }  from "./cliente.controller.js";
import { getById } from "./cliente.controller.js";
import { update }  from "./cliente.controller.js";
import { remove }  from "./cliente.controller.js";
import { validateCreateCliente } from "../../middlewares/cliente-validator.js";
import { validateClienteId }     from "../../middlewares/cliente-validator.js";

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
 *         - Direccion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         Nombre:
 *           type: string
 *           description: Nombre del cliente
 *         Apellido:
 *           type: string
 *           description: Apellido del cliente
 *         dpi:
 *           type: string
 *           description: DPI del cliente (exactamente 13 dígitos)
 *         Telefono:
 *           type: string
 *           description: Teléfono del cliente
 *         Correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente (único)
 *         Direccion:
 *           type: string
 *           description: Dirección del cliente
 *         Estado:
 *           type: boolean
 *           default: true
 *           description: Estado activo del cliente
 *       example:
 *         Nombre: "Juan"
 *         Apellido: "Pérez"
 *         dpi: "1234567890123"
 *         Telefono: "50212345678"
 *         Correo: "juan.perez@email.com"
 *         Direccion: "Zona 10, Ciudad de Guatemala"
 */

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post("/", validateCreateCliente, create);

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Error del servidor
 */
router.get("/", getAll);

/**
 * @swagger
 * /cliente/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", validateClienteId, getById);

/**
 * @swagger
 * /cliente/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", validateClienteId, update);

/**
 * @swagger
 * /cliente/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", validateClienteId, remove);

export default router;