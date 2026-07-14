import { Router } from "express";

import {
    create, getAll, getById, getByNumero, getByUsuario,
    getMisCuentas, update, remove,
    deposit, withdraw, transfer, cambiarEstado
} from "./cuenta.controller.js";

import { validateCreateCuenta, validateUpdateCuenta, validateCuentaId, validateUsuarioId } from "../../middlewares/cuenta-validator.js";
import { validateJWT } from "../../middlewares/validate-JWT.js";
import { isAdmin }     from "../../middlewares/validate-role.js";

// ── ROUTER USUARIO  →  /NovaCoin/v1/cuenta ──────────────────────────────────
export const userCuentaRouter = Router();

userCuentaRouter.get("/mis-cuentas", validateJWT, getMisCuentas);
userCuentaRouter.get("/:id", validateJWT, validateCuentaId, getById);
userCuentaRouter.get("/numero/:numeroCuenta", validateJWT, getByNumero);
userCuentaRouter.patch("/deposit/:cuentaId", validateJWT, deposit);
userCuentaRouter.patch("/withdraw/:cuentaId", validateJWT, withdraw);
userCuentaRouter.post("/transfer", validateJWT, transfer);

// ── ROUTER ADMIN  →  /NovaCoin/Admin/v1/cuenta ──────────────────────────────
export const adminCuentaRouter = Router();

adminCuentaRouter.post("/", validateJWT, validateCreateCuenta, isAdmin, create);
adminCuentaRouter.get("/", validateJWT, isAdmin, getAll);
adminCuentaRouter.get("/usuario/:usuarioId", validateJWT, isAdmin, validateUsuarioId, getByUsuario);
adminCuentaRouter.get("/:id", validateJWT, isAdmin, validateCuentaId, getById);
adminCuentaRouter.get("/numero/:numeroCuenta", validateJWT, isAdmin, getByNumero);
adminCuentaRouter.put("/:id", validateUpdateCuenta, isAdmin, update);
adminCuentaRouter.delete("/:id", validateJWT, isAdmin, validateCuentaId, remove);
adminCuentaRouter.patch("/deposit/:cuentaId", validateJWT, isAdmin, deposit);
adminCuentaRouter.patch("/withdraw/:cuentaId", validateJWT, isAdmin, withdraw);
adminCuentaRouter.post("/transfer", validateJWT, isAdmin, transfer);
adminCuentaRouter.patch("/estado/:id", validateJWT, isAdmin, validateCuentaId, cambiarEstado);