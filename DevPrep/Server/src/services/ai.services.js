import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a senior technical recruiter. Analyze the candidate's resume against the job description.

Return ONLY a valid JSON object with EXACTLY this structure — no extra fields, no markdown:

{
  "jobTitle": "string — the job title from the JD",
  "matchScore": number between 0 and 100 (integer, e.g. 72),
  "technicalQuestion": [
    {
      "question": "string — a specific technical question",
      "intention": "string — what skill/gap this tests",
      "answer": "string — ideal answer or key points to cover"
    }
  ],
  "behavioralQuestion": [
    {
      "question": "string — a behavioral/situational question",
      "intention": "string — what this probes",
      "answer": "string — what a strong answer looks like"
    }
  ],
  "skillGaps": [
    {
      "skills": "string — name of the missing skill",
      "severity": "high" | "medium" | "low"
    }
  ],
  "preprationPlan": [
    {
      "day": "string — e.g. Day 1",
      "time": "string — e.g. 2-3 hours",
      "task": ["string", "string"]
    }
  ]
}

STRICT RULES:
- technicalQuestion: exactly 5 objects with question, intention, answer fields
- behavioralQuestion: exactly 5 objects with question, intention, answer fields
- skillGaps: 3 to 5 objects. severity MUST be exactly "high", "medium", or "low" — never a number
- preprationPlan: exactly 7 objects (Day 1 through Day 7), each with day, time, task fields
- matchScore MUST be an integer (0-100), NOT a decimal like 0.8
- Do NOT return plain strings in arrays — every array item must be an object as shown above
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

Analyze the gap and return the JSON report.
`,
        },
      ],
    });

    const raw = response.choices[0].message.content || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    // Safety: normalize matchScore in case model still returns decimal
    if (result.matchScore && result.matchScore <= 1) {
      result.matchScore = Math.round(result.matchScore * 100);
    }

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
