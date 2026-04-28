import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
	try {
		const response = await groq.chat.completions.create({
			model: "llama-3.1-70b-versatile",
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

2. TECHNICAL QUESTIONS: Generate exactly 5 questions SPECIFIC to this JD + this candidate.
   - Reference the candidate's actual projects/tech stack from their resume
   - Target gaps between their background and the JD requirements
   - Do NOT generate generic questions — make them situational and role-specific

3. BEHAVIORAL QUESTIONS: Generate exactly 5 questions based on self-description and role that probe:
   - Real challenges they may face in this specific role
   - Their working style vs what the JD implies (team size, pace, ownership level)

4. SKILL GAPS: Be brutally honest. Generate 3 to 5 gaps.
   - Only list skills EXPLICITLY or IMPLICITLY required in the JD that are MISSING or WEAK in the resume
   - Rate severity based on how central that skill is to the role
   - Do NOT list things the candidate already has

5. PREPARATION PLAN: Create a realistic 7-day plan targeted at closing the skill gaps you identified.
   - Day tasks should directly address the gaps, not be generic advice
   - Include what to study, build, or practice — specific to this role

Return ONLY a valid JSON object with exactly these keys:
jobTitle, matchScore, technicalQuestion, behavioralQuestion, skillGaps, preprationPlan

No preamble, no explanation, no markdown fences.
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
				type: "json_object",
			},
		});

		const raw = response.choices[0].message.content || "{}";
		const cleaned = raw.replace(/```json|```/g, "").trim();
		const result = JSON.parse(cleaned);

		console.log("Job Title:", result.jobTitle);
		console.log("Match Score:", result.matchScore);

		return result;
	} catch (error) {
		console.error("Groq Error:", error.message);
		if (error.response) {
			console.error("Groq Response Status:", error.response.status);
			console.error("Groq Response Data:", error.response.data);
		}
		throw error;
	}
}

export default generateInterviewReport;
