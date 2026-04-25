import { body, param } from "express-validator";
import { validateJWT } from "./validate-JWT.js";
import { checkValidators } from "./check-validators.js";

export const validateCreateCuenta = [
  validateJWT,

  body("NumeroCuenta")
    .trim()
    .notEmpty()
    .withMessage("El número de cuenta es requerido"),

  body("TipoCuenta")
    .trim()
    .notEmpty()
    .withMessage("El tipo de cuenta es requerido")
    .isIn(["AHORRO", "MONETARIA", "EMPRESARIAL"])
    .withMessage("El tipo de cuenta debe ser AHORRO, MONETARIA o EMPRESARIAL"),

  body("Moneda")
    .trim()
    .notEmpty()
    .withMessage("La moneda es requerida")
    .isIn(["GTQ", "USD"])
    .withMessage("La moneda debe ser GTQ o USD"),

  body("Saldo")
    .notEmpty()
    .withMessage("El saldo inicial es requerido")
    .isFloat({ min: 0 })
    .withMessage("El saldo no puede ser negativo"),

  body("LimiteRetiroDiario")
    .notEmpty()
    .withMessage("El límite de retiro diario es requerido")
    .isFloat({ min: 0 })
    .withMessage("El límite de retiro no puede ser negativo"),

  body("IdCliente")
    .notEmpty()
    .withMessage("El ID del cliente es requerido")
    .isMongoId()
    .withMessage("El ID del cliente no es válido"),

  checkValidators,
];

export const validateUpdateCuenta = [
  validateJWT,

  body("TipoCuenta")
    .optional()
    .isIn(["AHORRO", "MONETARIA", "EMPRESARIAL"])
    .withMessage("El tipo de cuenta debe ser AHORRO, MONETARIA o EMPRESARIAL"),

  body("Moneda")
    .optional()
    .isIn(["GTQ", "USD"])
    .withMessage("La moneda debe ser GTQ o USD"),

  body("Saldo")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El saldo no puede ser negativo"),

  body("LimiteRetiroDiario")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El límite de retiro no puede ser negativo"),

  body("EstadoCuenta")
    .optional()
    .isIn(["ACTIVA", "BLOQUEADA", "CANCELADA"])
    .withMessage("El estado debe ser ACTIVA, BLOQUEADA o CANCELADA"),

  checkValidators,
];

export const validateCuentaId = [
  validateJWT,

  param("id")
    .isMongoId()
    .withMessage("No es un ID de cuenta válido"),

  checkValidators,
];

export const validateClienteId = [
  validateJWT,

  param("clienteId")
    .isMongoId()
    .withMessage("No es un ID de cliente válido"),

  checkValidators,
];