import { Router } from "express";
import { createCommunityVal, currentUser, getAllMembersVal, isLoggedIn, validateRequest } from "../middlewares";
import { createCommunity, getAllCommunities, getAllMembers, getMyJoinedCommunities, getMyOwnedCommunities } from "../controllers";

const router = Router();

router.post("/", currentUser, isLoggedIn, createCommunityVal, validateRequest, createCommunity);
router.get("/", getAllCommunities);
router.get("/me/owner", currentUser, isLoggedIn, getMyOwnedCommunities);
router.get("/:id/members", getAllMembersVal, validateRequest, getAllMembers)

router.get("/me/member", currentUser, isLoggedIn, getMyJoinedCommunities)

export { router as communityRouter };