import { Router } from "express";
import {
  getNewRide,
  register,
  login,
  logout,
  profile,
} from "../controllers/capton.controller.js";
import { authCapton } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authCapton, profile);
router.get("/new-ride", authCapton, getNewRide);

export default router;
