import { body, param } from "express-validator";
import { validateJWT } from "./validate-JWT.js";
import { checkValidators } from "./check-validators.js";

export const validateCreateCuenta = [
    validateJWT,

    body("TipoCuenta")
        .trim().notEmpty().withMessage("El tipo de cuenta es requerido")
        .isIn(["AHORRO", "MONETARIA", "EMPRESARIAL"]).withMessage("Debe ser AHORRO, MONETARIA o EMPRESARIAL"),

    body("Moneda")
        .trim().notEmpty().withMessage("La moneda es requerida")
        .isIn(["GTQ", "USD"]).withMessage("La moneda debe ser GTQ o USD"),

    body("Saldo")
        .notEmpty().withMessage("El saldo inicial es requerido")
        .isFloat({ min: 0 }).withMessage("El saldo no puede ser negativo"),

    body("LimiteRetiroDiario")
        .notEmpty().withMessage("El límite de retiro diario es requerido")
        .isFloat({ min: 0 }).withMessage("El límite no puede ser negativo"),

    body("IdUsuario")
        .notEmpty().withMessage("El ID del usuario es requerido")
        .isString().withMessage("El ID del usuario debe ser un texto válido"),

    checkValidators,
];

export const validateUpdateCuenta = [
    validateJWT,

    body("TipoCuenta").optional()
        .isIn(["AHORRO", "MONETARIA", "EMPRESARIAL"]).withMessage("Tipo inválido"),

    body("Moneda").optional()
        .isIn(["GTQ", "USD"]).withMessage("Moneda inválida"),

    body("Saldo").optional()
        .isFloat({ min: 0 }).withMessage("El saldo no puede ser negativo"),

    body("LimiteRetiroDiario").optional()
        .isFloat({ min: 0 }).withMessage("El límite no puede ser negativo"),

    body("EstadoCuenta").optional()
        .isIn(["ACTIVA", "BLOQUEADA", "CANCELADA"]).withMessage("Estado inválido"),

    checkValidators,
];

export const validateCuentaId = [
    validateJWT,
    param("id").isMongoId().withMessage("No es un ID de cuenta válido"),
    checkValidators,
];

export const validateUsuarioId = [
    param("usuarioId")
        .notEmpty().withMessage("El ID del usuario es requerido")
        .isString().withMessage("El ID del usuario debe ser texto válido"),
    checkValidators,
];