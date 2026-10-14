import { Router } from "express";
import { createRide, acceptRide } from "../controllers/ride.controller.js";
import { authCapton, authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-ride", authUser, createRide);
router.patch("/accept", authCapton, acceptRide);

export default router;
