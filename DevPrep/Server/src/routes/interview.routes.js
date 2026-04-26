import Router  from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import {generateInterviewReportController,getInterviewReportById,getAllInterviewReport} from "../controllers/interview.controllers.js";
import upload from "../middlewares/file.middlewares.js";
const router=Router();
router.post("/report",authMiddleware,upload.single("resume"),generateInterviewReportController);
router.get("/report/:id",authMiddleware,getInterviewReportById);
router.get('/',authMiddleware,getAllInterviewReport);
export default router;