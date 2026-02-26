import { Router } from "express";
import { create, getAll, update, remove } from "./cuenta.controller.js";

const router = Router();

router.post("/", create);

router.get("/", getAll);

router.put("/:id", update);    // Para editar: http://localhost:3020/.../v1/account/ID_AQUI

router.delete("/:id", remove); // Para eliminar: http://localhost:3020/.../v1/account/ID_AQUI

export default router;