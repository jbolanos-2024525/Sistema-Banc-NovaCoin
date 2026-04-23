import { Router } from "express";
import { create } from "./cuenta.controller.js";
import { getAll } from "./cuenta.controller.js";
import { getById } from "./cuenta.controller.js";
import { getByCliente } from "./cuenta.controller.js";
import { update } from "./cuenta.controller.js";
import { remove } from "./cuenta.controller.js";
import { validateCreateCuenta } from "../../middlewares/cuenta-validator.js";
import { validateUpdateCuenta } from "../../middlewares/cuenta-validator.js";
import { validateCuentaId } from "../../middlewares/cuenta-validator.js";
import { validateClienteId } from "../../middlewares/cuenta-validator.js";

const router = Router();

router.post("/", validateCreateCuenta, create);
router.get("/", getAll);
router.get("/cliente/:clienteId", validateClienteId, getByCliente);
router.get("/:id", validateCuentaId, getById);
router.put("/:id", validateUpdateCuenta, update);
router.delete("/:id", validateCuentaId, remove);

export default router;