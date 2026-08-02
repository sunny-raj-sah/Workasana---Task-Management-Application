import express from "express";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTag);
router.get("/", getTags);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;