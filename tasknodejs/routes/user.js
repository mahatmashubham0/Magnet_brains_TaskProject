import express from "express";
import { getMyProfile, getUserTaskById, login, logout, register } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", register);
router.post("/login", login);

router.get("/logout", logout);

router.get("/me", isAuthenticated, getMyProfile);

router.get("/me", isAuthenticated, getUserTaskById);

export default router;
