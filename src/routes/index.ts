import { Router } from "express";
import { roleRouter } from "./role";
import { authRouter } from "./user";
import { communityRouter } from "./community";
import { memberRouter } from "./member";

const router = Router();

router.use("/role", roleRouter);
router.use("/auth", authRouter);
router.use("/community", communityRouter);
router.use("/member", memberRouter);

export default router;