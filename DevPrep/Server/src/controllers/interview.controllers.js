import interviewReportModel  from '../models/interviewReport.models.js';
import generateInterviewReport from '../services/ai.services.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const generateInterviewReportController= async (req,res)=>{
     console.log("FILE:", req.file);
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

    const resumeFile=req.file;
    const resumeContent=await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer)).getText());
    const {selfDescription,jobDescription} = req.body;
    const interviewReport=await generateInterviewReport({resume:resumeContent.text,selfDescription,jobDescription});
    const newInterviewReport=await interviewReportModel.create({
        user:req.user._id,
        jobDescription,
        resume:resumeContent.text,
        selfDescription,
        matchScore:interviewReport.matchScore,
        technicalQuestion:interviewReport.technicalQuestion,
        behavioralQuestion:interviewReport.behavioralQuestion,
        skillGaps:interviewReport.skillGaps,
        preprationPlan:interviewReport.preprationPlan,
    });
    res.status(201).json({
        message:"Interview report generated successfully",
        data:newInterviewReport
    
    });
}
const getInterviewReportById=async (req,res)=>{
    const id=req.params.id;
    const interviewReport=await interviewReportModel.findById(id);
    res.status(200).json({
        message:"Interview report fetched successfully",
        data:interviewReport
    });
}

const getAllInterviewReport=async (req,res)=>{
    const interviewReport = await interviewReportModel
			.find({ user: req.user._id })
			.sort({ createdAt: -1 })
			.select(
				"-password -refreshToken -resume -selfDescription -jobDescription -__v  -technicalQuestion -behavioralQuestion -skillGaps -preprationPlan",
			);
    res.status(200).json({
        message:"Interview report fetched successfully",
        data:interviewReport
    });
}
export {generateInterviewReportController,getInterviewReportById,getAllInterviewReport};