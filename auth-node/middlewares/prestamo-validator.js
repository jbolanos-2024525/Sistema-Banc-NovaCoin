import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateCreatePrestamo = [
    body("tipoPrestamo")
        .trim().notEmpty().withMessage("El tipo de préstamo es requerido")
        .isIn(["PERSONAL", "HIPOTECARIO", "VEHICULAR"]).withMessage("Debe ser PERSONAL, HIPOTECARIO o VEHICULAR"),

    body("monto")
        .notEmpty().withMessage("El monto es requerido")
        .isFloat({ min: 1 }).withMessage("El monto debe ser mayor a 0"),

    body("tasaInteres").optional()
        .isFloat({ min: 0, max: 100 }).withMessage("La tasa de interés debe estar entre 0 y 100"),

    body("plazoMeses")
        .notEmpty().withMessage("El plazo en meses es requerido")
        .isInt({ min: 1, max: 360 }).withMessage("El plazo debe estar entre 1 y 360 meses"),

    body("proposito").optional()
        .trim()
        .isLength({ max: 500 }).withMessage("El propósito no puede exceder 500 caracteres"),

    body("cliente")
        .trim().notEmpty().withMessage("El ID del cliente es requerido")
        .isString().withMessage("El ID del cliente debe ser un texto válido"),

    body("cuentaId").optional()
        .trim()
        .isString().withMessage("El ID de la cuenta debe ser un texto válido"),

    checkValidators,
];

export const validateUpdatePrestamo = [
    body("proposito").optional()
        .trim()
        .isLength({ max: 500 }).withMessage("El propósito no puede exceder 500 caracteres"),

    body("estadoPrestamo").optional()
        .isIn(["ACTIVO", "PAGADO", "VENCIDO", "CANCELADO", "RECHAZADO"]).withMessage("Estado no válido"),

    body("cuentaId").optional()
        .trim()
        .isString().withMessage("El ID de la cuenta debe ser un texto válido"),

    checkValidators,
];

export const validatePrestamoId = [
    param("id").isMongoId().withMessage("No es un ID de préstamo válido"),
    checkValidators,
];

export const validateClienteId = [
    param("clienteId")
        .trim().notEmpty().withMessage("El ID del cliente es requerido")
        .isString().withMessage("El ID del cliente debe ser un texto válido"),
    checkValidators,
];

export const validatePrestamoEstado = [
    param("estado")
        .trim().notEmpty().withMessage("El estado es requerido")
        .isIn(["ACTIVO", "PAGADO", "VENCIDO", "CANCELADO", "RECHAZADO"]).withMessage("Estado no válido"),
    checkValidators,
];

export const validateEmpleadoId = [
    param("empleadoId")
        .trim().notEmpty().withMessage("El ID del empleado es requerido")
        .isMongoId().withMessage("No es un ID de empleado válido"),
    checkValidators,
];

export const validatePagoCuota = [
    param("id").isMongoId().withMessage("No es un ID de préstamo válido"),
    body("monto")
        .notEmpty().withMessage("El monto es requerido")
        .isFloat({ min: 0.01 }).withMessage("El monto debe ser mayor a 0"),
    checkValidators,
];

export const validateCambiarEstadoPrestamo = [
    param("id").isMongoId().withMessage("No es un ID de préstamo válido"),
    body("estado")
        .trim().notEmpty().withMessage("El estado es requerido")
        .isIn(["ACTIVO", "PAGADO", "VENCIDO", "CANCELADO", "RECHAZADO"]).withMessage("Estado no válido"),
    checkValidators,
];
