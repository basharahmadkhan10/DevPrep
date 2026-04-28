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
			model: "llama-3.3-70b-versatile", 
			max_tokens: 4000,
			messages: [
				{
					role: "system",
					content: `
You are a senior technical recruiter and career coach with 15+ years of experience hiring engineers.

Your job is to do a DEEP, HONEST analysis — not a generic one.

Given a candidate's Resume, Self Description, and Job Description, you must:

1. MATCH SCORE: Compare actual skills/experience in the resume against SPECIFIC requirements in the JD. 
   - Penalize heavily for missing must-have skills
   - Reward relevant projects, years of experience, and domain overlap
   - Be realistic: if they're missing core requirements, score should reflect that (don't inflate)

2. TECHNICAL QUESTIONS: Generate questions that are SPECIFIC to this JD + this candidate.
   - Reference the candidate's actual projects/tech stack from their resume
   - Target gaps between their background and the JD's requirements
   - Don't generate generic "explain OOP" questions — make them situational and role-specific

3. BEHAVIORAL QUESTIONS: Based on the self-description and role, ask questions that probe:
   - Real challenges they may face in this specific role
   - Their working style vs what the JD implies (team size, pace, ownership level)

4. SKILL GAPS: Be brutally honest.
   - Only list skills EXPLICITLY or IMPLICITLY required in the JD that are MISSING or WEAK in the resume
   - Rate severity based on how central that skill is to the role
   - Don't list things the candidate already has

5. PREPARATION PLAN: Create a realistic 7-day plan targeted at closing the skill gaps you identified.
   - Day tasks should directly address the gaps, not be generic advice
   - Include what to study, build, or practice — specific to this role

Return ONLY valid JSON. No preamble, no explanation.
`,
				},
				{
					role: "user",
					content: `
Job Description:
${jobDescription}

Resume:
${resume}

Self Description:
${selfDescription}

Analyze the gap between what the JD requires and what the candidate actually has. Be specific and honest.
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
