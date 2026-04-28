import interviewReportModel from '../models/interviewReport.models.js';
import generateInterviewReport from '../services/ai.services.js';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

// Extract text from PDF buffer
async function extractTextFromPDF(buffer) {
	const uint8Array = new Uint8Array(buffer);
	const pdf = await getDocument({ data: uint8Array }).promise;

	let fullText = '';
	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const content = await page.getTextContent();
		fullText += content.items.map(item => item.str).join(' ') + '\n';
	}
	return fullText.trim();
}

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

		// Parse PDF
		let resumeContent;
		try {
			resumeContent = await extractTextFromPDF(req.file.buffer);
		} catch (pdfError) {
			console.error("PDF Parse Error:", pdfError.message);
			return res.status(400).json({ message: "Failed to parse PDF. Make sure it's a valid PDF file." });
		}

		if (!resumeContent || resumeContent.trim().length === 0) {
			return res.status(400).json({ message: "Could not extract text from resume PDF" });
		}

		console.log("Resume extracted, length:", resumeContent.length);

		// Generate AI report
		const interviewReport = await generateInterviewReport({
			resume: resumeContent,
			selfDescription,
			jobDescription,
		});

		console.log("Report generated:", interviewReport.jobTitle, interviewReport.matchScore);

		// Save to DB
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
		console.error("Stack:", error.stack);
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
