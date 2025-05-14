import { Router } from "express";
import {
  addMemberVal,
  currentUser,
  deleteMemberVal,
  isCommunityAdmin,
  isCommunityModerator,
  isLoggedIn,
  validateRequest,
} from "../middlewares";
import { addMember, removeMember } from "../controllers";

const router = Router();

router.post(
  "/",
  addMemberVal,
  validateRequest,
  currentUser,
  isLoggedIn,
  isCommunityAdmin,
  addMember
);
router.delete(
  "/:id",
  deleteMemberVal,
  validateRequest,
  currentUser,
  isLoggedIn,
  isCommunityModerator,
  removeMember
);
export { router as memberRouter };
