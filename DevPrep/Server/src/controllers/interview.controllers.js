import interviewReportModel from '../models/interviewReport.models.js';
import generateInterviewReport from '../services/ai.services.js';
import pdfParse from 'pdf-parse';

const generateInterviewReportController = async (req, res) => {
	try {
		console.log("FILE:", req.file);
		console.log("BODY:", req.body);
		console.log("USER:", req.user);

		if (!req.file) {
			return res.status(400).json({ message: "Resume file is required" });
		}
		const { selfDescription, jobDescription } = req.body;
		if (!selfDescription || !jobDescription) {
			return res.status(400).json({ message: "selfDescription and jobDescription are required" });
		}

		const pdfData = await pdfParse(req.file.buffer);
		const resumeContent = pdfData.text;

		if (!resumeContent || resumeContent.trim().length === 0) {
			return res.status(400).json({ message: "Could not extract text from resume PDF" });
		}

		const interviewReport = await generateInterviewReport({
			resume: resumeContent,
			selfDescription,
			jobDescription,
		});

		const newInterviewReport = await interviewReportModel.create({
			user: req.user._id,
			jobDescription,
			resume: resumeContent,
			selfDescription,
			jobTitle: interviewReport.jobTitle,
			matchScore: interviewReport.matchScore,
			technicalQuestion: interviewReport.technicalQuestion,
			behavioralQuestion: interviewReport.behavioralQuestion,
			skillGaps: interviewReport.skillGaps,
			preprationPlan: interviewReport.preprationPlan,
		});

		res.status(201).json({
			message: "Interview report generated successfully",
			data: newInterviewReport,
		});

	} catch (error) {
		console.error("Controller Error:", error.message);
		res.status(500).json({
			message: "Failed to generate interview report",
			error: error.message,
		});
	}
};

const getInterviewReportById = async (req, res) => {
	try {
		const interviewReport = await interviewReportModel.findById(req.params.id);
		if (!interviewReport) {
			return res.status(404).json({ message: "Report not found" });
		}
		res.status(200).json({
			message: "Interview report fetched successfully",
			data: interviewReport,
		});
	} catch (error) {
		console.error("Get Report Error:", error.message);
		res.status(500).json({ message: "Failed to fetch report", error: error.message });
	}
};

const getAllInterviewReport = async (req, res) => {
	try {
		const interviewReport = await interviewReportModel
			.find({ user: req.user._id })
			.sort({ createdAt: -1 })
			.select("-resume -selfDescription -jobDescription -__v -technicalQuestion -behavioralQuestion -skillGaps -preprationPlan");

		res.status(200).json({
			message: "Interview reports fetched successfully",
			data: interviewReport,
		});
	} catch (error) {
		console.error("Get All Reports Error:", error.message);
		res.status(500).json({ message: "Failed to fetch reports", error: error.message });
	}
};

export { generateInterviewReportController, getInterviewReportById, getAllInterviewReport };
