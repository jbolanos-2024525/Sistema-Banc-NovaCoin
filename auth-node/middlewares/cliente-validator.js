import { body, param } from "express-validator";
import { validateJWT } from "./validate-JWT.js";
import { checkValidators } from "./check-validators.js";


export const validateCreateCliente = [
  validateJWT,

  body("Nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("Apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("Correo")
    .trim()
    .notEmpty()
    .withMessage("El correo es requerido")
    .isEmail()
    .withMessage("Debe ingresar un correo válido"),

  body("Telefono")
    .trim()
    .notEmpty()
    .withMessage("El teléfono es requerido")
    .isLength({ min: 8, max: 15 })
    .withMessage("El teléfono debe tener entre 8 y 15 caracteres"),

  body("DPI")
    .trim()
    .notEmpty()
    .withMessage("El DPI es requerido")
    .isLength({ min: 13, max: 13 })
    .withMessage("El DPI debe tener 13 dígitos"),

  body("Dirección")
    .trim()
    .notEmpty()
    .withMessage("La dirección es requerida")
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres"),

  body("monthlyIncome")
    .notEmpty()
    .withMessage("El ingreso mensual es requerido")
    .isFloat({ min: 0 })
    .withMessage("El ingreso mensual debe ser mayor o igual a 0"),

  checkValidators,
];


export const validateClienteId = [
  validateJWT,

  param("id")
    .isMongoId()
    .withMessage("No es un ID válido"),

  checkValidators,
];