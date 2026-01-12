import express from "express";
import {
  loginManager,
  createManager,
} from "../controllers/managerController.js";

const router = express.Router();

router.post("/login", loginManager);
router.post("/create", createManager); // optional

export default router;
