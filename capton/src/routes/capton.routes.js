import { Router } from "express";
import { register, login ,logout, profile} from "../controllers/capton.controller.js";
import { authCapton } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authCapton, profile);

export default router;
