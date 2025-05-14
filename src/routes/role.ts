import { Router } from "express";
import { createRoleVal, validateRequest } from "../middlewares";
import { createRole, getAllRole } from "../controllers";

const router = Router();

router.post("/", createRoleVal, validateRequest, createRole);
router.get("/", getAllRole)
export { router as roleRouter };