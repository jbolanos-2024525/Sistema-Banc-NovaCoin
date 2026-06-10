import { Router } from "express";
import {
    create,
    getAll,
    getById,
    getByUsuario,
    getMisTransacciones,
    getByCuenta,
    getByTipo,
    getByEstado,
    getByFecha,
    getByPrestamo,
    getResumen,
    update,
    remove,
    cambiarEstado
} from "./transaccion.controller.js";

import { validateJWT } from "../../middlewares/validate-JWT.js";
import { isAdmin } from "../../middlewares/validate-role.js";
import { validateCreateTransaccion } from "../../middlewares/transaccion-validator.js";

// ── ROUTER USUARIO  →  /NovaCoin/v1/transaccion ──────────────────────────────────
export const userTransaccionRouter = Router();

userTransaccionRouter.get("/mis-transacciones", validateJWT, getMisTransacciones);
userTransaccionRouter.get("/resumen", validateJWT, getResumen);
userTransaccionRouter.get("/:id", validateJWT, getById);
userTransaccionRouter.get("/cuenta/:cuentaId", validateJWT, getByCuenta);

// ── ROUTER ADMIN  →  /NovaCoin/Admin/v1/transaccion ──────────────────────────────
export const adminTransaccionRouter = Router();

adminTransaccionRouter.post("/", validateJWT, validateCreateTransaccion, create);
adminTransaccionRouter.get("/", validateJWT, isAdmin, getAll);
adminTransaccionRouter.get("/:id", validateJWT, isAdmin, getById);
adminTransaccionRouter.get("/usuario/:usuarioId", validateJWT, isAdmin, getByUsuario);
adminTransaccionRouter.get("/cuenta/:cuentaId", validateJWT, isAdmin, getByCuenta);
adminTransaccionRouter.get("/tipo/:tipo", validateJWT, isAdmin, getByTipo);
adminTransaccionRouter.get("/estado/:estado", validateJWT, isAdmin, getByEstado);
adminTransaccionRouter.get("/fecha", validateJWT, isAdmin, getByFecha);
adminTransaccionRouter.get("/prestamo/:prestamoId", validateJWT, isAdmin, getByPrestamo);
adminTransaccionRouter.put("/:id", validateJWT, isAdmin, update);
adminTransaccionRouter.delete("/:id", validateJWT, isAdmin, remove);
adminTransaccionRouter.patch("/estado/:id", validateJWT, isAdmin, cambiarEstado);
