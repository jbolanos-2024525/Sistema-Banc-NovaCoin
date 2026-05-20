import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateCreateCliente = [

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

  body("Password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mínimo 6 caracteres"),

  body("Telefono")
    .trim()
    .notEmpty()
    .withMessage("El teléfono es requerido")
    .matches(/^\d{8,15}$/)
    .withMessage("El teléfono debe contener entre 8 y 15 dígitos"),

  body("dpi")
    .trim()
    .notEmpty()
    .withMessage("El DPI es requerido")
    .matches(/^\d{13}$/)
    .withMessage("El DPI debe tener exactamente 13 dígitos"),

  body("Direccion")
    .trim()
    .notEmpty()
    .withMessage("La dirección es requerida")
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres"),

  checkValidators,
];

export const validateClienteId = [

  param("id")
    .isMongoId()
    .withMessage("No es un ID válido"),

  checkValidators,
];