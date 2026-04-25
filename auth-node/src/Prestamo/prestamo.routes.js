import { Router } from "express";
import { create, getAll, getById, update, cancelar } from "./prestamo.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Prestamo:
 *       type: object
 *       required:
 *         - tipoPrestamo
 *         - monto
 *         - plazoMeses
 *         - cliente
 *         - empleado
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         tipoPrestamo:
 *           type: string
 *           enum: [PERSONAL, HIPOTECARIO, VEHICULAR]
 *           description: Tipo de préstamo solicitado
 *         monto:
 *           type: number
 *           minimum: 1
 *           description: Monto total del préstamo
 *         tasaInteres:
 *           type: number
 *           default: 12
 *           description: Tasa de interés anual (%)
 *         plazoMeses:
 *           type: number
 *           minimum: 1
 *           description: Plazo del préstamo en meses
 *         cuotaMensual:
 *           type: number
 *           description: Cuota mensual calculada automáticamente
 *         montoPendiente:
 *           type: number
 *           description: Monto pendiente de pago
 *         totalPagado:
 *           type: number
 *           default: 0
 *           description: Total acumulado pagado hasta la fecha
 *         numeroCuotasPagadas:
 *           type: number
 *           default: 0
 *           description: Número de cuotas pagadas hasta la fecha
 *         estadoPrestamo:
 *           type: string
 *           enum: [ACTIVO, PAGADO, VENCIDO, CANCELADO]
 *           default: ACTIVO
 *           description: Estado actual del préstamo
 *         cliente:
 *           type: string
 *           description: ID del cliente solicitante
 *         empleado:
 *           type: string
 *           description: ID del empleado que aprueba el préstamo
 *       example:
 *         tipoPrestamo: "PERSONAL"
 *         monto: 25000.00
 *         tasaInteres: 12
 *         plazoMeses: 24
 *         cliente: "664f1a2b3c4d5e6f7a8b9c0d"
 *         empleado: "664f1a2b3c4d5e6f7a8b9c0e"
 */

/**
 * @swagger
 * /prestamo:
 *   post:
 *     summary: Solicitar un nuevo préstamo
 *     tags: [Prestamo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prestamo'
 *     responses:
 *       201:
 *         description: Préstamo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post("/", create);

/**
 * @swagger
 * /prestamo:
 *   get:
 *     summary: Obtener todos los préstamos
 *     tags: [Prestamo]
 *     responses:
 *       200:
 *         description: Lista de préstamos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestamo'
 *       500:
 *         description: Error del servidor
 */
router.get("/", getAll);

/**
 * @swagger
 * /prestamo/{id}:
 *   get:
 *     summary: Obtener un préstamo por ID
 *     tags: [Prestamo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo
 *     responses:
 *       200:
 *         description: Préstamo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestamo'
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", getById);

/**
 * @swagger
 * /prestamo/{id}:
 *   put:
 *     summary: Actualizar un préstamo
 *     tags: [Prestamo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prestamo'
 *     responses:
 *       200:
 *         description: Préstamo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", update);

/**
 * @swagger
 * /prestamo/{id}/cancelar:
 *   patch:
 *     summary: Cancelar un préstamo activo
 *     tags: [Prestamo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo a cancelar
 *     responses:
 *       200:
 *         description: Préstamo cancelado correctamente
 *       400:
 *         description: El préstamo no puede cancelarse (ya está pagado, vencido o cancelado)
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch("/:id/cancelar", cancelar);

export default router;