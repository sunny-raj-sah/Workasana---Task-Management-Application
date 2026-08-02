 import express from "express";
import { updateProfile, changePassword } from "../controllers/profileController.js";
import { profileAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", profileAuthMiddleware, updateProfile);

router.put("/password", profileAuthMiddleware, changePassword);

export default router;