import { Router } from "express";
import {
    create,
    getAll,
    getById,
    update,
    remove
} from "./cliente.controller.js";

import { validateJWT } from "../../middlewares/validate-JWT.js";
import { validateRole } from "../../middlewares/validate-role.js";

const router = Router();

router.post("/", validateJWT, validateRole("ADMIN_ROLE"), create);
router.get("/", validateJWT, getAll);
router.get("/:id", validateJWT, getById);
router.put("/:id", validateJWT, validateRole("ADMIN_ROLE"), update);
router.delete("/:id", validateJWT, validateRole("ADMIN_ROLE"), remove);

export default router;