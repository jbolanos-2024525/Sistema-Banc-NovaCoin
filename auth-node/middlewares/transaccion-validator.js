import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateCreateTransaccion = [
    body("TipoTransaccion")
        .trim().notEmpty().withMessage("El tipo de transacción es requerido")
        .isIn(["DEPOSITO", "RETIRO", "TRANSFERENCIA", "PAGO_PRESTAMO", "TRANSFERENCIA_RECIBIDA"]).withMessage("Tipo de transacción no válido"),

    body("Monto")
        .notEmpty().withMessage("El monto es requerido")
        .isFloat({ min: 0.01 }).withMessage("El monto debe ser mayor a 0"),

    body("Moneda").optional()
        .isIn(["GTQ", "USD"]).withMessage("La moneda debe ser GTQ o USD"),

    body("CuentaOrigen").optional()
        .trim()
        .isString().withMessage("El ID de cuenta origen debe ser un texto válido"),

    body("CuentaDestino").optional()
        .trim()
        .isString().withMessage("El ID de cuenta destino debe ser un texto válido"),

    body("NumeroCuentaOrigen").optional()
        .trim()
        .isString().withMessage("El número de cuenta origen debe ser un texto válido"),

    body("NumeroCuentaDestino").optional()
        .trim()
        .isString().withMessage("El número de cuenta destino debe ser un texto válido"),

    body("Descripcion").optional()
        .trim()
        .isLength({ max: 500 }).withMessage("La descripción no puede exceder 500 caracteres"),

    body("Referencia").optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La referencia no puede exceder 100 caracteres"),

    body("EstadoTransaccion").optional()
        .isIn(["COMPLETADA", "PENDIENTE", "FALLIDA", "CANCELADA"]).withMessage("Estado de transacción no válido"),

    body("PrestamoId").optional()
        .trim()
        .isString().withMessage("El ID del préstamo debe ser un texto válido"),

    checkValidators,
];

export const validateUpdateTransaccion = [
    body("Descripcion").optional()
        .trim()
        .isLength({ max: 500 }).withMessage("La descripción no puede exceder 500 caracteres"),

    body("Referencia").optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La referencia no puede exceder 100 caracteres"),

    body("EstadoTransaccion").optional()
        .isIn(["COMPLETADA", "PENDIENTE", "FALLIDA", "CANCELADA"]).withMessage("Estado de transacción no válido"),

    checkValidators,
];

export const validateTransaccionId = [
    param("id").isMongoId().withMessage("No es un ID de transacción válido"),
    checkValidators,
];

export const validateUsuarioId = [
    param("usuarioId")
        .trim().notEmpty().withMessage("El ID del usuario es requerido")
        .isString().withMessage("El ID del usuario debe ser un texto válido"),
    checkValidators,
];

export const validateCuentaId = [
    param("cuentaId")
        .trim().notEmpty().withMessage("El ID de cuenta es requerido")
        .isString().withMessage("El ID de cuenta debe ser un texto válido"),
    checkValidators,
];

export const validateTransaccionTipo = [
    param("tipo")
        .trim().notEmpty().withMessage("El tipo de transacción es requerido")
        .isIn(["DEPOSITO", "RETIRO", "TRANSFERENCIA", "PAGO_PRESTAMO", "TRANSFERENCIA_RECIBIDA"]).withMessage("Tipo de transacción no válido"),
    checkValidators,
];

export const validateTransaccionEstado = [
    param("estado")
        .trim().notEmpty().withMessage("El estado es requerido")
        .isIn(["COMPLETADA", "PENDIENTE", "FALLIDA", "CANCELADA"]).withMessage("Estado no válido"),
    checkValidators,
];

export const validateFechaRango = [
    body("fechaInicio")
        .trim().notEmpty().withMessage("La fecha de inicio es requerida")
        .isISO8601().withMessage("La fecha de inicio no es válida"),

    body("fechaFin")
        .trim().notEmpty().withMessage("La fecha fin es requerida")
        .isISO8601().withMessage("La fecha fin no es válida"),

    checkValidators,
];

export const validatePrestamoId = [
    param("prestamoId")
        .trim().notEmpty().withMessage("El ID del préstamo es requerido")
        .isString().withMessage("El ID del préstamo debe ser un texto válido"),
    checkValidators,
];

export const validateCambiarEstadoTransaccion = [
    param("id").isMongoId().withMessage("No es un ID de transacción válido"),
    body("estado")
        .trim().notEmpty().withMessage("El estado es requerido")
        .isIn(["COMPLETADA", "PENDIENTE", "FALLIDA", "CANCELADA"]).withMessage("Estado no válido"),
    checkValidators,
];
