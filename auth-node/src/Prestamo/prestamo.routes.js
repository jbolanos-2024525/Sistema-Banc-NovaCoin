import { Router } from "express";
import { 
    create, 
    getAll, 
    getById, 
    getByCliente,
    getByEstado,
    getByEmpleado,
    update, 
    pagar,
    cancelar, 
    remove,
    cambiarEstado
} from "./prestamo.controller.js";
import { validateJWT } from "../../middlewares/validate-JWT.js";
import { isAdmin } from "../../middlewares/validate-role.js";

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
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post("/", validateJWT, create);

router.get("/", validateJWT, isAdmin, getAll);

router.get("/:id", validateJWT, getById);

router.get("/cliente/:clienteId", validateJWT, getByCliente);

router.get("/estado/:estado", validateJWT, isAdmin, getByEstado);

router.get("/empleado/:empleadoId", validateJWT, isAdmin, getByEmpleado);

router.put("/:id", validateJWT, isAdmin, update);

router.patch("/pagar/:id", validateJWT, pagar);

router.patch("/cancelar/:id", validateJWT, isAdmin, cancelar);

router.patch("/estado/:id", validateJWT, isAdmin, cambiarEstado);

router.delete("/:id", validateJWT, isAdmin, remove);

export default router;