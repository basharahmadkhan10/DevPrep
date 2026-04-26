import Router from "express";
import {
	register,
	login,
	logout,
	tokenGeneration,
	googleLogin
} from "../controllers/auth.controllers.js";
import {
  authLimiter,
  googleAuthLimiter,
  refreshTokenLimiter,
  sensitiveLimiter,
} from "../middlewares/rateLimiter.middlewares.js";
const router = Router();
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/google", googleAuthLimiter, googleLogin);
router.post("/logout", logout); 
router.get("/refresh-token", refreshTokenLimiter, tokenGeneration);
export default router;
