import express from "express";
import { login, register } from "../controllers/authControllers";

const router = express.Router();

// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

export default router;
