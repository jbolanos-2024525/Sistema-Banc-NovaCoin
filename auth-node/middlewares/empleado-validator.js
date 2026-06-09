import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateCreateEmpleado = [
    body("Nombre")
        .trim().notEmpty().withMessage("El nombre es requerido")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("El nombre solo debe contener letras"),

    body("Apellido")
        .trim().notEmpty().withMessage("El apellido es requerido")
        .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("El apellido solo debe contener letras"),

    body("DPI")
        .trim().notEmpty().withMessage("El DPI es requerido")
        .isLength({ min: 13, max: 13 }).withMessage("El DPI debe tener 13 caracteres")
        .isNumeric().withMessage("El DPI debe contener solo números"),

    body("Correo")
        .trim().notEmpty().withMessage("El correo es requerido")
        .isEmail().withMessage("El correo no es válido")
        .normalizeEmail(),

    body("Telefono")
        .trim().notEmpty().withMessage("El teléfono es requerido")
        .isLength({ min: 8, max: 8 }).withMessage("El teléfono debe tener 8 caracteres")
        .isNumeric().withMessage("El teléfono debe contener solo números"),

    body("Puesto")
        .trim().notEmpty().withMessage("El puesto es requerido")
        .isIn(["Asesor", "Cajero", "Gerente", "Administrador"]).withMessage("Puesto no válido"),

    body("Salario")
        .notEmpty().withMessage("El salario es requerido")
        .isFloat({ min: 0 }).withMessage("El salario no puede ser negativo"),

    body("Rol")
        .trim().notEmpty().withMessage("El rol es requerido")
        .isIn(["Asesor", "Cajero", "Gerente", "Administrador"]).withMessage("Rol no válido"),

    checkValidators,
];

export const validateUpdateEmpleado = [
    body("Nombre").optional()
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("El nombre solo debe contener letras"),

    body("Apellido").optional()
        .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("El apellido solo debe contener letras"),

    body("Telefono").optional()
        .isLength({ min: 8, max: 8 }).withMessage("El teléfono debe tener 8 caracteres")
        .isNumeric().withMessage("El teléfono debe contener solo números"),

    body("Puesto").optional()
        .isIn(["Asesor", "Cajero", "Gerente", "Administrador"]).withMessage("Puesto no válido"),

    body("Salario").optional()
        .isFloat({ min: 0 }).withMessage("El salario no puede ser negativo"),

    body("Rol").optional()
        .isIn(["Asesor", "Cajero", "Gerente", "Administrador"]).withMessage("Rol no válido"),

    body("Estado").optional()
        .isIn(["ACTIVO", "INACTIVO", "SUSPENDIDO"]).withMessage("Estado no válido"),

    checkValidators,
];

export const validateEmpleadoId = [
    param("id").isMongoId().withMessage("No es un ID de empleado válido"),
    checkValidators,
];

export const validateEmpleadoDPI = [
    param("dpi")
        .trim().notEmpty().withMessage("El DPI es requerido")
        .isLength({ min: 13, max: 13 }).withMessage("El DPI debe tener 13 caracteres")
        .isNumeric().withMessage("El DPI debe contener solo números"),
    checkValidators,
];

export const validateEmpleadoCorreo = [
    param("correo")
        .trim().notEmpty().withMessage("El correo es requerido")
        .isEmail().withMessage("El correo no es válido"),
    checkValidators,
];

export const validateEmpleadoRol = [
    param("rol")
        .trim().notEmpty().withMessage("El rol es requerido")
        .isIn(["Asesor", "Cajero", "Gerente", "Administrador"]).withMessage("Rol no válido"),
    checkValidators,
];

export const validateEmpleadoEstado = [
    body("estado")
        .trim().notEmpty().withMessage("El estado es requerido")
        .isIn(["ACTIVO", "INACTIVO", "SUSPENDIDO"]).withMessage("Estado no válido"),
    checkValidators,
];
