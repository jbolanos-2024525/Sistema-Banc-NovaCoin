import { Router } from "express";

import {create, getAll, getById, update, cancelar} from "./prestamo.controller.js";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.patch("/:id/cancelar", cancelar);

export default router;