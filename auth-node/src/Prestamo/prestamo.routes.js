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
import { validateCreatePrestamo, validateUpdatePrestamo, validatePrestamoId, validatePagoCuota, validateCambiarEstadoPrestamo } from "../../middlewares/prestamo-validator.js";

// ── ROUTER USUARIO  →  /NovaCoin/v1/prestamo ──────────────────────────────────
export const userPrestamoRouter = Router();

userPrestamoRouter.post("/", validateJWT, validateCreatePrestamo, create);

userPrestamoRouter.get("/mis-prestamos", validateJWT, getByCliente);

userPrestamoRouter.get("/:id", validateJWT, getById);

userPrestamoRouter.patch("/pagar/:id", validateJWT, validatePrestamoId, validatePagoCuota, pagar);

// ── ROUTER ADMIN  →  /NovaCoin/Admin/v1/prestamo ──────────────────────────────
export const adminPrestamoRouter = Router();

adminPrestamoRouter.post("/", validateJWT, validateCreatePrestamo, isAdmin, create);

adminPrestamoRouter.get("/", validateJWT, isAdmin, getAll);

adminPrestamoRouter.get("/:id", validateJWT, isAdmin, getById);

adminPrestamoRouter.get("/cliente/:clienteId", validateJWT, isAdmin, getByCliente);

adminPrestamoRouter.get("/estado/:estado", validateJWT, isAdmin, getByEstado);

adminPrestamoRouter.get("/empleado/:empleadoId", validateJWT, isAdmin, getByEmpleado);

adminPrestamoRouter.put("/:id", validateJWT, isAdmin, validatePrestamoId, validateUpdatePrestamo, update);

adminPrestamoRouter.patch("/pagar/:id", validateJWT, isAdmin, validatePrestamoId, validatePagoCuota, pagar);

adminPrestamoRouter.patch("/cancelar/:id", validateJWT, isAdmin, cancelar);

adminPrestamoRouter.patch("/estado/:id", validateJWT, isAdmin, validatePrestamoId, validateCambiarEstadoPrestamo, cambiarEstado);

adminPrestamoRouter.delete("/:id", validateJWT, isAdmin, remove);