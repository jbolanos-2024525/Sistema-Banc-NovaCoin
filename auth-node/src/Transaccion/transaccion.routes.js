import { Router } from "express";

import {

    getAll,
    getById,
    getByCuenta,
    remove

} from "./transaccion.controller.js";

const router = Router();

/**
 * @swagger
 * /transaccion:
 *   get:
 *     summary: Obtener todas las transacciones
 *     tags: [Transaccion]
 */
router.get(
    "/",
    getAll
);

/**
 * @swagger
 * /transaccion/{id}:
 *   get:
 *     summary: Obtener transacción por ID
 *     tags: [Transaccion]
 */
router.get(
    "/:id",
    getById
);

/**
 * @swagger
 * /transaccion/cuenta/{cuentaId}:
 *   get:
 *     summary: Obtener historial de una cuenta
 *     tags: [Transaccion]
 */
router.get(
    "/cuenta/:cuentaId",
    getByCuenta
);

/**
 * @swagger
 * /transaccion/{id}:
 *   delete:
 *     summary: Eliminar transacción
 *     tags: [Transaccion]
 */
router.delete(
    "/:id",
    remove
);

export default router;