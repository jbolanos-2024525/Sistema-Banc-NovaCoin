import { Router } from "express";
import { create } from "./cliente.controller.js";
import { getAll } from "./cliente.controller.js";

const router = Router();

router.post("/", create);
router.get("/", getAll);

export default router;