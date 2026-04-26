import Groq from "groq-sdk";
import dotenv from "dotenv";
import { resume, selfDescription, jobDescription } from "./temp.js";

dotenv.config();

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

async function generateInterviewReport() {
	try {
		const response = await groq.chat.completions.create({
			model: "openai/gpt-oss-20b",
			max_tokens: 4000,
			messages: [
				{
					role: "system",
					content: `
You are an expert AI Interview Preparation Assistant.

Analyze the candidate's Resume, Self Description, and Job Description.

Generate a complete interview report in strict JSON format only.

Rules:
- matchScore must be between 0 to 100
- Generate exactly 5 technical questions
- Generate exactly 5 behavioral questions
- Generate 3 to 5 skill gaps
- Generate a 7-day preparation plan
- Extract or infer the best job title from the job description that matches the candidate's profile
- Do not return anything except valid JSON
- Do not return anything other than valid JSON
`,
				},
				{
					role: "user",
					content: `
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`,
				},
			],
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "interview_report",
					strict: true,
					schema: {
						type: "object",
						properties: {
							jobTitle: {
								type: "string",
								description:
									"Best fit job title for the candidate based on resume and job description",
							},
							matchScore: {
								type: "number",
								minimum: 0,
								maximum: 100,
								description:
									"Overall match percentage between candidate and job requirements",
							},
							technicalQuestion: {
								type: "array",
								items: {
									type: "object",
									properties: {
										question: {
											type: "string",
										},
										intention: {
											type: "string",
										},
										answer: {
											type: "string",
										},
									},
									required: ["question", "intention", "answer"],
									additionalProperties: false,
								},
							},
							behavioralQuestion: {
								type: "array",
								items: {
									type: "object",
									properties: {
										question: {
											type: "string",
										},
										intention: {
											type: "string",
										},
										answer: {
											type: "string",
										},
									},
									required: ["question", "intention", "answer"],
									additionalProperties: false,
								},
							},
							skillGaps: {
								type: "array",
								items: {
									type: "object",
									properties: {
										skills: {
											type: "string",
										},
										severity: {
											type: "string",
											enum: ["low", "medium", "high"],
										},
									},
									required: ["skills", "severity"],
									additionalProperties: false,
								},
							},
							preprationPlan: {
								type: "array",
								items: {
									type: "object",
									properties: {
										day: {
											type: "string",
										},
										time: {
											type: "string",
										},
										task: {
											type: "array",
											items: {
												type: "string",
											},
										},
									},
									required: ["day", "time", "task"],
									additionalProperties: false,
								},
							},
						},
						required: [
							"jobTitle",
							"matchScore",
							"technicalQuestion",
							"behavioralQuestion",
							"skillGaps",
							"preprationPlan",
						],
						additionalProperties: false,
					},
				},
			},
		});

		const result = JSON.parse(response.choices[0].message.content || "{}");

		console.log("Generated Report:", result);
		console.log("Job Title:", result.jobTitle);
		console.log("Match Score:", result.matchScore);

		return result;
	} catch (error) {
		console.error("Error generating interview report:", error.message);
		throw error;
	}
}

export default generateInterviewReport;
