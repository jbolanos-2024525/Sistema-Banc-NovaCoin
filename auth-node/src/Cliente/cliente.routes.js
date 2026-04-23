import { Router } from "express";
import { create } from "./cliente.controller.js";
import { getAll } from "./cliente.controller.js";
import { getById } from "./cliente.controller.js";
import { update } from "./cliente.controller.js";
import { remove } from "./cliente.controller.js";
import { validateCreateCliente } from "../../middlewares/cliente-validator.js";
import { validateClienteId } from "../../middlewares/cliente-validator.js";

const router = Router();

router.post("/", validateCreateCliente, create);
router.get("/", getAll);
router.get("/:id", validateClienteId, getById);
router.put("/:id", validateClienteId, update);
router.delete("/:id", validateClienteId, remove);

export default router;